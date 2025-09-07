import React from 'react';
import { Search, Calendar, MapPin, Car } from 'lucide-react';
import { SearchFilters } from '../types';

interface SearchFormProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onSearch: () => void;
  className?: string;
}

export default function SearchForm({ filters, onFiltersChange, onSearch, className = '' }: SearchFormProps) {
  const vehicleTypes = [
    { value: 'any', label: 'Any Type' },
    { value: 'economy', label: 'Economy' },
    { value: 'compact', label: 'Compact' },
    { value: 'mid-size', label: 'Mid-Size' },
    { value: 'luxury', label: 'Luxury' },
    { value: 'suv', label: 'SUV' },
    { value: 'van', label: 'Van' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <div className={`bg-white rounded-2xl shadow-2xl p-8 ${className}`}>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="space-y-2">
          <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
            <MapPin className="h-4 w-4 mr-2 text-orange-600" />
            Location
          </label>
          <input
            type="text"
            placeholder="Enter city or postcode"
            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
            value={filters.location}
            onChange={(e) => onFiltersChange({...filters, location: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
            <Calendar className="h-4 w-4 mr-2 text-orange-600" />
            Pick-up Date
          </label>
          <input
            type="date"
            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900"
            value={filters.pickupDate}
            onChange={(e) => onFiltersChange({...filters, pickupDate: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
            <Calendar className="h-4 w-4 mr-2 text-orange-600" />
            Return Date
          </label>
          <input
            type="date"
            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900"
            value={filters.returnDate}
            onChange={(e) => onFiltersChange({...filters, returnDate: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
            <Car className="h-4 w-4 mr-2 text-orange-600" />
            Vehicle Type
          </label>
          <select
            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900"
            value={filters.vehicleType}
            onChange={(e) => onFiltersChange({...filters, vehicleType: e.target.value})}
          >
            {vehicleTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-4 flex gap-4 pt-4">
          <button
            type="submit"
            className="flex-1 bg-orange-600 text-white py-4 px-8 rounded-xl hover:bg-orange-700 transition-all duration-200 transform hover:scale-105 font-semibold text-lg shadow-lg flex items-center justify-center"
          >
            <Search className="h-5 w-5 mr-2" />
            Search Vehicles
          </button>
        </div>
      </form>
    </div>
  );
}