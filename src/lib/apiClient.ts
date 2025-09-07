import axios from 'axios';
import { supabase } from './supabase';

// Create a custom Axios instance
const apiClient = axios.create({
  timeout: 15000, // Request timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Authorization header
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
    } catch (error) {
      console.error('Error getting Supabase session for Axios request:', error);
      // Optionally, handle this error (e.g., redirect to login if session is truly gone)
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle 401 Unauthorized errors and token refresh
apiClient.interceptors.response.use(
  (response) => response, // Pass through successful responses
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 Unauthorized and it's not a retry attempt
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark as retry attempt

      try {
        const { data, error: refreshError } = await supabase.auth.refreshSession();

        if (refreshError) {
          throw refreshError; // If refresh fails, throw error to be caught below
        }

        if (data.session?.access_token) {
          // Update the Authorization header for the original request
          originalRequest.headers.Authorization = `Bearer ${data.session.access_token}`;
          // Retry the original request with the new token
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.error('Failed to refresh token or session expired:', refreshError);
        // If token refresh fails, log out the user and redirect
        await supabase.auth.signOut();
        alert('Your session has expired. Please sign in again.');
        window.location.href = '/'; // Redirect to home/login page
      }
    }
    return Promise.reject(error); // For other errors or if retry fails
  }
);

export default apiClient;