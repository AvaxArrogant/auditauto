import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface LeaderboardEntry {
  rank: number
  alias: string
  conversions: number
  earnings: number
  userId?: string // Only included for the requesting user's own entry
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

    // Get the authenticated user (optional for leaderboard viewing)
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    const payoutAmountPerReferral = 10 // £10 per conversion

    // Query to get leaderboard data
    const { data: leaderboardData, error: leaderboardError } = await supabaseClient
      .from('referrals')
      .select(`
        referrer_user_id,
        users!referrals_referrer_user_id_fkey (
          alias,
          opt_in_leaderboard
        )
      `)
      .eq('converted', true)

    if (leaderboardError) {
      throw leaderboardError
    }

    // Process the data to create leaderboard
    const referrerStats = new Map<string, {
      userId: string
      alias: string | null
      optInLeaderboard: boolean
      conversions: number
    }>()

    leaderboardData.forEach((referral: any) => {
      const userId = referral.referrer_user_id
      const userData = referral.users

      if (!userData) return

      if (referrerStats.has(userId)) {
        referrerStats.get(userId)!.conversions += 1
      } else {
        referrerStats.set(userId, {
          userId,
          alias: userData.alias,
          optInLeaderboard: userData.opt_in_leaderboard,
          conversions: 1,
        })
      }
    })

    // Filter for users who opted in to leaderboard and sort by conversions
    const leaderboard: LeaderboardEntry[] = Array.from(referrerStats.values())
      .filter(stats => stats.optInLeaderboard)
      .sort((a, b) => b.conversions - a.conversions)
      .slice(0, 10) // Top 10
      .map((stats, index) => ({
        rank: index + 1,
        alias: stats.alias || `User${stats.userId.slice(-4)}`, // Pseudonymize if no alias
        conversions: stats.conversions,
        earnings: stats.conversions * payoutAmountPerReferral,
        ...(user && user.id === stats.userId ? { userId: stats.userId } : {}), // Include userId only for own entry
      }))

    // Get current user's stats if authenticated
    let userStats = null
    if (user) {
      const userEntry = Array.from(referrerStats.values()).find(stats => stats.userId === user.id)
      if (userEntry) {
        const userRank = Array.from(referrerStats.values())
          .filter(stats => stats.optInLeaderboard)
          .sort((a, b) => b.conversions - a.conversions)
          .findIndex(stats => stats.userId === user.id) + 1

        userStats = {
          rank: userRank || null,
          conversions: userEntry.conversions,
          earnings: userEntry.conversions * payoutAmountPerReferral,
          optInLeaderboard: userEntry.optInLeaderboard,
        }
      } else {
        userStats = {
          rank: null,
          conversions: 0,
          earnings: 0,
          optInLeaderboard: false,
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        leaderboard,
        userStats,
        payoutAmountPerReferral,
        totalEntries: leaderboard.length,
        lastUpdated: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error in leaderboard:', error)
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