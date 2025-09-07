import React, { useState, useEffect } from 'react';
import { 
  Car, Shield, CheckCircle, XCircle, AlertTriangle, Clock, FileText, 
  Download, Eye, Lock, ArrowRight, Calendar, Gauge, Users, TrendingUp, Mail,
  Award, Info, Search, Zap, PoundSterling, History, User
} from 'lucide-react';
import MOTHistoryChecker from '../components/MOTHistoryChecker';
import VehicleDataChecker from '../components/VehicleDataChecker';
import { DVLAVehicleData } from '../services/dvlaApi';
import { vehicleDataApi, VehicleDataFull } from '../services/vehicleDataApi';

import { supabase, createStripeCheckoutSession } from '../lib/supabase';

interface VehicleCheckPageProps {
  onSignIn?: () => void;
  onSignUp?: () => void;
}

// Custom Gift icon component
const Gift = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
  </svg>
);

export default function VehicleCheckPage({ onSignIn, onSignUp }: VehicleCheckPageProps) {
  // Active check type state (mot or comprehensive)
  const [activeCheckType, setActiveCheckType] = useState<'mot' | 'comprehensive'>('mot');
  
  // Vehicle data states
  const [verifiedVehicle, setVerifiedVehicle] = useState<DVLAVehicleData | null>(null);
  const [verifiedVehicleData, setVerifiedVehicleData] = useState<VehicleDataFull | null>(null);
  
  // User access states
  const [hasPaidForComprehensiveReport, setHasPaidForComprehensiveReport] = useState<boolean | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState<boolean>(true);
  const [isInitiatingPayment, setIsInitiatingPayment] = useState<boolean>(false);
  const [showEmailModal, setShowEmailModal] = useState<boolean>(false);

  const handleVehicleDataVerified = (reportData: VehicleDataFull) => {
    setVerifiedVehicleData(reportData);
  };
  
  // Check user authentication and access rights
  useEffect(() => {
    const checkUserAccess = async () => {
      console.log('Checking user access...');
      try {
        setIsCheckingAccess(true);
        // Check if user is authenticated
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setIsAuthenticated(true);
          
          // Get user profile to check if they have access to comprehensive reports
          try {
            const { data: profile, error } = await supabase
              .from('users')
              .select('has_comprehensive_report_access')
              .eq('id', user.id)
              .single();
          
            if (!error && profile) {
              setHasPaidForComprehensiveReport(profile.has_comprehensive_report_access || false);
              console.log('User comprehensive report access:', profile.has_comprehensive_report_access);
            } else {
              console.error('Error fetching user profile:', error);
              setHasPaidForComprehensiveReport(false);
            }
          } catch (profileError) {
            console.error('Exception fetching user profile:', profileError);
            setHasPaidForComprehensiveReport(false);
          }
        } else {
          setIsAuthenticated(false);
          setHasPaidForComprehensiveReport(false);
          console.log('User not authenticated');
        }
      } catch (error) {
        console.error('Error checking user access:', error);
        setIsAuthenticated(false);
        setHasPaidForComprehensiveReport(false);
      } finally {
        console.log('Setting isCheckingAccess to false');
        setIsCheckingAccess(false);
      }
    };
    
    checkUserAccess();
  }, []);

  // Add auth state change listener to update authentication status
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (session?.user) {
          setIsAuthenticated(true);
          
          // Get user profile to check comprehensive report access
          const { data: profile, error } = await supabase
            .from('users')
            .select('has_comprehensive_report_access')
            .eq('id', session.user.id)
            .single();
          
          if (!error && profile) {
            setHasPaidForComprehensiveReport(profile.has_comprehensive_report_access || false);
          }
        } else {
          setIsAuthenticated(false);
          setHasPaidForComprehensiveReport(false);
        }
      });
  }, []);
  
  // Handle purchase of comprehensive report
  const handlePurchaseComprehensiveReport = async () => {
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      alert('Please sign in to purchase comprehensive vehicle reports.');
      return;
    }
    
    setIsInitiatingPayment(true);
    
    try {
      const { data, error } = await createStripeCheckoutSession({
        amount: 24.99,
        productName: 'Comprehensive Vehicle Report Access',
        submission_id: crypto.randomUUID(),
        customerEmail: user.email,
        productType: 'comprehensive_report'
      });
      
      if (error) {
        throw error;
      }
      
      if (!data || !data.url) {
        throw new Error('No checkout URL received from payment service');
      }
      
      // Redirect to Stripe checkout
      window.location.href = data.url;
    } catch (error) {
      console.error('Error initiating payment:', error);
      alert('There was an error processing your request. Please try again.');
    } finally {
      setIsInitiatingPayment(false);
    }
  };

  const features = [
    {
      icon: Shield,
      title: 'Official DVLA Data',
      description: 'Direct access to government databases for accurate, up-to-date information'
    },
    {
      icon: CheckCircle,
      title: 'Comprehensive Reports',
      description: 'MOT history, tax status, insurance groups, and valuation data'
    },
    {
      icon: Clock,
      title: 'Instant Results',
      description: 'Get your complete vehicle history report in seconds'
    },
    {
      icon: FileText,
      title: 'Professional Format',
      description: 'Easy-to-read reports suitable for insurance and legal purposes'
    }
  ];

  const benefits = [
    {
      title: 'Buying a Used Car?',
      description: 'Check the MOT history to understand the vehicle\'s maintenance record and identify potential issues.',
      icon: Car,
      color: 'blue'
    },
    {
      title: 'Selling Your Vehicle?',
      description: 'Demonstrate your vehicle\'s good maintenance history to potential buyers.',
      icon: CheckCircle,
      color: 'green'
    },
    {
      title: 'Planning Maintenance?',
      description: 'Review past MOT advisories to plan upcoming maintenance and repairs.',
      icon: Calendar,
      color: 'purple'
    },
    {
      title: 'Insurance Claims?',
      description: 'Access official MOT records for insurance purposes and claims documentation.',
      icon: Shield,
      color: 'orange'
    }
  ];

  const stats = [
    { number: '2M+', label: 'Vehicles Checked', icon: Car },
    { number: '100%', label: 'Free Service', icon: Gift },
    { number: '24/7', label: 'Available', icon: Clock },
    { number: '99.9%', label: 'Uptime', icon: TrendingUp }
  ];

  const faqItems = [
    {
      question: 'What information does the vehicle check show?',
      answer: 'Our vehicle checks show MOT history, test dates, results (pass/fail), expiry dates, mileage records, defects found, advisories given, and reasons for failure. Comprehensive reports also include tax status, insurance data, valuation, and risk assessment.'
    },
    {
      question: 'How far back does the MOT history go?',
      answer: 'MOT history data is available from 2005 onwards. Vehicles first registered before this date may have limited historical data available.'
    },
    {
      question: 'Is the MOT check really free?',
      answer: 'Yes, our MOT history checker is completely free to use. We access the official DVLA MOT History API to provide you with accurate, up-to-date information at no cost.'
    },
    {
      question: 'What\'s included in the comprehensive report?',
      answer: 'The comprehensive report includes everything in the free MOT check plus vehicle valuation, insurance group data, stolen vehicle check, outstanding finance check, write-off status, mileage verification, and a detailed risk assessment.'
    },
    {
      question: 'Can I check any UK vehicle?',
      answer: 'Yes, you can check the history for any vehicle registered in England, Wales, or Scotland. Northern Ireland has a separate MOT system.'
    }
  ];

  // Loading state
  if (isCheckingAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 text-white py-16">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8">
              <Car className="h-5 w-5 mr-2" />
              <span className="text-sm font-semibold">
                {activeCheckType === 'mot' ? '100% Free MOT History Checker' : 'Professional Vehicle Reports'}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Vehicle History
              <span className="block bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent">
                Services
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-orange-100 max-w-4xl mx-auto mb-8 leading-relaxed">
              Access both free MOT history checks and comprehensive vehicle reports in one place. 
              Get official DVLA data, test results, valuations, and risk assessments for any UK vehicle.
            </p>
            
            {/* Service Type Selector - Moved up into hero section */}
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <button 
                onClick={() => setActiveCheckType('mot')}
                className={`px-6 py-4 rounded-xl text-lg font-semibold transition-all duration-300 flex items-center ${
                  activeCheckType === 'mot'
                    ? 'bg-orange-600 text-white shadow-lg transform scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Car className="h-5 w-5 mr-2" />
                Free MOT History
              </button>
              <button 
                onClick={() => setActiveCheckType('comprehensive')}
                className={`px-6 py-4 rounded-xl text-lg font-semibold transition-all duration-300 flex items-center ${
                  activeCheckType === 'comprehensive'
                    ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FileText className="h-5 w-5 mr-2" />
                Comprehensive Report
              </button>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-orange-200 mt-6">
              <div className="flex items-center bg-white/20 border border-white/30 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm hover:bg-white/25 transition-all duration-300">
                <Shield className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">Official DVLA Data</span>
              </div>
              <div className="flex items-center bg-white/20 border border-white/30 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm hover:bg-white/25 transition-all duration-300">
                <Clock className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">Instant Results</span>
              </div>
              <div className="flex items-center bg-white/20 border border-white/30 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm hover:bg-white/25 transition-all duration-300">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">
                  {activeCheckType === 'mot' ? '100% Free' : 'Professional Reports'}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-24 h-24 bg-white/15 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-36 h-36 bg-yellow-300/25 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-orange-300/20 rounded-full blur-xl animate-pulse delay-500"></div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Vehicle Checker Section */}
        <section className="mb-16 relative">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {activeCheckType === 'mot' 
                ? 'Check Your Vehicle\'s MOT History' 
                : 'Get Your Vehicle History Report'}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {activeCheckType === 'mot'
                ? 'Enter your vehicle registration to get instant access to complete MOT history'
                : 'Enter your vehicle registration to access comprehensive vehicle data'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              {activeCheckType === 'mot' ? (
                // MOT History Checker
                <MOTHistoryChecker className="shadow-2xl" />
              ) : (
                // Vehicle Data Checker with access control
                <VehicleDataChecker 
                  onVehicleVerified={handleVehicleDataVerified}
                  className="mb-8"
                  onSignIn={onSignIn}
                  onSignUp={onSignUp}
                  isAuthenticated={isAuthenticated}
                  hasComprehensiveAccess={hasPaidForComprehensiveReport === true}
                  onPurchaseComprehensiveReport={handlePurchaseComprehensiveReport}
                />
              )}
            </div>

            <div className="space-y-8">
              {/* Sample Report Preview */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  {activeCheckType === 'mot'
                    ? 'MOT History Preview'
                    : (hasPaidForComprehensiveReport ? 'Your Report Preview' : 'Sample Report Preview')}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Vehicle Registration</span>
                    <span className="font-semibold">AB12 CDE</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Make & Model</span>
                    <span className="font-semibold">BMW 3 Series</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-gray-700">
                      {activeCheckType === 'mot' ? 'MOT Status' : 'Tax Status'}
                    </span>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="font-semibold text-green-600">Valid</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-gray-700">
                      {activeCheckType === 'mot' ? 'Last Test Result' : 'MOT Status'}
                    </span>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="font-semibold text-green-600">
                        {activeCheckType === 'mot' ? 'PASSED' : 'Valid until 2025'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  {activeCheckType === 'mot' ? (
                    <>
                      <button className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center">
                        <Car className="h-4 w-4 mr-2" />
                        Check MOT History
                      </button>
                    </>
                  ) : (
                    hasPaidForComprehensiveReport ? (
                      <>
                        <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                          <Eye className="h-4 w-4 mr-2" />
                          View Full Report
                        </button>
                        <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center">
                          <Mail className="h-4 w-4 mr-2" />
                          Download PDF
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={handlePurchaseComprehensiveReport}
                          disabled={isInitiatingPayment || !isAuthenticated}
                          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                        >
                          <Lock className="h-4 w-4 mr-2" />
                          Unlock Full Report
                        </button>
                      </>
                    )
                  )}
                </div>
              </div>
            </div>
            </div>
        </section>

        {/* Stats Section - Moved down and made more compact */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">AutoAudit Vehicle Checks in Numbers</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-3">
                  <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-3 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {activeCheckType === 'mot' 
                ? 'Why Use Our MOT History Checker?' 
                : 'Why Choose Our Vehicle Reports?'}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {activeCheckType === 'mot'
                ? 'Get comprehensive MOT information from the official DVLA database with advanced features'
                : 'Get comprehensive vehicle intelligence with professional reports trusted by dealers and buyers'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${
                  activeCheckType === 'mot' 
                    ? 'from-orange-500 to-orange-600' 
                    : 'from-blue-500 to-blue-600'
                } opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                <div className="relative p-8 text-center">
                  <div className={`bg-gradient-to-br ${
                    activeCheckType === 'mot' 
                      ? 'from-orange-500 to-orange-600' 
                      : 'from-blue-500 to-blue-600'
                  } p-4 rounded-2xl w-16 h-16 mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              When Should You Check Vehicle History?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Vehicle history provides valuable insights for various situations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
                <div className="p-8">
                  <div className="flex items-start">
                    <div className={`bg-${benefit.color}-100 p-4 rounded-2xl mr-6 flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      <benefit.icon className={`h-8 w-8 text-${benefit.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What You'll See Section */}
        <section className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Information You'll Get
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {activeCheckType === 'mot'
                ? 'Our MOT history checker provides comprehensive details about every MOT test'
                : 'Our vehicle reports provide detailed information about the vehicle\'s history and status'}
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-2xl p-8 lg:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="bg-gradient-to-br from-green-100 to-green-200 p-6 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-3">MOT Results</h4>
                <p className="text-gray-600 leading-relaxed">Pass, fail, or advisory results for each MOT test</p>
              </div>
              
              <div className="text-center group">
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="h-10 w-10 text-blue-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-3">Expiry Dates</h4>
                <p className="text-gray-600 leading-relaxed">When tests were conducted and when MOT expires</p>
              </div>
              
              <div className="text-center group">
                <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-6 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Search className="h-10 w-10 text-purple-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-3">Defects</h4>
                <p className="text-gray-600 leading-relaxed">Detailed information about any issues found</p>
              </div>
              
              <div className="text-center group">
                <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 p-6 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Car className="h-10 w-10 text-yellow-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-3">Mileage</h4>
                <p className="text-gray-600 leading-relaxed">Odometer readings at each test to spot discrepancies</p>
              </div>
              
              {activeCheckType === 'comprehensive' && (
                <div className="text-center group">
                  <div className="bg-gradient-to-br from-indigo-100 to-indigo-200 p-6 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <PoundSterling className="h-10 w-10 text-indigo-600" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-3">Valuation</h4>
                  <p className="text-gray-600 leading-relaxed">Current market value based on condition and mileage</p>
                </div>
              )}
              
              <div className="text-center group">
                <div className="bg-gradient-to-br from-red-100 to-red-200 p-6 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <AlertTriangle className="h-10 w-10 text-red-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-3">Failures</h4>
                <p className="text-gray-600 leading-relaxed">Specific reasons why a vehicle failed its MOT</p>
              </div>
              
              {activeCheckType === 'comprehensive' && (
                <div className="text-center group">
                  <div className="bg-gradient-to-br from-green-100 to-green-200 p-6 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Shield className="h-10 w-10 text-green-600" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-3">Risk</h4>
                  <p className="text-gray-600 leading-relaxed">Comprehensive risk analysis including stolen and write-off checks</p>
                </div>
              )}
              
              <div className="text-center group">
                <div className="bg-gradient-to-br from-indigo-100 to-indigo-200 p-6 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <FileText className="h-10 w-10 text-indigo-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-3">Certificates</h4>
                <p className="text-gray-600 leading-relaxed">Official MOT test certificate numbers for verification</p>
              </div>
              
              <div className="text-center group">
                <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-6 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Mail className="h-10 w-10 text-orange-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-3">Email Reports</h4>
                <p className="text-gray-600 leading-relaxed">Get your vehicle report sent directly to your email</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Common questions about vehicle history checks
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {faqItems.map((item, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="p-8">
                    <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-start">
                      <div className="bg-orange-100 p-2 rounded-lg mr-4 flex-shrink-0">
                        <AlertTriangle className="h-5 w-5 text-orange-600" />
                      </div>
                      {item.question}
                    </h4>
                    <p className="text-gray-700 leading-relaxed ml-12">
                      {item.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 rounded-3xl shadow-2xl overflow-hidden relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }} />
            </div>
            
            <div className="relative p-8 lg:p-12 text-white text-center">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Car className="h-10 w-10 text-white" />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Get the Complete Vehicle Picture
              </h2>
              
              <p className="text-xl text-orange-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                Upgrade to our comprehensive report for complete vehicle intelligence including valuation, 
                risk assessment, and detailed history checks.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {activeCheckType === 'mot' ? (
                  <>
                    <button 
                      onClick={() => setActiveCheckType('comprehensive')}
                      className="bg-white text-orange-600 px-8 py-4 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 font-bold text-lg shadow-xl hover:shadow-2xl inline-flex items-center justify-center"
                    >
                      <FileText className="h-5 w-5 mr-2" />
                      Get Full Vehicle Report
                    </button>
                    <a 
                      href="/pricing" 
                      className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-orange-600 transition-all duration-300 transform hover:scale-105 font-bold text-lg inline-flex items-center justify-center"
                    >
                      <Award className="h-5 w-5 mr-2" />
                      View Pricing
                    </a>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handlePurchaseComprehensiveReport}
                      disabled={isInitiatingPayment || !isAuthenticated || hasPaidForComprehensiveReport}
                      className="bg-white text-orange-600 px-8 py-4 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 font-bold text-lg shadow-xl hover:shadow-2xl inline-flex items-center justify-center disabled:bg-gray-200 disabled:text-gray-500 disabled:transform-none disabled:hover:shadow-xl"
                    >
                      {isInitiatingPayment ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-600 mr-2"></div>
                          Processing...
                        </>
                      ) : hasPaidForComprehensiveReport ? (
                        <>
                          <CheckCircle className="h-5 w-5 mr-2" />
                          You Have Full Access
                        </>
                      ) : !isAuthenticated ? (
                        <>
                          <Lock className="h-5 w-5 mr-2" />
                          Sign In to Purchase
                        </>
                      ) : (
                        <>
                          <FileText className="h-5 w-5 mr-2" />
                          Get Full Report - £24.99
                        </>
                      )}
                    </button>
                    <button 
                      onClick={() => setActiveCheckType('mot')}
                      className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-orange-600 transition-all duration-300 transform hover:scale-105 font-bold text-lg inline-flex items-center justify-center"
                    >
                      <Car className="h-5 w-5 mr-2" />
                      Try Free MOT Check
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}