import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, MapPin, Users, Fuel, Settings, Calendar, 
  Shield, CheckCircle, ArrowLeft, Heart, Share2 
} from 'lucide-react';
import { Vehicle } from '../types';

interface VehicleDetailPageProps {
  vehicles: Vehicle[];
  onBookVehicle: (vehicleId: number, startDate: string, endDate: string) => void;
}

export default function VehicleDetailPage({ vehicles, onBookVehicle }: VehicleDetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  const vehicle = vehicles.find(v => v.id === parseInt(id || '0'));

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Vehicle not found</h2>
          <Link to="/browse" className="text-blue-600 hover:text-blue-700">
            Browse all vehicles
          </Link>
        </div>
      </div>
    );
  }

  const handleBooking = async () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates');
      return;
    }

    setIsBooking(true);
    try {
      await onBookVehicle(vehicle.id, startDate, endDate);
      alert('Booking request submitted successfully!');
    } catch (error) {
      alert('Failed to submit booking request');
    } finally {
      setIsBooking(false);
    }
  };

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const totalPrice = calculateDays() * vehicle.price;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          to="/browse"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Browse
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Vehicle Images */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
              <div className="relative">
                <img
                  src={vehicle.image}
                  alt={vehicle.title}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50">
                    <Heart className="h-5 w-5 text-gray-600" />
                  </button>
                  <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50">
                    <Share2 className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
                <div className="absolute bottom-4 left-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-emerald-600">
                  {vehicle.owner}
                </div>
              </div>
            </div>

            {/* Vehicle Info */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  {vehicle.category}
                </span>
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="text-lg font-medium text-gray-700 ml-1">
                    {vehicle.rating} ({vehicle.reviews} reviews)
                  </span>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">{vehicle.title}</h1>
              <p className="text-gray-600 mb-6 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                {vehicle.location}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <div className="font-semibold">{vehicle.seats}</div>
                  <div className="text-sm text-gray-600">Seats</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Fuel className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <div className="font-semibold">{vehicle.fuel}</div>
                  <div className="text-sm text-gray-600">Fuel</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Settings className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <div className="font-semibold">{vehicle.transmission}</div>
                  <div className="text-sm text-gray-600">Transmission</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <div className="font-semibold">{vehicle.year}</div>
                  <div className="text-sm text-gray-600">Year</div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Description</h3>
                <p className="text-gray-700 leading-relaxed">{vehicle.description}</p>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Features</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {vehicle.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-8">
                <h3 className="text-xl font-semibold mb-4">Safety & Insurance</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Comprehensive Insurance Included</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">24/7 Roadside Assistance</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Verified Host</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Clean & Sanitized</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900">£{vehicle.price}</div>
                <div className="text-gray-600">per day</div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                </div>
              </div>

              {calculateDays() > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">£{vehicle.price} × {calculateDays()} days</span>
                    <span className="font-semibold">£{totalPrice}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>Service fee</span>
                    <span>£{Math.round(totalPrice * 0.1)}</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between items-center font-semibold text-lg">
                    <span>Total</span>
                    <span>£{totalPrice + Math.round(totalPrice * 0.1)}</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleBooking}
                disabled={!vehicle.available || !startDate || !endDate || isBooking}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                  vehicle.available && startDate && endDate && !isBooking
                    ? 'bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isBooking ? 'Processing...' : vehicle.available ? 'Book Now' : 'Not Available'}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                You won't be charged yet. Review your booking details before confirming.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}