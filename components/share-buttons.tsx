"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  shareToTwitter,
  shareToFacebook,
  shareToLinkedIn,
  copyToClipboard,
  shareNative,
  type ShareData,
} from "@/lib/social-sharing"

interface ShareButtonsProps {
  data: ShareData
  className?: string
}

export function ShareButtons({ data, className = "" }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = async () => {
    try {
      await copyToClipboard(data)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  return (
    <Card className={`bg-white/90 backdrop-blur-sm border-0 shadow-lg ${className}`}>
      <CardContent className="p-4 space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Share Your Results!</h3>
          <p className="text-sm text-gray-600">Let everyone know about your Gnoma Yapper status</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => shareToTwitter(data)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold"
          >
            <span className="mr-2">🐦</span>
            Twitter
          </Button>

          <Button
            onClick={() => shareToFacebook(data)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          >
            <span className="mr-2">📘</span>
            Facebook
          </Button>

          <Button
            onClick={() => shareToLinkedIn(data)}
            className="bg-blue-700 hover:bg-blue-800 text-white font-semibold"
          >
            <span className="mr-2">💼</span>
            LinkedIn
          </Button>

          <Button
            onClick={handleCopyLink}
            variant="outline"
            className="border-2 border-gray-300 hover:bg-gray-100 font-semibold bg-transparent"
          >
            <span className="mr-2">{copied ? "✅" : "📋"}</span>
            {copied ? "Copied!" : "Copy Link"}
          </Button>
        </div>

        {/* Native sharing for mobile */}
        {typeof navigator !== "undefined" && navigator.share && (
          <Button
            onClick={() => {
              try {
                shareNative(data)
              } catch (error) {
                console.log("[v0] Share button error, falling back to Twitter")
                shareToTwitter(data)
              }
            }}
            className="w-full bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 text-white font-bold"
          >
            <span className="mr-2">📱</span>
            Share
          </Button>
        )}

        <div className="text-center">
          <Badge variant="secondary" className="bg-green-100 text-green-700 font-semibold">
            Help spread the Gnoma love!
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
