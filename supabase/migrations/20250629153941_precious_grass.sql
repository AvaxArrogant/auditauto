/*
  # Fix ambiguous column reference in generate_referral_code function

  1. Changes
    - Update the generate_referral_code function to explicitly qualify the column reference
    - Change the EXISTS query to use referral_codes.code instead of just code

  2. Security
    - No security changes needed
*/

-- Function to generate unique referral code (fixed version)
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS text AS $$
DECLARE
  code text;
  exists boolean;
BEGIN
  LOOP
    -- Generate a random 8-character code
    code := upper(substring(md5(random()::text) from 1 for 8));
    
    -- Check if code already exists (fixed ambiguous reference)
    SELECT EXISTS(SELECT 1 FROM public.referral_codes WHERE referral_codes.code = code) INTO exists;
    
    -- If code doesn't exist, return it
    IF NOT exists THEN
      RETURN code;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;