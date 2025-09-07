import React, { useState, useEffect } from 'react';
import { CheckCircle, Star, Zap, Shield, FileText, Search, AlertTriangle, Award, TrendingUp, Clock, Car, Scale, ArrowRight, Info } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { createStripeCheckoutSession } from '../lib/supabase'; // Import the new function

// Get Stripe key from environment variables with proper error handling
const stripeKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

// Initialize Stripe only if we have a valid key
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

// Log warning if Stripe key is missing
if (!stripeKey) {
  console.error("❌ Stripe public key missing! Payment functionality will be disabled.");
}

// Custom Gift icon component
const Gift = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
  </svg>
);

export default function PricingPage() {
  const [competitorQuote, setCompetitorQuote] = useState({
    company: '',
    service: '',
    price: '',
    email: '',
    phone: ''
  });
  
  const [showQuoteSubmitted, setShowQuoteSubmitted] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  
  // Offense types for display purposes only
  const offenseTypes = [
    { type: 'Parking Ticket', category: 'minor', recommendedPlan: 'Standard', basePrice: 19.99 },
    { type: 'Bus Lane Violation', category: 'minor', recommendedPlan: 'Standard', basePrice: 19.99 },
    { type: 'Congestion Charge', category: 'minor', recommendedPlan: 'Standard', basePrice: 19.99 },
    { type: 'Speeding (Minor)', category: 'moderate', recommendedPlan: 'Advanced', basePrice: 49.99 },
    { type: 'Red Light Violation', category: 'moderate', recommendedPlan: 'Advanced', basePrice: 49.99 },
    { type: 'Speeding (High)', category: 'serious', recommendedPlan: 'Premium', basePrice: 99.99 },
    { type: 'Driving Without Insurance', category: 'serious', recommendedPlan: 'Premium', basePrice: 99.99 },
    { type: 'Careless Driving', category: 'serious', recommendedPlan: 'Premium', basePrice: 99.99 }
  ];

  const vehicleReportPlans = [
    {
      name: 'Basic Vehicle Check',
      price: '£4.99',
      stripePrice: 'price_1Rg5XJLSBFrtdor3XT4h3wc9', // Replace with your actual Stripe Price ID
      description: 'Essential vehicle information from DVLA',
      features: [
        'DVLA vehicle data',
        'Tax status check',
        'MOT history',
        'Basic specifications',
        'Instant PDF report',
        'Email delivery'
      ],
      popular: false,
      icon: Search,
      type: 'vehicle-report'
    },
    {
      name: 'Comprehensive Report',
      price: '£24.99',
      stripePrice: 'price_1Rg5bTLSBFrtdor3uligruEX', // Replace with your actual Stripe Price ID
      description: 'Complete vehicle intelligence package',
      features: [
        'Everything in Basic Check',
        'CAP HPI valuation',
        'Insurance group data',
        'Vehicle history checks',
        'Stolen vehicle check',
        'Finance outstanding check',
        'Previous keeper info',
        'Professional PDF format'
      ],
      popular: true,
      icon: FileText,
      type: 'vehicle-report'
    }
  ];

  const disputeLetterPlans = [
    {
      name: 'Standard Dispute Letter',
      price: '£19.99',
      stripePrice: 'price_1Rg5erLSBFrtdor3nNb7g2Xl', // Replace with your actual Stripe Price ID
      description: 'For parking tickets and minor contraventions',
      features: [
        'Professional legal formatting',
        'Basic legal arguments',
        'UK law compliance',
        'PDF and Word formats',
        'Email delivery',
        'Basic support'
      ],
      popular: false,
      icon: FileText,
      type: 'dispute-letter'
    },
    {
      name: 'Advanced Dispute Letter',
      price: '£49.99',
      stripePrice: 'price_1Rg5gTLSBFrtdor3PqUt1AhS', // Replace with your actual Stripe Price ID
      description: 'For speeding tickets and moderate violations',
      features: [
        'Everything in Standard',
        'Enhanced legal arguments',
        'Case law references',
        'Detailed evidence analysis',
        'Printed & posted option',
        'Priority support',
        'Follow-up guidance'
      ],
      popular: true,
      icon: Scale,
      type: 'dispute-letter'
    },
    {
      name: 'Premium Dispute Letter',
      price: '£99.99',
      stripePrice: 'price_1Rg5hqLSBFrtdor3AVbMfsxZ', // Replace with your actual Stripe Price ID
      description: 'For serious or complex traffic offenses',
      features: [
        'Everything in Advanced',
        'Expert legal review',
        'Comprehensive case analysis',
        'Custom legal strategy',
        'Multiple revision options',
        'Expedited processing',
        'Phone consultation',
        'Dedicated case manager'
      ],
      popular: false,
      icon: Shield,
      type: 'dispute-letter'
    }
  ];

  const bundles = [
    {
      name: 'Driver Protection Bundle',
      originalPrice: '£44.98',
      bundlePrice: '£34.99',
      stripePrice: 'price_1Rg5isLSBFrtdor3hYdxnSxu', // Replace with your actual Stripe Price ID
      savings: '£9.99',
      description: 'Complete protection for UK drivers',
      includes: [
        '1x Comprehensive Vehicle Report',
        '1x Standard Dispute Letter',
        'Priority support',
        '30-day validity'
      ]
    },
    {
      name: 'Fleet Manager Pro',
      originalPrice: '£249.90',
      bundlePrice: '£199.99',
      stripePrice: 'price_1Rg5k9LSBFrtdor3ZpoEFeMc', // Replace with your actual Stripe Price ID
      savings: '£49.91',
      description: 'Perfect for dealers and fleet managers',
      includes: [
        '10x Comprehensive Vehicle Reports',
        '5x Standard Dispute Letters',
        'Bulk processing',
        'Priority processing',
        'Dedicated support',
        '90-day validity'
      ]
    },
    {
      name: 'Legal Defense Package',
      originalPrice: '£174.97',
      bundlePrice: '£129.99',
      stripePrice: 'price_1Rg5ldLSBFrtdor3PyYyRpsb', // Replace with your actual Stripe Price ID
      savings: '£44.98',
      description: 'Comprehensive legal protection',
      includes: [
        '1x Comprehensive Vehicle Report',
        '1x Advanced Dispute Letter',
        '1x Premium Dispute Letter',
        'Expert legal consultation',
        'Priority processing',
        '60-day validity'
      ]
    }
  ];

  const features = [
    {
      icon: Zap,
      title: 'Instant Results',
      description: 'Get your reports and letters in under 60 seconds'
    },
    {
      icon: Shield,
      title: 'Secure & Compliant',
      description: 'GDPR compliant with bank-level security'
    },
    {
      icon: CheckCircle,
      title: 'Money-Back Guarantee',
      description: '30-day money-back guarantee on all services'
    },
    {
      icon: Star,
      title: 'Expert Support',
      description: '24/7 customer support from UK-based team'
    }
  ];

  // Handle Stripe Checkout
  const handleCheckout = async (planPriceString: string, productName: string) => {
    const amount = parseFloat(planPriceString.replace('£', ''));
    
    if (isNaN(amount) || amount <= 0) {
      alert('Invalid price for checkout.');
      return;
    }

    setCheckoutLoading(productName);
    
    try {
      // Generate a unique submission ID
      const submission_id = crypto.randomUUID();
      
      // Call the Supabase Edge Function to create a checkout session
      const { data, error } = await createStripeCheckoutSession({
        amount,
        productName,
        quantity: 1,
        submission_id
      });
      
      if (error) {
        console.error('Supabase function error:', error);
        alert(`Error creating checkout session: ${error.message}. Please try again.`);
        return;
      }
      
      if (!data || !data.url) {
        throw new Error('No checkout URL received from payment service');
      }
      
      // Redirect to Stripe checkout
      window.location.href = data.url;
      
    } catch (error: any) {
      console.error('Checkout error:', error);
      alert(`There was an error processing your request: ${error.message || 'Unknown error'}. Please try again.`);
    } finally {
      setCheckoutLoading(null);
    }
  };

  const handleCompetitorQuoteChange = (field: string, value: string) => {
    setCompetitorQuote(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would send the data to a backend
    console.log('Competitor quote submitted:', competitorQuote);
    setShowQuoteSubmitted(true);
    
    // Reset form after 5 seconds
    setTimeout(() => {
      setShowQuoteSubmitted(false);
      setCompetitorQuote({
        company: '',
        service: '',
        price: '',
        email: '',
        phone: ''
      });
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8">
              <TrendingUp className="h-5 w-5 mr-2" />
              <span className="text-sm font-semibold">Transparent Value-Based Pricing</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Simple, Transparent
              <span className="block bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent">
                Pricing
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-orange-100 max-w-4xl mx-auto mb-8 leading-relaxed">
              Professional vehicle intelligence and legal support services at affordable prices. 
              No hidden fees, no subscriptions.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-orange-200">
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">No Hidden Fees</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Shield className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">30-Day Guarantee</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Zap className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">Instant Delivery</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-yellow-300/20 rounded-full blur-xl animate-pulse delay-1000"></div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-12">
        {/* Navigation Section */}
        <div className="mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Jump to a Section</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="#vehicle-reports" 
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 font-semibold flex items-center"
              >
                <Car className="h-5 w-5 mr-2" />
                Vehicle Reports
              </a>
              <a 
                href="#dispute-letters" 
                className="bg-orange-600 text-white px-6 py-3 rounded-xl hover:bg-orange-700 transition-all duration-300 transform hover:scale-105 font-semibold flex items-center"
              >
                <Scale className="h-5 w-5 mr-2" />
                Dispute Letters
              </a>
              <a 
                href="#bundle-deals" 
                className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 font-semibold flex items-center"
              >
                <Gift className="h-5 w-5 mr-2" />
                Bundle Deals
              </a>
              <a 
                href="#competitor-quote" 
                className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-all duration-300 transform hover:scale-105 font-semibold flex items-center"
              >
                <Award className="h-5 w-5 mr-2" />
                Price Match
              </a>
            </div>
          </div>
        </div>

        {/* Vehicle Reports Section */}
        <div id="vehicle-reports" className="mb-20 scroll-mt-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-blue-100 text-blue-800 rounded-full px-4 py-2 mb-4">
              <Car className="h-4 w-4 mr-2" />
              <span className="text-sm font-semibold">Vehicle Reports</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Vehicle History Reports</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive vehicle intelligence from official DVLA and CAP HPI data
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {vehicleReportPlans.map((plan, index) => (
              <div key={index} className={`bg-white rounded-2xl shadow-xl p-8 relative transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1 ${plan.popular ? 'ring-2 ring-blue-500' : 'border border-gray-200'}`}>
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="flex items-start">
                  <div className={`bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-2xl mr-6 flex-shrink-0 ${plan.popular ? 'from-blue-500 to-blue-600' : ''}`}>
                    <plan.icon className={`h-8 w-8 ${plan.popular ? 'text-white' : 'text-blue-600'}`} />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="flex items-baseline mb-4">
                      <div className="text-3xl font-bold text-blue-600">{plan.price}</div>
                      <div className="text-gray-500 ml-2">one-time</div>
                    </div>
                    <p className="text-gray-600 mb-6">{plan.description}</p>
                    
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <button
                      onClick={() => handleCheckout(plan.price, plan.name)}
                      disabled={checkoutLoading === plan.name}
                      className={`w-full py-3 px-6 rounded-xl font-bold transition-all duration-300 flex items-center justify-center ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl' 
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-200'
                      } ${checkoutLoading === plan.name ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {checkoutLoading === plan.name ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          Get Started
                          <ArrowRight className="h-5 w-5 ml-2" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dispute Letters Section */}
        <div id="dispute-letters" className="mb-20 scroll-mt-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-orange-100 text-orange-800 rounded-full px-4 py-2 mb-4">
              <Scale className="h-4 w-4 mr-2" />
              <span className="text-sm font-semibold">Dispute Letters</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Professional Dispute Letters</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Expert-crafted legal letters tailored to your specific offense type
            </p>
          </div>

          {/* Offense Categories Display (non-interactive) */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Offense Categories & Base Pricing</h3>
            <p className="text-gray-600 mb-6">
              Our dispute letter pricing is based on the complexity and severity of the offense. Below are the base prices for different categories of offenses.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <h4 className="text-xl font-bold text-green-800 mb-3 flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  Minor Offenses
                </h4>
                <p className="text-green-700 mb-4">Base price: £19.99</p>
                <ul className="space-y-2">
                  {offenseTypes.filter(o => o.category === 'minor').map((offense, index) => (
                    <li key={index} className="flex items-center text-green-800">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                      {offense.type}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                <h4 className="text-xl font-bold text-orange-800 mb-3 flex items-center">
                  <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                  Moderate Offenses
                </h4>
                <p className="text-orange-700 mb-4">Base price: £49.99</p>
                <ul className="space-y-2">
                  {offenseTypes.filter(o => o.category === 'moderate').map((offense, index) => (
                    <li key={index} className="flex items-center text-orange-800">
                      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>
                      {offense.type}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <h4 className="text-xl font-bold text-red-800 mb-3 flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  Serious Offenses
                </h4>
                <p className="text-red-700 mb-4">Base price: £99.99</p>
                <ul className="space-y-2">
                  {offenseTypes.filter(o => o.category === 'serious').map((offense, index) => (
                    <li key={index} className="flex items-center text-red-800">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                      {offense.type}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-800 mb-1">How Our Pricing Works</h4>
                  <p className="text-sm text-blue-700">
                    When creating a dispute letter, the price is calculated based on the highest severity offense selected and the service level chosen. 
                    For example, a Standard letter for a serious offense starts at £99.99, while an Advanced letter for the same offense would be £129.99.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {disputeLetterPlans.map((plan, index) => (
              <div key={index} className={`bg-white rounded-2xl shadow-xl p-8 relative transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1 ${plan.popular ? 'ring-2 ring-orange-500' : 'border border-gray-200'}`}>
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <div className={`bg-gradient-to-br p-4 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center ${
                    plan.popular ? 'from-orange-500 to-orange-600' : 'from-gray-100 to-gray-200'
                  }`}>
                    <plan.icon className={`h-8 w-8 ${plan.popular ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="text-3xl font-bold text-orange-600 mb-2">{plan.price}</div>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => handleCheckout(plan.price, plan.name)}
                  disabled={checkoutLoading === plan.name}
                  className={`w-full py-3 px-6 rounded-xl font-bold transition-all duration-300 flex items-center justify-center ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl' 
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-200'
                  } ${checkoutLoading === plan.name ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {checkoutLoading === plan.name ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      Choose {plan.name.split(' ')[0]}
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Competitor Quote Section */}
        <div id="competitor-quote" className="mb-20 scroll-mt-24">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border-2 border-blue-200 shadow-xl">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="lg:w-1/2">
                <div className="inline-flex items-center bg-blue-200 text-blue-800 rounded-full px-4 py-2 mb-4">
                  <Award className="h-4 w-4 mr-2" />
                  <span className="text-sm font-semibold">Price Match Promise</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  We'll Beat Any Competitor Quote
                </h3>
                <p className="text-lg text-gray-700 mb-6">
                  Found a better price elsewhere? Let us know and we'll beat it! We're confident in the quality of our services and want to ensure you get the best value.
                </p>
                <div className="bg-white rounded-xl p-4 border border-blue-200">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-blue-800 mb-1">Why We're Better</h4>
                      <ul className="text-blue-700 space-y-1">
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          <span>85% success rate vs industry average of 65%</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          <span>Expert legal team with traffic law specialization</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          <span>Faster turnaround times and better support</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="lg:w-1/2">
                {showQuoteSubmitted ? (
                  <div className="bg-green-50 rounded-2xl p-8 border-2 border-green-200 text-center">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h4 className="text-2xl font-bold text-green-800 mb-2">Quote Submitted!</h4>
                    <p className="text-green-700">
                      Thank you for submitting your competitor quote. Our team will review it and get back to you within 24 hours with a better offer.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitQuote} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
                    <h4 className="text-xl font-bold text-gray-900 mb-4">Submit Competitor Quote</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Competitor Company
                        </label>
                        <input
                          type="text"
                          value={competitorQuote.company}
                          onChange={(e) => handleCompetitorQuoteChange('company', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., LegalTraffic, TicketDefense"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Service Type
                        </label>
                        <select
                          value={competitorQuote.service}
                          onChange={(e) => handleCompetitorQuoteChange('service', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        >
                          <option value="">Select service type</option>
                          <option value="parking">Parking Ticket Dispute</option>
                          <option value="speeding">Speeding Ticket Dispute</option>
                          <option value="bus_lane">Bus Lane Violation</option>
                          <option value="congestion">Congestion Charge</option>
                          <option value="other">Other Traffic Violation</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Their Quote (£)
                        </label>
                        <input
                          type="text"
                          value={competitorQuote.price}
                          onChange={(e) => handleCompetitorQuoteChange('price', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., 29.99"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Your Email
                          </label>
                          <input
                            type="email"
                            value={competitorQuote.email}
                            onChange={(e) => handleCompetitorQuoteChange('email', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="your@email.com"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Your Phone (Optional)
                          </label>
                          <input
                            type="tel"
                            value={competitorQuote.phone}
                            onChange={(e) => handleCompetitorQuoteChange('phone', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g., 07700 900123"
                          />
                        </div>
                      </div>
                      
                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        Get Better Quote
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bundle Deals */}
        <div id="bundle-deals" className="mb-20 scroll-mt-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-purple-100 text-purple-800 rounded-full px-4 py-2 mb-4">
              <Gift className="h-4 w-4 mr-2" />
              <span className="text-sm font-semibold">Bundle Deals</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Save with Bundle Packages</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get more value with our popular bundle packages
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {bundles.map((bundle, index) => (
              <div key={index} className="bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 rounded-2xl p-8 text-white relative overflow-hidden transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1">
                <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                  Save {bundle.savings}
                </div>
                
                <h3 className="text-2xl font-bold mb-2">{bundle.name}</h3>
                <p className="text-orange-100 mb-6">{bundle.description}</p>
                
                <div className="mb-6">
                  <div className="flex items-center mb-2">
                    <span className="text-orange-200 line-through text-lg mr-3">{bundle.originalPrice}</span>
                    <span className="text-3xl font-bold">{bundle.bundlePrice}</span>
                  </div>
                  <p className="text-orange-100 text-sm">One-time payment</p>
                </div>

                <div className="mb-8">
                  <h4 className="font-semibold mb-3">Includes:</h4>
                  <ul className="space-y-2">
                    {bundle.includes.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-yellow-300 mr-2 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleCheckout(bundle.bundlePrice, bundle.name)}
                  disabled={checkoutLoading === bundle.name}
                  className="w-full bg-white text-orange-600 py-3 px-6 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {checkoutLoading === bundle.name ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-600 mr-2 inline-block"></div>
                      Processing...
                    </>
                  ) : (
                    'Choose Bundle'
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose AutoAudit?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional services with unmatched quality and support
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg text-center transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 border border-gray-100">
                <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-4 rounded-2xl w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <feature.icon className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                  <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
                  Are there any hidden fees?
                </h4>
                <p className="text-gray-600 text-lg mb-6 ml-7">
                  No, our pricing is completely transparent. The price you see is exactly what you pay.
                </p>

                <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                  <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
                  How quickly do I get my report or letter?
                </h4>
                <p className="text-gray-600 text-lg mb-6 ml-7">
                  Vehicle reports are delivered instantly. Standard dispute letters are delivered within 24 hours, Advanced within 48 hours, and Premium within 72 hours.
                </p>

                <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                  <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
                  Is there a money-back guarantee?
                </h4>
                <p className="text-gray-600 text-lg ml-7">
                  Yes, we offer a 30-day money-back guarantee on all our services if you're not satisfied with the quality.
                </p>
              </div>
              
              <div>
                <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                  <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
                  Can I get a refund if my appeal fails?
                </h4>
                <p className="text-gray-600 text-lg mb-6 ml-7">
                  While we can't guarantee appeal success, we offer a refund if our letter contains factual errors or doesn't meet professional standards.
                </p>

                <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                  <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
                  Do you offer bulk discounts?
                </h4>
                <p className="text-gray-600 text-lg mb-6 ml-7">
                  Yes, our Fleet Manager Pro bundle offers significant savings for multiple reports, and we offer custom pricing for larger organizations.
                </p>

                <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                  <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
                  Is my data secure?
                </h4>
                <p className="text-gray-600 text-lg ml-7">
                  Absolutely. We use bank-level encryption and are fully GDPR compliant. Your data is never shared with third parties.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 rounded-3xl p-12 text-white text-center relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>
          
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
              Join over 50,000 UK drivers who trust AutoAudit for their vehicle intelligence and legal support needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/vehicle-history" className="bg-white text-orange-600 px-8 py-4 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 font-bold text-lg shadow-xl hover:shadow-2xl flex items-center justify-center">
                <Search className="h-5 w-5 mr-2" />
                Check Vehicle History
              </a>
              <a href="/dispute-letters" className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-orange-600 transition-all duration-300 transform hover:scale-105 font-bold text-lg flex items-center justify-center">
                <FileText className="h-5 w-5 mr-2" />
                Generate Dispute Letter
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}