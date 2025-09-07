/*
  # Fix ambiguous column reference in generate_referral_code function

  1. Changes
    - Update the generate_referral_code function to use a table alias
    - This eliminates any potential ambiguity between the local variable 'code' and the column 'code'

  2. Security
    - No security changes needed
*/

-- Function to generate unique referral code (fixed ambiguity issue)
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