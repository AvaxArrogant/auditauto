import React from 'react';
import { Search, Calendar, Car, Shield, CreditCard, Star } from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      icon: Search,
      title: 'Search & Browse',
      description: 'Find the perfect vehicle for your needs using our advanced search filters. Browse by location, dates, vehicle type, and more.',
      details: [
        'Search by location and dates',
        'Filter by vehicle type, price, and features',
        'View detailed photos and specifications',
        'Read reviews from previous renters'
      ]
    },
    {
      icon: Calendar,
      title: 'Book Your Vehicle',
      description: 'Select your dates and submit a booking request. Our verified hosts will respond quickly to confirm availability.',
      details: [
        'Choose your pickup and return dates',
        'Review pricing and terms',
        'Submit booking request',
        'Receive confirmation from host'
      ]
    },
    {
      icon: Car,
      title: 'Pick Up & Drive',
      description: 'Meet your host at the agreed location, complete a quick vehicle inspection, and hit the road with confidence.',
      details: [
        'Meet host at pickup location',
        'Complete vehicle inspection',
        'Receive keys and documentation',
        'Enjoy your journey with full insurance coverage'
      ]
    },
    {
      icon: Star,
      title: 'Return & Review',
      description: 'Return the vehicle in the same condition, complete the checkout process, and leave a review for future renters.',
      details: [
        'Return vehicle at agreed time and location',
        'Complete final inspection with host',
        'Automatic payment processing',
        'Leave review and rating'
      ]
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: 'Fully Insured',
      description: 'Every booking includes comprehensive insurance coverage for peace of mind.'
    },
    {
      icon: CreditCard,
      title: 'Secure Payments',
      description: 'All payments are processed securely with industry-standard encryption.'
    },
    {
      icon: Car,
      title: 'Verified Vehicles',
      description: 'All vehicles are inspected and verified by our team before listing.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            How Balaloaded Fleet Hire Works
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Renting premium vehicles has never been easier. Follow these simple steps to get on the road.
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {steps.map((step, index) => (
              <div key={index} className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12`}>
                <div className="flex-1">
                  <div className="flex items-center mb-6">
                    <div className="bg-blue-100 p-4 rounded-full mr-4">
                      <step.icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-blue-600 mb-1">
                        Step {index + 1}
                      </div>
                      <h3 className="text-3xl font-bold text-gray-900">{step.title}</h3>
                    </div>
                  </div>
                  <p className="text-xl text-gray-600 mb-6">{step.description}</p>
                  <ul className="space-y-3">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                        <span className="text-gray-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-1">
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 h-80 flex items-center justify-center">
                    <step.icon className="h-32 w-32 text-blue-300" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Balaloaded Fleet Hire?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide the safest, most convenient car sharing experience with industry-leading benefits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg text-center">
                <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <benefit.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust Balaloaded Fleet Hire for their vehicle rental needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 font-semibold text-lg">
              Browse Vehicles
            </button>
            <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-200 transform hover:scale-105 font-semibold text-lg">
              List Your Car
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}