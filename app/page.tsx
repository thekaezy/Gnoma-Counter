"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

export default function HomePage() {
  const [username, setUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ username: string; count: number } | null>(null)

  const getGnomaTitle = (username: string): string => {
    const cleanUsername = username.toLowerCase().replace("@", "")

    // Special titles for specific users
    const specialTitles: { [key: string]: string } = {
      thekerukeion: "Certified Gnoma Heliax",
      adrianbrink: "Certified Gnoma Ceo",
      aisdordefi: "Certified Gnoma mod",
      thekaezy: "Certified Gnoma Web Creator",
      unicorn_ib: "Certified Gnoma Queen",
      prateekhh: "Certified Gnoma Mod",
      sand32121: "Certified Gnoma Mod",
      imbu30098217: "Certified Gnoma Mod",
    }

    if (specialTitles[cleanUsername]) {
      return specialTitles[cleanUsername]
    }

    // General titles for other users
    const generalTitles = [
      "Certified Gnoma Yapper!",
      "Certified Gnoma Intent",
      "Certified Gnoma Mage",
      "Certified Gnoma Master",
      "Certified Gnoma Grandmaster",
      "Certified Gnoma Intent leader",
      "Certified Gnoma Seeker",
      "Certified Gnoma Apprentice",
      "Certified Gnoma Acolyte",
      "Certified Gnoma Builder",
      "Certified Gnoma Intent mage",
    ]

    // Use username length to determine which title to use for consistency
    const titleIndex = cleanUsername.length % generalTitles.length
    return generalTitles[titleIndex]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim()) return

    setIsLoading(true)

    // Simulate loading for better UX
    setTimeout(() => {
      setResult({
        username: username.replace("@", ""),
        count: 69,
      })
      setIsLoading(false)
    }, 1500)
  }

  const handleShare = () => {
    if (!result) return

    const gnomaTitle = getGnomaTitle(result.username)
    const shareText = `I've said "gnoma" ${result.count} times on Twitter! I'm a ${gnomaTitle} 🗣️ Check your count at ${window.location.origin} created by https://x.com/TheKaezy`

    if (navigator.share) {
      navigator
        .share({
          title: "My Gnoma Count",
          text: shareText,
          url: window.location.origin,
        })
        .catch(() => {
          // Fallback to Twitter if native sharing fails
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, "_blank")
        })
    } else {
      // Fallback to Twitter
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, "_blank")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-green-500 to-teal-500 flex items-center justify-center p-4 relative">
      <div className="fixed top-4 right-4 z-10">
        <a
          href="https://x.com/TheKaezy"
          target="_blank"
          rel="noopener noreferrer"
          className="text-black hover:text-gray-700 text-sm font-semibold tracking-wider hover:scale-105 transition-all duration-200"
        >
          created by @thekaezy
        </a>
      </div>

      <div className="w-full max-w-2xl text-center space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-black text-white drop-shadow-2xl">GNOMA</h1>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-100 drop-shadow-lg">COUNTER</h2>
          <p className="text-xl md:text-2xl text-gray-200 font-semibold max-w-lg mx-auto drop-shadow-md">
            {'Find out how many times you\'ve said "gnoma" on Twitter!'}
          </p>
        </div>

        {/* Main Card */}
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
          <CardContent className="p-8 space-y-6">
            {!result ? (
              <>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="username" className="text-lg font-bold text-gray-800 block">
                      Enter your Twitter username
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg font-semibold">
                        @
                      </span>
                      <Input
                        id="username"
                        type="text"
                        placeholder="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="pl-8 h-14 text-lg font-semibold border-2 border-gray-300 focus:border-green-500"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading || !username.trim()}
                    className="w-full h-14 text-xl font-bold bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 text-white border-0 shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    {isLoading ? "COUNTING GNOMAS..." : "COUNT MY GNOMAS!"}
                  </Button>
                </form>

                <div className="text-center space-y-2">
                  <p className="text-gray-600 font-medium">
                    {'We\'ll analyze your recent tweets and count every "gnoma" mention!'}
                  </p>
                  <p className="text-sm text-gray-500">No login required • Safe & secure • Just for fun!</p>
                </div>
              </>
            ) : (
              <div className="space-y-6">
                <div className="text-center space-y-4">
                  <div className="text-6xl">🗣️</div>
                  <h3 className="text-3xl font-black text-gray-800">@{result.username} has said</h3>
                  <div className="text-8xl font-black text-transparent bg-gradient-to-r from-green-500 to-yellow-500 bg-clip-text">
                    {result.count}
                  </div>
                  <h3 className="text-3xl font-black text-gray-800">times</h3>
                  <div className="text-2xl font-bold text-green-600 bg-green-100 rounded-full px-6 py-3 inline-block">
                    {getGnomaTitle(result.username)}
                  </div>
                </div>

                <div className="space-y-4">
                  <Button
                    onClick={handleShare}
                    className="w-full h-14 text-xl font-bold bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 text-white border-0 shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    🚀 Share
                  </Button>
                  <p className="text-gray-600 font-medium">Help spread the Gnoma love!</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={() => {
                      setResult(null)
                      setUsername("")
                    }}
                    variant="outline"
                    className="flex-1 h-12 text-lg font-bold border-2 border-gray-300 hover:bg-gray-100"
                  >
                    Check Another
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
