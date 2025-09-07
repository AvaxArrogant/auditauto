import React from 'react';
import { 
  Car, Truck, Users, Building, Calendar, Clock, 
  Shield, CheckCircle, Phone, Mail, MapPin, Star,
  Briefcase, Plane, Heart, GraduationCap, Home
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function GeneralServicesPage() {
  const services = [
    {
      icon: Briefcase,
      title: 'Corporate Fleet Solutions',
      description: 'Comprehensive vehicle solutions for businesses of all sizes',
      features: [
        'Dedicated account management',
        'Flexible billing options',
        'Volume discounts available',
        'Priority booking system',
        '24/7 business support'
      ],
      image: 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      icon: Plane,
      title: 'Airport Transfers',
      description: 'Reliable and comfortable airport transportation services',
      features: [
        'Flight tracking included',
        'Meet & greet service',
        'Luxury vehicle options',
        'Fixed pricing',
        'Professional chauffeurs'
      ],
      image: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      icon: Heart,
      title: 'Wedding & Events',
      description: 'Make your special day perfect with our premium vehicles',
      features: [
        'Luxury wedding cars',
        'Decorated vehicles available',
        'Professional service',
        'Flexible packages',
        'Event coordination support'
      ],
      image: 'https://images.pexels.com/photos/1429775/pexels-photo-1429775.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      icon: GraduationCap,
      title: 'Student Discounts',
      description: 'Special rates for students and educational institutions',
      features: [
        'Up to 20% student discount',
        'Flexible payment terms',
        'Group booking discounts',
        'Educational institution rates',
        'Verification required'
      ],
      image: 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      icon: Home,
      title: 'Long-term Rentals',
      description: 'Extended rental periods with competitive monthly rates',
      features: [
        'Monthly and yearly packages',
        'Maintenance included',
        'Insurance coverage',
        'Vehicle replacement service',
        'Significant cost savings'
      ],
      image: 'https://images.pexels.com/photos/193999/pexels-photo-193999.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      icon: Truck,
      title: 'Commercial Vehicles',
      description: 'Vans, trucks, and commercial vehicles for business needs',
      features: [
        'Various sizes available',
        'Loading equipment included',
        'Commercial insurance',
        'Flexible rental periods',
        'Delivery available'
      ],
      image: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=600'
    }
  ];

  const additionalServices = [
    {
      icon: Shield,
      title: 'Comprehensive Insurance',
      description: 'Full coverage protection for peace of mind'
    },
    {
      icon: Clock,
      title: '24/7 Roadside Assistance',
      description: 'Round-the-clock support wherever you are'
    },
    {
      icon: Users,
      title: 'Chauffeur Services',
      description: 'Professional drivers available on request'
    },
    {
      icon: Calendar,
      title: 'Flexible Booking',
      description: 'Easy online booking with instant confirmation'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              General Services
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto mb-8">
              Comprehensive vehicle solutions tailored to meet all your transportation needs
            </p>
            <div className="flex items-center justify-center space-x-8 text-blue-200">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-400 fill-current mr-2" />
                <span>4.9/5 Rating</span>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                <span>10,000+ Customers</span>
              </div>
              <div className="flex items-center">
                <Car className="h-5 w-5 mr-2" />
                <span>500+ Vehicles</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From corporate solutions to special events, we provide comprehensive vehicle services for every occasion
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                <div className="relative h-48">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-white p-3 rounded-full">
                    <service.icon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-6">{service.description}</p>
                  <ul className="space-y-3 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/browse"
                    className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold"
                  >
                    Learn More
                    <Car className="h-4 w-4 ml-2" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Additional Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Enhanced services to make your rental experience seamless and worry-free
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {additionalServices.map((service, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
                <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <service.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Service Packages</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the package that best fits your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Basic</h3>
                <p className="text-gray-600 mb-4">Perfect for individual rentals</p>
                <div className="text-4xl font-bold text-blue-600">£45</div>
                <div className="text-gray-500">per day</div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                  <span>Standard insurance</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                  <span>24/7 support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                  <span>Free cancellation</span>
                </li>
              </ul>
              <Link
                to="/browse"
                className="w-full bg-gray-100 text-gray-900 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-semibold text-center block"
              >
                Get Started
              </Link>
            </div>

            <div className="bg-blue-600 rounded-2xl shadow-xl p-8 text-white relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span className="bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Premium</h3>
                <p className="text-blue-100 mb-4">Best for business users</p>
                <div className="text-4xl font-bold">£85</div>
                <div className="text-blue-200">per day</div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-400 mr-3" />
                  <span>Comprehensive insurance</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-400 mr-3" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-400 mr-3" />
                  <span>Chauffeur available</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-400 mr-3" />
                  <span>Luxury vehicles</span>
                </li>
              </ul>
              <Link
                to="/browse"
                className="w-full bg-white text-blue-600 py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-semibold text-center block"
              >
                Get Started
              </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
                <p className="text-gray-600 mb-4">For large organizations</p>
                <div className="text-4xl font-bold text-blue-600">Custom</div>
                <div className="text-gray-500">pricing</div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                  <span>Fleet management</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                  <span>Dedicated account manager</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                  <span>Volume discounts</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                  <span>Custom solutions</span>
                </li>
              </ul>
              <Link
                to="/help"
                className="w-full bg-gray-100 text-gray-900 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-semibold text-center block"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Have questions about our services? Our team is here to help you find the perfect solution
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Phone className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Call Us</h3>
              <p className="text-gray-600 mb-4">Speak with our team</p>
              <a href="tel:+441234567890" className="text-blue-600 hover:text-blue-700 font-semibold">
                +44 123 456 7890
              </a>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Email Us</h3>
              <p className="text-gray-600 mb-4">Send us a message</p>
              <a href="mailto:info@balaloaded.co.uk" className="text-blue-600 hover:text-blue-700 font-semibold">
                info@balaloaded.co.uk
              </a>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Visit Us</h3>
              <p className="text-gray-600 mb-4">Our main office</p>
              <p className="text-blue-600 font-semibold">
                London, United Kingdom
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Experience Our Services?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust Balaloaded Fleet Hire for their transportation needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/browse"
              className="bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 font-semibold text-lg"
            >
              Browse Vehicles
            </Link>
            <Link
              to="/help"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-200 transform hover:scale-105 font-semibold text-lg"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}