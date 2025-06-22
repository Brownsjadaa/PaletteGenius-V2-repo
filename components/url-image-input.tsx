"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Link, Download } from "lucide-react"
import { extractDominantColors } from "@/lib/color-extraction"

interface UrlImageInputProps {
  onImageUpload: (imageUrl: string) => void
  onColorsExtracted: (colors: string[]) => void
}

export function UrlImageInput({ onImageUpload, onColorsExtracted }: UrlImageInputProps) {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return

    setIsLoading(true)
    setError("")

    try {
      // Validate URL format
      new URL(url)

      // Check if it's an image URL (basic check)
      const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"]
      const hasImageExtension = imageExtensions.some((ext) => url.toLowerCase().includes(ext))

      if (!hasImageExtension && !url.includes("unsplash.com") && !url.includes("imgur.com")) {
        setError("Please provide a direct link to an image file")
        return
      }

      // Create a proxy URL to avoid CORS issues
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`

      onImageUpload(url)

      // Extract colors from the image
      const colors = await extractDominantColors(proxyUrl)
      onColorsExtracted(colors)
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("Invalid URL")) {
        setError("Please enter a valid URL")
      } else {
        setError("Failed to load image. Please check the URL and try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Link className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold">Load Image from URL</h3>
      </div>

      <form onSubmit={handleUrlSubmit} className="space-y-4">
        <div>
          <Input
            type="url"
            placeholder="https://example.com/image.jpg"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className={error ? "border-red-500" : ""}
          />
          {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        </div>

        <Button type="submit" disabled={isLoading || !url.trim()} className="w-full">
          {isLoading ? (
            <>
              <Download className="w-4 h-4 mr-2 animate-spin" />
              Loading Image...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Load from URL
            </>
          )}
        </Button>
      </form>

      <div className="mt-4 text-xs text-gray-500">
        <p>
          <strong>Tip:</strong> Works best with direct image links from Unsplash, Imgur, or other image hosting
          services.
        </p>
      </div>
    </Card>
  )
}
