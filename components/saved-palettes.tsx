"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Copy, Check } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import type { User } from "@supabase/supabase-js"

interface SavedPalettesProps {
  user: User
}

interface SavedPalette {
  id: string
  name: string
  type: string
  dominant_color: string
  colors: string[]
  created_at: string
}

export function SavedPalettes({ user }: SavedPalettesProps) {
  const [palettes, setPalettes] = useState<SavedPalette[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedColor, setCopiedColor] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchPalettes()
  }, [user])

  const fetchPalettes = async () => {
    try {
      const { data, error } = await supabase
        .from("palettes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error

      setPalettes(data || [])
    } catch (error) {
      toast({
        title: "Failed to load palettes",
        description: "Could not fetch your saved palettes",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const deletePalette = async (id: string) => {
    try {
      const { error } = await supabase.from("palettes").delete().eq("id", id)

      if (error) throw error

      setPalettes(palettes.filter((p) => p.id !== id))
      toast({
        title: "Palette deleted",
        description: "The palette has been removed from your collection",
      })
    } catch (error) {
      toast({
        title: "Failed to delete",
        description: "Could not delete the palette",
        variant: "destructive",
      })
    }
  }

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

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Loading your saved palettes...</p>
      </div>
    )
  }

  if (palettes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">You haven't saved any palettes yet.</p>
        <p className="text-sm text-gray-500">Generate some palettes and save your favorites to see them here.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold text-center">Your Saved Palettes</h3>

      <div className="grid gap-6">
        {palettes.map((palette) => (
          <Card key={palette.id} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold">{palette.name}</h4>
                <p className="text-sm text-gray-600 capitalize">
                  {palette.type} • Based on {palette.dominant_color}
                </p>
                <p className="text-xs text-gray-500">Saved on {new Date(palette.created_at).toLocaleDateString()}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => deletePalette(palette.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {palette.colors.map((color, colorIndex) => (
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
