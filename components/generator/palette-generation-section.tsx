"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Copy, Check, Heart, Info, Download, Share2, FileText, Code, Palette } from "lucide-react"
import { AccessibilityChecker } from "@/components/accessibility-checker"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

interface PaletteGenerationSectionProps {
  palettes: any[]
  dominantColor: string | null
  isActive: boolean
  user?: User | null
}

export function PaletteGenerationSection({ palettes, dominantColor, isActive, user }: PaletteGenerationSectionProps) {
  const [copiedColor, setCopiedColor] = useState<string | null>(null)
  const [favoritePalettes, setFavoritePalettes] = useState<Set<string>>(new Set())
  const [publishingPalette, setPublishingPalette] = useState<string | null>(null)
  const [selectedTheory, setSelectedTheory] = useState<string | null>(null)
  const { toast } = useToast()

  const copyToClipboard = async (color: string) => {
    try {
      await navigator.clipboard.writeText(color)
      setCopiedColor(color)
      toast({
        title: "Color copied!",
        description: `${color} copied to clipboard`,
      })
      setTimeout(() => setCopiedColor(null), 2000)
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy color to clipboard",
        variant: "destructive",
      })
    }
  }

  const copyFormat = async (palette: any, format: string) => {
    let content = ""
    let formatName = ""

    switch (format) {
      case "hex":
        content = palette.colors.join(", ")
        formatName = "HEX"
        break
      case "css":
        content = `:root {
${palette.colors.map((color: string, index: number) => `  --color-${index + 1}: ${color};`).join("\n")}
}

/* Usage Examples */
.primary { background-color: var(--color-1); }
.secondary { background-color: var(--color-2); }
.accent { background-color: var(--color-3); }`
        formatName = "CSS Color Code"
        break
      case "tailwind":
        content = `// Add to your tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
${palette.colors.map((color: string, index: number) => `        'palette-${index + 1}': '${color}',`).join("\n")}
      }
    }
  }
}

// Usage: bg-palette-1, text-palette-2, border-palette-3`
        formatName = "Tailwind CSS Variables"
        break
      case "svg":
        const totalWidth = palette.colors.length * 100
        content = `<svg width="${totalWidth}" height="100" xmlns="http://www.w3.org/2000/svg">
${palette.colors.map((color: string, index: number) => `  <rect x="${index * 100}" y="0" width="100" height="100" fill="${color}"/>`).join("\n")}
</svg>`
        formatName = "SVG"
        break
      case "gradient":
        content = `/* Linear Gradient */
background: linear-gradient(90deg, ${palette.colors.join(", ")});

/* Radial Gradient */
background: radial-gradient(circle, ${palette.colors.join(", ")});

/* Diagonal Gradient */
background: linear-gradient(45deg, ${palette.colors.join(", ")});`
        formatName = "Gradient Shade"
        break
    }

    try {
      await navigator.clipboard.writeText(content)
      toast({
        title: "Copied!",
        description: `${formatName} format copied to clipboard`,
      })
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const downloadImage = (palette: any) => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const swatchWidth = 120
    const swatchHeight = 120
    const padding = 20
    const textHeight = 40

    canvas.width = palette.colors.length * swatchWidth + (palette.colors.length + 1) * padding
    canvas.height = swatchHeight + textHeight + padding * 3

    // Background
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw color swatches
    palette.colors.forEach((color: string, index: number) => {
      const x = padding + index * (swatchWidth + padding)
      const y = padding

      // Color swatch
      ctx.fillStyle = color
      ctx.fillRect(x, y, swatchWidth, swatchHeight)

      // Border
      ctx.strokeStyle = "#e0e0e0"
      ctx.lineWidth = 1
      ctx.strokeRect(x, y, swatchWidth, swatchHeight)

      // Color text
      ctx.fillStyle = "#333333"
      ctx.font = "12px monospace"
      ctx.textAlign = "center"
      ctx.fillText(color, x + swatchWidth / 2, y + swatchHeight + 20)
    })

    // Download
    const link = document.createElement("a")
    link.download = `${palette.type}-palette.png`
    link.href = canvas.toDataURL()
    link.click()

    toast({
      title: "Downloaded!",
      description: "Palette image saved to your device",
    })
  }

  const publishPalette = async (palette: any) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to publish palettes",
        variant: "destructive",
      })
      return
    }

    setPublishingPalette(palette.type)

    try {
      const { error } = await supabase.from("palettes").insert({
        user_id: user.id,
        name: `${palette.type.charAt(0).toUpperCase() + palette.type.slice(1)} Palette`,
        type: palette.type,
        dominant_color: dominantColor,
        colors: palette.colors,
        is_public: true, // Add this field to make it public
      })

      if (error) throw error

      toast({
        title: "Published!",
        description: "Your palette has been published to the template library",
      })
    } catch (error) {
      toast({
        title: "Failed to publish",
        description: "Could not publish palette. Please try again.",
        variant: "destructive",
      })
    } finally {
      setPublishingPalette(null)
    }
  }

  const toggleFavorite = (paletteType: string) => {
    const newFavorites = new Set(favoritePalettes)
    if (newFavorites.has(paletteType)) {
      newFavorites.delete(paletteType)
    } else {
      newFavorites.add(paletteType)
    }
    setFavoritePalettes(newFavorites)
  }

  const paletteDescriptions = {
    analogous: {
      title: "Analogous Color Theory",
      description: "Colors that are next to each other on the color wheel, creating a harmonious and pleasing effect.",
      details:
        "Analogous colors are groups of three colors that are next to each other on the color wheel. They usually match well and create serene and comfortable designs. These color schemes are often found in nature and are harmonious and pleasing to the eye.",
      usage:
        "Perfect for creating calm, relaxing designs. Often used in nature photography, spa websites, and peaceful brand identities.",
      examples: "Sunset colors (red, orange, yellow), Ocean colors (blue, blue-green, green)",
    },
    complementary: {
      title: "Complementary Color Theory",
      description: "Colors that are opposite each other on the color wheel, creating high contrast and vibrant looks.",
      details:
        "Complementary colors are pairs of colors which, when combined or mixed, cancel each other out by producing a grayscale color. When placed next to each other, they create the strongest contrast and reinforce each other.",
      usage:
        "Great for making things stand out. Use one color as dominant and the other as accent. Perfect for call-to-action buttons and important elements.",
      examples: "Red & Green, Blue & Orange, Yellow & Purple",
    },
    triadic: {
      title: "Triadic Color Theory",
      description:
        "Three colors equally spaced around the color wheel, offering strong visual contrast while retaining harmony.",
      details:
        "Triadic color schemes use three colors equally spaced around the color wheel. This color scheme is popular among artists because it offers strong visual contrast while retaining harmony and color richness.",
      usage: "Ideal for creating vibrant, balanced designs. Use one color as dominant and the other two as accents.",
      examples: "Primary colors (Red, Blue, Yellow), Secondary colors (Orange, Green, Purple)",
    },
    "split-complementary": {
      title: "Split-Complementary Color Theory",
      description:
        "A variation of complementary that uses two colors adjacent to the complement, offering high contrast with less tension.",
      details:
        "Split-complementary color scheme is a variation of the complementary color scheme. Instead of using colors that are opposites, it uses colors on either side of the complement. This provides high contrast without the strong tension of the complementary scheme.",
      usage:
        "Offers more nuance than complementary schemes while maintaining visual interest. Good for beginners as it's hard to mess up.",
      examples: "Blue with Red-Orange and Yellow-Orange",
    },
    monochromatic: {
      title: "Monochromatic Color Theory",
      description: "Different shades, tints, and tones of the same hue, creating a cohesive and sophisticated look.",
      details:
        "Monochromatic color schemes are derived from a single base hue and extended using its shades, tones, and tints. This creates a very cohesive look that is soothing and pleasing to the eye.",
      usage:
        "Creates elegant, cohesive designs. Perfect for minimalist designs, professional presentations, and sophisticated branding.",
      examples: "Various shades of blue, Different tones of green, Multiple tints of red",
    },
  }

  const showTheory = (paletteType: string) => {
    setSelectedTheory(paletteType)
  }

  return (
    <Card className={`transition-all duration-300 ${isActive ? "ring-2 ring-teal-500 shadow-lg" : ""}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded border-2 border-gray-300"
            style={{ backgroundColor: dominantColor || "#000" }}
          />
          Generated Palettes
          <Badge variant="secondary" className="bg-teal-50 text-teal-700">
            {palettes.length} palettes
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="text-center">
            <p className="text-gray-600 mb-2">
              Based on your selected color <span className="font-mono font-semibold">{dominantColor}</span>
            </p>
            <p className="text-sm text-gray-500">
              Each palette follows different color theory principles to give you various design options.
            </p>
          </div>

          <div className="space-y-6">
            {palettes.map((palette, index) => (
              <Card key={index} className="border border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold capitalize text-gray-900">{palette.type}</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorite(palette.type)}
                        className={favoritePalettes.has(palette.type) ? "text-red-500" : "text-gray-400"}
                      >
                        <Heart
                          className="w-4 h-4"
                          fill={favoritePalettes.has(palette.type) ? "currentColor" : "none"}
                        />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Export Dropdown with Hover */}
                      <div className="relative group">
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <Download className="w-4 h-4" />
                          Export
                        </Button>

                        {/* Hover Dropdown */}
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                          <div className="py-1">
                            <button
                              onClick={() => copyFormat(palette, "hex")}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                            >
                              <FileText className="w-4 h-4" />
                              HEX Format
                            </button>
                            <button
                              onClick={() => copyFormat(palette, "css")}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Code className="w-4 h-4" />
                              CSS Color Code
                            </button>
                            <button
                              onClick={() => copyFormat(palette, "tailwind")}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Palette className="w-4 h-4" />
                              Tailwind CSS Variables
                            </button>
                            <button
                              onClick={() => copyFormat(palette, "svg")}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                            >
                              <FileText className="w-4 h-4" />
                              SVG Format
                            </button>
                            <button
                              onClick={() => copyFormat(palette, "gradient")}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Code className="w-4 h-4" />
                              Gradient Shade
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Theory Button */}
                      <Button variant="outline" size="sm" onClick={() => showTheory(palette.type)}>
                        <Info className="w-4 h-4 mr-2" />
                        Theory
                      </Button>

                      {/* Publish Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => publishPalette(palette)}
                        disabled={publishingPalette === palette.type}
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        {publishingPalette === palette.type ? "Publishing..." : "Publish"}
                      </Button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">
                    {paletteDescriptions[palette.type as keyof typeof paletteDescriptions]?.description}
                  </p>

                  <div className="grid grid-cols-5 gap-3 mb-4">
                    {palette.colors.map((color: string, colorIndex: number) => (
                      <div key={colorIndex} className="text-center">
                        <button
                          onClick={() => copyToClipboard(color)}
                          className="w-full h-16 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all hover:scale-105 relative group"
                          style={{ backgroundColor: color }}
                        >
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-lg transition-colors flex items-center justify-center">
                            {copiedColor === color ? (
                              <Check className="w-5 h-5 text-white" />
                            ) : (
                              <Copy className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            )}
                          </div>
                        </button>
                        <p className="text-xs font-mono mt-2 text-gray-700">{color}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Click any color to copy to clipboard</span>
                    <Badge variant="outline">{palette.colors.length} colors</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Accessibility Checker */}
          <div className="mt-8">
            <AccessibilityChecker colors={palettes[0]?.colors || []} />
          </div>
        </div>
      </CardContent>

      {/* Color Theory Dialog */}
      <Dialog open={!!selectedTheory} onOpenChange={() => setSelectedTheory(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              {selectedTheory && paletteDescriptions[selectedTheory as keyof typeof paletteDescriptions]?.title}
            </DialogTitle>
          </DialogHeader>
          {selectedTheory && (
            <div className="space-y-4">
              <div className="flex gap-1 rounded-lg overflow-hidden border">
                {palettes
                  .find((p) => p.type === selectedTheory)
                  ?.colors.map((color: string, index: number) => (
                    <div key={index} className="flex-1 h-16" style={{ backgroundColor: color }} />
                  ))}
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-700">
                    {paletteDescriptions[selectedTheory as keyof typeof paletteDescriptions]?.details}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Best Usage</h4>
                  <p className="text-gray-700">
                    {paletteDescriptions[selectedTheory as keyof typeof paletteDescriptions]?.usage}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Examples</h4>
                  <p className="text-gray-700">
                    {paletteDescriptions[selectedTheory as keyof typeof paletteDescriptions]?.examples}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}
