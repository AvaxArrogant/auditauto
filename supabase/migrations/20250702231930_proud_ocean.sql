/*
  # Set Admin User and Create Admin Check Function

  1. New Functions
    - `set_admin_user_by_email` - A secure function to set a user as admin by email
    - This function is designed to be run once to set up the initial admin user

  2. Security
    - Function is marked as SECURITY DEFINER to bypass RLS
    - Function returns boolean to indicate success/failure
*/

-- Create a function to set a user as admin by email
CREATE OR REPLACE FUNCTION public.set_admin_user_by_email(user_email text)
RETURNS boolean AS $$
DECLARE
  target_user_id uuid;
  success boolean := false;
BEGIN
  -- Find the user by email
  SELECT id INTO target_user_id FROM auth.users WHERE email = user_email;
  
  IF target_user_id IS NOT NULL THEN
    -- Update the is_admin flag
    UPDATE public.users SET is_admin = TRUE WHERE id = target_user_id;
    success := true;
  END IF;
  
  RETURN success;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to service_role only
GRANT EXECUTE ON FUNCTION public.set_admin_user_by_email(text) TO service_role;