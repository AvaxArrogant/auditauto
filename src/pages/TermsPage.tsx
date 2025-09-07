import React from 'react';
import { FileText, Scale, Shield, AlertTriangle, CheckCircle, Users } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Scale className="h-16 w-16 mx-auto mb-6 text-blue-200" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Terms of Service
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto">
              Please read these terms carefully before using our services. By using AutoAudit, you agree to these terms.
            </p>
            <p className="text-blue-200 mt-4">Last updated: January 2025</p>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            These Terms of Service ("Terms") govern your use of AutoAudit's website and services,
            including vehicle history reports and professional dispute letter services. By accessing 
            or using our services, you agree to be bound by these Terms.
          </p>
          <p className="text-gray-700 leading-relaxed">
            AutoAudit is operated by [Company Name], a company registered in England and Wales. 
            These Terms constitute a legally binding agreement between you and us.
          </p>
        </div>

        {/* Services */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Our Services</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <FileText className="h-6 w-6 text-blue-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Vehicle History Reports</h3>
                <p className="text-gray-700 text-sm">
                  We provide comprehensive vehicle history reports using official DVLA and CAP HPI data sources.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <Scale className="h-6 w-6 text-blue-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Professional Dispute Letters</h3>
                <p className="text-gray-700 text-sm">
                  We create professional dispute letters for council parking tickets and traffic violations.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <Users className="h-6 w-6 text-blue-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Customer Support</h3>
                <p className="text-gray-700 text-sm">
                  We provide customer support to help you use our services effectively.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* User Responsibilities */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Your Responsibilities</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Accurate Information</h3>
              <p className="text-gray-700">
                You must provide accurate and complete information when using our services. 
                False or misleading information may result in inaccurate reports or ineffective dispute letters.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Lawful Use</h3>
              <p className="text-gray-700">
                You must use our services only for lawful purposes and in accordance with these Terms. 
                You may not use our services for fraudulent activities or to violate any laws.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Account Security</h3>
              <p className="text-gray-700">
                You are responsible for maintaining the security of your account credentials and 
                for all activities that occur under your account.
              </p>
            </div>
          </div>
        </div>

        {/* Payment Terms */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Payment and Pricing</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Pricing</h3>
              <p className="text-gray-700">
                Our current pricing is displayed on our website. Prices may change at any time, 
                but changes will not affect orders already placed.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Payment Processing</h3>
              <p className="text-gray-700">
                Payments are processed securely through third-party payment providers. 
                We do not store your payment card details.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Refunds</h3>
              <p className="text-gray-700">
                We offer a 30-day money-back guarantee. Refunds are available if you are not 
                satisfied with the quality of our service, subject to our refund policy.
              </p>
            </div>
          </div>
        </div>

        {/* Service Limitations */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Service Limitations and Disclaimers</h2>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-800 mb-1">Important Disclaimers</h4>
                <p className="text-yellow-700 text-sm">
                  Please read these limitations carefully as they affect your rights.
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Data Accuracy</h3>
              <p className="text-gray-700">
                While we strive for accuracy, we cannot guarantee that all information in our reports 
                is complete or error-free. Data is sourced from third-party providers and may contain inaccuracies.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Dispute Letter Success</h3>
              <p className="text-gray-700">
                We cannot guarantee that dispute letters will result in successful appeals. 
                Success depends on many factors including the specific circumstances of your case.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Service Availability</h3>
              <p className="text-gray-700">
                Our services may be temporarily unavailable due to maintenance, technical issues, 
                or problems with third-party data providers.
              </p>
            </div>
          </div>
        </div>

        {/* Intellectual Property */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Intellectual Property</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Our Content</h3>
              <p className="text-gray-700">
                All content on our website, including text, graphics, logos, and software, 
                is owned by us or our licensors and is protected by copyright and other intellectual property laws.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Your Content</h3>
              <p className="text-gray-700">
                You retain ownership of any information you provide to us, but you grant us 
                a license to use this information to provide our services.
              </p>
            </div>
          </div>
        </div>

        {/* Liability */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Limitation of Liability</h2>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <Shield className="h-5 w-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-800 mb-1">Liability Limitations</h4>
                <p className="text-red-700 text-sm">
                  Our liability is limited as set out below.
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-gray-700">
              To the maximum extent permitted by law, we exclude all liability for any loss or damage 
              arising from your use of our services, except for:
            </p>
            <ul className="text-gray-700 space-y-2 ml-4">
              <li>• Death or personal injury caused by our negligence</li>
              <li>• Fraud or fraudulent misrepresentation</li>
              <li>• Any other liability that cannot be excluded by law</li>
            </ul>
            <p className="text-gray-700">
              Our total liability to you for any claim shall not exceed the amount you paid for the specific service.
            </p>
          </div>
        </div>

        {/* Termination */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Termination</h2>
          <div className="space-y-4">
            <p className="text-gray-700">
              We may terminate or suspend your access to our services at any time if you breach these Terms 
              or engage in conduct that we consider harmful to our business or other users.
            </p>
            <p className="text-gray-700">
              You may stop using our services at any time. Upon termination, your right to use our services 
              will cease immediately.
            </p>
          </div>
        </div>

        {/* Changes to Terms */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to These Terms</h2>
          <p className="text-gray-700">
            We may update these Terms from time to time. We will notify you of any material changes 
            by posting the new Terms on our website. Your continued use of our services after such 
            changes constitutes acceptance of the new Terms.
          </p>
        </div>

        {/* Governing Law */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Governing Law</h2>
          <p className="text-gray-700">
            These Terms are governed by English law and any disputes will be subject to the 
            exclusive jurisdiction of the English courts.
          </p>
        </div>

        {/* Contact Information */}
        <div className="bg-blue-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
          <p className="text-gray-700 mb-4">
            If you have any questions about these Terms of Service, please contact us:
          </p>
          <div className="space-y-2 text-gray-700">
            <p><strong>Email:</strong> legal@autoaudit.net</p>
            <p><strong>Address:</strong> AutoAudit, Legal Department, London, United Kingdom</p>
            <p><strong>Phone:</strong> +44 20 7946 0958</p>
          </div>
        </div>
      </div>
    </div>
  );
}