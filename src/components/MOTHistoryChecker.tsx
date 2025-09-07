import React, { useState } from 'react';
import { Search, CheckCircle, XCircle, AlertTriangle, Loader2, Car, Calendar, Gauge, FileText, Clock, AlertCircle } from 'lucide-react';
import { dvlaApi, DVLAMOTHistoryData, DVLAApiError } from '../services/dvlaApi';

interface MOTHistoryCheckerProps {
  onMOTVerified?: (motData: DVLAMOTHistoryData) => void;
  className?: string;
}

export default function MOTHistoryChecker({ onMOTVerified, className = '' }: MOTHistoryCheckerProps) {
  const [registration, setRegistration] = useState('');
  const [loading, setLoading] = useState(false);
  const [motData, setMOTData] = useState<DVLAMOTHistoryData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTest, setActiveTest] = useState<number>(0);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registration.trim()) {
      setError('Please enter a registration number');
      return;
    }

    setLoading(true);
    setError(null);
    setMOTData(null);

    try {
      const result = await dvlaApi.getMOTHistory(registration);
      
      if ('error' in result) {
        const apiError = result as DVLAApiError;
        setError(apiError.message);
      } else {
        const data = result as DVLAMOTHistoryData;
        setMOTData(data);
        setActiveTest(0); // Show most recent test first
        onMOTVerified?.(data);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  const getTestResultIcon = (result: string) => {
    switch (result.toLowerCase()) {
      case 'passed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getTestResultColor = (result: string) => {
    switch (result.toLowerCase()) {
      case 'passed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'failed':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  const getCurrentMOTStatus = () => {
    if (!motData || !motData.motTests || motData.motTests.length === 0) {
      return { status: 'Unknown', color: 'text-gray-600', icon: AlertTriangle };
    }

    const latestTest = motData.motTests[0];
    const today = new Date();
    
    if (latestTest.testResult.toLowerCase() === 'passed' && latestTest.expiryDate) {
      const expiryDate = new Date(latestTest.expiryDate);
      if (expiryDate > today) {
        return { 
          status: `Valid until ${formatDate(latestTest.expiryDate)}`, 
          color: 'text-green-600',
          icon: CheckCircle 
        };
      } else {
        return { 
          status: 'Expired', 
          color: 'text-red-600',
          icon: XCircle 
        };
      }
    } else {
      return { 
        status: 'Failed or No Valid MOT', 
        color: 'text-red-600',
        icon: XCircle 
      };
    }
  };

  return (
    <div className={`bg-white rounded-3xl shadow-2xl p-8 lg:p-10 ${className} border border-gray-100`}>
      <div className="flex items-center mb-6">
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-2xl mr-4">
          <Car className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Free MOT History Checker</h3>
          <p className="text-gray-600">Enter your registration number below</p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Enter registration number (e.g., AB12 CDE)"
              value={registration}
              onChange={(e) => setRegistration(e.target.value.toUpperCase())}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 placeholder-gray-500 text-lg font-medium transition-all duration-200"
              maxLength={8}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !registration.trim()}
            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none min-w-[140px]"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Checking...
              </>
            ) : (
              <>
                <Search className="h-5 w-5 mr-2" />
                Check MOT
              </>
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="mb-6 p-6 bg-red-50 border-2 border-red-200 rounded-xl flex items-start">
          <AlertTriangle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-red-800 mb-1">Error</h4>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {motData && (
        <div className="space-y-6">
          {/* Vehicle Summary */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
            <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Car className="h-5 w-5 text-orange-600 mr-2" />
              Vehicle Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-600">Registration</span>
                <p className="text-lg font-bold text-gray-900">{motData.registration}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Make & Model</span>
                <p className="text-lg font-bold text-gray-900">{motData.make} {motData.model}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">First Used</span>
                <p className="text-lg font-bold text-gray-900">{formatDate(motData.firstUsedDate)}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Fuel Type</span>
                <p className="text-lg font-bold text-gray-900">{motData.fuelType}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Colour</span>
                <p className="text-lg font-bold text-gray-900">{motData.primaryColour}</p>
              </div>
            </div>
          </div>

          {/* Current MOT Status */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
            <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Shield className="h-5 w-5 text-blue-600 mr-2" />
              Current MOT Status
            </h4>
            <div className="flex items-center bg-white rounded-xl p-4 shadow-sm">
              {(() => {
                const status = getCurrentMOTStatus();
                return (
                  <>
                    <div className={`p-3 rounded-xl mr-4 ${status.color.includes('green') ? 'bg-green-100' : status.color.includes('red') ? 'bg-red-100' : 'bg-gray-100'}`}>
                      <status.icon className={`h-6 w-6 ${status.color.replace('text-', 'text-')}`} />
                    </div>
                    <span className={`font-bold text-xl ${status.color}`}>
                      {status.status}
                    </span>
                  </>
                );
              })()}
            </div>
          </div>

          {/* MOT Test History */}
          {motData.motTests && motData.motTests.length > 0 && (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
              <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <FileText className="h-5 w-5 text-gray-600 mr-2" />
                MOT Test History
              </h4>
              
              {/* Test Navigation */}
              <div className="flex flex-wrap gap-3 mb-6">
                {motData.motTests.map((test, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTest(index)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                      activeTest === index
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg transform scale-105'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {formatDate(test.completedDate)}
                  </button>
                ))}
              </div>

              {/* Active Test Details */}
              {motData.motTests[activeTest] && (
                <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-sm">
                  <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold mb-6 border-2 ${getTestResultColor(motData.motTests[activeTest].testResult)}`}>
                    {getTestResultIcon(motData.motTests[activeTest].testResult)}
                    <span className="ml-2">{motData.motTests[activeTest].testResult}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-lg mr-3">
                        <Calendar className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Test Date</span>
                        <p className="font-bold text-gray-900">{formatDate(motData.motTests[activeTest].completedDate)}</p>
                      </div>
                    </div>
                    
                    {motData.motTests[activeTest].expiryDate && (
                      <div className="flex items-center">
                        <div className="bg-green-100 p-2 rounded-lg mr-3">
                          <Clock className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600">Expiry Date</span>
                          <p className="font-bold text-gray-900">{formatDate(motData.motTests[activeTest].expiryDate)}</p>
                        </div>
                      </div>
                    )}
                    
                    {motData.motTests[activeTest].odometerValue && (
                      <div className="flex items-center">
                        <div className="bg-purple-100 p-2 rounded-lg mr-3">
                          <Gauge className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600">Mileage</span>
                          <p className="font-bold text-gray-900">
                            {parseInt(motData.motTests[activeTest].odometerValue!).toLocaleString()} {motData.motTests[activeTest].odometerUnit}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {motData.motTests[activeTest].motTestNumber && (
                      <div className="flex items-center">
                        <div className="bg-orange-100 p-2 rounded-lg mr-3">
                          <FileText className="h-4 w-4 text-orange-600" />
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600">Test Number</span>
                          <p className="font-bold text-gray-900 text-xs">{motData.motTests[activeTest].motTestNumber}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Defects */}
                  {motData.motTests[activeTest].defects && motData.motTests[activeTest].defects!.length > 0 && (
                    <div className="mb-4">
                      <h5 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                        Defects ({motData.motTests[activeTest].defects!.length})
                      </h5>
                      <div className="space-y-2">
                        {motData.motTests[activeTest].defects!.map((defect, defectIndex) => (
                          <div key={defectIndex} className={`p-3 rounded-lg border ${
                            defect.dangerous ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'
                          }`}>
                            <div className="flex items-start">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold mr-3 ${
                                defect.dangerous ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {defect.dangerous ? 'DANGEROUS' : defect.type.toUpperCase()}
                              </span>
                              <p className="text-sm text-gray-700 flex-1">{defect.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* RFR and Comments */}
                  {motData.motTests[activeTest].rfrAndComments && motData.motTests[activeTest].rfrAndComments!.length > 0 && (
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">Additional Comments</h5>
                      <div className="space-y-2">
                        {motData.motTests[activeTest].rfrAndComments!.map((comment, commentIndex) => (
                          <div key={commentIndex} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-start">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 mr-3">
                                {comment.type.toUpperCase()}
                              </span>
                              <p className="text-sm text-gray-700 flex-1">{comment.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Summary Stats */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl p-6">
            <h4 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
              MOT History Summary
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="text-3xl font-bold text-blue-700">{motData.motTests?.length || 0}</p>
                  <p className="text-sm font-medium text-blue-600">Total Tests</p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="text-3xl font-bold text-green-600">
                    {motData.motTests?.filter(test => test.testResult.toLowerCase() === 'passed').length || 0}
                  </p>
                  <p className="text-sm font-medium text-blue-600">Passed</p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="text-3xl font-bold text-red-600">
                    {motData.motTests?.filter(test => test.testResult.toLowerCase() === 'failed').length || 0}
                  </p>
                  <p className="text-sm font-medium text-blue-600">Failed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}