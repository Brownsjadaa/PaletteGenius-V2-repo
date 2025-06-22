"use client"

import { useEffect } from "react"
import { Card } from "@/components/ui/card"
import { generateColorPalettes } from "@/lib/palette-generation"

interface DominantColorsProps {
  colors: string[]
  selectedColor: string | null
  onColorSelect: (color: string) => void
  onPalettesGenerated: (palettes: any[]) => void
}

export function DominantColors({ colors, selectedColor, onColorSelect, onPalettesGenerated }: DominantColorsProps) {
  useEffect(() => {
    if (selectedColor) {
      console.log("Selected color:", selectedColor) // Debug log
      try {
        const palettes = generateColorPalettes(selectedColor)
        console.log("Generated palettes:", palettes) // Debug log
        onPalettesGenerated(palettes)

        // Add to history
        if ((window as any).addToPaletteHistory) {
          ;(window as any).addToPaletteHistory(selectedColor, palettes)
        }
      } catch (error) {
        console.error("Error generating palettes:", error)
      }
    }
  }, [selectedColor, onPalettesGenerated])

  if (colors.length === 0) {
    return null
  }

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Dominant Colors</h3>
      <p className="text-gray-600 mb-6">Click on a color to generate complementary palettes</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {colors.map((color, index) => (
          <div key={index} className="text-center">
            <button
              onClick={() => {
                console.log("Color selected:", color) // Debug log
                onColorSelect(color)
              }}
              className={`w-full h-20 rounded-lg border-4 transition-all hover:scale-105 ${
                selectedColor === color ? "border-purple-500 shadow-lg" : "border-gray-200 hover:border-gray-300"
              }`}
              style={{ backgroundColor: color }}
            />
            <p className="text-sm font-mono mt-2 text-gray-700">{color}</p>
          </div>
        ))}
      </div>

      {selectedColor && (
        <div className="mt-6 p-4 bg-purple-50 rounded-lg">
          <p className="text-sm text-purple-800">
            <strong>Selected:</strong> {selectedColor} - Generating palettes below...
          </p>
        </div>
      )}
    </Card>
  )
}
