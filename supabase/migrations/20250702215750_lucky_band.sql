/*
  # Add Admin Role to Users Table

  1. New Fields
    - `is_admin` - Boolean flag to indicate if a user has admin privileges

  2. Security
    - Update RLS policies to allow admins to view all data
    - Add new policy for admin access to user data

  3. Changes
    - Add is_admin column to users table with default false
    - Add index on is_admin column for faster queries
    - Update RLS policies to grant admins access
*/

-- Add is_admin column to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT FALSE;

-- Create index for faster admin queries
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON public.users(is_admin);

-- Add RLS policy for admins to view all users
CREATE POLICY "Admins can view all users"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM public.users WHERE is_admin = TRUE
  ));

-- Add RLS policy for admins to view all referral codes
CREATE POLICY "Admins can view all referral codes"
  ON public.referral_codes
  FOR SELECT
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM public.users WHERE is_admin = TRUE
  ));

-- Add RLS policy for admins to view all referrals
CREATE POLICY "Admins can view all referrals"
  ON public.referrals
  FOR SELECT
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM public.users WHERE is_admin = TRUE
  ));

-- Add RLS policy for admins to view all payouts
CREATE POLICY "Admins can view all payouts"
  ON public.payouts
  FOR SELECT
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM public.users WHERE is_admin = TRUE
  ));

-- Create dispute_letters table for tracking letter submissions
CREATE TABLE IF NOT EXISTS public.dispute_letters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
  ticket_number text NOT NULL,
  issue_date date NOT NULL,
  location text NOT NULL,
  vehicle_reg text NOT NULL,
  amount numeric NOT NULL,
  reason text NOT NULL,
  evidence text,
  offense_types text[] NOT NULL,
  service_level text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  letter_content text,
  admin_notes text,
  price numeric NOT NULL,
  payment_id text,
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  reviewed_by uuid REFERENCES public.users(id) ON DELETE SET NULL,
  reviewed_at timestamptz
);

-- Enable RLS on dispute_letters
ALTER TABLE public.dispute_letters ENABLE ROW LEVEL SECURITY;

-- RLS policies for dispute_letters
CREATE POLICY "Users can view their own dispute letters"
  ON public.dispute_letters
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all dispute letters"
  ON public.dispute_letters
  FOR SELECT
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM public.users WHERE is_admin = TRUE
  ));

CREATE POLICY "Admins can update dispute letters"
  ON public.dispute_letters
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM public.users WHERE is_admin = TRUE
  ));

-- Add trigger for updated_at
CREATE TRIGGER update_dispute_letters_updated_at
  BEFORE UPDATE ON public.dispute_letters
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_dispute_letters_user_id ON public.dispute_letters(user_id);
CREATE INDEX IF NOT EXISTS idx_dispute_letters_status ON public.dispute_letters(status);
CREATE INDEX IF NOT EXISTS idx_dispute_letters_payment_status ON public.dispute_letters(payment_status);
CREATE INDEX IF NOT EXISTS idx_dispute_letters_created_at ON public.dispute_letters(created_at);