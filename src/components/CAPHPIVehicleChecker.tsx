import React, { useState } from 'react';
import { 
  Search, CheckCircle, XCircle, AlertTriangle, Loader2, Car, 
  PoundSterling, Shield, History, TrendingUp, AlertCircle, Info
} from 'lucide-react';
import { capHpiApi, CAPHPIVehicleData, CAPHPIValuationData, CAPHPIInsuranceData, CAPHPIHistoryData, CAPHPIApiError } from '../services/capHpiApi';

interface CAPHPIVehicleCheckerProps {
  onVehicleVerified?: (vehicleData: any) => void;
  className?: string;
}

interface ComprehensiveReport {
  vehicle: CAPHPIVehicleData;
  valuation?: CAPHPIValuationData;
  insurance?: CAPHPIInsuranceData;
  history?: CAPHPIHistoryData;
}

export default function CAPHPIVehicleChecker({ onVehicleVerified, className = '' }: CAPHPIVehicleCheckerProps) {
  const [registration, setRegistration] = useState('');
  const [mileage, setMileage] = useState('');
  const [condition, setCondition] = useState<'excellent' | 'good' | 'average' | 'below_average' | 'poor'>('good');
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<ComprehensiveReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'valuation' | 'insurance' | 'history'>('overview');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registration.trim()) {
      setError('Please enter a registration number');
      return;
    }

    setLoading(true);
    setError(null);
    setReportData(null);

    try {
      const mileageNum = mileage ? parseInt(mileage) : undefined;
      const result = await capHpiApi.getComprehensiveReport(registration, mileageNum, condition);
      
      if ('error' in result) {
        const apiError = result as CAPHPIApiError;
        setError(apiError.message);
      } else {
        const data = result as ComprehensiveReport;
        setReportData(data);
        onVehicleVerified?.(data);
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

  const getStatusIcon = (status: 'clear' | 'alert' | 'unknown' | string) => {
    switch (status) {
      case 'clear':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'alert':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: 'clear' | 'alert' | 'unknown' | string) => {
    switch (status) {
      case 'clear':
        return 'text-green-600';
      case 'alert':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  const getRiskColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
    }
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg p-6 ${className}`}>
      <div className="flex items-center mb-6">
        <Car className="h-6 w-6 text-orange-600 mr-3" />
        <h3 className="text-xl font-semibold text-gray-900">CAP HPI Vehicle Report</h3>
      </div>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Registration Number
            </label>
            <input
              type="text"
              placeholder="e.g., AB12 CDE"
              value={registration}
              onChange={(e) => setRegistration(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              maxLength={8}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mileage (Optional)
            </label>
            <input
              type="number"
              placeholder="e.g., 50000"
              value={mileage}
              onChange={(e) => setMileage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Condition
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
            >
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="average">Average</option>
              <option value="below_average">Below Average</option>
              <option value="poor">Poor</option>
            </select>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading || !registration.trim()}
          className="w-full px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Generating Report...
            </>
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Get Vehicle Report
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {reportData && (
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
              {reportData.valuation && (
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
                </button>
              )}
              {reportData.insurance && (
                <button
                  onClick={() => setActiveTab('insurance')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'insurance'
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Shield className="h-4 w-4 inline mr-2" />
                  Insurance
                </button>
              )}
              {reportData.history && (
                <button
                  onClick={() => setActiveTab('history')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'history'
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <History className="h-4 w-4 inline mr-2" />
                  History
                </button>
              )}
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
                    <p className="font-semibold text-gray-900">{reportData.vehicle.registration}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Make & Model:</span>
                    <p className="font-semibold text-gray-900">{reportData.vehicle.make} {reportData.vehicle.model}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Year:</span>
                    <p className="font-semibold text-gray-900">{reportData.vehicle.year}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Fuel Type:</span>
                    <p className="font-semibold text-gray-900">{reportData.vehicle.fuelType}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Transmission:</span>
                    <p className="font-semibold text-gray-900">{reportData.vehicle.transmission}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Engine Size:</span>
                    <p className="font-semibold text-gray-900">{reportData.vehicle.engineSize}L</p>
                  </div>
                </div>
              </div>

              {/* Quick Summary */}
              {reportData.history && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Risk Assessment</h4>
                  {(() => {
                    const risk = capHpiApi.constructor.getRiskAssessment(reportData.history);
                    return (
                      <div className={`p-3 rounded-lg border ${getRiskColor(risk.level)}`}>
                        <div className="flex items-center mb-2">
                          <AlertCircle className="h-5 w-5 mr-2" />
                          <span className="font-semibold capitalize">{risk.level} Risk</span>
                        </div>
                        <p className="text-sm mb-2">{risk.description}</p>
                        {risk.alerts.length > 0 && (
                          <ul className="text-sm space-y-1">
                            {risk.alerts.map((alert, index) => (
                              <li key={index} className="flex items-center">
                                <span className="w-1 h-1 bg-current rounded-full mr-2"></span>
                                {alert}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}

          {activeTab === 'valuation' && reportData.valuation && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Current Market Values</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-2">Retail Values</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Excellent:</span>
                        <span className="font-semibold">{capHpiApi.constructor.formatCurrency(reportData.valuation.values.retail.excellent)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Good:</span>
                        <span className="font-semibold">{capHpiApi.constructor.formatCurrency(reportData.valuation.values.retail.good)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Average:</span>
                        <span className="font-semibold">{capHpiApi.constructor.formatCurrency(reportData.valuation.values.retail.average)}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-2">Trade Values</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Clean:</span>
                        <span className="font-semibold">{capHpiApi.constructor.formatCurrency(reportData.valuation.values.trade.clean)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Average:</span>
                        <span className="font-semibold">{capHpiApi.constructor.formatCurrency(reportData.valuation.values.trade.average)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Below:</span>
                        <span className="font-semibold">{capHpiApi.constructor.formatCurrency(reportData.valuation.values.trade.below)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Valuation Date:</span>
                    <span className="font-semibold">{formatDate(reportData.valuation.valuationDate)}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-600">Based on Mileage:</span>
                    <span className="font-semibold">{reportData.valuation.mileage.toLocaleString()} miles</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'insurance' && reportData.insurance && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Insurance Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Insurance Group:</span>
                    <p className="font-semibold text-gray-900">{reportData.insurance.insuranceGroup}</p>
                    <p className="text-xs text-gray-500">
                      {capHpiApi.constructor.getInsuranceGroupDescription(reportData.insurance.insuranceGroup)}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Security Rating:</span>
                    <p className="font-semibold text-gray-900">{reportData.insurance.securityRating}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Theft Rating:</span>
                    <p className="font-semibold text-gray-900">{reportData.insurance.theftRating}/10</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Performance Index:</span>
                    <p className="font-semibold text-gray-900">{reportData.insurance.performanceIndex}</p>
                  </div>
                </div>
                {reportData.insurance.safetyRating && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">NCAP Safety Rating:</span>
                      <span className="font-semibold">{reportData.insurance.safetyRating.ncap}/5 stars ({reportData.insurance.safetyRating.year})</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'history' && reportData.history && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-semibold text-gray-800 mb-3">Security Checks</h5>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Stolen Check:</span>
                      <div className="flex items-center">
                        {getStatusIcon(reportData.history.checks.stolen.status)}
                        <span className={`ml-2 text-sm font-semibold ${getStatusColor(reportData.history.checks.stolen.status)}`}>
                          {reportData.history.checks.stolen.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Write-off Check:</span>
                      <div className="flex items-center">
                        {getStatusIcon(reportData.history.checks.writeOff.status)}
                        <span className={`ml-2 text-sm font-semibold ${getStatusColor(reportData.history.checks.writeOff.status)}`}>
                          {reportData.history.checks.writeOff.status}
                          {reportData.history.checks.writeOff.category && ` (Cat ${reportData.history.checks.writeOff.category})`}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Finance Check:</span>
                      <div className="flex items-center">
                        {getStatusIcon(reportData.history.checks.finance.status)}
                        <span className={`ml-2 text-sm font-semibold ${getStatusColor(reportData.history.checks.finance.status)}`}>
                          {reportData.history.checks.finance.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-semibold text-gray-800 mb-3">Vehicle History</h5>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Previous Keepers:</span>
                      <span className="font-semibold text-gray-900">{reportData.history.checks.previousKeepers.count}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Mileage Check:</span>
                      <div className="flex items-center">
                        {getStatusIcon(reportData.history.checks.mileage.status)}
                        <span className={`ml-2 text-sm font-semibold ${getStatusColor(reportData.history.checks.mileage.status)}`}>
                          {reportData.history.checks.mileage.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Import Status:</span>
                      <span className="font-semibold text-gray-900">
                        {reportData.history.checks.import.status === 'uk' ? 'UK Vehicle' : 'Imported'}
                        {reportData.history.checks.import.country && ` from ${reportData.history.checks.import.country}`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}