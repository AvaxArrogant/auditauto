import React, { useEffect, useState } from 'react';
import { CheckCircle, Download, Mail, ArrowRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase, createDisputeLetter, updateUserComprehensiveReportAccess } from '../lib/supabase';

export default function SuccessPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [productType, setProductType] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    // Get session ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const sessionIdParam = urlParams.get('session_id');
    const productTypeParam = urlParams.get('product_type');
    setSessionId(sessionIdParam);
    setProductType(productTypeParam);
    
    // Process the payment success
    if (sessionIdParam) {
      processPaymentSuccess(sessionIdParam, productTypeParam);
    }
  }, []);
  
  const processPaymentSuccess = async (sessionId: string, productType: string | null) => {
    try {
      setLoading(true);
      
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError('User not authenticated. Please sign in to continue.');
        return;
      }
      
      // Handle comprehensive report purchase
      if (productType === 'comprehensive_report') {
        const { error: accessError } = await updateUserComprehensiveReportAccess(user.id, true);
        
        if (accessError) {
          throw accessError;
        }
        
        setSuccess('Your comprehensive report access has been activated. You can now view full vehicle reports.');
        setLoading(false);
        return;
      }
      
      // Retrieve dispute data from localStorage
      const disputeDataString = localStorage.getItem('current_dispute');
      if (!disputeDataString) {
        setError('Dispute data not found. Please try creating a new dispute letter.');
        return;
      }
      
      const disputeData = JSON.parse(disputeDataString);
      
      // Create dispute letter record in Supabase
      const { data, error } = await createDisputeLetter({
        user_id: user.id,
        ticket_number: disputeData.ticket_number,
        issue_date: disputeData.issue_date,
        location: disputeData.location,
        vehicle_reg: disputeData.vehicle_reg,
        amount: disputeData.amount,
        reason: disputeData.reason,
        evidence: disputeData.evidence,
        offense_types: disputeData.offense_types,
        service_level: disputeData.service_level,
        price: disputeData.price,
        payment_id: sessionId,
        payment_status: 'paid',
        status: 'pending'
      });
      
      if (error) {
        throw error;
      }
      
      // Clear localStorage
      localStorage.removeItem('current_dispute');
      
      setSuccess('Your dispute letter has been successfully created and will be processed shortly.');
    } catch (err) {
      console.error('Error processing payment success:', err);
      setError('There was an error processing your payment. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      {/* Success Hero */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-green-100 p-6 rounded-full w-24 h-24 mx-auto mb-8 flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Payment Successful!
          </h1>

          {productType === 'comprehensive_report' ? (
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Thank you for purchasing comprehensive vehicle report access. Your account has been upgraded and you now have full access to detailed vehicle reports.
            </p>
          ) : (
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Thank you for your purchase. Your dispute letter order has been processed successfully and you'll receive a confirmation email shortly.
            </p>
          )}
          
          {loading && (
            <div className="bg-blue-50 rounded-lg p-4 mb-8 inline-block">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                <p className="text-blue-700">Processing your order...</p>
              </div>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 rounded-lg p-4 mb-8 inline-block">
              <p className="text-red-700">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 rounded-lg p-4 mb-8 inline-block">
              <p className="text-green-700">{success}</p>
            </div>
          )}

          {sessionId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-8 inline-block">
              <p className="text-sm text-gray-600">Order Reference:</p>
              <p className="font-mono text-sm text-gray-900">{sessionId}</p>
            </div>
          )}
        </div>
      </section>

      {/* Next Steps */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">What Happens Next?</h2>

          {productType === 'comprehensive_report' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Immediate Access</h3>
                <p className="text-gray-600">
                  Your account has been upgraded with full access to comprehensive vehicle reports.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-orange-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Download className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Unlimited Reports</h3>
                <p className="text-gray-600">
                  Check as many vehicles as you need with full history, valuation, and risk assessment.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Expert Support</h3>
                <p className="text-gray-600">
                  Our team is ready to help you with any questions about your vehicle reports.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Mail className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Confirmation</h3>
                <p className="text-gray-600">
                  You'll receive a detailed confirmation email with your order details and next steps.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-orange-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Download className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Your Products</h3>
                <p className="text-gray-600">
                  Your reports and letters will be available for download in your account dashboard.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Expert Support</h3>
                <p className="text-gray-600">
                  Our team is ready to help you with any questions about your purchase.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Action Buttons */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Ready to Get Started?</h2>

          {productType === 'comprehensive_report' ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/vehicle-history"
                className="bg-orange-600 text-white px-8 py-4 rounded-xl hover:bg-orange-700 transition-all duration-300 transform hover:scale-105 font-semibold text-lg shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                <Download className="h-5 w-5 mr-2" />
                Check Vehicle History
              </Link>
              
              <Link
                to="/contact"
                className="bg-white text-orange-600 border-2 border-orange-600 px-8 py-4 rounded-xl hover:bg-orange-50 transition-all duration-300 transform hover:scale-105 font-semibold text-lg flex items-center justify-center"
              >
                <Mail className="h-5 w-5 mr-2" />
                Contact Support
              </Link>
              
              <Link
                to="/"
                className="bg-gray-600 text-white px-8 py-4 rounded-xl hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 font-semibold text-lg flex items-center justify-center"
              >
                <Home className="h-5 w-5 mr-2" />
                Back to Home
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/dashboard"
                className="bg-orange-600 text-white px-8 py-4 rounded-xl hover:bg-orange-700 transition-all duration-300 transform hover:scale-105 font-semibold text-lg shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                <Download className="h-5 w-5 mr-2" />
                Access Dashboard
              </Link>
              
              <Link
                to="/contact"
                className="bg-white text-orange-600 border-2 border-orange-600 px-8 py-4 rounded-xl hover:bg-orange-50 transition-all duration-300 transform hover:scale-105 font-semibold text-lg flex items-center justify-center"
              >
                <Mail className="h-5 w-5 mr-2" />
                Contact Support
              </Link>
              
              <Link
                to="/"
                className="bg-gray-600 text-white px-8 py-4 rounded-xl hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 font-semibold text-lg flex items-center justify-center"
              >
                <Home className="h-5 w-5 mr-2" />
                Back to Home
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Support Information */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-blue-900 mb-4">Need Help?</h3>
            <p className="text-blue-800 mb-4">
              If you have any questions about your purchase or need assistance, our support team is here to help.
            </p>
            <div className="space-y-2 text-blue-700">
              <p><strong>Email:</strong> support@autoaudit.net</p>
              <p><strong>Phone:</strong> +44 20 7946 0958</p>
              <p><strong>Hours:</strong> Monday - Friday, 9AM - 6PM GMT</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}