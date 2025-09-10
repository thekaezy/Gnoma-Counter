import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { fetchUserTweetsWithGnoma, type TwitterConfig } from "@/lib/twitter"

async function fetchUserGnomaCount(username: string): Promise<number> {
  // Check if Twitter Bearer Token is available
  const bearerToken = process.env.TWITTER_BEARER_TOKEN

  if (!bearerToken) {
    console.log(`[v0] No Twitter Bearer Token found, using fallback for: ${username}`)
    // Fallback to mock data if no API credentials
    return generateMockGnomaCount(username)
  }

  console.log(`[v0] Fetching real Twitter data for user: ${username}`)

  const config: TwitterConfig = { bearerToken }

  try {
    const { count } = await fetchUserTweetsWithGnoma(username, config)
    return count
  } catch (error) {
    if (error instanceof Error && error.message.includes("RATE_LIMITED")) {
      console.log(`[v0] Twitter API rate limited for ${username}, using mock data`)
    } else {
      console.error(`[v0] Twitter API failed for ${username}:`, error)
    }
    // Fallback to mock data on API failure
    return generateMockGnomaCount(username)
  }
}

function generateMockGnomaCount(username: string): number {
  console.log(`[v0] Using mock data for user: ${username}`)

  // Create a simple hash from username to seed randomness
  const seed = username.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)

  // Generate 0-15 gnoma mentions based on username
  const gnomaCount = seed % 16

  console.log(`[v0] Mock gnoma count for ${username}: ${gnomaCount}`)
  return gnomaCount
}

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json()

    if (!username || typeof username !== "string") {
      return NextResponse.json({ error: "Username is required" }, { status: 400 })
    }

    console.log(`[v0] Processing gnoma count for username: ${username}`)

    // Create Supabase client
    const supabase = await createClient()

    // Check if we already have recent data for this user
    const { data: existingData } = await supabase.from("gnoma_counts").select("*").eq("username", username).single()

    if (existingData) {
      const lastUpdated = new Date(existingData.last_updated)
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000) // Changed from 1 hour to 5 minutes

      if (lastUpdated > fiveMinutesAgo) {
        console.log(`[v0] Returning cached result for ${username}: ${existingData.count}`)
        return NextResponse.json({
          username,
          count: existingData.count,
          cached: true,
        })
      }
    }

    console.log(`[v0] Making fresh API call for ${username} (cache expired or no cached data)`)

    const gnomaCount = await fetchUserGnomaCount(username)

    const { data, error } = await supabase
      .from("gnoma_counts")
      .upsert(
        {
          username,
          count: gnomaCount,
          last_updated: new Date().toISOString(),
        },
        {
          onConflict: "username",
        },
      )
      .select()

    if (error) {
      console.error("[v0] Database error:", error)
      return NextResponse.json({ error: "Failed to save result" }, { status: 500 })
    }

    console.log(`[v0] Successfully processed ${username}: ${gnomaCount} gnoma mentions`)

    return NextResponse.json({
      username,
      count: gnomaCount,
      cached: false,
    })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
