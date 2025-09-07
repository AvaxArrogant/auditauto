import React, { useState } from 'react';
import { Shield, CheckCircle, AlertTriangle, Car, FileText, Clock, User, Users, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import DVLAVehicleChecker from '../components/DVLAVehicleChecker';
import DVLADriverChecker from '../components/DVLADriverChecker';
import CAPHPIVehicleChecker from '../components/CAPHPIVehicleChecker';
import { DVLAVehicleData, DVLADriverData } from '../services/dvlaApi';

export default function VehicleVerificationPage() {
  const [verifiedVehicle, setVerifiedVehicle] = useState<DVLAVehicleData | null>(null);
  const [verifiedDriver, setVerifiedDriver] = useState<DVLADriverData | null>(null);
  const [verifiedCAPHPI, setVerifiedCAPHPI] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'vehicle' | 'driver' | 'valuation'>('vehicle');

  const handleVehicleVerified = (vehicleData: DVLAVehicleData) => {
    setVerifiedVehicle(vehicleData);
  };

  const handleDriverVerified = (driverData: DVLADriverData) => {
    setVerifiedDriver(driverData);
  };

  const handleCAPHPIVerified = (reportData: any) => {
    setVerifiedCAPHPI(reportData);
  };

  const benefits = [
    {
      icon: Shield,
      title: 'Enhanced Security',
      description: 'Verify vehicle authenticity and legal status before rental'
    },
    {
      icon: CheckCircle,
      title: 'Compliance Assurance',
      description: 'Ensure all vehicles meet legal requirements for road use'
    },
    {
      icon: FileText,
      title: 'Accurate Records',
      description: 'Maintain up-to-date vehicle information and documentation'
    },
    {
      icon: Clock,
      title: 'Real-time Data',
      description: 'Access the latest DVLA information instantly'
    }
  ];

  const verificationSteps = [
    {
      step: 1,
      title: 'Enter Registration',
      description: 'Input the vehicle registration number you want to verify'
    },
    {
      step: 2,
      title: 'DVLA Lookup',
      description: 'Our system queries the official DVLA database'
    },
    {
      step: 3,
      title: 'Instant Results',
      description: 'Receive comprehensive vehicle information and compliance status'
    },
    {
      step: 4,
      title: 'Make Decision',
      description: 'Use verified data to make informed rental decisions'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              DVLA Verification Services
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto">
              Instantly verify vehicle and driver information using official DVLA data to ensure compliance and authenticity
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 rounded-lg p-1 flex flex-wrap">
            <button
              onClick={() => setActiveTab('vehicle')}
              className={`px-4 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center ${
                activeTab === 'vehicle'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Car className="h-5 w-5 mr-2" />
              Vehicle Verification
            </button>
            <button
              onClick={() => setActiveTab('driver')}
              className={`px-4 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center ${
                activeTab === 'driver'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <User className="h-5 w-5 mr-2" />
              Driver Verification
            </button>
            <button
              onClick={() => setActiveTab('valuation')}
              className={`px-4 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center ${
                activeTab === 'valuation'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <TrendingUp className="h-5 w-5 mr-2" />
              Vehicle Valuation
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Verification Component */}
          <div>
            {activeTab === 'vehicle' ? (
              <DVLAVehicleChecker 
                onVehicleVerified={handleVehicleVerified}
                className="mb-8"
              />
            ) : activeTab === 'driver' ? (
              <DVLADriverChecker 
                onDriverVerified={handleDriverVerified}
                className="mb-8"
              />
            ) : (
              <CAPHPIVehicleChecker 
                onVehicleVerified={handleCAPHPIVerified}
                className="mb-8"
              />
            )}

            {/* API Key Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-yellow-800 mb-1">
                    {activeTab === 'valuation' ? 'CAP HPI API Key Required' : 'DVLA API Key Required'}
                  </h4>
                  <p className="text-sm text-yellow-700">
                    {activeTab === 'valuation' ? (
                      <>To use vehicle valuation features, you need a valid CAP HPI API key. <a href="https://api.cap-hpi.co.uk/docs/index.html" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline ml-1">Get your API key here</a></>
                    ) : (
                      <>
                        To use this feature, you need a valid DVLA API key. 
                        <a 
                          href="https://developer-portal.driver-vehicle-licensing.api.gov.uk/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="underline hover:no-underline ml-1"
                        >
                          Get your API key here
                        </a>
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Information Panel */}
          <div className="space-y-8">
            {/* Benefits */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {activeTab === 'vehicle' ? 'Why Verify Vehicles?' : 
                 activeTab === 'driver' ? 'Why Verify Drivers?' : 
                 'Why Get Vehicle Valuations?'}
              </h3>
              <div className="space-y-4">
                {(activeTab === 'valuation' ? [
                  {
                    icon: TrendingUp,
                    title: 'Market Intelligence',
                    description: 'Get accurate market values for informed pricing decisions'
                  },
                  {
                    icon: Shield,
                    title: 'Risk Assessment',
                    description: 'Comprehensive vehicle history and insurance data'
                  },
                  {
                    icon: CheckCircle,
                    title: 'Professional Reports',
                    description: 'Industry-standard CAP HPI valuation reports'
                  },
                  {
                    icon: Clock,
                    title: 'Real-time Data',
                    description: 'Up-to-date market values and vehicle information'
                  }
                ] : benefits).map((benefit, index) => (
                  <div key={index} className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-lg mr-4 flex-shrink-0">
                      <benefit.icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{benefit.title}</h4>
                      <p className="text-gray-600 text-sm">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* How it Works */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h3>
              <div className="space-y-6">
                {(activeTab === 'valuation' ? [
                  {
                    step: 1,
                    title: 'Enter Vehicle Details',
                    description: 'Input registration number, mileage, and condition'
                  },
                  {
                    step: 2,
                    title: 'CAP HPI Lookup',
                    description: 'Our system queries the CAP HPI database'
                  },
                  {
                    step: 3,
                    title: 'Comprehensive Report',
                    description: 'Receive valuation, insurance, and history data'
                  },
                  {
                    step: 4,
                    title: 'Make Decisions',
                    description: 'Use professional data for pricing and risk assessment'
                  }
                ] : verificationSteps).map((step, index) => (
                  <div key={index} className="flex items-start">
                    <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0">
                      {step.step}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{step.title}</h4>
                      <p className="text-gray-600 text-sm">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Sources */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Data Sources</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                  <span className="text-gray-700">
                    {activeTab === 'valuation' ? 'CAP HPI Database' : 'Official DVLA Database'}
                  </span>
                </div>
                {activeTab === 'vehicle' ? (
                  <>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                      <span className="text-gray-700">Real-time Tax Status</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                      <span className="text-gray-700">Current MOT Information</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                      <span className="text-gray-700">Vehicle Specifications</span>
                    </div>
                  </>
                ) : activeTab === 'valuation' ? (
                  <>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                      <span className="text-gray-700">Market Valuations</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                      <span className="text-gray-700">Insurance Group Data</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                      <span className="text-gray-700">Vehicle History Checks</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                      <span className="text-gray-700">License Status & Validity</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                      <span className="text-gray-700">Driving Entitlements</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                      <span className="text-gray-700">Penalty Points & Endorsements</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {(verifiedVehicle || verifiedDriver || verifiedCAPHPI) && (
          <div className="mt-12 bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
              <h3 className="text-lg font-semibold text-green-900">
                {verifiedVehicle ? 'Vehicle' : verifiedDriver ? 'Driver' : 'Vehicle Report'} Successfully {verifiedCAPHPI ? 'Generated' : 'Verified'}
              </h3>
            </div>
            <p className="text-green-700 mb-4">
              {verifiedVehicle 
                ? `The vehicle ${verifiedVehicle.registrationNumber} has been verified against DVLA records.`
                : verifiedDriver 
                ? `The driver license ${verifiedDriver.driver.drivingLicenceNumber} has been verified against DVLA records.`
                : `Comprehensive vehicle report generated for ${verifiedCAPHPI?.vehicle?.registration}.`
              } You can now proceed with confidence knowing the information is accurate and up-to-date.
            </p>
            <div className="flex gap-4">
              <Link
                to="/browse"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold"
              >
                Browse Vehicles
              </Link>
              <Link
                to="/list-car"
                className="bg-white text-green-600 border border-green-600 px-6 py-2 rounded-lg hover:bg-green-50 transition-colors duration-200 font-semibold"
              >
                List Your Vehicle
              </Link>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
          <Users className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-4">Ready to Verify Your Fleet & Drivers?</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Ensure all vehicles and drivers in your fleet meet legal requirements and provide accurate information to your customers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/general-services"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-semibold"
            >
              Learn More About Our Services
            </Link>
            <Link
              to="/help"
              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg hover:bg-white hover:text-blue-600 transition-colors duration-200 font-semibold"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}