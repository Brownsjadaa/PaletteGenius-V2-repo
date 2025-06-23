"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface PublicPalette {
  id: string
  name: string
  type: string
  colors: string[]
  dominant_color: string
  created_at: string
  user_id: string
  is_favorite?: boolean
  user_email?: string
  user_name?: string
}

export default function TemplatesPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [palettes, setPalettes] = useState<PublicPalette[]>([])
  const [filteredPalettes, setFilteredPalettes] = useState<PublicPalette[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [copiedColor, setCopiedColor] = useState<string | null>(null)
  const [favoritePalettes, setFavoritePalettes] = useState<Set<string>>(new Set())
  const { toast } = useToast()

  useEffect(() => {
    checkUser()
    fetchPublicPalettes()
  }, [])

  useEffect(() => {
    filterPalettes()
  }, [palettes, searchTerm, selectedType])

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    setUser(user)
    if (user) {
      fetchUserFavorites(user.id)
    }
  }

  const fetchUserFavorites = async (userId: string) => {
    try {
      const { data, error } = await supabase.from("palette_favorites").select("palette_id").eq("user_id", userId)

      if (error) throw error

      const favoriteIds = new Set(data.map((fav) => fav.palette_id))
      setFavoritePalettes(favoriteIds)
    } catch (error) {
      console.error("Error fetching favorites:", error)
    }
  }

  const fetchPublicPalettes = async () => {
    try {
      setLoading(true)

      const { data, error } = await supabase
        .from("palettes")
        .select(
          `
          id,
          name,
          type,
          colors,
          dominant_color,
          created_at,
          user_id
        `,
        )
        .eq("is_public", true)
        .order("created_at", { ascending: false })
        .limit(50)

      if (error) throw error

      const palettesWithUsers = data.map((palette) => ({
        ...palette,
        user_email: "Community User",
        user_name: `User ${palette.user_id.slice(0, 8)}`,
      }))

      setPalettes(palettesWithUsers)
    } catch (error) {
      console.error("Error fetching palettes:", error)
      toast({
        title: "Error",
        description: "Failed to load template library",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterPalettes = () => {
    let filtered = palettes

    if (searchTerm) {
      filtered = filtered.filter(
        (palette) =>
          palette.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          palette.type.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedType !== "all") {
      filtered = filtered.filter((palette) => palette.type === selectedType)
    }

    setFilteredPalettes(filtered)
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

  const toggleFavorite = async (paletteId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to favorite palettes",
        variant: "destructive",
      })
      return
    }

    try {
      const isFavorited = favoritePalettes.has(paletteId)

      if (isFavorited) {
        await supabase.from("palette_favorites").delete().eq("user_id", user.id).eq("palette_id", paletteId)

        setFavoritePalettes((prev) => {
          const newSet = new Set(prev)
          newSet.delete(paletteId)
          return newSet
        })
      } else {
        await supabase.from("palette_favorites").insert({
          user_id: user.id,
          palette_id: paletteId,
        })

        setFavoritePalettes((prev) => new Set(prev).add(paletteId))
      }

      toast({
        title: isFavorited ? "Removed from favorites" : "Added to favorites",
        description: isFavorited ? "Palette removed from your favorites" : "Palette added to your favorites",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive",
      })
    }
  }

  const savePalette = async (palette: PublicPalette) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save palettes",
        variant: "destructive",
      })
      return
    }

    try {
      const { error } = await supabase.from("palettes").insert({
        user_id: user.id,
        name: `${palette.name} (Copy)`,
        type: palette.type,
        dominant_color: palette.dominant_color,
        colors: palette.colors,
        is_public: false, // Save as private by default
      })

      if (error) throw error

      toast({
        title: "Palette saved!",
        description: "Palette has been saved to your collection",
      })
    } catch (error) {
      toast({
        title: "Failed to save",
        description: "Could not save palette. Please try again.",
        variant: "destructive",
      })
    }
  }

  const paletteTypes = ["all", "monochromatic", "analogous", "complementary", "triadic", "tetradic"]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-gray-600">Loading community templates...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">Template Library</h1>
        <p className="mt-2 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
          Discover and use beautiful palettes created by the PaletteGenius community.
        </p>
      </header>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 sticky top-0 bg-white/80 backdrop-blur-sm py-4 z-10">
        <div className="relative flex-1">
          <Input
            placeholder="Search by name, type, or color..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by Type" />
          </SelectTrigger>
          <SelectContent>
            {paletteTypes.map((type) => (
              <SelectItem key={type} value={type} className="capitalize">
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Palette Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredPalettes.map((palette) => (
          <div
            key={palette.id}
            className="border bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group"
          >
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 truncate group-hover:text-teal-600">{palette.name}</h3>
              <p className="text-xs text-gray-500 capitalize mb-3">{palette.type} palette</p>
            </div>
            <div className="flex h-24">
              {palette.colors.map((color, index) => (
                <div
                  key={`${color}-${index}`}
                  className="w-full h-full transition-transform duration-200 ease-in-out group-hover:scale-105"
                  style={{ backgroundColor: color }}
                  onClick={() => copyToClipboard(color)}
                  title={`Copy ${color}`}
                ></div>
              ))}
            </div>
            <div className="p-4 bg-gray-50/50 flex items-center justify-between">
              <p className="text-xs text-gray-500">by {palette.user_name}</p>
              <div className="flex gap-2">
                <Button
                  onClick={() => toggleFavorite(palette.id)}
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-red-500"
                >
                  {favoritePalettes.has(palette.id) ? "❤️" : "🤍"}
                </Button>
                <Button
                  onClick={() => savePalette(palette)}
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-teal-600"
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filteredPalettes.length === 0 && !loading && (
        <div className="text-center py-16">
          <p className="text-gray-600">No templates found for your criteria.</p>
        </div>
      )}
    </div>
  )
}
