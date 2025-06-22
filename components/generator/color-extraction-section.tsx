"use client"

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Palette, Sparkles, ArrowRight } from "lucide-react"
import { generateColorPalettes } from "@/lib/palette-generation"

interface ColorExtractionSectionProps {
  colors: string[]
  selectedColor: string | null
  onColorSelect: (color: string) => void
  onPalettesGenerated: (palettes: any[]) => void
  isActive: boolean
}

export function ColorExtractionSection({
  colors,
  selectedColor,
  onColorSelect,
  onPalettesGenerated,
  isActive,
}: ColorExtractionSectionProps) {
  useEffect(() => {
    if (selectedColor) {
      try {
        const palettes = generateColorPalettes(selectedColor)
        onPalettesGenerated(palettes)

        // Add to history
        if ((window as any).addToPaletteHistory) {
          ;(window as any).addToPaletteHistory(selectedColor, palettes)
        }
      } catch (error) {
        console.error("Error generating palettes:", error)
      }
    }
    // onPalettesGenerated is stable (memoised) so we can omit it
  }, [selectedColor])

  const handleColorSelect = (color: string) => {
    onColorSelect(color)
  }

  return (
    <Card className={`transition-all duration-300 ${isActive ? "ring-2 ring-teal-500 shadow-lg" : ""}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-teal-600" />
          Extracted Colors
          <Badge variant="secondary" className="bg-teal-50 text-teal-700">
            {colors.length} colors found
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <p className="text-gray-600">
            We've extracted the dominant colors from your image. Click on a color to generate harmonious palettes based
            on color theory.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {colors.map((color, index) => (
              <div key={index} className="text-center">
                <button
                  onClick={() => handleColorSelect(color)}
                  className={`w-full h-20 rounded-xl border-4 transition-all hover:scale-105 hover:shadow-lg ${
                    selectedColor === color
                      ? "border-teal-500 shadow-lg ring-2 ring-teal-200"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  style={{ backgroundColor: color }}
                >
                  {selectedColor === color && (
                    <div className="w-full h-full rounded-lg bg-black/20 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                  )}
                </button>
                <p className="text-sm font-mono mt-2 text-gray-700">{color}</p>
                {selectedColor === color && <Badge className="mt-1 bg-teal-600 text-white text-xs">Selected</Badge>}
              </div>
            ))}
          </div>

          {selectedColor && (
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg border-2 border-white"
                    style={{ backgroundColor: selectedColor }}
                  />
                  <div>
                    <p className="font-semibold text-teal-900">Selected Color: {selectedColor}</p>
                    <p className="text-sm text-teal-700">Generating 5 different palette types...</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-teal-600" />
              </div>
            </div>
          )}

          {!selectedColor && (
            <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <Palette className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Choose Your Base Color</h3>
              <p className="text-gray-500">Click on any color above to generate beautiful palettes</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
