import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, HelpCircle, FileText } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: ''
  });

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Get help via email',
      contact: 'support@autoaudit.net',
      availability: 'Response within 24 hours'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Speak to our UK team',
      contact: '+44 20 7946 0958',
      availability: 'Mon-Fri, 9AM-6PM GMT'
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Instant help online',
      contact: 'Available on website',
      availability: 'Mon-Fri, 9AM-6PM GMT'
    },
    {
      icon: MapPin,
      title: 'Office Address',
      description: 'Visit our London office',
      contact: '123 Tech Street, London EC2A 4DP',
      availability: 'By appointment only'
    }
  ];

  const categories = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'billing', label: 'Billing & Payments' },
    { value: 'dispute', label: 'Dispute Letter Help' },
    { value: 'vehicle', label: 'Vehicle Report Issues' },
    { value: 'partnership', label: 'Business Partnership' }
  ];

  const faqs = [
    {
      question: 'How quickly will I receive my vehicle report?',
      answer: 'All vehicle reports are generated instantly and delivered within 60 seconds of payment confirmation.'
    },
    {
      question: 'What if my dispute letter doesn\'t work?',
      answer: 'While we can\'t guarantee success, our letters have an 85% success rate. We offer a refund if the letter contains factual errors.'
    },
    {
      question: 'Is my personal data secure?',
      answer: 'Yes, we use bank-level encryption and are fully GDPR compliant. We never store data longer than necessary.'
    },
    {
      question: 'Can I get a refund?',
      answer: 'We offer a 30-day money-back guarantee on all services if you\'re not satisfied with the quality.'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    alert('Thank you for your message. We\'ll get back to you within 24 hours.');
    setFormData({
      name: '',
      email: '',
      subject: '',
      category: 'general',
      message: ''
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-orange-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Get in Touch
            </h1>
            <p className="text-xl md:text-2xl text-orange-100 max-w-4xl mx-auto">
              Our UK-based support team is here to help with any questions about our vehicle reports 
              and dispute letter services.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Contact Methods */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How to Reach Us</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the contact method that works best for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactMethods.map((method, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg text-center">
                <div className="bg-orange-100 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <method.icon className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{method.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{method.description}</p>
                <p className="text-orange-600 font-semibold text-sm mb-2">{method.contact}</p>
                <p className="text-gray-500 text-xs">{method.availability}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form & FAQ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Brief description of your inquiry"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Please provide as much detail as possible..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-orange-600 text-white py-3 px-6 rounded-lg hover:bg-orange-700 transition-colors duration-200 flex items-center justify-center font-semibold"
              >
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </button>
            </form>
          </div>

          {/* FAQ Section */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
              
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-start">
                      <HelpCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                      {faq.question}
                    </h4>
                    <p className="text-gray-700 text-sm leading-relaxed ml-6">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-blue-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Links</h3>
              <div className="space-y-3">
                <a href="/help" className="flex items-center text-orange-600 hover:text-orange-700 transition-colors">
                  <FileText className="h-4 w-4 mr-2" />
                  Help Center
                </a>
                <a href="/pricing" className="flex items-center text-orange-600 hover:text-orange-700 transition-colors">
                  <FileText className="h-4 w-4 mr-2" />
                  Pricing Information
                </a>
                <a href="/vehicle-history" className="flex items-center text-orange-600 hover:text-orange-700 transition-colors">
                  <FileText className="h-4 w-4 mr-2" />
                  Vehicle History Reports
                </a>
                <a href="/dispute-letters" className="flex items-center text-orange-600 hover:text-orange-700 transition-colors">
                  <FileText className="h-4 w-4 mr-2" />
                  Dispute Letters
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Office Hours */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center">
            <Clock className="h-12 w-12 text-orange-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Support Hours</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Phone & Live Chat</h4>
                <p className="text-gray-600">Monday - Friday</p>
                <p className="text-gray-600">9:00 AM - 6:00 PM GMT</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Email Support</h4>
                <p className="text-gray-600">24/7 Submission</p>
                <p className="text-gray-600">Response within 24 hours</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Emergency Support</h4>
                <p className="text-gray-600">Critical issues only</p>
                <p className="text-gray-600">Available weekends</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}