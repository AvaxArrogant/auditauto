import React from 'react';
import { Shield, Users, Award, Clock, CheckCircle, Target, Heart, Zap } from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { number: '500K+', label: 'Vehicle Reports Generated', icon: Shield },
    { number: '50K+', label: 'Happy Customers', icon: Users },
    { number: '85%', label: 'Successful Dispute Rate', icon: Award },
    { number: '24/7', label: 'Service Availability', icon: Clock }
  ];

  const values = [
    {
      icon: Shield,
      title: 'Trust & Transparency',
      description: 'We provide accurate, reliable information using official government databases and maintain complete transparency in our processes.'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'We leverage cutting-edge AI technology to provide instant, professional-grade services that were previously only available to industry professionals.'
    },
    {
      icon: Heart,
      title: 'Customer First',
      description: 'Every decision we make is guided by what\'s best for our customers. We\'re here to help UK drivers make informed decisions and protect their rights.'
    },
    {
      icon: Target,
      title: 'Excellence',
      description: 'We strive for excellence in everything we do, from the accuracy of our reports to the quality of our customer service.'
    }
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      bio: 'Former automotive industry executive with 15 years of experience in vehicle data and consumer protection.',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      name: 'David Chen',
      role: 'CTO',
      bio: 'AI and machine learning expert who previously worked at leading fintech companies developing automated legal solutions.',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      name: 'Emma Williams',
      role: 'Head of Legal',
      bio: 'Qualified solicitor specializing in traffic law and consumer rights with extensive experience in council appeals.',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=300'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-orange-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About AutoAudit
            </h1>
            <p className="text-xl md:text-2xl text-orange-100 max-w-4xl mx-auto">
              We're on a mission to empower UK drivers with professional vehicle intelligence 
              and legal support services that were previously only available to industry professionals.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-orange-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <stat.icon className="h-8 w-8 text-orange-600" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  AutoAudit was founded in 2023 when our CEO, Sarah Johnson, experienced firsthand 
                  the frustration of buying a used car with hidden problems and later receiving an 
                  unfair parking ticket. She realized that ordinary drivers lacked access to the 
                  professional tools and legal expertise that could protect them.
                </p>
                <p>
                  We set out to democratize access to professional vehicle intelligence and expert 
                  legal support services. By combining official government data sources with experienced 
                  legal professionals, we've made it possible for anyone to get comprehensive vehicle reports 
                  and expertly crafted dispute letters quickly and affordably.
                </p>
                <p>
                  Today, we're proud to serve over 50,000 UK drivers, helping them make informed 
                  decisions about vehicle purchases and successfully dispute unfair tickets. Our 
                  mission continues: to level the playing field for ordinary drivers.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Team working"
                className="rounded-2xl shadow-xl"
              />
              <div className="absolute inset-0 bg-blue-600 opacity-10 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="bg-orange-100 p-4 rounded-full w-16 h-16 mb-6 flex items-center justify-center">
                  <value.icon className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-700 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The experts behind AutoAudit's innovative services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-blue-600 font-semibold mb-4">{member.role}</p>
                  <p className="text-gray-700 text-sm leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology & Security */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Technology"
                className="rounded-2xl shadow-xl"
              />
              <div className="absolute inset-0 bg-blue-600 opacity-10 rounded-2xl"></div>
            </div>
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Technology & Security</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-4 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Advanced AI Technology</h3>
                    <p className="text-gray-700">
                      Our expert legal team has analyzed thousands of successful cases and stays 
                      continuously updated with the latest UK traffic law changes.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-4 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Official Data Sources</h3>
                    <p className="text-gray-700">
                      We connect directly to DVLA and CAP HPI databases to ensure all information 
                      is accurate, up-to-date, and legally compliant.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-4 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Bank-Level Security</h3>
                    <p className="text-gray-700">
                      Your data is protected with 256-bit SSL encryption and we're fully GDPR compliant. 
                      We never store sensitive personal information longer than necessary.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Join Our Mission</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Contact our support team for assistance with AutoAudit's vehicle reports and dispute letter services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/vehicle-history" className="bg-white text-orange-600 px-8 py-4 rounded-xl hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 font-semibold text-lg text-center">
              Check Vehicle History
            </a>
            <a href="/dispute-letters" className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-orange-600 transition-all duration-200 transform hover:scale-105 font-semibold text-lg text-center">
              href="mailto:support@autoaudit.net"
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}