import React, { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal } from 'lucide-react';
import { Vehicle, SearchFilters } from '../types';
import VehicleCard from '../components/VehicleCard';
import SearchForm from '../components/SearchForm';

interface BrowsePageProps {
  vehicles: Vehicle[];
  searchFilters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
}

export default function BrowsePage({ vehicles, searchFilters, onFiltersChange }: BrowsePageProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('price-low');

  const filteredVehicles = useMemo(() => {
    let filtered = vehicles.filter(vehicle => {
      if (searchFilters.location && !vehicle.location.toLowerCase().includes(searchFilters.location.toLowerCase())) {
        return false;
      }
      if (searchFilters.vehicleType !== 'any' && !vehicle.category.toLowerCase().includes(searchFilters.vehicleType)) {
        return false;
      }
      if (vehicle.price < searchFilters.priceRange[0] || vehicle.price > searchFilters.priceRange[1]) {
        return false;
      }
      if (searchFilters.transmission !== 'any' && vehicle.transmission.toLowerCase() !== searchFilters.transmission.toLowerCase()) {
        return false;
      }
      if (searchFilters.fuel !== 'any' && vehicle.fuel.toLowerCase() !== searchFilters.fuel.toLowerCase()) {
        return false;
      }
      if (searchFilters.seats !== 'any' && vehicle.seats.toString() !== searchFilters.seats) {
        return false;
      }
      return true;
    });

    // Sort vehicles
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => b.year - a.year);
        break;
      default:
        break;
    }

    return filtered;
  }, [vehicles, searchFilters, sortBy]);

  const handleSearch = () => {
    // Search is handled by the filtering logic above
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Form */}
        <div className="mb-8">
          <SearchForm
            filters={searchFilters}
            onFiltersChange={onFiltersChange}
            onSearch={handleSearch}
          />
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Advanced Filters
            </button>
            <span className="text-gray-600">
              {filteredVehicles.length} vehicles found
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            >
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Advanced Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range (£/day)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={searchFilters.priceRange[0]}
                    onChange={(e) => onFiltersChange({
                      ...searchFilters,
                      priceRange: [parseInt(e.target.value) || 0, searchFilters.priceRange[1]]
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={searchFilters.priceRange[1]}
                    onChange={(e) => onFiltersChange({
                      ...searchFilters,
                      priceRange: [searchFilters.priceRange[0], parseInt(e.target.value) || 1000]
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transmission
                </label>
                <select
                  value={searchFilters.transmission}
                  onChange={(e) => onFiltersChange({...searchFilters, transmission: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                >
                  <option value="any">Any</option>
                  <option value="automatic">Automatic</option>
                  <option value="manual">Manual</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fuel Type
                </label>
                <select
                  value={searchFilters.fuel}
                  onChange={(e) => onFiltersChange({...searchFilters, fuel: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                >
                  <option value="any">Any</option>
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="electric">Electric</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seats
                </label>
                <select
                  value={searchFilters.seats}
                  onChange={(e) => onFiltersChange({...searchFilters, seats: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                >
                  <option value="any">Any</option>
                  <option value="2">2 seats</option>
                  <option value="4">4 seats</option>
                  <option value="5">5 seats</option>
                  <option value="7">7+ seats</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Vehicle Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>

        {filteredVehicles.length === 0 && (
          <div className="text-center py-12">
            <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}