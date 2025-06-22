"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Copy, Save, Check } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import type { User } from "@supabase/supabase-js"
import { PaletteExport } from "@/components/palette-export"

interface ColorPalettesProps {
  palettes: any[]
  dominantColor: string | null
  user: User | null
}

export function ColorPalettes({ palettes, dominantColor, user }: ColorPalettesProps) {
  const [copiedColor, setCopiedColor] = useState<string | null>(null)
  const [savingPalette, setSavingPalette] = useState<string | null>(null)
  const [paletteName, setPaletteName] = useState("")
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

  const savePalette = async (palette: any) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save palettes",
        variant: "destructive",
      })
      return
    }

    if (!paletteName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for your palette",
        variant: "destructive",
      })
      return
    }

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

      toast({
        title: "Palette saved!",
        description: `"${paletteName}" has been saved to your collection`,
      })
      setPaletteName("")
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

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-semibold mb-2">Generated Color Palettes</h3>
        <p className="text-gray-600">
          Based on your selected color: <span className="font-mono font-semibold">{dominantColor}</span>
        </p>
      </div>

      <div className="grid gap-6">
        {palettes.map((palette, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold capitalize">{palette.type}</h4>
                <p className="text-sm text-gray-600">{palette.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <PaletteExport palette={palette} paletteName={`${palette.type} palette`} />
                {user && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Save Palette</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Palette Name</label>
                          <Input
                            value={paletteName}
                            onChange={(e) => setPaletteName(e.target.value)}
                            placeholder={`My ${palette.type} palette`}
                          />
                        </div>
                        <div className="flex gap-2">
                          {palette.colors.map((color: string, colorIndex: number) => (
                            <div
                              key={colorIndex}
                              className="w-8 h-8 rounded border"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        <Button
                          onClick={() => savePalette(palette)}
                          disabled={savingPalette === palette.type}
                          className="w-full"
                        >
                          {savingPalette === palette.type ? "Saving..." : "Save Palette"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2">
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
                  <p className="text-xs font-mono mt-1 text-gray-700">{color}</p>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
