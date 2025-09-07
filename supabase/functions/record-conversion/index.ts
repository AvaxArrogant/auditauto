import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RecordConversionRequest {
  referredUserId: string
  conversionValue?: number
  createPayout?: boolean
  payoutAmount?: number
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
    const { 
      referredUserId, 
      conversionValue = 0, 
      createPayout = true,
      payoutAmount = 10 // Default £10 per referral
    }: RecordConversionRequest = await req.json()

    if (!referredUserId) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required field',
          message: 'referredUserId is required'
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Find the referral record
    const { data: referralData, error: referralError } = await supabaseClient
      .from('referrals')
      .select('id, referrer_user_id, converted')
      .eq('referred_user_id', referredUserId)
      .single()

    if (referralError || !referralData) {
      return new Response(
        JSON.stringify({ 
          error: 'Referral not found',
          message: 'No referral record found for this user'
        }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Check if already converted
    if (referralData.converted) {
      return new Response(
        JSON.stringify({ 
          error: 'Already converted',
          message: 'This referral has already been marked as converted'
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Update the referral as converted
    const { error: updateError } = await supabaseClient
      .from('referrals')
      .update({
        converted: true,
        conversion_date: new Date().toISOString(),
        conversion_value: conversionValue,
      })
      .eq('id', referralData.id)

    if (updateError) {
      throw updateError
    }

    let payoutData = null

    // Create payout record if requested
    if (createPayout && payoutAmount > 0) {
      const { data: payout, error: payoutError } = await supabaseClient
        .from('payouts')
        .insert({
          user_id: referralData.referrer_user_id,
          referral_id: referralData.id,
          amount: payoutAmount,
          status: 'pending',
          notes: `Referral conversion payout for user ${referredUserId}`,
        })
        .select()
        .single()

      if (payoutError) {
        console.error('Error creating payout:', payoutError)
        // Don't fail the conversion if payout creation fails
      } else {
        payoutData = payout
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        referralId: referralData.id,
        payoutId: payoutData?.id || null,
        message: 'Conversion recorded successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error in record-conversion:', error)
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