import React from 'react';
import { Star, MapPin, Users, Fuel, Settings } from 'lucide-react';
import { Vehicle } from '../types';
import { Link } from 'react-router-dom';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
      <div className="relative">
        <img
          src={vehicle.image}
          alt={vehicle.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-emerald-600">
          {vehicle.owner}
        </div>
        {!vehicle.available && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold">
              Not Available
            </span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
            {vehicle.category}
          </span>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-gray-700 ml-1">
              {vehicle.rating} ({vehicle.reviews})
            </span>
          </div>
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mb-1">{vehicle.title}</h3>
        <p className="text-gray-600 text-sm mb-4 flex items-center">
          <MapPin className="h-4 w-4 mr-1" />
          {vehicle.location}
        </p>
        
        <div className="grid grid-cols-3 gap-2 mb-4 text-xs text-gray-600">
          <div className="flex items-center">
            <Users className="h-3 w-3 mr-1" />
            {vehicle.seats} seats
          </div>
          <div className="flex items-center">
            <Fuel className="h-3 w-3 mr-1" />
            {vehicle.fuel}
          </div>
          <div className="flex items-center">
            <Settings className="h-3 w-3 mr-1" />
            {vehicle.transmission}
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          {vehicle.features.slice(0, 2).map((feature, index) => (
            <span
              key={index}
              className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mr-2"
            >
              {feature}
            </span>
          ))}
          {vehicle.features.length > 2 && (
            <span className="text-xs text-gray-500">
              +{vehicle.features.length - 2} more
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-gray-900">£{vehicle.price}</span>
            <span className="text-gray-600 text-sm">/day</span>
          </div>
          <Link
            to={`/vehicle/${vehicle.id}`}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
              vehicle.available
                ? 'bg-orange-600 text-white hover:bg-orange-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {vehicle.available ? 'View Details' : 'Unavailable'}
          </Link>
        </div>
      </div>
    </div>
  );
}