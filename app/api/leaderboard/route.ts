import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] Fetching leaderboard data")

    // Create Supabase client
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("gnoma_counts")
      .select("username, count, last_updated")
      .order("count", { ascending: false })
      .limit(50)

    if (error) {
      console.error("[v0] Database error:", error)
      return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 })
    }

    console.log(`[v0] Successfully fetched ${data?.length || 0} leaderboard entries`)

    return NextResponse.json({
      leaderboard: data || [],
      total: data?.length || 0,
    })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
