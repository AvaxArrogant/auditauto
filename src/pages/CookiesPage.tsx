import React, { useState } from 'react';
import { Cookie, Settings, CheckCircle, XCircle, Info, Shield } from 'lucide-react';

export default function CookiesPage() {
  const [preferences, setPreferences] = useState({
    essential: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
    preferences: false
  });

  const cookieTypes = [
    {
      id: 'essential',
      name: 'Essential Cookies',
      description: 'These cookies are necessary for the website to function and cannot be switched off.',
      icon: Shield,
      required: true,
      examples: [
        'Session management',
        'Security tokens',
        'Load balancing',
        'Form submissions'
      ]
    },
    {
      id: 'analytics',
      name: 'Analytics Cookies',
      description: 'These cookies help us understand how visitors interact with our website.',
      icon: Info,
      required: false,
      examples: [
        'Google Analytics',
        'Page view tracking',
        'User journey analysis',
        'Performance monitoring'
      ]
    },
    {
      id: 'preferences',
      name: 'Preference Cookies',
      description: 'These cookies remember your choices and personalize your experience.',
      icon: Settings,
      required: false,
      examples: [
        'Language preferences',
        'Theme settings',
        'Form auto-fill',
        'Display preferences'
      ]
    },
    {
      id: 'marketing',
      name: 'Marketing Cookies',
      description: 'These cookies are used to deliver relevant advertisements and track campaign effectiveness.',
      icon: Cookie,
      required: false,
      examples: [
        'Social media pixels',
        'Advertising networks',
        'Conversion tracking',
        'Retargeting'
      ]
    }
  ];

  const handlePreferenceChange = (cookieType: string, enabled: boolean) => {
    if (cookieType === 'essential') return; // Cannot disable essential cookies
    
    setPreferences(prev => ({
      ...prev,
      [cookieType]: enabled
    }));
  };

  const savePreferences = () => {
    // In a real implementation, you would save these preferences
    // and apply them to your cookie management system
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    alert('Cookie preferences saved successfully!');
  };

  const acceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      marketing: true,
      preferences: true
    };
    setPreferences(allAccepted);
    localStorage.setItem('cookiePreferences', JSON.stringify(allAccepted));
    alert('All cookies accepted!');
  };

  const rejectAll = () => {
    const onlyEssential = {
      essential: true,
      analytics: false,
      marketing: false,
      preferences: false
    };
    setPreferences(onlyEssential);
    localStorage.setItem('cookiePreferences', JSON.stringify(onlyEssential));
    alert('Only essential cookies will be used.');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Cookie className="h-16 w-16 mx-auto mb-6 text-blue-200" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Cookie Policy
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto">
              Learn about how we use cookies and similar technologies to improve your experience on our website.
            </p>
            <p className="text-blue-200 mt-4">Last updated: January 2025</p>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What Are Cookies?</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Cookies are small text files that are stored on your device when you visit our website.
            They help us provide you with a better experience by remembering your preferences, 
            analyzing how you use our site, and enabling certain functionality.
          </p>
          <p className="text-gray-700 leading-relaxed">
            We use both first-party cookies (set by AutoAudit) and third-party cookies
            (set by our partners and service providers) to enhance your browsing experience.
          </p>
        </div>

        {/* Cookie Preferences */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Your Cookie Preferences</h2>
          
          <div className="space-y-6">
            {cookieTypes.map((type) => (
              <div key={type.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-3 rounded-lg mr-4 flex-shrink-0">
                      <type.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{type.name}</h3>
                      <p className="text-gray-700 text-sm mb-3">{type.description}</p>
                      <div className="text-xs text-gray-600">
                        <strong>Examples:</strong> {type.examples.join(', ')}
                      </div>
                    </div>
                  </div>
                  <div className="ml-4">
                    {type.required ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        <span className="text-sm font-medium">Always Active</span>
                      </div>
                    ) : (
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences[type.id as keyof typeof preferences]}
                          onChange={(e) => handlePreferenceChange(type.id, e.target.checked)}
                          className="sr-only"
                        />
                        <div className={`relative w-12 h-6 rounded-full transition-colors ${
                          preferences[type.id as keyof typeof preferences] ? 'bg-blue-600' : 'bg-gray-300'
                        }`}>
                          <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            preferences[type.id as keyof typeof preferences] ? 'translate-x-6' : 'translate-x-0'
                          }`} />
                        </div>
                      </label>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button
              onClick={acceptAll}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Accept All Cookies
            </button>
            <button
              onClick={rejectAll}
              className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors font-semibold"
            >
              Reject Non-Essential
            </button>
            <button
              onClick={savePreferences}
              className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Save Preferences
            </button>
          </div>
        </div>

        {/* Detailed Cookie Information */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Detailed Cookie Information</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">First-Party Cookies</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 font-semibold">Cookie Name</th>
                      <th className="text-left py-2 font-semibold">Purpose</th>
                      <th className="text-left py-2 font-semibold">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    <tr className="border-b border-gray-100">
                      <td className="py-2">session_id</td>
                      <td className="py-2">Maintains user session</td>
                      <td className="py-2">Session</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">csrf_token</td>
                      <td className="py-2">Security protection</td>
                      <td className="py-2">Session</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">cookie_preferences</td>
                      <td className="py-2">Stores your cookie choices</td>
                      <td className="py-2">1 year</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Third-Party Cookies</h3>
              <div className="space-y-3">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Google Analytics</h4>
                  <p className="text-gray-700 text-sm mb-2">
                    Helps us understand how visitors interact with our website.
                  </p>
                  <p className="text-gray-600 text-xs">
                    Cookies: _ga, _ga_*, _gid | Duration: 2 years, 2 years, 24 hours
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Payment Processors</h4>
                  <p className="text-gray-700 text-sm mb-2">
                    Secure payment processing and fraud prevention.
                  </p>
                  <p className="text-gray-600 text-xs">
                    Varies by payment provider | Duration: Session to 1 year
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Managing Cookies */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Managing Cookies in Your Browser</h2>
          <p className="text-gray-700 mb-4">
            You can also manage cookies directly through your browser settings. Here's how:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Chrome</h3>
              <p className="text-gray-700 text-sm">
                Settings → Privacy and security → Cookies and other site data
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Firefox</h3>
              <p className="text-gray-700 text-sm">
                Settings → Privacy & Security → Cookies and Site Data
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Safari</h3>
              <p className="text-gray-700 text-sm">
                Preferences → Privacy → Manage Website Data
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Edge</h3>
              <p className="text-gray-700 text-sm">
                Settings → Cookies and site permissions → Cookies and site data
              </p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-800 mb-1">Important Note</h4>
                <p className="text-yellow-700 text-sm">
                  Disabling certain cookies may affect the functionality of our website and your user experience.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-blue-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions About Cookies?</h2>
          <p className="text-gray-700 mb-4">
            If you have any questions about our use of cookies, please contact us:
          </p>
          <div className="space-y-2 text-gray-700">
            <p><strong>Email:</strong> privacy@autoaudit.net</p>
            <p><strong>Address:</strong> AutoAudit, Privacy Team, London, United Kingdom</p>
            <p><strong>Phone:</strong> +44 20 7946 0958</p>
          </div>
        </div>
      </div>
    </div>
  );
}