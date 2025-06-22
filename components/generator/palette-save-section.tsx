"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Save, Check, Folder, Star } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import type { User } from "@supabase/supabase-js"
import { PaletteExport } from "@/components/palette-export"

interface PaletteSaveSectionProps {
  palettes: any[]
  dominantColor: string | null
  user: User
  isActive: boolean
}

export function PaletteSaveSection({ palettes, dominantColor, user, isActive }: PaletteSaveSectionProps) {
  const [savedPalettes, setSavedPalettes] = useState<Set<string>>(new Set())
  const [savingPalette, setSavingPalette] = useState<string | null>(null)
  const [paletteNames, setPaletteNames] = useState<Record<string, string>>({})
  const { toast } = useToast()

  const savePalette = async (palette: any) => {
    const paletteName = paletteNames[palette.type] || `${palette.type} palette`

    setSavingPalette(palette.type)

    try {
      const { error } = await supabase.from("palettes").insert({
        user_id: user.id,
        name: paletteName,
        type: palette.type,
        dominant_color: dominantColor,
        colors: palette.colors,
      })

      if (error) throw error

      setSavedPalettes(new Set([...savedPalettes, palette.type]))
      toast({
        title: "Palette saved!",
        description: `"${paletteName}" has been saved to your collection`,
      })
    } catch (error) {
      toast({
        title: "Failed to save",
        description: "Could not save palette. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSavingPalette(null)
    }
  }

  const saveAllPalettes = async () => {
    for (const palette of palettes) {
      if (!savedPalettes.has(palette.type)) {
        await savePalette(palette)
      }
    }
  }

  const updatePaletteName = (paletteType: string, name: string) => {
    setPaletteNames({
      ...paletteNames,
      [paletteType]: name,
    })
  }

  return (
    <Card className={`transition-all duration-300 ${isActive ? "ring-2 ring-teal-500 shadow-lg" : ""}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Save className="w-5 h-5 text-teal-600" />
          Save Your Palettes
          <Badge variant="secondary" className="bg-green-50 text-green-700">
            {savedPalettes.size} of {palettes.length} saved
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-teal-900 mb-1">Save to Your Collection</h3>
                <p className="text-sm text-teal-700">
                  Save your favorite palettes to access them later from your dashboard.
                </p>
              </div>
              <Button
                onClick={saveAllPalettes}
                disabled={savedPalettes.size === palettes.length}
                className="bg-teal-600 hover:bg-teal-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Save All
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {palettes.map((palette, index) => (
              <Card key={index} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold capitalize text-gray-900">{palette.type}</h3>
                      {savedPalettes.has(palette.type) && (
                        <Badge className="bg-green-50 text-green-700 border-green-200">
                          <Check className="w-3 h-3 mr-1" />
                          Saved
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <PaletteExport
                        palette={palette}
                        paletteName={paletteNames[palette.type] || `${palette.type} palette`}
                      />
                      <Button variant="outline" size="sm">
                        <Star className="w-4 h-4 mr-2" />
                        Favorite
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-2 mb-4">
                    {palette.colors.map((color: string, colorIndex: number) => (
                      <div
                        key={colorIndex}
                        className="flex-1 h-12 rounded-lg border border-gray-200"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Label htmlFor={`name-${palette.type}`} className="text-sm font-medium text-gray-700">
                        Palette Name
                      </Label>
                      <Input
                        id={`name-${palette.type}`}
                        value={paletteNames[palette.type] || `${palette.type} palette`}
                        onChange={(e) => updatePaletteName(palette.type, e.target.value)}
                        placeholder={`My ${palette.type} palette`}
                        className="mt-1"
                        disabled={savedPalettes.has(palette.type)}
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-6">
                      <Button variant="outline" size="sm">
                        <Folder className="w-4 h-4 mr-2" />
                        Folder
                      </Button>
                      <Button
                        onClick={() => savePalette(palette)}
                        disabled={savedPalettes.has(palette.type) || savingPalette === palette.type}
                        className="bg-teal-600 hover:bg-teal-700"
                      >
                        {savingPalette === palette.type ? (
                          <>
                            <div className="w-4 h-4 mr-2 animate-spin border-2 border-white border-t-transparent rounded-full" />
                            Saving...
                          </>
                        ) : savedPalettes.has(palette.type) ? (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Saved
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Save
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {savedPalettes.size === palettes.length && (
            <div className="text-center py-8 bg-green-50 border border-green-200 rounded-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-green-900 mb-2">All Palettes Saved!</h3>
              <p className="text-green-700 mb-4">Your palettes have been saved to your collection.</p>
              <div className="flex items-center justify-center gap-4">
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Create Another
                </Button>
                <Button
                  onClick={() => (window.location.href = "/dashboard")}
                  className="bg-green-600 hover:bg-green-700"
                >
                  View Dashboard
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
