"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Download, Star, Trash2, Plus } from "lucide-react"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"
import { PaletteExportModal } from "@/components/dashboard/palette-export-modal"
import { PaletteIcon } from "lucide-react"

interface Palette {
  id: string
  name: string
  colors: string[]
  created_at: string
  is_favorite: boolean
  folder_id: string | null
}

interface PaletteGridProps {
  user: User
  selectedFolder: string | null
  onFolderSelect: (folderId: string | null) => void
}

export function PaletteGrid({ user, selectedFolder, onFolderSelect }: PaletteGridProps) {
  const [palettes, setPalettes] = useState<Palette[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPalette, setSelectedPalette] = useState<Palette | null>(null)
  const [showExportModal, setShowExportModal] = useState(false)

  useEffect(() => {
    fetchPalettes()
  }, [user, selectedFolder])

  const fetchPalettes = async () => {
    try {
      let query = supabase.from("palettes").select("*").eq("user_id", user.id).order("created_at", { ascending: false })

      if (selectedFolder) {
        query = query.eq("folder_id", selectedFolder)
      } else {
        query = query.is("folder_id", null)
      }

      const { data, error } = await query

      if (error) throw error
      setPalettes(data || [])
    } catch (error) {
      console.error("Error fetching palettes:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = async (paletteId: string, currentFavorite: boolean) => {
    try {
      const { error } = await supabase.from("palettes").update({ is_favorite: !currentFavorite }).eq("id", paletteId)

      if (error) throw error

      setPalettes(palettes.map((p) => (p.id === paletteId ? { ...p, is_favorite: !currentFavorite } : p)))
    } catch (error) {
      console.error("Error updating favorite:", error)
    }
  }

  const deletePalette = async (paletteId: string) => {
    try {
      const { error } = await supabase.from("palettes").delete().eq("id", paletteId)

      if (error) throw error

      setPalettes(palettes.filter((p) => p.id !== paletteId))
    } catch (error) {
      console.error("Error deleting palette:", error)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-4"></div>
            <div className="flex gap-2 mb-4">
              {[...Array(5)].map((_, j) => (
                <div key={j} className="w-8 h-8 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-3 bg-gray-200 rounded"></div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {selectedFolder ? "Folder Palettes" : "My Palettes"}
        </h2>
        <p className="text-gray-600">
          {palettes.length} palette{palettes.length !== 1 ? "s" : ""} found
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {palettes.map((palette) => (
          <Card key={palette.id} className="group hover:shadow-lg transition-shadow duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 truncate">{palette.name}</h3>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFavorite(palette.id, palette.is_favorite)}
                    className={palette.is_favorite ? "text-yellow-500" : "text-gray-400"}
                  >
                    <Star className="w-4 h-4" fill={palette.is_favorite ? "currentColor" : "none"} />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-1 mb-4">
                {palette.colors.map((color, index) => (
                  <div
                    key={index}
                    className="flex-1 h-12 rounded-lg border border-gray-200"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>{new Date(palette.created_at).toLocaleDateString()}</span>
                <Badge variant="secondary">{palette.colors.length} colors</Badge>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    setSelectedPalette(palette)
                    setShowExportModal(true)
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deletePalette(palette.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {palettes.length === 0 && (
          <div className="col-span-full text-center py-12">
            <PaletteIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No palettes found</h3>
            <p className="text-gray-600 mb-4">
              {selectedFolder
                ? "This folder is empty. Create your first palette!"
                : "Create your first color palette to get started."}
            </p>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Palette
            </Button>
          </div>
        )}
      </div>

      {selectedPalette && (
        <PaletteExportModal
          isOpen={showExportModal}
          onClose={() => {
            setShowExportModal(false)
            setSelectedPalette(null)
          }}
          palette={selectedPalette}
        />
      )}
    </>
  )
}
