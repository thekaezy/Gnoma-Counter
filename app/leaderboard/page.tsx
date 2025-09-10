"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShareButtons } from "@/components/share-buttons"

interface LeaderboardEntry {
  username: string
  count: number
  last_updated: string
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedEntry, setSelectedEntry] = useState<LeaderboardEntry | null>(null)

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/leaderboard")

      if (response.ok) {
        const data = await response.json()
        setLeaderboard(data.leaderboard)
      } else {
        setError("Failed to load leaderboard")
      }
    } catch (err) {
      setError("Error loading leaderboard")
      console.error("Leaderboard error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const getRankEmoji = (rank: number) => {
    switch (rank) {
      case 1:
        return "🥇"
      case 2:
        return "🥈"
      case 3:
        return "🥉"
      default:
        return "🏆"
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "from-yellow-400 to-yellow-600"
      case 2:
        return "from-gray-300 to-gray-500"
      case 3:
        return "from-orange-400 to-orange-600"
      default:
        return "from-green-400 to-green-600"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-300 to-yellow-300 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 pt-8">
          <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-lg">GNOMA</h1>
          <h2 className="text-2xl md:text-4xl font-bold text-gray-800">LEADERBOARD</h2>
          <p className="text-lg md:text-xl text-gray-700 font-semibold max-w-2xl mx-auto">
            The ultimate ranking of certified Gnoma Yappers across Twitter!
          </p>
          <Button
            onClick={() => (window.location.href = "/")}
            variant="outline"
            className="bg-white/90 hover:bg-white border-2 border-gray-300 font-bold text-gray-800"
          >
            ← Check Your Count
          </Button>
        </div>

        {/* Leaderboard */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-gray-800">
              Top Gnoma Yappers {leaderboard.length > 0 && `(${leaderboard.length} total)`}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🔄</div>
                <p className="text-xl font-semibold text-gray-600">Loading the yappers...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">😅</div>
                <p className="text-xl font-semibold text-gray-600 mb-4">{error}</p>
                <Button onClick={fetchLeaderboard} className="bg-green-500 hover:bg-green-600 text-white">
                  Try Again
                </Button>
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🤔</div>
                <p className="text-xl font-semibold text-gray-600 mb-2">No Gnoma Yappers yet!</p>
                <p className="text-gray-500 mb-4">Be the first to check your count and claim the top spot.</p>
                <Button
                  onClick={() => (window.location.href = "/")}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  Start Counting
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {leaderboard.map((entry, index) => {
                  const rank = index + 1
                  return (
                    <div
                      key={entry.username}
                      className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                        rank <= 3 ? "border-yellow-300 bg-yellow-50" : "border-gray-200 bg-gray-50"
                      } hover:shadow-md transition-shadow`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-full bg-gradient-to-r ${getRankColor(
                            rank,
                          )} flex items-center justify-center text-white font-bold text-lg shadow-lg`}
                        >
                          #{rank}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-gray-800">@{entry.username}</span>
                            {rank <= 3 && <span className="text-2xl">{getRankEmoji(rank)}</span>}
                          </div>
                          <p className="text-sm text-gray-500">
                            Last updated: {new Date(entry.last_updated).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-3">
                        <div>
                          <div className="text-3xl font-black text-transparent bg-gradient-to-r from-green-500 to-yellow-500 bg-clip-text">
                            {entry.count}
                          </div>
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-700 font-semibold border-green-200"
                          >
                            {entry.count === 1 ? "Gnoma" : "Gnomas"}
                          </Badge>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedEntry(entry)}
                          className="border-2 border-blue-300 hover:bg-blue-50 text-blue-600 font-semibold"
                        >
                          Share
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {selectedEntry && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="max-w-md w-full">
              <ShareButtons
                data={{
                  username: selectedEntry.username,
                  count: selectedEntry.count,
                  rank: leaderboard.findIndex((e) => e.username === selectedEntry.username) + 1,
                }}
              />
              <Button
                onClick={() => setSelectedEntry(null)}
                variant="outline"
                className="w-full mt-4 bg-white hover:bg-gray-100 border-2 border-gray-300 font-bold"
              >
                Close
              </Button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center space-y-4 pb-8">
          <p className="text-gray-700 font-semibold">Want to climb the ranks?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => (window.location.href = "/")}
              className="bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 text-white font-bold"
            >
              Check Your Count
            </Button>
            <Button
              onClick={fetchLeaderboard}
              variant="outline"
              className="bg-white/80 hover:bg-white border-2 border-gray-300 font-bold text-gray-800"
            >
              Refresh Leaderboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
