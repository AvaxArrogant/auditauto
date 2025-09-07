import React, { useState, useEffect } from 'react';
import { 
  Users, FileText, DollarSign, Settings, AlertTriangle, 
  CheckCircle, XCircle, Edit, Trash2, Eye, Search, Trash,
  RefreshCw, Download, Filter, ArrowUpDown, Plus
} from 'lucide-react';
import { supabase, checkUserAdminStatus } from '../lib/supabase';

export default function AdminDashboardPage() {
  console.log('🔍 AdminDashboardPage: Component rendering started');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'dispute-letters' | 'referrals' | 'payouts'>('users');
  const [users, setUsers] = useState<any[]>([]);
  const [disputeLetters, setDisputeLetters] = useState<any[]>([]);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [clearingCache, setClearingCache] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      console.log('🔍 AdminDashboardPage: checkAdminStatus function called');
      try {
        setLoading(true);
        
        // Get current user
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        console.log('🔍 AdminDashboardPage: Current user:', currentUser?.id);
        
        if (!currentUser) {
          console.log('🔍 AdminDashboardPage: No user found, setting error');
          setError('You must be logged in to access this page');
          setLoading(false);
          return;
        }
        
        setUser(currentUser);
        
        // Check if user is admin
        console.log('🔍 AdminDashboardPage: Checking admin status');
        const adminStatus = await checkUserAdminStatus();
        console.log('🔍 AdminDashboardPage: Admin status result:', adminStatus);
        setIsAdmin(adminStatus);
        
        if (!adminStatus) {
          console.log('🔍 AdminDashboardPage: User is not admin, setting error');
          setError('You do not have permission to access this page');
          setLoading(false);
          return;
        }
        
        // Load initial data
        console.log('🔍 AdminDashboardPage: User is admin, loading initial data');
        loadData();
      } catch (error) {
        console.error('🔍 AdminDashboardPage: Error in checkAdminStatus:', error);
        setError('An unexpected error occurred');
        setLoading(false);
      }
    };
    
    checkAdminStatus();
  }, []);

  const loadData = async () => {
    try {
      console.log('🔍 AdminDashboardPage: loadData called for tab:', activeTab);
      setIsRefreshing(true);
      setError(null);
      
      // Load data based on active tab
      switch (activeTab) {
        case 'users':
          console.log('🔍 AdminDashboardPage: Loading users data');
          await loadUsers();
          break;
        case 'dispute-letters':
          console.log('🔍 AdminDashboardPage: Loading dispute letters data');
          await loadDisputeLetters();
          break;
        case 'referrals':
          console.log('🔍 AdminDashboardPage: Loading referrals data');
          await loadReferrals();
          break;
        case 'payouts':
          console.log('🔍 AdminDashboardPage: Loading payouts data');
          await loadPayouts();
          break;
      }
    } catch (error) {
      console.error(`🔍 AdminDashboardPage: Error loading ${activeTab} data:`, error);
      setError(`Failed to load ${activeTab.replace('-', ' ')} data`);
    } finally {
      console.log('🔍 AdminDashboardPage: Finished loading data, setting loading/refreshing to false');
      setIsRefreshing(false);
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    console.log('🔍 AdminDashboardPage: loadUsers function called');
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order(sortField, { ascending: sortDirection === 'asc' });
    
    if (error) {
      console.error('🔍 AdminDashboardPage: Error in loadUsers:', error);
      throw error;
    }
    console.log('🔍 AdminDashboardPage: Users loaded successfully, count:', data?.length || 0);
    setUsers(data || []);
  };

  const loadDisputeLetters = async () => {
    console.log('🔍 AdminDashboardPage: loadDisputeLetters function called');
    let query = supabase
      .from('dispute_letters')
      .select(`
        *,
       users:users!dispute_letters_user_id_fkey (
          email,
          alias
        )
      `)
      .order(sortField, { ascending: sortDirection === 'asc' });
    
    if (selectedStatus !== 'all') {
      query = query.eq('status', selectedStatus);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('🔍 AdminDashboardPage: Error in loadDisputeLetters:', error);
      throw error;
    }
    console.log('🔍 AdminDashboardPage: Dispute letters loaded successfully, count:', data?.length || 0);
    setDisputeLetters(data || []);
  };

  const loadReferrals = async () => {
    console.log('🔍 AdminDashboardPage: loadReferrals function called');
    console.log('🔍 AdminDashboardPage: Current sort field:', sortField, 'direction:', sortDirection);
    const { data, error } = await supabase
      .from('referrals')
      .select(`
        *,
       referrer:users!referrals_referrer_user_id_fkey(
          email,
          alias
        ),
       referred:users!referrals_referred_user_id_fkey(
          email,
          alias
        )
      `)
      .order(sortField, { ascending: sortDirection === 'asc' });
    
    if (error) {
      console.error('🔍 AdminDashboardPage: Error in loadReferrals:', error);
      throw error;
    }
    console.log('🔍 AdminDashboardPage: Referrals loaded successfully, count:', data?.length || 0);
    console.log('🔍 AdminDashboardPage: First referral data sample:', data?.[0] ? JSON.stringify(data[0]).substring(0, 200) + '...' : 'No data');
    setReferrals(data || []);
  };

  const loadPayouts = async () => {
    console.log('🔍 AdminDashboardPage: loadPayouts function called');
    let query = supabase
      .from('payouts')
      .select(`
        *,
       users:users!payouts_user_id_fkey(
          email,
          alias
        ),
       referrals(
          id,
          referrer_user_id,
          referred_user_id
        )
      `)
      .order(sortField, { ascending: sortDirection === 'asc' });
    
    if (selectedStatus !== 'all') {
      query = query.eq('status', selectedStatus);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('🔍 AdminDashboardPage: Error in loadPayouts:', error);
      throw error;
    }
    console.log('🔍 AdminDashboardPage: Payouts loaded successfully, count:', data?.length || 0);
    setPayouts(data || []);
  };

  const handleTabChange = (tab: 'users' | 'dispute-letters' | 'referrals' | 'payouts') => {
    console.log('🔍 AdminDashboardPage: handleTabChange called, new tab:', tab, 'previous tab:', activeTab);
    setActiveTab(tab);
    setSearchTerm('');
    setSelectedStatus('all');
    setSortField('created_at');
    setSortDirection('desc');
    console.log('🔍 AdminDashboardPage: State reset, now calling loadData()');
    loadData();
  };

  const handleSort = (field: string) => {
    console.log('🔍 AdminDashboardPage: handleSort called, field:', field, 'current sortField:', sortField);
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔍 AdminDashboardPage: handleSearch called, searchTerm:', searchTerm);
    loadData();
  };

  const handleRefresh = () => {
    console.log('🔍 AdminDashboardPage: handleRefresh called');
    loadData();
  };

  const handleStatusChange = (status: string) => {
    console.log('🔍 AdminDashboardPage: handleStatusChange called, new status:', status);
    setSelectedStatus(status);
  };

  const handleClearCache = async () => {
    console.log('🔍 AdminDashboardPage: handleClearCache called');
    setClearingCache(true);
    
    try {
      // Clear all caches
      if ('caches' in window) {
        console.log('🔍 AdminDashboardPage: Clearing browser caches');
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
        console.log('🔍 AdminDashboardPage: Successfully cleared caches:', cacheNames);
      }
      
      // Clear localStorage
      console.log('🔍 AdminDashboardPage: Clearing localStorage');
      localStorage.clear();
      
      // Clear sessionStorage
      console.log('🔍 AdminDashboardPage: Clearing sessionStorage');
      sessionStorage.clear();
      
      // Show success message
      alert('Cache cleared successfully! The page will now reload.');
      
      // Reload the page with cache busting parameter
      window.location.href = window.location.pathname + '?cache_bust=' + Date.now();
    } catch (error) {
      console.error('🔍 AdminDashboardPage: Error clearing cache:', error);
      alert('Failed to clear cache: ' + (error instanceof Error ? error.message : 'Unknown error'));
      setClearingCache(false);
    }
  };

  const handleUpdateUserAdmin = async (userId: string, isAdmin: boolean) => {
    console.log('🔍 AdminDashboardPage: handleUpdateUserAdmin called, userId:', userId, 'isAdmin:', isAdmin);
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_admin: isAdmin })
        .eq('id', userId);
      
      if (error) throw error;
      
      console.log('🔍 AdminDashboardPage: User admin status updated successfully');
      // Refresh users list
      loadUsers();
    } catch (error) {
      console.error('🔍 AdminDashboardPage: Error updating user admin status:', error);
      alert('Failed to update user admin status');
    }
  };

  const handleUpdateDisputeLetterStatus = async (letterId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('dispute_letters')
        .update({ 
          status,
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', letterId);
      
      if (error) throw error;
      
      // Refresh dispute letters list
      loadDisputeLetters();
    } catch (error) {
      console.error('Error updating dispute letter status:', error);
      alert('Failed to update dispute letter status');
    }
  };

  const handleUpdatePayoutStatus = async (payoutId: string, status: string) => {
    try {
      const updates: any = { status };
      
      if (status === 'approved') {
        updates.approved_at = new Date().toISOString();
      } else if (status === 'paid') {
        updates.paid_at = new Date().toISOString();
      }
      
      const { error } = await supabase
        .from('payouts')
        .update(updates)
        .eq('id', payoutId);
      
      if (error) throw error;
      
      // Refresh payouts list
      loadPayouts();
    } catch (error) {
      console.error('Error updating payout status:', error);
      alert('Failed to update payout status');
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    console.log('🔍 AdminDashboardPage: Rendering loading state');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (error) {
    console.log('🔍 AdminDashboardPage: Rendering error state:', error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">{error}</h2>
          <p className="text-gray-600 text-center mb-6">
            You don't have permission to access this page or an error occurred.
          </p>
          <div className="flex justify-center">
            <a
              href="/"
              className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
            >
              Return to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    console.log('🔍 AdminDashboardPage: Rendering main component with activeTab:', activeTab),
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Manage users, dispute letters, referrals, and payouts
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleClearCache}
                disabled={clearingCache}
                className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors flex items-center"
              >
                <Trash className={`h-4 w-4 mr-2 ${clearingCache ? 'animate-spin' : ''}`} />
                {clearingCache ? 'Clearing...' : 'Clear Cache'}
              </button>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => handleTabChange('users')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'users'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Users className="h-5 w-5 inline mr-2" />
                Users
              </button>
              <button
                onClick={() => handleTabChange('dispute-letters')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'dispute-letters'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FileText className="h-5 w-5 inline mr-2" />
                Dispute Letters
              </button>
              <button
                onClick={() => handleTabChange('referrals')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'referrals'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Users className="h-5 w-5 inline mr-2" />
                Referrals
              </button>
              <button
                onClick={() => handleTabChange('payouts')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'payouts'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <DollarSign className="h-5 w-5 inline mr-2" />
                Payouts
              </button>
            </nav>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {(activeTab === 'dispute-letters' || activeTab === 'payouts') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status Filter
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="all">All Statuses</option>
                  {activeTab === 'dispute-letters' ? (
                    <>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="completed">Completed</option>
                    </>
                  ) : (
                    <>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="paid">Paid</option>
                      <option value="cancelled">Cancelled</option>
                    </>
                  )}
                </select>
              </div>
            )}
          </div>

          <form onSubmit={handleSearch} className="flex w-full sm:w-auto">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={`Search ${activeTab.replace('-', ' ')}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="bg-orange-600 text-white px-4 py-2 rounded-r-lg hover:bg-orange-700 transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Content based on active tab */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {activeTab === 'users' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('email')}
                    >
                      <div className="flex items-center">
                        Email
                        {sortField === 'email' && (
                          <ArrowUpDown className="h-4 w-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('alias')}
                    >
                      <div className="flex items-center">
                        Alias
                        {sortField === 'alias' && (
                          <ArrowUpDown className="h-4 w-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('created_at')}
                    >
                      <div className="flex items-center">
                        Created At
                        {sortField === 'created_at' && (
                          <ArrowUpDown className="h-4 w-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('is_admin')}
                    >
                      <div className="flex items-center">
                        Admin
                        {sortField === 'is_admin' && (
                          <ArrowUpDown className="h-4 w-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.alias || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.is_admin ? (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                            Admin
                          </span>
                        ) : (
                          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                            User
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => handleUpdateUserAdmin(user.id, !user.is_admin)}
                          className={`px-3 py-1 rounded-md text-white text-xs ${
                            user.is_admin ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
                          }`}
                        >
                          {user.is_admin ? 'Remove Admin' : 'Make Admin'}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'dispute-letters' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('ticket_number')}
                    >
                      <div className="flex items-center">
                        Ticket Number
                        {sortField === 'ticket_number' && (
                          <ArrowUpDown className="h-4 w-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      User
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('issue_date')}
                    >
                      <div className="flex items-center">
                        Issue Date
                        {sortField === 'issue_date' && (
                          <ArrowUpDown className="h-4 w-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center">
                        Status
                        {sortField === 'status' && (
                          <ArrowUpDown className="h-4 w-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('payment_status')}
                    >
                      <div className="flex items-center">
                        Payment
                        {sortField === 'payment_status' && (
                          <ArrowUpDown className="h-4 w-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {disputeLetters.map((letter) => (
                    <tr key={letter.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {letter.ticket_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {letter.users?.email || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {letter.issue_date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeColor(letter.status)}`}>
                          {letter.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeColor(letter.payment_status)}`}>
                          {letter.payment_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleUpdateDisputeLetterStatus(letter.id, 'approved')}
                            className="text-blue-600 hover:text-blue-800"
                            title="Approve"
                          >
                            <CheckCircle className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleUpdateDisputeLetterStatus(letter.id, 'rejected')}
                            className="text-red-600 hover:text-red-800"
                            title="Reject"
                          >
                            <XCircle className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleUpdateDisputeLetterStatus(letter.id, 'completed')}
                            className="text-green-600 hover:text-green-800"
                            title="Mark as Completed"
                          >
                            <CheckCircle className="h-5 w-5" />
                          </button>
                          <button
                            className="text-gray-600 hover:text-gray-800"
                            title="View Details"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {disputeLetters.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                        No dispute letters found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'referrals' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                {console.log('🔍 AdminDashboardPage: Rendering referrals table, data count:', referrals.length)}
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Referrer
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Referred User
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('converted')}
                    >
                      <div className="flex items-center">
                        Converted
                        {sortField === 'converted' && (
                          <ArrowUpDown className="h-4 w-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('conversion_date')}
                    >
                      <div className="flex items-center">
                        Conversion Date
                        {sortField === 'conversion_date' && (
                          <ArrowUpDown className="h-4 w-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('created_at')}
                    >
                      <div className="flex items-center">
                        Created At
                        {sortField === 'created_at' && (
                          <ArrowUpDown className="h-4 w-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {console.log('🔍 AdminDashboardPage: Mapping through referrals for table rows')}
                  {referrals.map((referral) => (
                    <tr key={referral.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {referral.referrer ? referral.referrer.email : 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {referral.referred ? referral.referred.email : 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {referral.converted ? (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                            Converted
                          </span>
                        ) : (
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {referral.conversion_date ? formatDate(referral.conversion_date) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(referral.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button
                            className="text-blue-600 hover:text-blue-800"
                            title="View Details"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {referrals.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                        No referrals found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'payouts' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      User
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('amount')}
                    >
                      <div className="flex items-center">
                        Amount
                        {sortField === 'amount' && (
                          <ArrowUpDown className="h-4 w-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center">
                        Status
                        {sortField === 'status' && (
                          <ArrowUpDown className="h-4 w-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('created_at')}
                    >
                      <div className="flex items-center">
                        Created At
                        {sortField === 'created_at' && (
                          <ArrowUpDown className="h-4 w-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payouts.map((payout) => (
                    <tr key={payout.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payout.users?.email || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        £{payout.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeColor(payout.status)}`}>
                          {payout.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(payout.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          {payout.status === 'pending' && (
                            <button
                              onClick={() => handleUpdatePayoutStatus(payout.id, 'approved')}
                              className="text-blue-600 hover:text-blue-800"
                              title="Approve"
                            >
                              <CheckCircle className="h-5 w-5" />
                            </button>
                          )}
                          {payout.status === 'approved' && (
                            <button
                              onClick={() => handleUpdatePayoutStatus(payout.id, 'paid')}
                              className="text-green-600 hover:text-green-800"
                              title="Mark as Paid"
                            >
                              <DollarSign className="h-5 w-5" />
                            </button>
                          )}
                          {(payout.status === 'pending' || payout.status === 'approved') && (
                            <button
                              onClick={() => handleUpdatePayoutStatus(payout.id, 'cancelled')}
                              className="text-red-600 hover:text-red-800"
                              title="Cancel"
                            >
                              <XCircle className="h-5 w-5" />
                            </button>
                          )}
                          <button
                            className="text-gray-600 hover:text-gray-800"
                            title="View Details"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {payouts.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                        No payouts found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}