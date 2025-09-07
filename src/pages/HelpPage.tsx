import React, { useState } from 'react';
import { Search, Book, FileText, HelpCircle, CheckCircle, AlertTriangle, Clock, Shield } from 'lucide-react';

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Topics', icon: Book },
    { id: 'vehicle-reports', name: 'Vehicle Reports', icon: FileText },
    { id: 'dispute-letters', name: 'Dispute Letters', icon: Shield },
    { id: 'billing', name: 'Billing & Payments', icon: CheckCircle },
    { id: 'technical', name: 'Technical Issues', icon: AlertTriangle }
  ];

  const helpArticles = [
    {
      id: 1,
      title: 'How to read your vehicle history report',
      category: 'vehicle-reports',
      description: 'Understanding all the information in your comprehensive vehicle report',
      content: 'Your vehicle history report contains detailed information from official sources...',
      popular: true
    },
    {
      id: 2,
      title: 'What information is included in a DVLA check?',
      category: 'vehicle-reports',
      description: 'Complete breakdown of DVLA data and what each field means',
      content: 'DVLA checks include tax status, MOT information, vehicle specifications...',
      popular: true
    },
    {
      id: 3,
      title: 'How to write an effective dispute letter',
      category: 'dispute-letters',
      description: 'Tips for creating compelling arguments in your ticket appeals',
      content: 'An effective dispute letter should be professional, factual, and well-structured...',
      popular: true
    },
    {
      id: 4,
      title: 'Understanding council appeal deadlines',
      category: 'dispute-letters',
      description: 'Important timelines for submitting parking ticket appeals',
      content: 'Most councils have strict deadlines for appeals, typically 28 days...',
      popular: false
    },
    {
      id: 5,
      title: 'Payment methods and billing cycles',
      category: 'billing',
      description: 'How payments work and when you\'ll be charged',
      content: 'We accept all major credit cards and PayPal. Payments are processed instantly...',
      popular: false
    },
    {
      id: 6,
      title: 'Refund policy and money-back guarantee',
      category: 'billing',
      description: 'When and how to request refunds for our services',
      content: 'We offer a 30-day money-back guarantee on all services...',
      popular: false
    },
    {
      id: 7,
      title: 'Report not generating or loading slowly',
      category: 'technical',
      description: 'Troubleshooting common technical issues',
      content: 'If your report isn\'t generating, first check your internet connection...',
      popular: false
    },
    {
      id: 8,
      title: 'Browser compatibility and requirements',
      category: 'technical',
      description: 'Supported browsers and system requirements',
      content: 'Our service works on all modern browsers including Chrome, Firefox, Safari...',
      popular: false
    }
  ];

  const quickActions = [
    {
      title: 'Generate Vehicle Report',
      description: 'Get a comprehensive vehicle history report',
      icon: FileText,
      link: '/vehicle-history',
      color: 'bg-blue-500'
    },
    {
      title: 'Create Dispute Letter',
      description: 'Get a professional dispute letter',
      icon: Shield,
      link: '/dispute-letters',
      color: 'bg-green-500'
    },
    {
      title: 'Contact Support',
      description: 'Get help from our UK team',
      icon: HelpCircle,
      link: '/contact',
      color: 'bg-purple-500'
    },
    {
      title: 'View Pricing',
      description: 'See our transparent pricing',
      icon: CheckCircle,
      link: '/pricing',
      color: 'bg-orange-500'
    }
  ];

  const filteredArticles = helpArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || article.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const popularArticles = helpArticles.filter(article => article.popular);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-orange-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Help Center
            </h1>
            <p className="text-xl md:text-2xl text-orange-100 max-w-4xl mx-auto mb-8">
              Find answers to common questions and get the most out of AutoAudit's vehicle reports and dispute letter services.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for help articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-0 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-300 focus:outline-none text-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Actions */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <a
                key={index}
                href={action.link}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
              >
                <div className={`${action.color.replace('bg-blue-', 'bg-orange-')} p-3 rounded-full w-12 h-12 mb-4 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-gray-600 text-sm">{action.description}</p>
              </a>
            ))}
          </div>
        </div>

        {/* Popular Articles */}
        {!searchTerm && activeCategory === 'all' && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Popular Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {popularArticles.map((article) => (
                <div key={article.id} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center mb-3">
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded-full">
                      Popular
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{article.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{article.description}</p>
                  <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                    Read Article →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Categories and Articles */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                      activeCategory === category.id
                        ? 'bg-orange-100 text-orange-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <category.icon className="h-4 w-4 mr-3" />
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Articles List */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {searchTerm ? `Search Results (${filteredArticles.length})` : 
                   activeCategory === 'all' ? 'All Articles' : 
                   categories.find(c => c.id === activeCategory)?.name}
                </h3>
                <span className="text-gray-500 text-sm">
                  {filteredArticles.length} articles
                </span>
              </div>

              {filteredArticles.length > 0 ? (
                <div className="space-y-4">
                  {filteredArticles.map((article) => (
                    <div key={article.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">{article.title}</h4>
                          <p className="text-gray-600 text-sm mb-3">{article.description}</p>
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>2 min read</span>
                            {article.popular && (
                              <>
                                <span className="mx-2">•</span>
                                <span className="text-yellow-600">Popular</span>
                              </>
                            )}
                          </div>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm ml-4">
                          Read →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <HelpCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-600 mb-2">No articles found</h4>
                  <p className="text-gray-500">
                    Try adjusting your search terms or browse different categories.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="mt-16 bg-orange-500 rounded-2xl p-8 text-white text-center">
          <HelpCircle className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-4">Still Need Help?</h3>
          <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
            Contact our support team for assistance with AutoAudit's vehicle reports and dispute letter services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact" className="bg-white text-orange-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-semibold">
              Contact Support
            </a>
            <a
              href="mailto:support@autoaudit.net"
              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg hover:bg-white hover:text-orange-600 transition-colors duration-200 font-semibold"
            >
              Email Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}