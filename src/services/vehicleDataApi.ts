import { supabase } from '../lib/supabase';

// New wrapper function for fetch with authentication and retry logic
async function fetchWithAuth(url: RequestInfo, options?: RequestInit, isRetry = false): Promise<Response> {
  let currentOptions = { ...options };

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      currentOptions.headers = {
        ...currentOptions.headers,
        'Authorization': `Bearer ${session.access_token}`,
      };
    }
  } catch (error) {
    console.error('Error getting Supabase session for fetch request:', error);
    // If session is truly gone, you might want to redirect here too
    // window.location.href = '/signin';
  }

  const response = await fetch(url, currentOptions);

  if (response.status === 401 && !isRetry) {
    try {
      const { data, error: refreshError } = await supabase.auth.refreshSession();

      if (refreshError) {
        throw refreshError;
      }

      if (data.session?.access_token) {
        // Retry the original request with the new token
        return fetchWithAuth(url, options, true); // Pass true for isRetry
      }
    } catch (refreshError) {
      console.error('Failed to refresh token for fetch request or session expired:', refreshError);
      await supabase.auth.signOut();
      alert('Your session has expired. Please sign in again.');
      window.location.href = '/'; // Redirect to home/login page
    }
  }

  return response;
}

export interface VehicleDataApiError {
  error: string;
}

export interface VehicleDataFull {
  registration: string;
  make: string;
  model: string;
  color: string;
  yearOfManufacture: number;
  engineSize: number;
  fuelType: string;
  motStatus: { isValid: boolean };
  taxStatus?: { isValid: boolean };
  history?: {
    isStolen: boolean;
    isWriteOff: boolean;
    writeOffCategory: string | null;
    hasOutstandingFinance: boolean;
    hasMileageDiscrepancy: boolean;
    mileageHistory: any[];
    keeperChanges: any[];
    plateChanges: any[];
  };
  valuation?: {
    retail: {
      excellent: number;
      good: number;
      average: number;
    };
    trade: {
      clean: number;
      average: number;
      below: number;
    };
    private: {
      excellent: number;
      good: number;
      average: number;
    };
    adjustmentFactors: {
      age: number;
      mileage: number;
    };
  };
  riskAssessment?: {
    level: 'low' | 'medium' | 'high';
    alerts: string[];
    description: string;
  };
  performance?: {
    power: number;
    topSpeed: number;
    zeroToSixty: number;
    fuelEconomy: number;
  };
  bodyDetails?: {
    bodyStyle: string;
    numberOfDoors: number;
    numberOfSeats: number;
  };
  emissions?: {
    co2: number;
    euroStatus: string;
  };
}

async function postVehicleData(
  registration: string,
  dataType: 'basic' | 'full'
): Promise<VehicleDataFull | VehicleDataApiError> {
  try {
    // Use the new fetchWithAuth wrapper
    const res = await fetchWithAuth(`${import.meta.env.VITE_SUPABASE_EDGE_URL}/vehicle-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ registration, dataType })
    });

    const responseText = await res.text();
    let json;
    try {
      json = JSON.parse(responseText);
    } catch (err) {
      console.error('Failed to parse response JSON:', responseText);
      return { error: 'Invalid JSON response from API.' };
    }

    if (!res.ok) {
      return { error: json?.message || `API returned status ${res.status}` };
    }

    return json;
  } catch (err) {
    console.error('Vehicle data fetch error:', err);
    return { error: 'Unexpected error while contacting the vehicle data API.' };
  }
}

export const vehicleDataApi = {
  getBasicVehicleInfo: (registration: string) => postVehicleData(registration, 'basic'),
  getFullVehicleInfo: (registration: string) => postVehicleData(registration, 'full'),
  formatRegistration: (reg: string) =>
    reg.replace(/\s+/g, '').toUpperCase().replace(/(\w{2})(\d{2})(\w{3})/, '$1$2 $3') ?? reg

};

export default vehicleDataApi;