import React, { useState, useEffect } from 'react';
import { 
  Users, TrendingUp, DollarSign, Copy, Share2, 
  Settings, CheckCircle, AlertCircle, ExternalLink,
  Gift, Target, Award, Clock
} from 'lucide-react';
import { supabase, getUserProfile, getUserReferralStats, updateUserProfile, generateReferralCode } from '../lib/supabase';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    alias: '',
    optInLeaderboard: false
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error('User not authenticated:', userError);
        return;
      }
      
      setUser(user);

      // Get user profile
      const { data: profileData, error: profileError } = await getUserProfile();
      if (profileError) {
        console.error('Error loading profile:', profileError);
      } else {
        setProfile(profileData);
        setFormData({
          alias: profileData?.alias || '',
          optInLeaderboard: profileData?.opt_in_leaderboard || false
        });
      }

      // Get referral stats
      const { data: statsData, error: statsError } = await getUserReferralStats();
      if (statsError) {
        console.error('Error loading stats:', statsError);
      } else {
        setStats(statsData);
        
        // If no referral code exists, generate one
        if (!statsData?.referralCode) {
          const { data: codeData, error: codeError } = await generateReferralCode();
          if (!codeError && codeData?.success) {
            // Reload stats to get the new code
            const { data: updatedStats } = await getUserReferralStats();
            setStats(updatedStats);
          }
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const { error } = await updateUserProfile({
        alias: formData.alias.trim() || null,
        opt_in_leaderboard: formData.optInLeaderboard
      });

      if (error) {
        throw error;
      }

      // Reload profile data
      await loadUserData();
      alert('Profile updated successfully!');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      alert(`Error updating profile: ${error.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const copyReferralLink = async () => {
    if (!stats?.referralCode) return;
    
    const referralLink = `${window.location.origin}?ref=${stats.referralCode}`;
    
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = referralLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareReferralLink = async () => {
    if (!stats?.referralCode) return;
    
    const referralLink = `${window.location.origin}?ref=${stats.referralCode}`;
    const shareData = {
      title: 'Join AutoCheck with my referral',
      text: 'Get professional vehicle reports and dispute letters with AutoCheck!',
      url: referralLink
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to copying link
      copyReferralLink();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  const referralLink = stats?.referralCode ? `${window.location.origin}?ref=${stats.referralCode}` : '';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Referral Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Welcome back, {profile?.alias || user?.email?.split('@')[0] || 'User'}!
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <a 
                href="/leaderboard" 
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center"
              >
                <Award className="h-4 w-4 mr-2" />
                View Leaderboard
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Referrals</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalReferrals || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Conversions</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.convertedReferrals || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-full">
                <Target className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.conversionRate ? `${stats.conversionRate.toFixed(1)}%` : '0%'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">£{stats?.totalEarnings || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Referral Code Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Referral Code</h3>
            
            {stats?.referralCode ? (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Your unique referral code:</p>
                    <p className="text-3xl font-bold text-orange-600 font-mono tracking-wider">
                      {stats.referralCode}
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700 mb-3">Share this link to earn £10 for each conversion:</p>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={referralLink}
                      readOnly
                      className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                    />
                    <button
                      onClick={copyReferralLink}
                      className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center"
                    >
                      {copied ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </>
                      )}
                    </button>
                    <button
                      onClick={shareReferralLink}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </button>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <Gift className="h-5 w-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-green-800 mb-1">
                        How it works
                      </h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• Share your referral link with friends</li>
                        <li>• They sign up and make their first purchase</li>
                        <li>• You earn £10 for each successful referral</li>
                        <li>• Track your progress on this dashboard</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No referral code found. Please refresh the page.</p>
              </div>
            )}
          </div>

          {/* Profile Settings */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h3>
            
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Alias
                </label>
                <input
                  type="text"
                  value={formData.alias}
                  onChange={(e) => setFormData(prev => ({ ...prev, alias: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter a display name for the leaderboard"
                  maxLength={50}
                />
                <p className="text-xs text-gray-500 mt-1">
                  This will be shown on the public leaderboard if you opt in
                </p>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="opt-in-leaderboard"
                    type="checkbox"
                    checked={formData.optInLeaderboard}
                    onChange={(e) => setFormData(prev => ({ ...prev, optInLeaderboard: e.target.checked }))}
                    className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="opt-in-leaderboard" className="font-medium text-gray-700">
                    Show me on the public leaderboard
                  </label>
                  <p className="text-gray-500">
                    Your alias and referral stats will be visible to other users
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={updating}
                className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {updating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Settings className="h-4 w-4 mr-2" />
                    Update Profile
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Referrals</h3>
          
          {stats?.referrals && stats.referrals.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Conversion</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Earnings</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.referrals.slice(0, 10).map((referral: any, index: number) => (
                    <tr key={referral.id} className="border-b border-gray-100">
                      <td className="py-3 px-4 text-gray-900">
                        {new Date(referral.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Referred
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {referral.converted ? (
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            <span className="text-sm">Converted</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            <span className="text-sm">Pending</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-900">
                        {referral.converted ? '£10.00' : '£0.00'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-600 mb-2">No referrals yet</h4>
              <p className="text-gray-500 mb-4">
                Start sharing your referral link to earn rewards!
              </p>
              <button
                onClick={copyReferralLink}
                className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Copy Referral Link
              </button>
            </div>
          )}
        </div>

        {/* Earnings Summary */}
        {stats?.payouts && stats.payouts.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Earnings Summary</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm text-green-600 font-medium">Total Earned</p>
                    <p className="text-2xl font-bold text-green-700">£{stats.totalEarnings}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-yellow-600 mr-3" />
                  <div>
                    <p className="text-sm text-yellow-600 font-medium">Pending</p>
                    <p className="text-2xl font-bold text-yellow-700">£{stats.pendingEarnings}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Paid Out</p>
                    <p className="text-2xl font-bold text-blue-700">£{stats.paidEarnings}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-blue-800 mb-1">
                    Payout Information
                  </h4>
                  <p className="text-sm text-blue-700">
                    Join AutoAudit and start earning £10 for every successful referral after signing up!
                    Pending earnings will be paid out once they reach the minimum threshold.
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