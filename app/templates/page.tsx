"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import type { User as SupabaseUser } from "@supabase/supabase-js"

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

      // Fetch only public palettes
      const { data, error } = await supabase
        .from("palettes")
        .select(`
          id,
          name,
          type,
          colors,
          dominant_color,
          created_at,
          user_id
        `)
        .eq("is_public", true)
        .order("created_at", { ascending: false })
        .limit(50)

      if (error) throw error

      // Create simplified user info (since we can't access auth.admin in client)
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

  const paletteTypes = [
    "all",
    "monochromatic",
    "analogous",
    "complementary",
    "triadic",
    "tetradic\",
