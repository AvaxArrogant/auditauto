import React from 'react';
import { Shield, Eye, Lock, Database, UserCheck, FileText } from 'lucide-react';

export default function PrivacyPage() {
  const dataTypes = [
    {
      icon: UserCheck,
      title: 'Personal Information',
      description: 'Name, email, address, and phone number when you create an account or use our services'
    },
    {
      icon: FileText,
      title: 'Service Data',
      description: 'Vehicle registration numbers, ticket details, and dispute information you provide'
    },
    {
      icon: Eye,
      title: 'Usage Information',
      description: 'How you interact with our website, pages visited, and features used'
    },
    {
      icon: Database,
      title: 'Technical Data',
      description: 'IP address, browser type, device information, and cookies for website functionality'
    }
  ];

  const rights = [
    'Access your personal data',
    'Correct inaccurate data',
    'Delete your data',
    'Restrict processing',
    'Data portability',
    'Object to processing',
    'Withdraw consent'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Shield className="h-16 w-16 mx-auto mb-6 text-blue-200" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto">
              Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
            </p>
            <p className="text-blue-200 mt-4">Last updated: January 2025</p>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            AutoAudit ("we", "our", or "us") is committed to protecting your privacy and personal data. 
            This Privacy Policy explains how we collect, use, store, and protect your information when you 
            use our vehicle history and dispute letter services.
          </p>
          <p className="text-gray-700 leading-relaxed">
            We are the data controller for the personal information we collect about you. This policy 
            complies with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
          </p>
        </div>

        {/* Data We Collect */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Information We Collect</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dataTypes.map((type, index) => (
              <div key={index} className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-lg mr-4 flex-shrink-0">
                  <type.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{type.title}</h3>
                  <p className="text-gray-600 text-sm">{type.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How We Use Data */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Service Provision</h3>
              <ul className="text-gray-700 space-y-1 ml-4">
                <li>• Generate vehicle history reports using DVLA data</li>
                <li>• Create professional dispute letters</li>
                <li>• Process payments and manage your account</li>
                <li>• Provide customer support</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Legal Obligations</h3>
              <ul className="text-gray-700 space-y-1 ml-4">
                <li>• Comply with legal and regulatory requirements</li>
                <li>• Prevent fraud and ensure service security</li>
                <li>• Maintain records as required by law</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Service Improvement</h3>
              <ul className="text-gray-700 space-y-1 ml-4">
                <li>• Analyze usage patterns to improve our services</li>
                <li>• Send service updates and important notifications</li>
                <li>• Conduct research and development</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Data Sharing */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Sharing and Third Parties</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Official Data Sources</h3>
              <p className="text-gray-700">
                We access DVLA and CAP HPI databases to provide vehicle information. This is done 
                under official licensing agreements and your data is processed securely.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Service Providers</h3>
              <p className="text-gray-700">
                We work with trusted third-party providers for payment processing, email delivery, 
                and website hosting. These providers are contractually bound to protect your data.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Legal Requirements</h3>
              <p className="text-gray-700">
                We may share information when required by law, court order, or to protect our 
                rights and the safety of our users.
              </p>
            </div>
          </div>
        </div>

        {/* Data Security */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <Lock className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Encryption</h3>
                <p className="text-gray-700 text-sm">
                  All data is encrypted in transit and at rest using industry-standard encryption protocols.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <Shield className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Access Controls</h3>
                <p className="text-gray-700 text-sm">
                  Strict access controls ensure only authorized personnel can access your data.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <Database className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Secure Storage</h3>
                <p className="text-gray-700 text-sm">
                  Data is stored in secure, UK-based data centers with robust physical security.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <Eye className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Monitoring</h3>
                <p className="text-gray-700 text-sm">
                  Continuous monitoring and regular security audits protect against threats.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Your Rights */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
          <p className="text-gray-700 mb-4">
            Under UK GDPR, you have the following rights regarding your personal data:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {rights.map((right, index) => (
              <div key={index} className="flex items-center">
                <UserCheck className="h-4 w-4 text-green-600 mr-2" />
                <span className="text-gray-700">{right}</span>
              </div>
            ))}
          </div>
          <p className="text-gray-700 mt-4">
            To exercise any of these rights, please contact us at{' '}
            <a href="mailto:privacy@autoaudit.net" className="text-blue-600 hover:text-blue-700">
              privacy@autoaudit.net
            </a>
          </p>
        </div>

        {/* Data Retention */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Retention</h2>
          <div className="space-y-3">
            <p className="text-gray-700">
              <strong>Account Data:</strong> Retained while your account is active and for 7 years after closure for legal compliance.
            </p>
            <p className="text-gray-700">
              <strong>Service Data:</strong> Vehicle checks and dispute letters are retained for 3 years for support purposes.
            </p>
            <p className="text-gray-700">
              <strong>Usage Data:</strong> Website analytics data is retained for 2 years for service improvement.
            </p>
            <p className="text-gray-700">
              <strong>Marketing Data:</strong> Retained until you unsubscribe or withdraw consent.
            </p>
          </div>
        </div>

        {/* Cookies */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies and Tracking</h2>
          <p className="text-gray-700 mb-4">
            We use cookies and similar technologies to improve your experience on our website. 
            These include:
          </p>
          <ul className="text-gray-700 space-y-2 ml-4">
            <li>• <strong>Essential cookies:</strong> Required for website functionality</li>
            <li>• <strong>Analytics cookies:</strong> Help us understand how you use our site</li>
            <li>• <strong>Preference cookies:</strong> Remember your settings and preferences</li>
          </ul>
          <p className="text-gray-700 mt-4">
            You can manage your cookie preferences in your browser settings or through our{' '}
            <a href="/cookies" className="text-blue-600 hover:text-blue-700">cookie policy</a>.
          </p>
        </div>

        {/* Contact Information */}
        <div className="bg-blue-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
          <p className="text-gray-700 mb-4">
            If you have any questions about this Privacy Policy or how we handle your data, please contact us:
          </p>
          <div className="space-y-2 text-gray-700">
            <p><strong>Email:</strong> privacy@autoaudit.net</p>
            <p><strong>Address:</strong> AutoAudit, Data Protection Officer, London, United Kingdom</p>
            <p><strong>Phone:</strong> +44 20 7946 0958</p>
          </div>
          <p className="text-gray-700 mt-4">
            You also have the right to lodge a complaint with the Information Commissioner's Office (ICO) 
            if you believe we have not handled your data appropriately.
          </p>
        </div>
      </div>
    </div>
  );
}