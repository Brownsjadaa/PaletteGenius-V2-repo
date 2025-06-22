"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  MoreHorizontal,
  Download,
  Star,
  Trash2,
  Plus,
  Search,
  Filter,
  Grid,
  List,
  Calendar,
  Folder,
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"
import { PaletteExportModal } from "@/components/dashboard/palette-export-modal"
import { useRouter } from "next/navigation"

interface Palette {
  id: string
  name: string
  colors: string[]
  created_at: string
  is_favorite: boolean
  folder_id: string | null
}

interface PaletteManagementProps {
  user: User
}

export function PaletteManagement({ user }: PaletteManagementProps) {
  const [palettes, setPalettes] = useState<Palette[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPalette, setSelectedPalette] = useState<Palette | null>(null)
  const [showExportModal, setShowExportModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<"recent" | "name" | "favorite">("recent")
  const router = useRouter()

  useEffect(() => {
    fetchPalettes()
  }, [user])

  const fetchPalettes = async () => {
    try {
      let query = supabase.from("palettes").select("*").eq("user_id", user.id)

      // Apply sorting
      switch (sortBy) {
        case "recent":
          query = query.order("created_at", { ascending: false })
          break
        case "name":
          query = query.order("name", { ascending: true })
          break
        case "favorite":
          query = query.order("is_favorite", { ascending: false }).order("created_at", { ascending: false })
          break
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

  const filteredPalettes = palettes.filter((palette) => palette.name.toLowerCase().includes(searchQuery.toLowerCase()))

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="flex gap-2 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="w-8 h-8 bg-gray-200 rounded"></div>
                  ))}
                </div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Palettes</h2>
          <p className="text-gray-600">
            {filteredPalettes.length} palette{filteredPalettes.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <Button onClick={() => router.push("/generator")} className="bg-teal-600 hover:bg-teal-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Palette
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search palettes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {/* Sort dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="recent">Recent</option>
            <option value="name">Name</option>
            <option value="favorite">Favorites</option>
          </select>

          {/* View toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode("grid")}
              className={viewMode === "grid" ? "bg-white shadow-sm" : ""}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode("list")}
              className={viewMode === "list" ? "bg-white shadow-sm" : ""}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Palettes Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPalettes.map((palette) => (
            <Card key={palette.id} className="group hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 truncate flex-1">{palette.name}</h3>
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
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(palette.created_at).toLocaleDateString()}</span>
                  </div>
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
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredPalettes.map((palette) => (
            <Card key={palette.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex gap-1">
                      {palette.colors.slice(0, 5).map((color, index) => (
                        <div
                          key={index}
                          className="w-8 h-8 rounded border border-gray-200"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{palette.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{palette.colors.length} colors</span>
                        <span>{new Date(palette.created_at).toLocaleDateString()}</span>
                        {palette.folder_id && (
                          <div className="flex items-center gap-1">
                            <Folder className="w-3 h-3" />
                            <span>In folder</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFavorite(palette.id, palette.is_favorite)}
                      className={palette.is_favorite ? "text-yellow-500" : "text-gray-400"}
                    >
                      <Star className="w-4 h-4" fill={palette.is_favorite ? "currentColor" : "none"} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedPalette(palette)
                        setShowExportModal(true)
                      }}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deletePalette(palette.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredPalettes.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No palettes found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery ? "Try adjusting your search terms" : "Create your first color palette to get started"}
          </p>
          <Button onClick={() => router.push("/generator")} className="bg-teal-600 hover:bg-teal-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Palette
          </Button>
        </div>
      )}

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
    </div>
  )
}
