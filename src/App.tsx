import React, { useState, useEffect, lazy, Suspense } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import AuthForm from './components/AuthForm';
import ErrorBoundary from './components/ErrorBoundary';
import { supabase, signIn, signUp, signOut, trackReferral, checkUserAdminStatus } from './lib/supabase';

// Direct imports for frequently used pages
import HomePage from './pages/HomePage';
import DisputeLettersPage from './pages/DisputeLettersPage';
import PricingPage from './pages/PricingPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import HelpPage from './pages/HelpPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import CookiesPage from './pages/CookiesPage';
import DashboardPage from './pages/DashboardPage';
import LeaderboardPage from './pages/LeaderboardPage';
import VehicleCheckPage from './pages/VehicleCheckPage';
import SuccessPage from './pages/SuccessPage';

// Lazy load admin dashboard for code splitting
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));

function App() {
  console.log('🚨 App component function started - VERY FIRST LINE');
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false); 
  const [loading, setLoading] = useState(true);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  useEffect(() => {
    console.log('🚀 App.tsx useEffect: Setting up auth listener');
    let mounted = true;
    
    // Function to fetch user profile and check admin status
    const fetchUserProfile = async (userId: string) => {
      try {
        console.log('👑 App.tsx: Checking admin status for user:', userId);
        return await checkUserAdminStatus();
      } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
    };
    
    // Get initial session and check admin status
    const initializeAuth = async () => {
      try {
        console.log('📡 App.tsx: Starting authentication initialization...');
        console.log('📡 App.tsx: Getting initial session...');
        const { data: { session } } = await supabase.auth.getSession();
        
        console.log('📡 App.tsx: Initial session result:', {
          hasSession: !!session,
          hasUser: !!session?.user,
          userId: session?.user?.id,
          mounted
        });
        
        if (mounted && session?.user) {
          const newUser = session.user;
          console.log('👤 App.tsx: Setting initial user:', { id: newUser.id, email: newUser.email });

          // Check if user is admin
          let isAdminUser = false;
          try {
            console.log('👑 App.tsx: About to check admin status...');
            isAdminUser = await fetchUserProfile(newUser.id);
            console.log('👑 App.tsx: Admin status check completed:', isAdminUser);
          } catch (error) {
            console.error('Error fetching user profile, defaulting to non-admin:', error);
            isAdminUser = false;
          }

          setUser(newUser);
          setIsAdmin(isAdminUser);
          console.log('✅ App.tsx: User state set successfully');
        } else if (mounted) {
          console.log('👤 App.tsx: No session found, clearing user state');
          setUser(null);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('❌ App.tsx: Error during authentication initialization:', error);
        // Even if there's an error, we should clear the user state and stop loading
        if (mounted) {
          setUser(null);
          setIsAdmin(false);
        }
      } finally {
        if (mounted) {
          console.log('🏁 App.tsx: Authentication initialization complete, setting loading to false');
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    console.log('👂 App.tsx: Setting up auth state change listener');
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {      
      console.log('🔔 App.tsx: Auth state change event:', {
        event,
        hasSession: !!session,
        hasUser: !!session?.user,
        userId: session?.user?.id,
        mounted,
        timestamp: new Date().toISOString()
      });
      
      if (mounted) {
        try {
          const newUser = session?.user ?? null;
          
          if (newUser) {
            console.log('👤 App.tsx: Auth change - setting user:', { id: newUser.id, email: newUser.email });
            
            // Check if user is admin
            let isAdminUser = false;
            try {
              isAdminUser = await fetchUserProfile(newUser.id);
            } catch (error) {
              console.error('Error fetching user profile during auth change, defaulting to non-admin:', error);
              isAdminUser = false;
            }
            console.log('👑 App.tsx: User admin status:', isAdminUser);
            
            setUser(newUser);
            setIsAdmin(isAdminUser);
          } else {
            console.log('👤 App.tsx: Auth change - user signed out');
            setUser(null);
            setIsAdmin(false);
          }
          
          // Handle new user signup with referral tracking
          if (event === 'SIGNED_UP' && newUser) {
            console.log('🎉 App.tsx: New user signed up, checking for referral...');
            const urlParams = new URLSearchParams(window.location.search);
            const referralCode = urlParams.get('ref');
            console.log('🔗 App.tsx: Referral code from URL:', referralCode);
            
            if (referralCode) {
              try {
                console.log('📤 App.tsx: Tracking referral...');
                const { data, error } = await trackReferral(referralCode, newUser.id);
                if (error) {
                  console.error('Error tracking referral:', error);
                } else if (data?.success) {
                  console.log('✅ App.tsx: Referral tracked successfully');
                  // Optionally show a success message to the user
                }
              } catch (error) {
                console.error('❌ App.tsx: Error tracking referral:', error);
              }
            }
          }
        } catch (error) {
          console.error('❌ App.tsx: Error during auth state change handling:', error);
          // If there's an error during auth state change, ensure we don't leave the user in a broken state
          setUser(null);
          setIsAdmin(false);
        }
      }
    });

    return () => {
      console.log('🧹 App.tsx: Cleanup - unmounting and unsubscribing');
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSignIn = async () => {
    console.log('🔑 App.tsx: handleSignIn called');
    setAuthMode('signin');
    setShowAuthForm(true);
  };

  const handleSignUp = async () => {
    console.log('📝 App.tsx: handleSignUp called');
    setAuthMode('signup');
    setShowAuthForm(true);
  };

  const handleSignOut = async () => {
    console.log('🚪 App.tsx: handleSignOut called');
    const { error } = await signOut();
    if (error) {
      console.error('❌ App.tsx: Sign out error:', error);
      alert(`Sign out error: ${error.message}`);
    } else {
      console.log('✅ App.tsx: Sign out successful');
    }
  };

  const handleAuthSuccess = () => {
    console.log('🎉 App.tsx: handleAuthSuccess called');
    // Auth state will be updated automatically by the auth listener
    setShowAuthForm(false);
  };
  
  if (loading) {
    console.log('⏳ App.tsx: Rendering loading state');
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  console.log('🎨 App.tsx: Rendering main app', {
    hasUser: !!user,
    userId: user?.id,
    showAuthForm,
  });

  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Header
          isAuthenticated={!!user}
          onSignIn={handleSignIn}
          onSignUp={handleSignUp}
          onSignOut={handleSignOut}
          isAdminUser={isAdmin}
          user={user ? { name: user.email?.split('@')[0] || 'User', email: user.email || '' } : null}
        />

        <Routes>
  <Route path="/" element={
    <HomePage 
      isAuthenticated={!!user} 
      onSignIn={handleSignIn} 
      onSignUp={handleSignUp} 
    />
  } />

  <Route path="/vehicle-history" element={
    <ErrorBoundary>
      <VehicleCheckPage onSignIn={handleSignIn} onSignUp={handleSignUp} />
    </ErrorBoundary>
  } />
  
  <Route path="/mot-checker" element={
    <ErrorBoundary>
      <VehicleCheckPage onSignIn={handleSignIn} onSignUp={handleSignUp} />
    </ErrorBoundary>
  } />

  <Route path="/dispute-letters" element={<ErrorBoundary><DisputeLettersPage /></ErrorBoundary>} />
  <Route path="/pricing" element={<PricingPage />} />
  <Route path="/about" element={<AboutPage />} />
  <Route path="/contact" element={<ContactPage />} />
  
  <Route path="/help" element={<ErrorBoundary><HelpPage /></ErrorBoundary>} />
  <Route path="/privacy" element={<ErrorBoundary><PrivacyPage /></ErrorBoundary>} />
  <Route path="/terms" element={<ErrorBoundary><TermsPage /></ErrorBoundary>} />
  <Route path="/cookies" element={<ErrorBoundary><CookiesPage /></ErrorBoundary>} />

  <Route path="/admin" element={
    <Suspense fallback={<div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
    </div>}>
      {isAdmin ? <AdminDashboardPage /> : <HomePage />}
    </Suspense>
  } />

  <Route path="/dashboard" element={
    <ErrorBoundary>
      {user ? <DashboardPage /> : <HomePage />}
    </ErrorBoundary>
  } />

  <Route path="/leaderboard" element={<LeaderboardPage />} />
  <Route path="/success" element={<SuccessPage />} />

  <Route path="*" element={
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">404</h1>
        <p className="text-gray-600">Page not found.</p>
      </div>
    </div>
  } />
</Routes>


        {/* Auth Modal */}
        {showAuthForm && (
          <AuthForm
            mode={authMode}
            onSuccess={handleAuthSuccess}
            onClose={() => setShowAuthForm(false)}
          />
        )}

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center mb-4">
                  <img src="/Asset 6.png" alt="AutoAudit" className="h-8" />
                </div>
                <p className="text-gray-400 mb-4 max-w-md">
                  Professional vehicle history checks and expert council ticket dispute letters for UK drivers.
                  Get the information and support you need to make informed decisions.
                </p>
                <div className="flex space-x-4">
                  <div className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                    <div className="h-5 w-5 bg-orange-400 rounded"></div>
                  </div>
                  <div className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                    <div className="h-5 w-5 bg-orange-400 rounded"></div>
                  </div>
                  <div className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                    <div className="h-5 w-5 bg-orange-400 rounded"></div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Services</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="/vehicle-history" className="hover:text-white transition-colors">Vehicle History</a></li>
                  <li><a href="/mot-checker" className="hover:text-white transition-colors">Free MOT Check</a></li>
                  <li><a href="/dispute-letters" className="hover:text-white transition-colors">Dispute Letters</a></li>
                  <li><a href="/pricing" className="hover:text-white transition-colors">Pricing</a></li>
                  <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
                  {user && (
                    <>
                      <li><a href="/dashboard" className="hover:text-white transition-colors">Dashboard</a></li>
                      <li><a href="/leaderboard" className="hover:text-white transition-colors">Leaderboard</a></li>
                    </>
                  )}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Support</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="/help" className="hover:text-white transition-colors">Help Center</a></li>
                  <li><a href="/contact" className="hover:text-white transition-colors">Contact Us</a></li>
                  <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2025 AutoAudit. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
                <a href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
                <a href="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;