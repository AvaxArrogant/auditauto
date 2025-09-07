import React, { useState } from 'react';
import {
  Search, CheckCircle, XCircle, AlertTriangle, Loader2, Car,
  PoundSterling, Shield, History, TrendingUp, AlertCircle, Info,
  Lock, User, Download, Mail, Eye, LogIn, UserPlus
} from 'lucide-react';
import { vehicleDataApi, VehicleDataFull, VehicleDataApiError } from '../services/vehicleDataApi';
import VehicleReportGenerator from '../utils/vehicleReportGenerator';
import { EmailService } from '../services/emailService';
import { supabase } from '../lib/supabase';



interface VehicleDataCheckerProps {
  onVehicleVerified?: (vehicleData: VehicleDataFull) => void;
  className?: string;
  onSignIn?: () => void;
  onSignUp?: () => void;
  hasComprehensiveAccess?: boolean;
  isAuthenticated?: boolean;
  onPurchaseComprehensiveReport?: () => void;
}

export default function VehicleDataChecker({
  onSignIn,
  onSignUp,
  onVehicleVerified,
  className = '',
  hasComprehensiveAccess = false,
  isAuthenticated = false,
  onPurchaseComprehensiveReport
}: VehicleDataCheckerProps) {
  const [registration, setRegistration] = useState('');
  const [loading, setLoading] = useState(false);
  const [vehicleData, setVehicleData] = useState<VehicleDataFull | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'mot' | 'valuation' | 'history' | 'risk'>('overview');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');
  const [emailSending, setEmailSending] = useState(false);
  const [emailResult, setEmailResult] = useState<{success: boolean; message: string} | null>(null);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

const handleSearch = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!isAuthenticated) {
    setShowAuthPrompt(true);
    if (onSignIn) {
      onSignIn();
    }
    return;
  }

  if (!registration.trim()) {
    setError('Please enter a registration number');
    return;
  }

  setLoading(true);
  setError(null);
  setVehicleData(null);

  try {
    const result = hasComprehensiveAccess
      ? await vehicleDataApi.getFullVehicleInfo(registration)
      : await vehicleDataApi.getBasicVehicleInfo(registration);

    if ('error' in result) {
      setError(result.error);
    } else {
      setVehicleData(result);
      if (onVehicleVerified) {
        onVehicleVerified(result);
      }

      // 🛡️ NEW: Get Supabase token
      const { data: session } = await supabase.auth.getSession();
      const token = session?.session?.access_token;

      if (!token) {
        console.warn('No Supabase access token found');
        return;
      }

      // ✅ Log to Supabase Edge Function with auth
      await fetch(`${import.meta.env.VITE_SUPABASE_EDGE_URL}/vehicle-data-log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          registration: registration.trim(),
          user_id: session.session.user.id,
          submission_id: crypto.randomUUID(),
          timestamp: new Date().toISOString()
        })
      });
    }
  } catch (err) {
    console.error(err);
    setError('Failed to fetch vehicle data');
  } finally {
    setLoading(false);
  }
};


  const isMotValid = (data: VehicleDataFull) => {
    return data.motStatus.isValid;
  };

  const isTaxValid = (data: VehicleDataFull) => {
    return data.taxStatus?.isValid || false;
  };

  const handleDownloadReport = () => {
    if (!vehicleData) return;
    
    VehicleReportGenerator.downloadPDF({
      vehicleData,
      reportType: hasComprehensiveAccess ? 'comprehensive' : 'basic'
    });
  };

  const handleEmailReport = async () => {
    if (!vehicleData || !emailAddress) return;
    
    setEmailSending(true);
    setEmailResult(null);
    
    try {
      // Generate report content
      const reportContent = VehicleReportGenerator.generatePlainTextReport({
        vehicleData,
        reportType: hasComprehensiveAccess ? 'comprehensive' : 'basic'
      });
      
      // Send email
      const result = await EmailService.sendVehicleReportEmail({
        to: emailAddress,
        registration: vehicleData.registration,
        reportContent,
        reportType: hasComprehensiveAccess ? 'comprehensive' : 'basic'
      });
      
      setEmailResult(result);
      
      if (result.success) {
        // Close modal after successful email
        setTimeout(() => {
          setShowEmailModal(false);
          setEmailResult(null);
        }, 3000);
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setEmailResult({
        success: false,
        message: 'Failed to send email. Please try again.'
      });
    } finally {
      setEmailSending(false);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <div className="flex items-center mb-6">
        <Car className="h-6 w-6 text-orange-600 mr-3" />
        <h3 className="text-xl font-semibold text-gray-900">
          {isAuthenticated ? "Vehicle Data Check" : "Vehicle Check - Sign In Required"}
        </h3>
      </div>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Enter registration number (e.g., AB12 CDE)"
              value={registration}
              onChange={(e) => setRegistration(e.target.value.toUpperCase())}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${
                isAuthenticated 
                  ? "focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900" 
                  : "bg-gray-100 text-gray-500 cursor-not-allowed"
              } placeholder-gray-500`}
              disabled={!isAuthenticated}
              maxLength={8}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !registration.trim() || !isAuthenticated}
            className={`px-6 py-3 rounded-lg transition-colors duration-200 flex items-center ${
              isAuthenticated 
                ? "bg-orange-600 text-white hover:bg-orange-700 disabled:bg-gray-400" 
                : "bg-gray-400 text-gray-200"
            } disabled:cursor-not-allowed`}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </button>
        </div>
      </form>

      {/* Authentication Prompt */}
      {showAuthPrompt && !isAuthenticated && (
        <div className="mb-6 p-4 bg-orange-50 border-2 border-orange-200 rounded-lg flex items-start">
          <AlertCircle className="h-5 w-5 text-orange-500 mr-3 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-orange-800 mb-1">Authentication Required</h4>
            <p className="text-orange-700 text-sm mb-3">
              You need to sign in to check vehicle data. Create an account to save your reports and access them anytime.
            </p>
            <div className="flex gap-3">
              <button
                onClick={onPurchaseComprehensiveReport}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center text-sm"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </button>
              <button
                onClick={onPurchaseComprehensiveReport}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Create Account
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {!hasComprehensiveAccess && vehicleData && (
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 mb-6 border-2 border-blue-200">
          <div className="flex items-start">
            <div className="bg-blue-600 p-2 rounded-full mr-3 flex-shrink-0">
              <Lock className="h-4 w-4 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 mb-1">Upgrade to Comprehensive Report</h4>
              <p className="text-sm text-blue-700 mb-2">
                Get complete vehicle history, valuation, and risk assessment with our comprehensive report.
              </p>
              {isAuthenticated ? (
                <button 
                  onClick={onPurchaseComprehensiveReport}
                  className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                >
                  Unlock Full Report - £24.99
                </button>
              ) : (
                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowEmailModal(true)}
                    className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Mail className="h-3 w-3 mr-1" />
                    Email Report
                  </button>
                  <button 
                    onClick={onPurchaseComprehensiveReport}
                    className="text-sm bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 transition-colors flex items-center"
                  >
                    <User className="h-3 w-3 mr-1" />
                    Sign In to Save
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {!isAuthenticated && !vehicleData && (
        <div className="bg-yellow-50 rounded-lg p-4 mb-6 border-2 border-yellow-200">
          <div className="flex items-start">
            <div className="bg-yellow-600 p-2 rounded-full mr-3 flex-shrink-0">
              <User className="h-4 w-4 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-yellow-800 mb-1">Sign In Recommended</h4>
              <p className="text-sm text-yellow-700">
                Sign in to save your vehicle reports and access them anytime.
              </p>
            </div>
          </div>
        </div>
      )}

      {vehicleData && (
        <div className="space-y-6">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Car className="h-4 w-4 inline mr-2" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab('mot')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'mot'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <History className="h-4 w-4 inline mr-2" />
                MOT History
              </button>
              <button
                onClick={() => setActiveTab('valuation')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'valuation'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <PoundSterling className="h-4 w-4 inline mr-2" />
                Valuation
                {!hasComprehensiveAccess && <Lock className="h-3 w-3 inline ml-1" />}
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'history'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Shield className="h-4 w-4 inline mr-2" />
                Vehicle History
                {!hasComprehensiveAccess && <Lock className="h-3 w-3 inline ml-1" />}
              </button>
              <button
                onClick={() => setActiveTab('risk')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'risk'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <AlertCircle className="h-4 w-4 inline mr-2" />
                Risk
                {!hasComprehensiveAccess && <Lock className="h-3 w-3 inline ml-1" />}
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Vehicle Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Registration:</span>
                    <p className="font-semibold text-gray-900">
                      {vehicleData.registration ? vehicleDataApi.formatRegistration(vehicleData.registration) : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Make & Model:</span>
                    <p className="font-semibold text-gray-900">{vehicleData.make} {vehicleData.model}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Year:</span>
                    <p className="font-semibold text-gray-900">{vehicleData.yearOfManufacture}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Fuel Type:</span>
                    <p className="font-semibold text-gray-900">{vehicleData.fuelType}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Color:</span>
                    <p className="font-semibold text-gray-900">{vehicleData.color}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Engine Size:</span>
                    <p className="font-semibold text-gray-900">{vehicleData.engineSize ? `${(vehicleData.engineSize / 1000).toFixed(1)}L` : 'Not available'}</p>
                  </div>
                </div>
              </div>
              
              {/* MOT and Tax Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">MOT Status</h4>
                  <div className="flex items-center">
                    {isMotValid(vehicleData) ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mr-2" />
                    )}
                    <span className={`font-semibold ${isMotValid(vehicleData) ? 'text-green-600' : 'text-red-600'}`}>
                      {isMotValid(vehicleData) ? 'Valid' : 'Not Valid'}
                    </span>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Tax Status</h4>
                  <div className="flex items-center">
                    {isTaxValid(vehicleData) ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mr-2" />
                    )}
                    <span className={`font-semibold ${isTaxValid(vehicleData) ? 'text-green-600' : 'text-red-600'}`}>
                      {isTaxValid(vehicleData) ? 'Valid' : 'Not Valid'}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleDownloadReport}
                  className={`flex-1 py-2 px-4 rounded-lg transition-colors flex items-center justify-center ${
                    isAuthenticated 
                      ? "bg-orange-600 text-white hover:bg-orange-700" 
                      : "bg-gray-400 text-gray-200 cursor-not-allowed"
                  }`}
                  disabled={!isAuthenticated}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </button>
                <button
                  onClick={onSignUp}
                  className={`flex-1 py-2 px-4 rounded-lg transition-colors flex items-center justify-center ${
                    isAuthenticated 
                      ? "bg-blue-600 text-white hover:bg-blue-700" 
                      : "bg-gray-400 text-gray-200 cursor-not-allowed"
                  }`}
                  disabled={!isAuthenticated}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email Report
                </button>
              </div>
            </div>
          )}

          {/* MOT History Tab */}
          {activeTab === 'mot' && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">MOT Status</h4>
                <div className="flex items-center mb-4">
                  {isMotValid(vehicleData) ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mr-2" />
                  )}
                  <span className={`font-semibold ${isMotValid(vehicleData) ? 'text-green-600' : 'text-red-600'}`}>
                    {isMotValid(vehicleData) ? 'Valid' : 'Not Valid'}
                  </span>
                </div>
                
                {vehicleData.motStatus?.dueDate && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">MOT Due Date:</span>
                    <span className="font-semibold text-gray-900">
                      {new Date(vehicleData.motStatus.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                
                {vehicleData.motStatus?.lastTestDate && (
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-600">Last Test Date:</span>
                    <span className="font-semibold text-gray-900">
                      {new Date(vehicleData.motStatus.lastTestDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-1">MOT Information</h4>
                    <p className="text-sm text-blue-700">
                      The MOT test is an annual test of vehicle safety, roadworthiness aspects, and exhaust emissions required for most vehicles over three years old used on public roads in the UK.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!hasComprehensiveAccess && (activeTab === 'valuation' || activeTab === 'history') && (
            <div className="bg-blue-50 rounded-lg p-6 text-center">
              <Lock className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-blue-800 mb-2">Premium Feature</h4>
              <p className="text-blue-600 mb-4">
                This feature is available with our comprehensive vehicle report.
              </p>
              <button
                onClick={onPurchaseComprehensiveReport}
                disabled={!isAuthenticated}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isAuthenticated ? 'Upgrade Now' : 'Sign In to Upgrade'}
              </button>
            </div>
          )}
          
          {/* Comprehensive Report Tabs - Only shown if user has access */}
          {hasComprehensiveAccess && activeTab === 'valuation' && vehicleData.valuation && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Vehicle Valuation</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-2">Retail Values</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Excellent:</span>
                        <span className="font-semibold">£{vehicleData.valuation.retail.excellent.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Good:</span>
                        <span className="font-semibold">£{vehicleData.valuation.retail.good.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Average:</span>
                        <span className="font-semibold">£{vehicleData.valuation.retail.average.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-2">Trade Values</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Clean:</span>
                        <span className="font-semibold">£{vehicleData.valuation.trade.clean.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Average:</span>
                        <span className="font-semibold">£{vehicleData.valuation.trade.average.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Below:</span>
                        <span className="font-semibold">£{vehicleData.valuation.trade.below.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Valuation Date:</span>
                    <span className="font-semibold">{new Date().toLocaleDateString('en-GB')}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {hasComprehensiveAccess && activeTab === 'history' && vehicleData.history && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-semibold text-gray-800 mb-3">Security Checks</h5>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Stolen Check:</span>
                      <div className="flex items-center">
                        {vehicleData.history.isStolen ? (
                          <XCircle className="h-4 w-4 text-red-500 mr-2" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        )}
                        <span className={`ml-2 text-sm font-semibold ${vehicleData.history.isStolen ? 'text-red-600' : 'text-green-600'}`}>
                          {vehicleData.history.isStolen ? 'STOLEN' : 'Clear'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Write-off Check:</span>
                      <div className="flex items-center">
                        {vehicleData.history.isWriteOff ? (
                          <XCircle className="h-4 w-4 text-red-500 mr-2" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        )}
                        <span className={`ml-2 text-sm font-semibold ${vehicleData.history.isWriteOff ? 'text-red-600' : 'text-green-600'}`}>
                          {vehicleData.history.isWriteOff ? `Category ${vehicleData.history.writeOffCategory}` : 'Clear'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Finance Check:</span>
                      <div className="flex items-center">
                        {vehicleData.history.hasOutstandingFinance ? (
                          <XCircle className="h-4 w-4 text-red-500 mr-2" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        )}
                        <span className={`ml-2 text-sm font-semibold ${vehicleData.history.hasOutstandingFinance ? 'text-red-600' : 'text-green-600'}`}>
                          {vehicleData.history.hasOutstandingFinance ? 'Outstanding Finance' : 'Clear'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-semibold text-gray-800 mb-3">Vehicle History</h5>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Mileage Check:</span>
                      <div className="flex items-center">
                        {vehicleData.history.hasMileageDiscrepancy ? (
                          <XCircle className="h-4 w-4 text-red-500 mr-2" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        )}
                        <span className={`ml-2 text-sm font-semibold ${vehicleData.history.hasMileageDiscrepancy ? 'text-red-600' : 'text-green-600'}`}>
                          {vehicleData.history.hasMileageDiscrepancy ? 'Discrepancy Detected' : 'No Issues'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Previous Keepers:</span>
                      <span className="font-semibold text-gray-900">
                        {vehicleData.history.keeperChanges?.length || 'Unknown'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Plate Changes:</span>
                      <span className="font-semibold text-gray-900">
                        {vehicleData.history.plateChanges?.length || 'None'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {hasComprehensiveAccess && activeTab === 'risk' && vehicleData.riskAssessment && (
            <div className="space-y-4">
              <div className={`bg-${vehicleData.riskAssessment.level === 'low' ? 'green' : vehicleData.riskAssessment.level === 'medium' ? 'yellow' : 'red'}-50 rounded-lg p-6 border border-${vehicleData.riskAssessment.level === 'low' ? 'green' : vehicleData.riskAssessment.level === 'medium' ? 'yellow' : 'red'}-200`}>
                <div className="flex items-center mb-4">
                  <div className={`bg-${vehicleData.riskAssessment.level === 'low' ? 'green' : vehicleData.riskAssessment.level === 'medium' ? 'yellow' : 'red'}-100 p-3 rounded-full mr-4`}>
                    {vehicleData.riskAssessment.level === 'low' ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : vehicleData.riskAssessment.level === 'medium' ? (
                      <AlertTriangle className="h-6 w-6 text-yellow-600" />
                    ) : (
                      <AlertCircle className="h-6 w-6 text-red-600" />
                    )}
                  </div>
                  <div>
                    <h4 className={`text-xl font-bold text-${vehicleData.riskAssessment.level === 'low' ? 'green' : vehicleData.riskAssessment.level === 'medium' ? 'yellow' : 'red'}-800`}>
                      {vehicleData.riskAssessment.level.toUpperCase()} RISK
                    </h4>
                    <p className={`text-${vehicleData.riskAssessment.level === 'low' ? 'green' : vehicleData.riskAssessment.level === 'medium' ? 'yellow' : 'red'}-700`}>
                      {vehicleData.riskAssessment.description}
                    </p>
                  </div>
                </div>
                
                {vehicleData.riskAssessment.alerts && vehicleData.riskAssessment.alerts.length > 0 && (
                  <div className="mt-4">
                    <h5 className={`font-semibold text-${vehicleData.riskAssessment.level === 'low' ? 'green' : vehicleData.riskAssessment.level === 'medium' ? 'yellow' : 'red'}-800 mb-2`}>
                      Risk Alerts:
                    </h5>
                    <ul className="space-y-2">
                      {vehicleData.riskAssessment.alerts.map((alert, index) => (
                        <li key={index} className="flex items-start">
                          <AlertCircle className={`h-4 w-4 text-${vehicleData.riskAssessment.level === 'low' ? 'green' : vehicleData.riskAssessment.level === 'medium' ? 'yellow' : 'red'}-600 mr-2 mt-0.5`} />
                          <span className={`text-${vehicleData.riskAssessment.level === 'low' ? 'green' : vehicleData.riskAssessment.level === 'medium' ? 'yellow' : 'red'}-700`}>
                            {alert}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {vehicleData.riskAssessment.level === 'low' && (
                  <div className="mt-4 bg-green-100 p-3 rounded-lg">
                    <p className="text-green-800 text-sm">
                      This vehicle appears to have a clean history with no major issues detected.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Email Report Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Email Vehicle Report</h3>
              <button 
                onClick={() => {
                  setShowEmailModal(false);
                  setEmailResult(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {emailResult ? (
              <div className={`p-4 rounded-lg ${emailResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                <div className="flex items-center">
                  {emailResult.success ? (
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 mr-2 text-red-500" />
                  )}
                  <p>{emailResult.message}</p>
                </div>
              </div>
            ) : (
              <>
                <p className="text-gray-600 mb-4">
                  Enter your email address to receive the vehicle report for {vehicleData?.registration}.
                </p>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowEmailModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEmailReport}
                    disabled={!emailAddress || !EmailService.isValidEmail(emailAddress) || emailSending}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                  >
                    {emailSending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        Send Report
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}