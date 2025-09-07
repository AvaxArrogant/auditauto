import React, { useState } from 'react';
import { Search, CheckCircle, XCircle, AlertTriangle, Loader2, Car, Info } from 'lucide-react';
import { dvlaApi, DVLAVehicleData, DVLAApiError } from '../services/dvlaApi';

interface DVLAVehicleCheckerProps {
  onVehicleVerified?: (vehicleData: DVLAVehicleData) => void;
  className?: string;
}

export default function DVLAVehicleChecker({ onVehicleVerified, className = '' }: DVLAVehicleCheckerProps) {
  const [registration, setRegistration] = useState('');
  const [loading, setLoading] = useState(false);
  const [vehicleData, setVehicleData] = useState<DVLAVehicleData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registration.trim()) {
      setError('Please enter a registration number');
      return;
    }

    setLoading(true);
    setError(null);
    setVehicleData(null);

    try {
      const result = await dvlaApi.getVehicleInfo(registration);
      
      if ('error' in result) {
        const apiError = result as DVLAApiError;
        setError(apiError.message);
      } else {
        const data = result as DVLAVehicleData;
        setVehicleData(data);
        onVehicleVerified?.(data);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
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

  return (
    <div className={`bg-white rounded-2xl shadow-lg p-6 ${className}`}>
      <div className="flex items-center mb-6">
        <Car className="h-6 w-6 text-orange-600 mr-3" />
        <h3 className="text-xl font-semibold text-gray-900">DVLA Vehicle Checker</h3>
      </div>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Enter registration number (e.g., AB12 CDE)"
              value={registration}
              onChange={(e) => setRegistration(e.target.value.toUpperCase())}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              maxLength={8}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !registration.trim()}
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

      {vehicleData && (
        <div className="space-y-6 relative">
          <div className="absolute top-0 right-0 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-medium">
            Free Check
          </div>
          
          {/* Vehicle Basic Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Vehicle Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600">Registration:</span>
                <p className="font-semibold text-gray-900">
                  {dvlaApi.constructor.formatRegistration(vehicleData.registrationNumber)}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Make:</span>
                <p className="font-semibold text-gray-900">{vehicleData.make}</p>
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
                <span className="text-sm text-gray-600">Colour:</span>
                <p className="font-semibold text-gray-900">{vehicleData.colour}</p>
              </div>
              {vehicleData.engineCapacity && (
                <div>
                  <span className="text-sm text-gray-600">Engine Size:</span>
                  <p className="font-semibold text-gray-900">{vehicleData.engineCapacity}cc</p>
                </div>
              )}
            </div>
          </div>

          {/* Tax Status */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Tax Status</h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {getStatusIcon(dvlaApi.constructor.isTaxValid(vehicleData))}
                <span className={`ml-2 font-semibold ${getStatusColor(dvlaApi.constructor.isTaxValid(vehicleData))}`}>
                  {vehicleData.taxStatus}
                </span>
              </div>
              {vehicleData.taxDueDate && (
                <div className="text-right">
                  <span className="text-sm text-gray-600">Due Date:</span>
                  <p className="font-semibold text-gray-900">{formatDate(vehicleData.taxDueDate)}</p>
                </div>
              )}
            </div>
          </div>

          {/* MOT Status */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">MOT Status</h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {getStatusIcon(dvlaApi.constructor.isMOTValid(vehicleData))}
                <span className={`ml-2 font-semibold ${getStatusColor(dvlaApi.constructor.isMOTValid(vehicleData))}`}>
                  {vehicleData.motStatus}
                </span>
              </div>
              {vehicleData.motExpiryDate && (
                <div className="text-right">
                  <span className="text-sm text-gray-600">Expiry Date:</span>
                  <p className="font-semibold text-gray-900">{formatDate(vehicleData.motExpiryDate)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Additional Information */}
          {(vehicleData.co2Emissions || vehicleData.euroStatus) && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Environmental Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vehicleData.co2Emissions && (
                  <div>
                    <span className="text-sm text-gray-600">CO2 Emissions:</span>
                    <p className="font-semibold text-gray-900">{vehicleData.co2Emissions}g/km</p>
                  </div>
                )}
                {vehicleData.euroStatus && (
                  <div>
                    <span className="text-sm text-gray-600">Euro Status:</span>
                    <p className="font-semibold text-gray-900">{vehicleData.euroStatus}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Upgrade Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-800 mb-1">Want more detailed information?</h4>
                <p className="text-sm text-blue-700 mb-2">
                  Upgrade to our comprehensive report to get full vehicle history, valuation, and risk assessment.
                </p>
                <button 
                  onClick={() => setActiveTab('comprehensive')}
                  className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                >
                  View Comprehensive Check
                </button>
              </div>
            </div>
          </div>

          {/* Compliance Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-blue-900 mb-2">Compliance Summary</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-blue-800">Road Legal:</span>
                <span className={`font-semibold ${
                  dvlaApi.constructor.isTaxValid(vehicleData) && dvlaApi.constructor.isMOTValid(vehicleData)
                    ? 'text-green-600' : 'text-red-600'
                }`}>
                  {dvlaApi.constructor.isTaxValid(vehicleData) && dvlaApi.constructor.isMOTValid(vehicleData) 
                    ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-blue-800">Vehicle Age:</span>
                <span className="font-semibold text-blue-900">
                  {dvlaApi.constructor.getVehicleAge(vehicleData)} years
                </span>
              </div>
              {vehicleData.markedForExport && (
                <div className="flex items-center justify-between">
                  <span className="text-blue-800">Export Status:</span>
                  <span className="font-semibold text-orange-600">Marked for Export</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}