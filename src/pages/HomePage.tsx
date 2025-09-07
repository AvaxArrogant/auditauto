import React from 'react';
import { Search, FileText, Shield, Clock, CheckCircle, Star, ArrowRight, Car, Scale, Users, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HomePageProps {
  isAuthenticated?: boolean;
  onSignIn?: () => void;
  onSignUp?: () => void;
}

export default function HomePage({ isAuthenticated, onSignIn, onSignUp }: HomePageProps) {
  const features = [
    {
      icon: Search,
      title: 'Comprehensive Vehicle History',
      description: 'Get detailed DVLA reports, MOT history, tax status, and insurance information for any UK vehicle.',
      link: '/vehicle-history'
    },
    {
      icon: Car,
      title: 'Free MOT History Checker',
      description: 'Check any UK vehicle\'s complete MOT history instantly using official DVLA data - completely free.',
      link: '/mot-checker'
    },
    {
      icon: FileText,
      title: 'Professional Dispute Letters',
      description: 'Get expertly crafted council ticket dispute letters from experienced professionals tailored to UK law.',
      link: '/dispute-letters'
    },
    {
      icon: Shield,
      title: 'Legal Compliance',
      description: 'All our services comply with UK data protection laws and use official government databases with expert legal oversight.',
      link: '/about'
    },
    {
      icon: Clock,
      title: 'Instant Results',
      description: 'Get your vehicle reports instantly and professional dispute letters within 24 hours.',
      link: '/pricing'
    }
  ];

  const stats = [
    { number: '500K+', label: 'Vehicle Reports Generated' },
    { number: '85%', label: 'Successful Dispute Rate' },
    { number: '50K+', label: 'Happy Customers' },
    { number: '24/7', label: 'Service Availability' }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      location: 'Manchester',
      text: 'The vehicle history report saved me from buying a car with hidden damage. Excellent service!',
      rating: 5
    },
    {
      name: 'David Williams',
      location: 'London',
      text: 'Got my parking ticket overturned using their professional dispute letter. Expertly written and effective.',
      rating: 5
    },
    {
      name: 'Emma Thompson',
      location: 'Birmingham',
      text: 'Quick, reliable, and affordable. The reports are comprehensive and easy to understand.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-orange-500 text-white overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Professional Vehicle History &{' '}
              <span className="text-white">
                Ticket Dispute Services
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8 max-w-4xl mx-auto leading-relaxed drop-shadow-md">
              Get comprehensive vehicle history reports and professionally crafted council ticket dispute letters. 
              Trusted by over 50,000 UK drivers across the United Kingdom.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                to="/vehicle-history"
                className="bg-white text-orange-600 px-8 py-4 rounded-xl hover:bg-orange-50 transition-all duration-300 transform hover:scale-105 font-semibold text-lg shadow-xl hover:shadow-2xl inline-flex items-center justify-center border-2 border-white/20"
                onClick={(e) => {
                  if (!isAuthenticated && onSignIn) {
                    e.preventDefault();
                    onSignIn();
                  }
                }}
              >
                <Car className="h-5 w-5 mr-2" />
                Check Vehicle History
              </Link>
              <Link
                to="/mot-checker"
                className="bg-orange-700 border-2 border-orange-600 text-white px-8 py-4 rounded-xl hover:bg-orange-800 transition-all duration-300 transform hover:scale-105 font-semibold text-lg inline-flex items-center justify-center shadow-xl hover:shadow-2xl"
              >
                <Search className="h-5 w-5 mr-2" />
                Free MOT Check
              </Link>
              <Link
                to="/dispute-letters"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-orange-600 transition-all duration-300 transform hover:scale-105 font-semibold text-lg inline-flex items-center justify-center shadow-xl hover:shadow-2xl"
                onClick={(e) => {
                  if (!isAuthenticated && onSignIn) {
                    e.preventDefault();
                    onSignIn();
                  }
                }}
              >
                <Scale className="h-5 w-5 mr-2" />
                Dispute Ticket
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-white text-sm">
              <div className="flex items-center bg-white bg-opacity-20 px-4 py-2 rounded-full backdrop-blur-sm border border-white/30">
                <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                <span>DVLA Approved Data</span>
              </div>
              <div className="flex items-center bg-white bg-opacity-20 px-4 py-2 rounded-full backdrop-blur-sm border border-white/30">
                <Shield className="h-4 w-4 mr-2 text-blue-400" />
                <span>85% Success Rate</span>
              </div>
              <div className="flex items-center bg-white bg-opacity-20 px-4 py-2 rounded-full backdrop-blur-sm border border-white/30">
                <Clock className="h-4 w-4 mr-2 text-orange-400" />
                <span>Instant Reports</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-orange-100 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-blue-100 rounded-full opacity-30 blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose AutoAudit?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We provide the most comprehensive vehicle intelligence and legal support services in the UK
            </p>
          </div>

          {/* Floating Feature Icons Bar */}
          <div className="flex justify-center mb-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-full shadow-xl p-2 flex gap-2 border border-gray-100">
              {features.map((feature, index) => (
                <Link key={index} to={feature.link} className="group relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-md transform transition-all duration-300 group-hover:scale-110">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-10">
                    <p className="text-xs font-bold">{feature.title.split(' ')[0]}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Feature Cards - Horizontal Layout */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <Link
                key={index}
                to={feature.link}
                onClick={(e) => {
                  if (!isAuthenticated && onSignIn && (feature.link === '/vehicle-history' || feature.link === '/dispute-letters')) {
                    e.preventDefault();
                    onSignIn();
                  }
                }}
                className="group relative bg-white backdrop-blur-sm bg-opacity-90 rounded-xl p-5 shadow-md hover:shadow-lg border border-gray-100 transition-all duration-300 flex items-center overflow-hidden"
              >
                {/* Subtle gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative flex items-center w-full">
                  <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-4 rounded-xl flex-shrink-0 mr-5 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-6 w-6 text-orange-600" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                  
                  <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover:translate-x-0">
                    <ArrowRight className="h-5 w-5 text-orange-600" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Get the information and support you need in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-gradient-to-br from-orange-600 to-orange-700 text-white rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center text-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Enter Details</h3>
              <p className="text-gray-600 leading-relaxed">
                Provide your vehicle registration or ticket details through our secure platform
              </p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-orange-600 to-orange-700 text-white rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center text-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Expert Analysis</h3>
              <p className="text-gray-600 leading-relaxed">
                Our expert systems analyze official databases and generate your professional report or letter
              </p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-orange-600 to-orange-700 text-white rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center text-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Get Results</h3>
              <p className="text-gray-600 leading-relaxed">
                Receive your comprehensive report or professionally formatted dispute letter instantly
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Join thousands of satisfied customers who trust AutoAudit
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic leading-relaxed">"{testimonial.text}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-600 text-sm">{testimonial.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-orange-500 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose AutoAudit?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
            Join over 50,000 UK drivers who trust AutoAudit for their vehicle intelligence and legal support needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/vehicle-history"
              className="bg-white text-orange-600 px-8 py-4 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 font-semibold text-lg inline-flex items-center justify-center shadow-xl hover:shadow-2xl border-2 border-white/20"
              onClick={(e) => {
                if (!isAuthenticated && onSignIn) {
                  e.preventDefault();
                  onSignIn();
                }
              }}
            >
              <Search className="h-5 w-5 mr-2" />
              Check Vehicle Now
            </Link>
            <Link
              to="/mot-checker"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-orange-600 transition-all duration-300 transform hover:scale-105 font-semibold text-lg inline-flex items-center justify-center shadow-xl hover:shadow-2xl"
            >
              <Car className="h-5 w-5 mr-2" />
              Free MOT Check
            </Link>
            <Link
              to="/dispute-letters"
              className="bg-orange-700 text-white px-8 py-4 rounded-xl hover:bg-orange-800 transition-all duration-300 transform hover:scale-105 font-semibold text-lg inline-flex items-center justify-center shadow-xl hover:shadow-2xl"
              onClick={(e) => {
                if (!isAuthenticated && onSignIn) {
                  e.preventDefault();
                  onSignIn();
                }
              }}
            >
              <FileText className="h-5 w-5 mr-2" />
              Dispute Ticket
            </Link>
            {!isAuthenticated && (
              <button
                onClick={onSignIn}
                className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 font-bold text-lg inline-flex items-center justify-center shadow-xl hover:shadow-2xl"
              >
                <LogIn className="h-5 w-5 mr-2" />
                Sign In
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}