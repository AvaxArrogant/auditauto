import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    // Get the authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Check if user already has a referral code
    const { data: existingCode, error: fetchError } = await supabaseClient
      .from('referral_codes')
      .select('code')
      .eq('user_id', user.id)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError
    }

    // If user already has a code, return it
    if (existingCode) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          code: existingCode.code,
          message: 'Existing referral code retrieved'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Generate a new unique referral code
    const { data: newCodeData, error: generateError } = await supabaseClient
      .rpc('generate_referral_code')

    if (generateError) {
      throw generateError
    }

    const newCode = newCodeData as string

    // Insert the new referral code
    const { error: insertError } = await supabaseClient
      .from('referral_codes')
      .insert({
        user_id: user.id,
        code: newCode,
      })

    if (insertError) {
      throw insertError
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        code: newCode,
        message: 'New referral code generated'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error in generate-referral-code:', error)
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