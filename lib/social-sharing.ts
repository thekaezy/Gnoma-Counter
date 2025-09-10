// Social sharing utilities for the Gnoma Counter app

export interface ShareData {
  username: string
  count: number
  rank?: number
}

export function generateShareText(data: ShareData): string {
  const { username, count, rank } = data

  if (count === 0) {
    return `I checked my Gnoma count and... 😅 I haven't said "gnoma" yet! Time to start yapping! Check yours at`
  }

  if (count === 1) {
    return `@${username} has said Gnoma 1 time. Starting the Gnoma journey! 🗣️ Check your count at`
  }

  if (rank && rank <= 3) {
    const medals = { 1: "🥇", 2: "🥈", 3: "🥉" }
    return `@${username} has said Gnoma ${count} times and is ranked #${rank} ${medals[rank as keyof typeof medals]} on the leaderboard! Certified Gnoma Yapper! 🗣️ Check your count at`
  }

  if (count >= 50) {
    return `@${username} has said Gnoma ${count} times! ULTIMATE GNOMA YAPPER! 🔥🗣️ This is legendary! Check your count at`
  }

  if (count >= 20) {
    return `@${username} has said Gnoma ${count} times! MEGA Gnoma Yapper! 🗣️💪 Check your count at`
  }

  if (count >= 10) {
    return `@${username} has said Gnoma ${count} times! Certified Gnoma Yapper! 🗣️ Check your count at`
  }

  return `@${username} has said Gnoma ${count} times. Getting into Gnoma Yapper territory! 🗣️ Check your count at`
}

export function shareToTwitter(data: ShareData, appUrl: string = window.location.origin): void {
  const text = generateShareText(data)
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(appUrl)}`
  window.open(url, "_blank", "width=550,height=420")
}

export function shareToFacebook(data: ShareData, appUrl: string = window.location.origin): void {
  const text = generateShareText(data)
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(appUrl)}&quote=${encodeURIComponent(text)}`
  window.open(url, "_blank", "width=550,height=420")
}

export function shareToLinkedIn(data: ShareData, appUrl: string = window.location.origin): void {
  const text = generateShareText(data)
  const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(appUrl)}&summary=${encodeURIComponent(text)}`
  window.open(url, "_blank", "width=550,height=420")
}

export function copyToClipboard(data: ShareData, appUrl: string = window.location.origin): Promise<void> {
  const text = `${generateShareText(data)} ${appUrl}`
  return navigator.clipboard.writeText(text)
}

export function shareNative(data: ShareData, appUrl: string = window.location.origin): void {
  if (navigator.share) {
    const text = generateShareText(data)
    navigator
      .share({
        title: "Gnoma Counter Results",
        text: text,
        url: appUrl,
      })
      .catch((error) => {
        console.log("[v0] Native sharing failed, falling back to Twitter:", error.message)
        shareToTwitter(data, appUrl)
      })
  } else {
    shareToTwitter(data, appUrl)
  }
}
