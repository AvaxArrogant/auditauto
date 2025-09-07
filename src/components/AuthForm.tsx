import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User, AlertCircle, CheckCircle } from 'lucide-react';
import { signIn, signUp } from '../lib/supabase';

interface AuthFormProps {
  mode: 'signin' | 'signup';
  onSuccess: () => void;
  onClose: () => void;
}

export default function AuthForm({ mode, onSuccess, onClose }: AuthFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentMode, setCurrentMode] = useState(mode);

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return false;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (currentMode === 'signup' && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (currentMode === 'signin') {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          setError(error.message);
        } else {
          setSuccess('Successfully signed in!');
          setTimeout(() => {
            onSuccess();
            onClose();
          }, 1000);
        }
      } else {
        const { error } = await signUp(formData.email, formData.password);
        if (error) {
          setError(error.message);
        } else {
          setSuccess('Account created! Please check your email for the confirmation link.');
          setTimeout(() => {
            onSuccess();
            onClose();
          }, 2000);
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(''); // Clear error when user starts typing
  };

  const switchMode = () => {
    setCurrentMode(currentMode === 'signin' ? 'signup' : 'signin');
    setError('');
    setSuccess('');
    setFormData({ email: '', password: '', confirmPassword: '' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-orange-100 p-2 rounded-full mr-3">
                <User className="h-6 w-6 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {currentMode === 'signin' ? 'Welcome Back' : 'Create Account'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-gray-600 mt-2">
            {currentMode === 'signin' 
              ? 'Sign in to access your dashboard and referral stats' 
              : 'Join AutoCheck and start earning referral rewards'
            }
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                placeholder="Enter your password"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            {currentMode === 'signup' && (
              <p className="text-xs text-gray-500 mt-1">
                Join AutoAudit and start earning £10 for every successful referral after signing up!
              </p>
            )}
          </div>

          {/* Confirm Password Field (Sign Up Only) */}
          {currentMode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
              <p className="text-sm text-green-700">{success}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center font-semibold"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                {currentMode === 'signin' ? 'Signing In...' : 'Creating Account...'}
              </>
            ) : (
              currentMode === 'signin' ? 'Sign In' : 'Create Account'
            )}
          </button>

          {/* Mode Switch */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              {currentMode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
              <button
                type="button"
                onClick={switchMode}
                className="ml-1 text-orange-600 hover:text-orange-700 font-semibold transition-colors"
              >
                {currentMode === 'signin' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </form>

        {/* Referral Notice for Sign Up */}
        {currentMode === 'signup' && (
          <div className="px-6 pb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="bg-blue-100 p-1 rounded-full mr-3 flex-shrink-0">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-blue-800 mb-1">
                    Join the Referral Program
                  </h4>
                  <p className="text-sm text-blue-700">
                    Get your own referral code and earn £10 for every successful referral after signing up!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}