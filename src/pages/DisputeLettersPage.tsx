import React, { useState, useEffect } from 'react';
import { 
  FileText, Scale, Shield, Clock, CheckCircle, AlertTriangle,
  Mic, Camera, Upload, Star, Award, 
  Users, TrendingUp, ArrowRight, Zap, Eye, Info
} from 'lucide-react';
import { aiDisputeService, DisputeFormData, AIEnhancedLetter } from '../services/aiDisputeService';
import { createStripeCheckoutSession, supabase } from '../lib/supabase';



export default function DisputeLettersPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [selectedOffenses, setSelectedOffenses] = useState<string[]>([]);
  const [selectedServiceLevel, setSelectedServiceLevel] = useState<'standard' | 'advanced' | 'premium'>('standard');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [scrollToError, setScrollToError] = useState<string | null>(null);

  const [formData, setFormData] = useState<DisputeFormData>({
    ticketNumber: '',
    issueDate: '',
    location: '',
    vehicleReg: '',
    amount: '',
    reason: '',
    evidence: '',
    selectedOffenses: [],
    personalDetails: {
      name: '',
      address: '',
      email: '',
      phone: ''
    }
  });

  // Offense types with base pricing
  const offenseTypes = [
    { type: 'Parking Ticket', category: 'minor', basePrice: 19.99, icon: '🅿️' },
    { type: 'Bus Lane Violation', category: 'minor', basePrice: 19.99, icon: '🚌' },
    { type: 'Congestion Charge', category: 'minor', basePrice: 19.99, icon: '🏙️' },
    { type: 'Speeding (Minor)', category: 'moderate', basePrice: 49.99, icon: '🚗' },
    { type: 'Red Light Violation', category: 'moderate', basePrice: 49.99, icon: '🚦' },
    { type: 'Moving Traffic Violation', category: 'moderate', basePrice: 0.50, icon: '⚠️' },
    { type: 'Speeding (Serious)', category: 'serious', basePrice: 99.99, icon: '🚨' },
    { type: 'Dangerous Driving', category: 'serious', basePrice: 99.99, icon: '⛔' },
    { type: 'Driving Without Insurance', category: 'serious', basePrice: 99.99, icon: '🚫' },
    { type: 'Other Traffic Violation', category: 'serious', basePrice: 19.99, icon: '❓' }
  ];

  // Service level pricing additions
  const serviceLevelPricing = {
    standard: { multiplier: 1.0, name: 'Standard Dispute Letter' },
    advanced: { multiplier: 1.8, name: 'Advanced Dispute Letter' },
    premium: { multiplier: 2.3, name: 'Premium Dispute Letter' }
  };

  // Calculate dynamic pricing
  const calculatePrice = () => {
    let basePrice = 19.99; // Default base price
    
    if (selectedOffenses.length === 0) {
      // Use default base price
    }
    else {
      // Find the highest base price among selected offenses
      const selectedOffenseData = offenseTypes.filter(offense => 
        selectedOffenses.includes(offense.type)
      );
      
      basePrice = Math.max(...selectedOffenseData.map(offense => offense.basePrice));
    }

    // Apply the service level multiplier to the base price
    return basePrice * serviceLevelPricing[selectedServiceLevel].multiplier;
  };

  const currentPrice = calculatePrice();

  // Calculate price for a specific service level
  const calculatePriceForLevel = (level: 'standard' | 'advanced' | 'premium') => {
    let basePrice = 19.99; // Default base price
    
    if (selectedOffenses.length > 0) {
      // Find the highest base price among selected offenses
      const selectedOffenseData = offenseTypes.filter(offense => 
        selectedOffenses.includes(offense.type)
      );
      
      basePrice = Math.max(...selectedOffenseData.map(offense => offense.basePrice));
    }
    
    // Apply the service level multiplier to the base price
    return basePrice * serviceLevelPricing[level].multiplier;
  };

  // Recording timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Scroll to error effect
  useEffect(() => {
    if (scrollToError) {
      const element = document.getElementById(scrollToError);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
          element.classList.add('highlight-error');
          setTimeout(() => {
            element.classList.remove('highlight-error');
          }, 1500);
        }, 500);
      }
      setScrollToError(null);
    }
  }, [scrollToError]);

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedImages(prev => [...prev, ...files].slice(0, 5)); // Max 5 images
    
    // Clear evidence validation error if images are uploaded
    if (validationErrors['evidence'] && files.length > 0) {
      setValidationErrors(prev => {
        const updated = { ...prev };
        delete updated['evidence'];
        return updated;
      });
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
      setRecordingTime(0);
      
      // In a real implementation, you would set up MediaRecorder here
      console.log('Recording started');
      
      // Clear evidence validation error if recording starts
      if (validationErrors['evidence']) {
        setValidationErrors(prev => {
          const updated = { ...prev };
          delete updated['evidence'];
          return updated;
        });
      }
    } catch (error) {
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    setRecordingTime(0);
    // In a real implementation, you would stop MediaRecorder and process the audio
    console.log('Recording stopped');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const generateLetter = () => {
    if (!validateForm()) return;
    
    // Update formData with selected offenses
    setFormData(prev => ({
      ...prev,
      selectedOffenses
    }));
    
    // Move to payment step
    setCurrentStep(2);
  };

  const validateForm = (): boolean => {
    // Reset validation errors
    setValidationErrors({});
    const errors: Record<string, string> = {};
    let firstErrorField: string | null = null;
    
    // Validate selected offenses
    if (selectedOffenses.length === 0) {
      errors['selectedOffenses'] = 'Please select at least one offense type';
      firstErrorField = firstErrorField || 'selectedOffenses';
    }
    
    // Validate ticket details
    if (!formData.ticketNumber.trim()) {
      errors['ticketNumber'] = 'Please enter the ticket number';
      firstErrorField = firstErrorField || 'ticketNumber';
    }
    
    if (!formData.issueDate) {
      errors['issueDate'] = 'Please select the issue date';
      firstErrorField = firstErrorField || 'issueDate';
    }
    
    if (!formData.location.trim()) {
      errors['location'] = 'Please enter the location';
      firstErrorField = firstErrorField || 'location';
    }
    
    if (!formData.vehicleReg.trim()) {
      errors['vehicleReg'] = 'Please enter the vehicle registration';
      firstErrorField = firstErrorField || 'vehicleReg';
    }
    
    if (!formData.amount.trim()) {
      errors['amount'] = 'Please enter the penalty amount';
      firstErrorField = firstErrorField || 'amount';
    }
    
    if (!formData.reason) {
      errors['reason'] = 'Please select a reason for dispute';
      firstErrorField = firstErrorField || 'reason';
    }
    
    if (!formData.evidence.trim() && selectedImages.length === 0) {
      errors['evidence'] = 'Please provide some evidence or details about your case';
      firstErrorField = firstErrorField || 'evidence';
    }

    // Validate personal details
    if (!formData.personalDetails.name.trim()) {
      errors['personalDetails.name'] = 'Please enter your full name';
      firstErrorField = firstErrorField || 'personalDetails.name';
    }
    
    if (!formData.personalDetails.address.trim()) {
      errors['personalDetails.address'] = 'Please enter your address';
      firstErrorField = firstErrorField || 'personalDetails.address';
    }
    
    if (!formData.personalDetails.email.trim()) {
      errors['personalDetails.email'] = 'Please enter your email address';
      firstErrorField = firstErrorField || 'personalDetails.email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.personalDetails.email)) {
      errors['personalDetails.email'] = 'Please enter a valid email address';
      firstErrorField = firstErrorField || 'personalDetails.email';
    }
    
    // Set validation errors and scroll to first error if any
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      if (firstErrorField) {
        setScrollToError(firstErrorField);
      }
      return false;
    }

    return true;
  };

  const handleInitiatePayment = async () => {
  try {
    setCheckoutLoading(true);

    const productName = `Dispute Letter - ${selectedServiceLevel.charAt(0).toUpperCase() + selectedServiceLevel.slice(1)}`;

    // Create a dispute letter record in Supabase
    const currentDispute = {
      id: crypto.randomUUID(),
      product_name: productName,
      service_level: selectedServiceLevel || 'standard',
      ticket_number: formData.ticketNumber,
      issue_date: formData.issueDate,
      location: formData.location,
      vehicle_reg: formData.vehicleReg,
      amount: formData.amount,
      reason: formData.reason,
      evidence: formData.evidence,
      offense_types: selectedOffenses,
      price: currentPrice
    };

    // Store dispute data in localStorage for retrieval after payment
    localStorage.setItem('current_dispute', JSON.stringify(currentDispute));

    const { data, error } = await createStripeCheckoutSession({
      amount: currentPrice,
      productName: currentDispute.product_name,
      quantity: 1,
      customerEmail: formData.personalDetails.email,
      submission_id: currentDispute.id,
      service_level: currentDispute.service_level
    });

    if (error) {
      throw error;
    }

    if (!data || !data.url) {
      throw new Error('No checkout URL received from payment service');
    }

    window.location.href = data.url;
  } catch (error) {
    console.error('Payment initiation error:', error);
    alert(`Error initiating payment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    setCheckoutLoading(false);
  }
};





  const handleOffenseToggle = (offenseType: string) => {
    setSelectedOffenses(prev => 
      prev.includes(offenseType)
        ? prev.filter(offense => offense !== offenseType)
        : [...prev, offenseType]
    );
    
    // Clear validation error for selectedOffenses
    if (validationErrors['selectedOffenses']) {
      setValidationErrors(prev => {
        const updated = { ...prev };
        delete updated['selectedOffenses'];
        return updated;
      });
    }
  };

  const disputeReasons = [
    'Signage unclear or missing',
    'Payment made but not registered',
    'Vehicle breakdown',
    'Medical emergency',
    'Incorrect vehicle details',
    'Ticket issued incorrectly',
    'Vehicle not in violation',
    'Mitigating circumstances',
    'Let Us Decide',
    'Other'
  ];

  const successRates = aiDisputeService.constructor.getSuccessRates();

  const stats = [
    { number: '85%', label: 'Success Rate', icon: TrendingUp },
    { number: '10K+', label: 'Letters Created', icon: FileText },
    { number: '24hrs', label: 'Average Response', icon: Clock },
    { number: '4.9★', label: 'Customer Rating', icon: Star }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section */}
      <section className="bg-orange-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Professional Dispute Letters
            </h1>
            <p className="text-xl md:text-2xl text-orange-100 max-w-4xl mx-auto mb-8">
              Get expertly crafted council ticket dispute letters written by legal professionals. 
              Our AI-enhanced service has an 85% success rate.
            </p>
            <div className="flex items-center justify-center space-x-8 text-orange-200">
              <div className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                <span>Legal Expert Reviewed</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <span>24hr Delivery</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span>85% Success Rate</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center space-x-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  currentStep >= step 
                    ? 'bg-orange-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                <span className={`ml-2 font-medium ${
                  currentStep >= step ? 'text-orange-600' : 'text-gray-600'
                }`}>
                  {step === 1 ? 'Details' : step === 2 ? 'Create' : 'Purchase'}
                </span>
                {step < 3 && (
                  <ArrowRight className={`h-5 w-5 mx-4 ${
                    currentStep > step ? 'text-orange-600' : 'text-gray-400'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Form */}
        {currentStep === 1 && (
          <div className="bg-white rounded-2xl shadow-lg p-8" id="step1-form">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Order Your Dispute Letter</h2>
            
            <div className="space-y-6">
              {/* Offense Type Selection */}
              <div id="selectedOffenses">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Your Offense Type(s)
                </label>
                <p className="text-gray-600 mb-4 text-sm">
                  Choose the type(s) of offense you need help with. Pricing will adjust based on the complexity and severity of your case.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {offenseTypes.map((offense) => (
                    <button
                      key={offense.type}
                      type="button"
                      onClick={() => handleOffenseToggle(offense.type)}
                      className={`p-4 border-2 rounded-xl text-left transition-all duration-300 transform hover:scale-105 ${
                        selectedOffenses.includes(offense.type)
                          ? 'border-orange-500 bg-orange-50 shadow-lg ring-2 ring-orange-200 ring-opacity-50'
                          : 'border-gray-200 hover:border-orange-300 hover:bg-orange-25'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{offense.icon}</span>
                        <div className={`w-3 h-3 rounded-full ${
                          offense.category === 'minor' 
                            ? 'bg-green-500' 
                            : offense.category === 'moderate'
                              ? 'bg-orange-500'
                              : 'bg-red-500'
                        }`}></div>
                      </div>
                      <div>
                        <span className={`font-medium block ${
                          selectedOffenses.includes(offense.type) ? 'text-orange-700' : 'text-gray-900'
                        }`}>
                          {offense.type}
                        </span>
                        <div className="flex justify-between items-center mt-1">
                          <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                            offense.category === 'minor' 
                              ? 'bg-green-100 text-green-700' 
                              : offense.category === 'moderate'
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-red-100 text-red-700'
                          }`}>
                            {offense.category}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                
                {validationErrors['selectedOffenses'] && (
                  <p className="error-message mt-2">
                    {validationErrors['selectedOffenses']}
                  </p>
                )}

                {selectedOffenses.length > 0 && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Selected Offenses:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedOffenses.map((offense, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          {offense}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Service Level Selection */}
              <div id="serviceLevel">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Choose Service Level
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(serviceLevelPricing).map(([level, details]) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setSelectedServiceLevel(level as any)}
                      className={`p-6 border-2 rounded-xl text-center transition-all duration-300 transform hover:scale-105 ${
                        selectedServiceLevel === level
                          ? 'border-orange-500 bg-orange-50 shadow-lg ring-2 ring-orange-200 ring-opacity-50'
                          : 'border-gray-200 hover:border-orange-300'
                      } ${level === 'advanced' ? 'ring-2 ring-blue-200' : ''}`}
                    >
                      {level === 'advanced' && (
                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                          <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                            Most Popular
                          </span>
                        </div>
                      )}
                      <h3 className={`text-lg font-bold mb-2 ${
                        selectedServiceLevel === level ? 'text-orange-700' : 'text-gray-900'
                      }`}>
                        {details.name}
                      </h3>
                      <div className={`text-2xl font-bold mb-2 ${
                        selectedServiceLevel === level ? 'text-orange-600' : 'text-gray-700'
                      }`}>
                        £{calculatePriceForLevel(level as 'standard' | 'advanced' | 'premium').toFixed(2)}
                      </div>
                      <p className={`text-sm ${
                        selectedServiceLevel === level ? 'text-orange-600' : 'text-gray-600'
                      }`}>
                        {level === 'standard' && 'Basic legal arguments and formatting'}
                        {level === 'advanced' && 'Enhanced legal arguments with case law'}
                        {level === 'premium' && 'Expert review with custom strategy'}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Basic Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="basicDetails">
                <div id="ticketNumber">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ticket Number
                  </label>
                  <input
                    id="ticketNumber"
                    name="ticketNumber"
                    type="text"
                    value={formData.ticketNumber}
                    onChange={(e) => handleInputChange('ticketNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g., PCN123456789"
                  />
                  {validationErrors['ticketNumber'] && (
                    <p className="error-message">
                      {validationErrors['ticketNumber']}
                    </p>
                  )}
                </div>
                <div id="issueDate">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Issue Date
                  </label>
                  <input
                    id="issueDate"
                    name="issueDate"
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) => handleInputChange('issueDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  {validationErrors['issueDate'] && (
                    <p className="error-message">
                      {validationErrors['issueDate']}
                    </p>
                  )}
                </div>
                <div id="location">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g., High Street, Manchester"
                  />
                  {validationErrors['location'] && (
                    <p className="error-message">
                      {validationErrors['location']}
                    </p>
                  )}
                </div>
                <div id="vehicleReg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Registration
                  </label>
                  <input
                    id="vehicleReg"
                    name="vehicleReg"
                    type="text"
                    value={formData.vehicleReg}
                    onChange={(e) => handleInputChange('vehicleReg', e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g., AB12 CDE"
                  />
                  {validationErrors['vehicleReg'] && (
                    <p className="error-message">
                      {validationErrors['vehicleReg']}
                    </p>
                  )}
                </div>
                <div id="amount">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Penalty Amount
                  </label>
                  <input
                    id="amount"
                    name="amount"
                    type="text"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g., £60.00"
                  />
                  {validationErrors['amount'] && (
                    <p className="error-message">
                      {validationErrors['amount']}
                    </p>
                  )}
                </div>
              </div>

              {/* Dispute Reason */}
              <div id="reason">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Reason for Dispute
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {disputeReasons.map((reason) => (
                    <button
                      key={reason}
                      type="button"
                      onClick={() => handleInputChange('reason', reason)}
                      className={`p-3 border-2 rounded-lg text-left transition-all duration-200 ${
                        formData.reason === reason
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{reason}</span>
                        {successRates[reason] && (
                          <span className="text-sm text-green-600 font-semibold">
                            {successRates[reason]}% success
                          </span>
                        )}
                        {reason === 'Let Us Decide' && (
                          <span className="text-sm text-blue-600 font-semibold">
                            Expert Selection
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                {validationErrors['reason'] && (
                  <p className="error-message mt-2">
                    {validationErrors['reason']}
                  </p>
                )}
              </div>

              {/* Evidence Section */}
              <div id="evidence">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Evidence & Additional Details
                </label>
                <textarea
                  id="evidence"
                  name="evidence"
                  value={formData.evidence}
                  onChange={(e) => handleInputChange('evidence', e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Describe the circumstances, any evidence you have (photos, receipts, witness statements), and why you believe the ticket was issued incorrectly..."
                />
                {validationErrors['evidence'] && (
                  <p className="error-message">
                    {validationErrors['evidence']}
                  </p>
                )}
                
                {/* Evidence Upload Options */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Image Upload */}
                  <div>
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Camera className="w-8 h-8 mb-2 text-gray-500" />
                        <p className="text-sm text-gray-500">Upload Photos</p>
                      </div>
                      <input
                        id="photoUpload"
                        name="photoUpload"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Voice Recording */}
                  <div>
                    <button
                      type="button"
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg ${
                        isRecording 
                          ? 'border-red-300 bg-red-50 text-red-600' 
                          : 'border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-500'
                      }`}
                    >
                      <Mic className={`w-8 h-8 mb-2 ${isRecording ? 'animate-pulse' : ''}`} />
                      <p className="text-sm">
                        {isRecording ? `Recording ${formatTime(recordingTime)}` : 'Voice Recording'}
                      </p>
                    </button>
                  </div>

                  {/* Document Upload */}
                  <div>
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-gray-500" />
                        <p className="text-sm text-gray-500">Upload Documents</p>
                      </div>
                      <input
                        id="documentUpload"
                        name="documentUpload"
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.txt"
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Uploaded Images Preview */}
                {selectedImages.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Uploaded Images:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedImages.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Evidence ${index + 1}`}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Personal Details */}
              <div id="personalDetails">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div id="personalDetails.name">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      id="personalDetails.name"
                      name="personalDetails.name"
                      type="text"
                      value={formData.personalDetails.name}
                      onChange={(e) => handleInputChange('personalDetails.name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Your full name"
                    />
                    {validationErrors['personalDetails.name'] && (
                      <p className="error-message">
                        {validationErrors['personalDetails.name']}
                      </p>
                    )}
                  </div>
                  <div id="personalDetails.email">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      id="personalDetails.email"
                      name="personalDetails.email"
                      type="email"
                      value={formData.personalDetails.email}
                      onChange={(e) => handleInputChange('personalDetails.email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                    {validationErrors['personalDetails.email'] && (
                      <p className="error-message">
                        {validationErrors['personalDetails.email']}
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-2" id="personalDetails.address">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Address
                    </label>
                    <textarea
                      id="personalDetails.address"
                      name="personalDetails.address"
                      value={formData.personalDetails.address}
                      onChange={(e) => handleInputChange('personalDetails.address', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Your full postal address"
                    />
                    {validationErrors['personalDetails.address'] && (
                      <p className="error-message">
                        {validationErrors['personalDetails.address']}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      id="personalDetails.phone"
                      name="personalDetails.phone"
                      type="tel"
                      value={formData.personalDetails.phone}
                      onChange={(e) => handleInputChange('personalDetails.phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Your phone number"
                    />
                  </div>
                </div>
              </div>

            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setCurrentStep(2)}
                className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-colors duration-200 font-semibold flex items-center text-lg shadow-lg hover:shadow-xl"
              >
                Order Letter - £{calculatePrice().toFixed(2)}
                <ArrowRight className="h-5 w-5 ml-2" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Generate Letter */}
        {currentStep === 2 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Order Your Dispute Letter</h2>
            
            <div className="text-center">
              <div className="bg-orange-100 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <FileText className="h-12 w-12 text-orange-600" />
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Ready to Order Your Professional Dispute Letter
              </h3>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-orange-800">Selected Service:</h4>
                    <p className="text-orange-700">{serviceLevelPricing[selectedServiceLevel].name}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-orange-600">£{currentPrice.toFixed(2)}</div>
                    <p className="text-sm text-orange-600">One-time payment</p>
                  </div>                  
                </div>
              </div>

              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Our expert team will analyze your case details and create a professional, 
                legally-compliant dispute letter tailored to your specific situation. After payment,
                your letter will be delivered to your email within 24-48 hours.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                    <Scale className="h-8 w-8 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Legal Analysis</h4>
                  <p className="text-sm text-gray-600">We analyze your case against UK traffic law</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                    <Award className="h-8 w-8 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Expert Review</h4>
                  <p className="text-sm text-gray-600">Legal professionals validate the arguments</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                    <Zap className="h-8 w-8 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Expert Crafting</h4>
                  <p className="text-sm text-gray-600">Professional letter ready quickly</p>
                </div>
              </div>

              <button
                onClick={handleInitiatePayment}
                disabled={checkoutLoading}
                className="bg-orange-600 text-white px-8 py-4 rounded-lg hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 font-semibold text-lg flex items-center mx-auto shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {checkoutLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Processing Payment...
                  </>
                ) : (
                  <>                    
                    <FileText className="h-5 w-5 mr-3" />                    
                    Proceed to Payment - £{currentPrice.toFixed(2)}
                  </>
                )}
              </button>

              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-gray-600 hover:text-gray-800 transition-colors duration-200 flex items-center"
                >
                  <ArrowRight className="h-4 w-4 mr-2 transform rotate-180" />
                  Back to Edit Details
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* CTA Section */}
      <section className="py-20 bg-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Need Help with Your Dispute?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Our expert legal team is here to help you craft the most effective dispute letter for your case.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact" className="bg-white text-orange-600 px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors duration-200 font-semibold text-lg">
              Contact Support
            </a>
            <a href="/pricing" className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-orange-600 transition-colors duration-200 font-semibold text-lg">
              View Pricing
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}