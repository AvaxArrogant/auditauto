import React, { useState, useEffect } from 'react';
import { Award, TrendingUp, Users, DollarSign, Crown, Medal, Trophy, RefreshCw } from 'lucide-react';
import { getLeaderboard } from '../lib/supabase';

interface LeaderboardEntry {
  rank: number;
  alias: string;
  conversions: number;
  earnings: number;
  userId?: string;
}

interface LeaderboardData {
  leaderboard: LeaderboardEntry[];
  userStats: {
    rank: number | null;
    conversions: number;
    earnings: number;
    optInLeaderboard: boolean;
  } | null;
  payoutAmountPerReferral: number;
  totalEntries: number;
  lastUpdated: string;
}

export default function LeaderboardPage() {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const { data: leaderboardData, error } = await getLeaderboard();
      
      if (error) {
        console.error('Error loading leaderboard:', error);
        return;
      }

      if (leaderboardData?.success) {
        setData(leaderboardData);
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Trophy className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      case 3:
        return 'bg-gradient-to-r from-amber-400 to-amber-600 text-white';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-orange-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Award className="h-16 w-16 mx-auto mb-6 text-orange-200" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Referral Leaderboard
            </h1>
            <p className="text-xl md:text-2xl text-orange-100 max-w-4xl mx-auto">
              See how you stack up against other AutoAudit referrers. 
              Top performers earn the most rewards!
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Referrers</p>
                <p className="text-2xl font-bold text-gray-900">{data?.totalEntries || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Conversions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data?.leaderboard.reduce((sum, entry) => sum + entry.conversions, 0) || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Per Referral</p>
                <p className="text-2xl font-bold text-gray-900">£{data?.payoutAmountPerReferral || 10}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Paid Out</p>
                <p className="text-2xl font-bold text-gray-900">
                  £{data?.leaderboard.reduce((sum, entry) => sum + entry.earnings, 0) || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Your Stats (if user is authenticated) */}
        {data?.userStats && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Performance</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-600 font-medium">Your Rank</p>
                  <p className="text-3xl font-bold text-blue-700">
                    {data.userStats.rank ? `#${data.userStats.rank}` : 'Unranked'}
                  </p>
                </div>
              </div>
              
              <div className="text-center">
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-green-600 font-medium">Conversions</p>
                  <p className="text-3xl font-bold text-green-700">{data.userStats.conversions}</p>
                </div>
              </div>
              
              <div className="text-center">
                <div className="bg-orange-50 rounded-lg p-4">
                  <p className="text-sm text-orange-600 font-medium">Earnings</p>
                  <p className="text-3xl font-bold text-orange-700">£{data.userStats.earnings}</p>
                </div>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-sm text-purple-600 font-medium">Leaderboard</p>
                  <p className="text-lg font-bold text-purple-700">
                    {data.userStats.optInLeaderboard ? 'Visible' : 'Hidden'}
                  </p>
                </div>
              </div>
            </div>

            {!data.userStats.optInLeaderboard && (
              <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                  <Award className="h-5 w-5 text-yellow-600 mr-3" />
                  <div>
                    <h4 className="text-sm font-semibold text-yellow-800">
                      Want to appear on the leaderboard?
                    </h4>
                    <p className="text-sm text-yellow-700">
                      Update your profile settings to opt in and show your achievements to others.
                    </p>
                  </div>
                  <a 
                    href="/dashboard" 
                    className="ml-auto bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                  >
                    Update Settings
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Leaderboard */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">Top Referrers</h3>
            <div className="flex items-center space-x-4">
              <p className="text-sm text-gray-500">
                Last updated: {data?.lastUpdated ? new Date(data.lastUpdated).toLocaleString() : 'Unknown'}
              </p>
              <button
                onClick={() => loadLeaderboard(true)}
                disabled={refreshing}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:bg-gray-400 transition-colors flex items-center"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>

          {data?.leaderboard && data.leaderboard.length > 0 ? (
            <div className="space-y-4">
              {data.leaderboard.map((entry, index) => (
                <div
                  key={`${entry.rank}-${entry.alias}`}
                  className={`flex items-center justify-between p-6 rounded-xl border-2 transition-all duration-200 ${
                    entry.userId ? 'border-orange-300 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getRankBadgeColor(entry.rank)}`}>
                      {getRankIcon(entry.rank)}
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">
                        {entry.alias}
                        {entry.userId && (
                          <span className="ml-2 text-sm bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                            You
                          </span>
                        )}
                      </h4>
                      <p className="text-gray-600">Rank #{entry.rank}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-8">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{entry.conversions}</p>
                      <p className="text-sm text-gray-600">Conversions</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">£{entry.earnings}</p>
                      <p className="text-sm text-gray-600">Earned</p>
                    </div>

                    {entry.rank <= 3 && (
                      <div className="text-center">
                        {entry.rank === 1 && (
                          <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                            🏆 Champion
                          </div>
                        )}
                        {entry.rank === 2 && (
                          <div className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
                            🥈 Runner-up
                          </div>
                        )}
                        {entry.rank === 3 && (
                          <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-semibold">
                            🥉 Third Place
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-600 mb-2">No leaderboard entries yet</h4>
              <p className="text-gray-500 mb-6">
                Be the first to make successful referrals and claim the top spot!
              </p>
              <a 
                href="/dashboard" 
                className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Start Referring
              </a>
            </div>
          )}
        </div>

        {/* How to Climb the Leaderboard */}
        <div className="mt-12 bg-orange-500 rounded-2xl p-8 text-white">
          <div className="text-center">
            <Trophy className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">Want to climb the leaderboard?</h3>
            <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
              Share your referral link with friends and colleagues. Every successful conversion 
              earns you £{data?.payoutAmountPerReferral || 10} and moves you up the rankings!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/dashboard" 
                className="bg-white text-orange-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
              >
                Get Your Referral Link
              </a>
              <a 
                href="/vehicle-history" 
                className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg hover:bg-white hover:text-orange-600 transition-colors font-semibold"
              >
                Try Our Services
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}