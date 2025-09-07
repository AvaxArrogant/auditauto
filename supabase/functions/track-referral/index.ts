import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TrackReferralRequest {
  referralCode: string
  referredUserId: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Parse request body
    const { referralCode, referredUserId }: TrackReferralRequest = await req.json()

    if (!referralCode || !referredUserId) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields',
          message: 'referralCode and referredUserId are required'
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Find the referrer by referral code
    const { data: referralCodeData, error: codeError } = await supabaseClient
      .from('referral_codes')
      .select('user_id')
      .eq('code', referralCode.toUpperCase())
      .single()

    if (codeError || !referralCodeData) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid referral code',
          message: 'The provided referral code does not exist'
        }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const referrerUserId = referralCodeData.user_id

    // Prevent self-referrals
    if (referrerUserId === referredUserId) {
      return new Response(
        JSON.stringify({ 
          error: 'Self-referral not allowed',
          message: 'Users cannot refer themselves'
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Check if the referred user already has a referral record
    const { data: existingReferral, error: existingError } = await supabaseClient
      .from('referrals')
      .select('id')
      .eq('referred_user_id', referredUserId)
      .single()

    if (existingError && existingError.code !== 'PGRST116') {
      throw existingError
    }

    if (existingReferral) {
      return new Response(
        JSON.stringify({ 
          error: 'User already referred',
          message: 'This user has already been referred by someone else'
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Create the referral record
    const { data: referralData, error: referralError } = await supabaseClient
      .from('referrals')
      .insert({
        referrer_user_id: referrerUserId,
        referred_user_id: referredUserId,
      })
      .select()
      .single()

    if (referralError) {
      throw referralError
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        referralId: referralData.id,
        message: 'Referral tracked successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error in track-referral:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})