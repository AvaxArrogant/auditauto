import React, { useState } from 'react';
import { Search, CheckCircle, XCircle, AlertTriangle, Loader2, User, Calendar, Award, AlertCircle } from 'lucide-react';
import { dvlaApi, DVLADriverData, DVLAApiError } from '../services/dvlaApi';

interface DVLADriverCheckerProps {
  onDriverVerified?: (driverData: DVLADriverData) => void;
  className?: string;
}

export default function DVLADriverChecker({ onDriverVerified, className = '' }: DVLADriverCheckerProps) {
  const [licenseNumber, setLicenseNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [driverData, setDriverData] = useState<DVLADriverData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!licenseNumber.trim()) {
      setError('Please enter a driving license number');
      return;
    }

    setLoading(true);
    setError(null);
    setDriverData(null);

    try {
      const result = await dvlaApi.getDriverInfo(licenseNumber);
      
      if ('error' in result) {
        const apiError = result as DVLAApiError;
        setError(apiError.message);
      } else {
        const data = result as DVLADriverData;
        setDriverData(data);
        onDriverVerified?.(data);
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

  const getStatusIcon = (isValid: boolean) => {
    return isValid ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <XCircle className="h-5 w-5 text-red-500" />
    );
  };

  const getStatusColor = (isValid: boolean) => {
    return isValid ? 'text-green-600' : 'text-red-600';
  };

  const getPenaltyPointsColor = (points: number) => {
    if (points === 0) return 'text-green-600';
    if (points <= 6) return 'text-yellow-600';
    if (points <= 9) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg p-6 ${className}`}>
      <div className="flex items-center mb-6">
        <User className="h-6 w-6 text-orange-600 mr-3" />
        <h3 className="text-xl font-semibold text-gray-900">DVLA Driver License Checker</h3>
      </div>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Enter driving license number (e.g., TCAEU610267NO9EK)"
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value.toUpperCase())}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              maxLength={16}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !licenseNumber.trim()}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {driverData && (
        <div className="space-y-6">
          {/* Driver Basic Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Driver Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600">License Number:</span>
                <p className="font-semibold text-gray-900">{driverData.driver.drivingLicenceNumber}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Name:</span>
                <p className="font-semibold text-gray-900">
                  {driverData.driver.firstNames} {driverData.driver.lastName}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Date of Birth:</span>
                <p className="font-semibold text-gray-900">{formatDate(driverData.driver.dateOfBirth)}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Age:</span>
                <p className="font-semibold text-gray-900">{dvlaApi.constructor.getDriverAge(driverData)} years</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Gender:</span>
                <p className="font-semibold text-gray-900">{driverData.driver.gender}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Postcode:</span>
                <p className="font-semibold text-gray-900">{driverData.driver.address.unstructuredAddress.postcode}</p>
              </div>
            </div>
          </div>

          {/* License Status */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">License Status</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {getStatusIcon(dvlaApi.constructor.isLicenseValid(driverData))}
                  <span className={`ml-2 font-semibold ${getStatusColor(dvlaApi.constructor.isLicenseValid(driverData))}`}>
                    {driverData.licence.status}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-600">Type:</span>
                  <p className="font-semibold text-gray-900">{driverData.licence.type}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-600">Valid Until:</span>
                <p className="font-semibold text-gray-900">{formatDate(driverData.token.validToDate)}</p>
              </div>
            </div>
          </div>

          {/* Entitlements */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">License Categories</h4>
            <div className="space-y-3">
              {driverData.entitlement.map((entitlement, index) => (
                <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm font-semibold mr-2">
                        {entitlement.categoryCode}
                      </span>
                      <span className="text-sm text-gray-600">{entitlement.categoryType}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-gray-600">Expires:</span>
                      <p className="text-sm font-semibold text-gray-900">{formatDate(entitlement.expiryDate)}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{entitlement.categoryLegalLiteral}</p>
                  {entitlement.restrictions && entitlement.restrictions.length > 0 && (
                    <div className="mt-2">
                      <span className="text-xs text-orange-600 font-semibold">Restrictions:</span>
                      {entitlement.restrictions.map((restriction, restrictionIndex) => (
                        <p key={restrictionIndex} className="text-xs text-orange-700">
                          {restriction.restrictionCode}: {restriction.restrictionLiteral}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Endorsements */}
          {driverData.endorsements && driverData.endorsements.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Endorsements</h4>
              <div className="space-y-3">
                {driverData.endorsements.map((endorsement, index) => (
                  <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-semibold">
                        {endorsement.offenceCode}
                      </span>
                      <div className="text-right">
                        <span className="text-sm text-gray-600">Points:</span>
                        <span className="font-semibold text-red-600 ml-1">{endorsement.penaltyPoints}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-1">{endorsement.offenceLegalLiteral}</p>
                    <p className="text-xs text-gray-600">Date: {formatDate(endorsement.offenceDate)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-blue-900 mb-2">Driver Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between">
                <span className="text-blue-800">License Valid:</span>
                <span className={`font-semibold ${
                  dvlaApi.constructor.isLicenseValid(driverData) ? 'text-green-600' : 'text-red-600'
                }`}>
                  {dvlaApi.constructor.isLicenseValid(driverData) ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-blue-800">Car License (B):</span>
                <span className={`font-semibold ${
                  dvlaApi.constructor.hasValidEntitlement(driverData, 'B') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {dvlaApi.constructor.hasValidEntitlement(driverData, 'B') ? 'Valid' : 'Invalid'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-blue-800">Penalty Points:</span>
                <span className={`font-semibold ${getPenaltyPointsColor(dvlaApi.constructor.getTotalPenaltyPoints(driverData))}`}>
                  {dvlaApi.constructor.getTotalPenaltyPoints(driverData)}
                </span>
              </div>
            </div>
            
            {dvlaApi.constructor.getTotalPenaltyPoints(driverData) >= 12 && (
              <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-red-800 font-semibold">
                  Warning: Driver has 12+ penalty points and may be disqualified
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}