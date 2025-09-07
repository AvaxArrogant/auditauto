/*
  # Fix Infinite Recursion in RLS Policies

  1. New Functions
    - `is_admin_user` - A SECURITY DEFINER function to safely check admin status
    - This function bypasses RLS when checking admin status, preventing recursion

  2. Changes
    - Drop all problematic RLS policies that use recursive subqueries
    - Create new policies that use the is_admin_user function instead
    - Fix policies on all tables: dispute_letters, referral_codes, referrals, payouts

  3. Security
    - Maintain same security model but implement it without recursion
    - SECURITY DEFINER function runs with elevated privileges to bypass RLS
*/

-- Create a SECURITY DEFINER function to check if a user is an admin
-- This function runs with the privileges of the creator (postgres)
-- and bypasses RLS, preventing the infinite recursion
CREATE OR REPLACE FUNCTION public.is_admin_user(user_id uuid)
RETURNS boolean AS $$
DECLARE
  is_admin boolean;
BEGIN
  -- Direct query to users table, bypassing RLS
  SELECT u.is_admin INTO is_admin
  FROM public.users u
  WHERE u.id = user_id;
  
  -- Return false if user not found or is_admin is null
  RETURN COALESCE(is_admin, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop all problematic policies that cause recursion
-- dispute_letters table
DROP POLICY IF EXISTS "Admins can view all dispute letters" ON public.dispute_letters;
DROP POLICY IF EXISTS "Admins can update dispute letters" ON public.dispute_letters;
DROP POLICY IF EXISTS "Admins can insert dispute letters" ON public.dispute_letters;
DROP POLICY IF EXISTS "Admins can delete dispute letters" ON public.dispute_letters;

-- referral_codes table
DROP POLICY IF EXISTS "Admins can view all referral codes" ON public.referral_codes;
DROP POLICY IF EXISTS "Admins can update referral codes" ON public.referral_codes;
DROP POLICY IF EXISTS "Admins can insert referral codes" ON public.referral_codes;
DROP POLICY IF EXISTS "Admins can delete referral codes" ON public.referral_codes;

-- referrals table
DROP POLICY IF EXISTS "Admins can view all referrals" ON public.referrals;
DROP POLICY IF EXISTS "Admins can update referrals" ON public.referrals;
DROP POLICY IF EXISTS "Admins can insert referrals" ON public.referrals;
DROP POLICY IF EXISTS "Admins can delete referrals" ON public.referrals;

-- payouts table
DROP POLICY IF EXISTS "Admins can view all payouts" ON public.payouts;
DROP POLICY IF EXISTS "Admins can update payouts" ON public.payouts;
DROP POLICY IF EXISTS "Admins can insert payouts" ON public.payouts;
DROP POLICY IF EXISTS "Admins can delete payouts" ON public.payouts;

-- Create new policies using the is_admin_user function
-- dispute_letters table
CREATE POLICY "Admins can view all dispute letters"
  ON public.dispute_letters
  FOR SELECT
  TO authenticated
  USING (is_admin_user(auth.uid()));

CREATE POLICY "Admins can update dispute letters"
  ON public.dispute_letters
  FOR UPDATE
  TO authenticated
  USING (is_admin_user(auth.uid()));

CREATE POLICY "Admins can insert dispute letters"
  ON public.dispute_letters
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin_user(auth.uid()));

CREATE POLICY "Admins can delete dispute letters"
  ON public.dispute_letters
  FOR DELETE
  TO authenticated
  USING (is_admin_user(auth.uid()));

-- referral_codes table
CREATE POLICY "Admins can view all referral codes"
  ON public.referral_codes
  FOR SELECT
  TO authenticated
  USING (is_admin_user(auth.uid()));

CREATE POLICY "Admins can update referral codes"
  ON public.referral_codes
  FOR UPDATE
  TO authenticated
  USING (is_admin_user(auth.uid()));

CREATE POLICY "Admins can insert referral codes"
  ON public.referral_codes
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin_user(auth.uid()));

CREATE POLICY "Admins can delete referral codes"
  ON public.referral_codes
  FOR DELETE
  TO authenticated
  USING (is_admin_user(auth.uid()));

-- referrals table
CREATE POLICY "Admins can view all referrals"
  ON public.referrals
  FOR SELECT
  TO authenticated
  USING (is_admin_user(auth.uid()));

CREATE POLICY "Admins can update referrals"
  ON public.referrals
  FOR UPDATE
  TO authenticated
  USING (is_admin_user(auth.uid()));

CREATE POLICY "Admins can insert referrals"
  ON public.referrals
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin_user(auth.uid()));

CREATE POLICY "Admins can delete referrals"
  ON public.referrals
  FOR DELETE
  TO authenticated
  USING (is_admin_user(auth.uid()));

-- payouts table
CREATE POLICY "Admins can view all payouts"
  ON public.payouts
  FOR SELECT
  TO authenticated
  USING (is_admin_user(auth.uid()));

CREATE POLICY "Admins can update payouts"
  ON public.payouts
  FOR UPDATE
  TO authenticated
  USING (is_admin_user(auth.uid()));

CREATE POLICY "Admins can insert payouts"
  ON public.payouts
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin_user(auth.uid()));

CREATE POLICY "Admins can delete payouts"
  ON public.payouts
  FOR DELETE
  TO authenticated
  USING (is_admin_user(auth.uid()));