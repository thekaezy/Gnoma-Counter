// Twitter API integration utilities
// This file contains the structure for real Twitter API integration

export interface TwitterConfig {
  bearerToken: string
}

export interface Tweet {
  id: string
  text: string
  created_at: string
  author_id: string
}

export interface TwitterUser {
  id: string
  username: string
  name: string
}

// Real Twitter API v2 implementation would go here
export async function fetchUserTweetsReal(username: string, config: TwitterConfig): Promise<Tweet[]> {
  // This would be the actual Twitter API v2 implementation
  // Example endpoint: https://api.twitter.com/2/users/by/username/{username}/tweets

  const url = `https://api.twitter.com/2/users/by/username/${username}/tweets?max_results=100&tweet.fields=created_at`

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${config.bearerToken}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Twitter API error: ${response.status}`)
    }

    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error("Twitter API error:", error)
    throw error
  }
}

// Helper function to extract gnoma mentions from tweets
export function extractGnomaMentions(tweets: Tweet[]): {
  totalCount: number
  tweetDetails: Array<{ tweetId: string; text: string; mentions: number }>
} {
  const tweetDetails: Array<{ tweetId: string; text: string; mentions: number }> = []
  let totalCount = 0

  for (const tweet of tweets) {
    const matches = tweet.text.toLowerCase().match(/gnoma/g)
    const mentions = matches ? matches.length : 0

    if (mentions > 0) {
      tweetDetails.push({
        tweetId: tweet.id,
        text: tweet.text,
        mentions,
      })
    }

    totalCount += mentions
  }

  return { totalCount, tweetDetails }
}

export async function fetchUserTweetsWithGnoma(
  username: string,
  config: TwitterConfig,
): Promise<{ count: number; tweets: Tweet[] }> {
  // Use Twitter API v2 search endpoint to find tweets from user containing "gnoma"
  const url = `https://api.twitter.com/2/tweets/search/recent?query=from:${username} gnoma&max_results=100&tweet.fields=created_at`

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${config.bearerToken}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`User @${username} not found`)
      }
      if (response.status === 429) {
        throw new Error(`RATE_LIMITED`)
      }
      throw new Error(`Twitter API error: ${response.status}`)
    }

    const data = await response.json()

    if (data.errors) {
      throw new Error(`Twitter API error: ${data.errors[0]?.detail || "Unknown error"}`)
    }

    const tweets = data.data || []
    const count = data.meta?.result_count || 0

    console.log(`[v0] Found ${count} tweets containing 'gnoma' for @${username}`)

    return { count, tweets }
  } catch (error) {
    if (error instanceof Error && !error.message.includes("RATE_LIMITED")) {
      console.error("Twitter API error:", error)
    }
    throw error
  }
}
