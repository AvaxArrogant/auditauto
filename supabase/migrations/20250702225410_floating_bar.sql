/*
  # Fix Admin Status Recursion in RLS Policies

  1. New Functions
    - `get_user_admin_status` - A secure RPC function to check admin status without triggering RLS recursion
    - Uses the existing `is_admin_user` function internally

  2. Security
    - Function is marked as SECURITY DEFINER to bypass RLS
    - Function only returns boolean result to minimize data exposure

  3. Purpose
    - Provides a safe way for client applications to check admin status
    - Eliminates infinite recursion when checking admin status
*/

-- Create a secure RPC function to check admin status
CREATE OR REPLACE FUNCTION public.get_user_admin_status()
RETURNS boolean AS $$
DECLARE
  is_admin boolean;
BEGIN
  -- Use the existing is_admin_user function with the current user's ID
  RETURN is_admin_user(auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_user_admin_status() TO authenticated;