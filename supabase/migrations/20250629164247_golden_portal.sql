/*
  # Referral System Database Schema

  1. New Tables
    - `users` - Extended user profile data with referral settings
    - `referral_codes` - Unique referral codes for each user
    - `referrals` - Tracks referral relationships and conversions
    - `payouts` - Manages referral rewards and payments

  2. Security
    - Enable RLS on all tables
    - Add policies for user data access and privacy
    - Ensure users can only access their own data

  3. Functions
    - Trigger to create user profile on auth signup
    - Function to generate unique referral codes
*/

-- Create users table for extended profile data
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  alias text UNIQUE,
  opt_in_leaderboard boolean DEFAULT FALSE,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create referral_codes table
CREATE TABLE IF NOT EXISTS public.referral_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  code text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create referrals table
CREATE TABLE IF NOT EXISTS public.referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  referred_user_id uuid UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  converted boolean DEFAULT FALSE,
  conversion_date timestamptz,
  conversion_value numeric DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create payouts table
CREATE TABLE IF NOT EXISTS public.payouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  referral_id uuid REFERENCES public.referrals(id) ON DELETE CASCADE,
  amount numeric NOT NULL CHECK (amount > 0),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'cancelled')),
  notes text,
  created_at timestamptz DEFAULT now() NOT NULL,
  approved_at timestamptz,
  paid_at timestamptz
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can view public leaderboard data" ON public.users;
DROP POLICY IF EXISTS "Users can view their own referral code" ON public.referral_codes;
DROP POLICY IF EXISTS "Users can insert their own referral code" ON public.referral_codes;
DROP POLICY IF EXISTS "Users can view referrals they made" ON public.referrals;
DROP POLICY IF EXISTS "Users can view referrals where they were referred" ON public.referrals;
DROP POLICY IF EXISTS "System can insert referrals" ON public.referrals;
DROP POLICY IF EXISTS "System can update referral conversions" ON public.referrals;
DROP POLICY IF EXISTS "Users can view their own payouts" ON public.payouts;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view public leaderboard data"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (opt_in_leaderboard = true);

-- RLS Policies for referral_codes table
CREATE POLICY "Users can view their own referral code"
  ON public.referral_codes
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own referral code"
  ON public.referral_codes
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for referrals table
CREATE POLICY "Users can view referrals they made"
  ON public.referrals
  FOR SELECT
  TO authenticated
  USING (referrer_user_id = auth.uid());

CREATE POLICY "Users can view referrals where they were referred"
  ON public.referrals
  FOR SELECT
  TO authenticated
  USING (referred_user_id = auth.uid());

CREATE POLICY "System can insert referrals"
  ON public.referrals
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "System can update referral conversions"
  ON public.referrals
  FOR UPDATE
  TO authenticated
  USING (true);

-- RLS Policies for payouts table
CREATE POLICY "Users can view their own payouts"
  ON public.payouts
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to generate unique referral code
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS text AS $$
DECLARE
  new_code text;
  code_exists boolean;
BEGIN
  LOOP
    -- Generate a random 8-character code
    new_code := upper(substring(md5(random()::text) from 1 for 8));
    
    -- Check if code already exists using table alias to avoid ambiguity
    SELECT EXISTS(
      SELECT 1 FROM public.referral_codes rc WHERE rc.code = new_code
    ) INTO code_exists;
    
    -- If code doesn't exist, return it
    IF NOT code_exists THEN
      RETURN new_code;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_referrals_updated_at ON public.referrals;
CREATE TRIGGER update_referrals_updated_at
  BEFORE UPDATE ON public.referrals
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_referral_codes_user_id ON public.referral_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_referral_codes_code ON public.referral_codes(code);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON public.referrals(referrer_user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred ON public.referrals(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_converted ON public.referrals(converted);
CREATE INDEX IF NOT EXISTS idx_payouts_user_id ON public.payouts(user_id);
CREATE INDEX IF NOT EXISTS idx_payouts_status ON public.payouts(status);