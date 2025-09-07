/*
  # Admin Access Policies

  1. New Policies
    - Add admin policies for all tables (users, referral_codes, referrals, payouts, dispute_letters)
    - Ensure admins can perform all operations (select, insert, update, delete)
    
  2. Functions
    - Add utility function to set a user as admin
*/

-- Make sure admins can update users table
CREATE POLICY "Admins can update users"
  ON public.users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM public.users WHERE is_admin = TRUE
  ));

-- Make sure admins can insert into users table
CREATE POLICY "Admins can insert users"
  ON public.users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IN (
    SELECT id FROM public.users WHERE is_admin = TRUE
  ));

-- Make sure admins can delete from users table
CREATE POLICY "Admins can delete users"
  ON public.users
  FOR DELETE
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM public.users WHERE is_admin = TRUE
  ));

-- Make sure admins can update referral_codes table
CREATE POLICY "Admins can update referral codes"
  ON public.referral_codes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM public.users WHERE is_admin = TRUE
  ));

-- Make sure admins can insert into referral_codes table
CREATE POLICY "Admins can insert referral codes"
  ON public.referral_codes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IN (
    SELECT id FROM public.users WHERE is_admin = TRUE
  ));

-- Make sure admins can delete from referral_codes table
CREATE POLICY "Admins can delete referral codes"
  ON public.referral_codes
  FOR DELETE
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM public.users WHERE is_admin = TRUE
  ));

-- Make sure admins can update referrals table
CREATE POLICY "Admins can update referrals"
  ON public.referrals
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM public.users WHERE is_admin = TRUE
  ));

-- Make sure admins can insert into referrals table
CREATE POLICY "Admins can insert referrals"
  ON public.referrals
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IN (
    SELECT id FROM public.users WHERE is_admin = TRUE
  ));

-- Make sure admins can delete from referrals table
CREATE POLICY "Admins can delete referrals"
  ON public.referrals
  FOR DELETE
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM public.users WHERE is_admin = TRUE
  ));

-- Make sure admins can update payouts table
CREATE POLICY "Admins can update payouts"
  ON public.payouts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM public.users WHERE is_admin = TRUE
  ));

-- Make sure admins can insert into payouts table
CREATE POLICY "Admins can insert payouts"
  ON public.payouts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IN (
    SELECT id FROM public.users WHERE is_admin = TRUE
  ));

-- Make sure admins can delete from payouts table
CREATE POLICY "Admins can delete payouts"
  ON public.payouts
  FOR DELETE
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM public.users WHERE is_admin = TRUE
  ));

-- Make sure admins can insert into dispute_letters table
CREATE POLICY "Admins can insert dispute letters"
  ON public.dispute_letters
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IN (
    SELECT id FROM public.users WHERE is_admin = TRUE
  ));

-- Make sure admins can delete from dispute_letters table
CREATE POLICY "Admins can delete dispute letters"
  ON public.dispute_letters
  FOR DELETE
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM public.users WHERE is_admin = TRUE
  ));

-- Function to set a user as admin
CREATE OR REPLACE FUNCTION public.set_user_admin(user_email text, is_admin_value boolean)
RETURNS boolean AS $$
DECLARE
  user_id uuid;
  success boolean := false;
BEGIN
  -- Find the user by email
  SELECT id INTO user_id FROM auth.users WHERE email = user_email;
  
  IF user_id IS NOT NULL THEN
    -- Update the is_admin flag
    UPDATE public.users SET is_admin = is_admin_value WHERE id = user_id;
    success := true;
  END IF;
  
  RETURN success;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;