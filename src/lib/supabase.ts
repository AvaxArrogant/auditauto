import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Authentication functions
export const signUp = async (email: string, password: string) => {
  console.log('🔐 supabase.ts: signUp called with email:', email);
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  console.log('🔐 supabase.ts: signUp result:', { data, error });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  console.log('🔐 supabase.ts: signIn called with email:', email);
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  console.log('🔐 supabase.ts: signIn result:', { data, error });
  return { data, error };
};

export const signOut = async () => {
  console.log('🔐 supabase.ts: signOut called');
  const { error } = await supabase.auth.signOut();
  console.log('🔐 supabase.ts: signOut result:', { error });
  return { error };
};

export const updateUserComprehensiveReportAccess = async (userId: string, hasAccess: boolean = true) => {
  console.log('🔐 supabase.ts: updateUserComprehensiveReportAccess called for userId:', userId, 'hasAccess:', hasAccess);
  try {
    const { data, error } = await supabase
      .from('users')
      .update({ has_comprehensive_report_access: hasAccess })
      .eq('id', userId)
      .select();
    
    console.log('🔐 supabase.ts: updateUserComprehensiveReportAccess result:', { data, error });
    return { data, error };
  } catch (error) {
    console.error('🔐 supabase.ts: updateUserComprehensiveReportAccess exception:', error);
    return { data: null, error };
  }
};

export const getUserReferralStats = async () => {
  console.log('📊 supabase.ts: getUserReferralStats called');
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('📊 supabase.ts: No user found');
      return { data: null, error: 'No authenticated user' };
    }

    // Get user's referral code
    const { data: referralCode, error: codeError } = await supabase
      .from('referral_codes')
      .select('code')
      .eq('user_id', user.id)
      .single();

    if (codeError && codeError.code !== 'PGRST116') {
      console.error('📊 supabase.ts: Error fetching referral code:', codeError);
    }

    // Get referral statistics
    const { data: referrals, error: referralsError } = await supabase
      .from('referrals')
      .select(`
        *,
        referred_user:users!referrals_referred_user_id_fkey(email, alias)
      `)
      .eq('referrer_user_id', user.id)
      .order('created_at', { ascending: false });

    if (referralsError) {
      console.error('📊 supabase.ts: Error fetching referrals:', referralsError);
      return { data: null, error: referralsError };
    }

    // Get payout statistics
    const { data: payouts, error: payoutsError } = await supabase
      .from('payouts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (payoutsError) {
      console.error('📊 supabase.ts: Error fetching payouts:', payoutsError);
      return { data: null, error: payoutsError };
    }

    // Calculate statistics
    const totalReferrals = referrals?.length || 0;
    const convertedReferrals = referrals?.filter(r => r.converted).length || 0;
    const conversionRate = totalReferrals > 0 ? (convertedReferrals / totalReferrals) * 100 : 0;
    
    const totalEarnings = payouts?.reduce((sum, payout) => sum + Number(payout.amount), 0) || 0;
    const pendingEarnings = payouts?.filter(p => p.status === 'pending').reduce((sum, payout) => sum + Number(payout.amount), 0) || 0;
    const paidEarnings = payouts?.filter(p => p.status === 'paid').reduce((sum, payout) => sum + Number(payout.amount), 0) || 0;

    const stats = {
      referralCode: referralCode?.code || null,
      totalReferrals,
      convertedReferrals,
      conversionRate: Math.round(conversionRate * 100) / 100,
      totalEarnings,
      pendingEarnings,
      paidEarnings,
      recentReferrals: referrals?.slice(0, 10) || [],
      recentPayouts: payouts?.slice(0, 10) || []
    };

    console.log('📊 supabase.ts: getUserReferralStats result:', stats);
    return { data: stats, error: null };
  } catch (error) {
    console.error('📊 supabase.ts: Exception in getUserReferralStats:', error);
    return { data: null, error };
  }
};
// Profile functions
export const getUserProfile = async (userId: string) => {
  console.log('👤 supabase.ts: getUserProfile called for userId:', userId);
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  
  console.log('👤 supabase.ts: getUserProfile result:', { data, error });
  return { data, error };
};

export const updateUserProfile = async (userId: string, updates: any) => {
  console.log('👤 supabase.ts: updateUserProfile called for userId:', userId, 'with updates:', updates);
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  
  console.log('👤 supabase.ts: updateUserProfile result:', { data, error });
  return { data, error };
};

export const checkUserAdminStatus = async () => {
  console.log('👑 supabase.ts: checkUserAdminStatus called');
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('👑 supabase.ts: No user found');
      return false;
    }

    console.log('👑 supabase.ts: User found, checking admin status for:', user.id);

    // Add timeout to prevent hanging requests
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Admin status check timeout')), 5000);
    });

    const queryPromise = supabase
      .from('users')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    console.log('👑 supabase.ts: Starting database query for admin status...');
    const { data, error } = await Promise.race([queryPromise, timeoutPromise]) as any;

    if (error) {
      console.error('👑 supabase.ts: Error checking admin status:', error);
      // If it's a timeout or connection error, return false instead of throwing
      if (error.message?.includes('timeout') || error.code === 'PGRST301') {
        console.warn('👑 supabase.ts: Admin check timed out or connection failed, defaulting to false');
        return false;
      }
      return false;
    }

    const isAdmin = data?.is_admin || false;
    console.log('👑 supabase.ts: Admin status result:', isAdmin);
    return isAdmin;
  } catch (error) {
    console.error('👑 supabase.ts: Exception in checkUserAdminStatus:', error);
    // Always return false on any error to prevent blocking the app
    return false;
  }
};

// Referral functions
export const generateReferralCode = async () => {
  console.log('🔗 supabase.ts: generateReferralCode called');
  try {
    const { data, error } = await supabase.functions.invoke('generate-referral-code');
    console.log('🔗 supabase.ts: generateReferralCode result:', { data, error });
    return { data, error };
  } catch (error) {
    console.error('🔗 supabase.ts: generateReferralCode exception:', error);
    return { data: null, error };
  }
};

export const trackReferral = async (referralCode: string, newUserId: string) => {
  console.log('🔗 supabase.ts: trackReferral called with code:', referralCode, 'for user:', newUserId);
  try {
    const { data, error } = await supabase.functions.invoke('track-referral', {
      body: { referralCode, newUserId }
    });
    console.log('🔗 supabase.ts: trackReferral result:', { data, error });
    return { data, error };
  } catch (error) {
    console.error('🔗 supabase.ts: trackReferral exception:', error);
    return { data: null, error };
  }
};

export const recordConversion = async (userId: string, conversionValue: number) => {
  console.log('🔗 supabase.ts: recordConversion called for user:', userId, 'value:', conversionValue);
  try {
    const { data, error } = await supabase.functions.invoke('record-conversion', {
      body: { userId, conversionValue }
    });
    console.log('🔗 supabase.ts: recordConversion result:', { data, error });
    return { data, error };
  } catch (error) {
    console.error('🔗 supabase.ts: recordConversion exception:', error);
    return { data: null, error };
  }
};

export const getLeaderboard = async () => {
  console.log('🏆 supabase.ts: getLeaderboard called');
  try {
    const { data, error } = await supabase.functions.invoke('leaderboard');
    console.log('🏆 supabase.ts: getLeaderboard result:', { data, error });
    return { data, error };
  } catch (error) {
    console.error('🏆 supabase.ts: getLeaderboard exception:', error);
    return { data: null, error };
  }
};

// Stripe functions
export const createStripeCheckoutSession = async ({
  amount,
  productName,
  submission_id,
  customerEmail,
  quantity = 1,
  productType,
  service_level,
}: {
  amount: number;
  productName: string;
  submission_id: string;
  customerEmail?: string;
  quantity?: number;
  productType?: 'dispute_letter' | 'comprehensive_report';
  service_level?: string;
}) => {
  console.log('💳 supabase.ts: createStripeCheckoutSession called with:', {
    amount, productName, submission_id, customerEmail, quantity, service_level, productType
  });

  try {
    const { data, error } = await supabase.functions.invoke('create-stripe-checkout-session', {
      body: {
        amount,
        productName,
        submission_id,
        customerEmail,
        quantity,
        service_level,
        productType,
      }
    });

    console.log('💳 supabase.ts: createStripeCheckoutSession result:', { data, error });
    return { data, error };
  } catch (error) {
    console.error('💳 supabase.ts: createStripeCheckoutSession exception:', error);
    return { data: null, error };
  }
};


// Dispute letters functions
export const getDisputeLetters = async () => {
  console.log('📝 supabase.ts: getDisputeLetters called');
  const { data, error } = await supabase
    .from('dispute_letters')
    .select('*')
    .order('created_at', { ascending: false });
  
  console.log('📝 supabase.ts: getDisputeLetters result:', { data, error });
  return { data, error };
};

export const createDisputeLetter = async (disputeData: any) => {
  console.log('📝 supabase.ts: createDisputeLetter called with data:', disputeData);
  const { data, error } = await supabase
    .from('dispute_letters')  // Table name
    .insert([disputeData])    // Data to insert
    .select()                 // Return the inserted data
    .single();                // Return a single object instead of an array
  
  console.log('📝 supabase.ts: createDisputeLetter result:', { data, error });
  return { data, error };
};

export const updateDisputeLetter = async (id: string, updates: any) => {
  console.log('📝 supabase.ts: updateDisputeLetter called for id:', id, 'with updates:', updates);
  const { data, error } = await supabase
    .from('dispute_letters')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  console.log('📝 supabase.ts: updateDisputeLetter result:', { data, error });
  return { data, error };
};

export const deleteDisputeLetter = async (id: string) => {
  console.log('📝 supabase.ts: deleteDisputeLetter called for id:', id);
  const { error } = await supabase
    .from('dispute_letters')
    .delete()
    .eq('id', id);
  
  console.log('📝 supabase.ts: deleteDisputeLetter result:', { error });
  return { error };
};