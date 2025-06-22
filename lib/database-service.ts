import { supabase } from "./supabase"

export interface UserProfile {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  website?: string
  bio?: string
  created_at: string
  updated_at: string
}

export interface Palette {
  id: string
  user_id: string
  folder_id?: string
  name: string
  description?: string
  type: string
  dominant_color: string
  colors: string[]
  tags: string[]
  is_favorite: boolean
  is_public: boolean
  view_count: number
  like_count: number
  source_image_url?: string
  created_at: string
  updated_at: string
}

export interface Folder {
  id: string
  user_id: string
  name: string
  description?: string
  color: string
  is_default: boolean
  created_at: string
  updated_at: string
}

export class DatabaseService {
  // =====================================================
  // USER PROFILE METHODS
  // =====================================================

  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      if (!userId) return null

      const { data, error } = await supabase.from("user_profiles").select("*").eq("id", userId).single()

      if (error) {
        console.error("Error fetching user profile:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Error in getUserProfile:", error)
      return null
    }
  }

  static async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<boolean> {
    try {
      const { error } = await supabase.from("user_profiles").update(updates).eq("id", userId)

      if (error) {
        console.error("Error updating user profile:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Error in updateUserProfile:", error)
      return false
    }
  }

  // =====================================================
  // PALETTE METHODS
  // =====================================================

  static async createPalette(
    palette: Omit<Palette, "id" | "created_at" | "updated_at" | "view_count" | "like_count">,
  ): Promise<string | null> {
    try {
      const { data, error } = await supabase.from("palettes").insert(palette).select("id").single()

      if (error) {
        console.error("Error creating palette:", error)
        return null
      }

      // Log activity
      await this.logUserActivity(palette.user_id, "palette_created", data.id)

      return data.id
    } catch (error) {
      console.error("Error in createPalette:", error)
      return null
    }
  }

  static async getUserPalettes(userId: string, includePublic = false): Promise<Palette[]> {
    try {
      const query = supabase
        .from("palettes")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      const { data, error } = await query

      if (error) {
        console.error("Error fetching user palettes:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Error in getUserPalettes:", error)
      return []
    }
  }

  static async getPublicPalettes(limit = 50, offset = 0): Promise<Palette[]> {
    try {
      const { data, error } = await supabase
        .from("recent_public_palettes")
        .select("*")
        .limit(limit)
        .range(offset, offset + limit - 1)

      if (error) {
        console.error("Error fetching public palettes:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Error in getPublicPalettes:", error)
      return []
    }
  }

  static async getPopularPalettes(limit = 20): Promise<Palette[]> {
    try {
      const { data, error } = await supabase.from("popular_palettes").select("*").limit(limit)

      if (error) {
        console.error("Error fetching popular palettes:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Error in getPopularPalettes:", error)
      return []
    }
  }

  static async publishPalette(paletteId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("palettes")
        .update({ is_public: true })
        .eq("id", paletteId)
        .eq("user_id", userId)

      if (error) {
        console.error("Error publishing palette:", error)
        return false
      }

      // Log activity
      await this.logUserActivity(userId, "palette_published", paletteId)

      return true
    } catch (error) {
      console.error("Error in publishPalette:", error)
      return false
    }
  }

  static async incrementPaletteViews(paletteId: string): Promise<void> {
    try {
      await supabase.rpc("increment_palette_views", { palette_id: paletteId })
    } catch (error) {
      console.error("Error in incrementPaletteViews:", error)
    }
  }

  // =====================================================
  // FOLDER METHODS
  // =====================================================

  static async getUserFolders(userId: string): Promise<Folder[]> {
    try {
      const { data, error } = await supabase
        .from("folders")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching folders:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Error in getUserFolders:", error)
      return []
    }
  }

  static async createFolder(folder: Omit<Folder, "id" | "created_at" | "updated_at">): Promise<string | null> {
    try {
      const { data, error } = await supabase.from("folders").insert(folder).select("id").single()

      if (error) {
        console.error("Error creating folder:", error)
        return null
      }

      // Log activity
      await this.logUserActivity(folder.user_id, "folder_created", data.id)

      return data.id
    } catch (error) {
      console.error("Error in createFolder:", error)
      return null
    }
  }

  // =====================================================
  // FAVORITES AND LIKES
  // =====================================================

  static async togglePaletteFavorite(userId: string, paletteId: string): Promise<boolean> {
    try {
      // Check if already favorited
      const { data: existing } = await supabase
        .from("palette_favorites")
        .select("id")
        .eq("user_id", userId)
        .eq("palette_id", paletteId)
        .single()

      if (existing) {
        // Remove favorite
        const { error } = await supabase
          .from("palette_favorites")
          .delete()
          .eq("user_id", userId)
          .eq("palette_id", paletteId)

        return !error
      } else {
        // Add favorite
        const { error } = await supabase.from("palette_favorites").insert({ user_id: userId, palette_id: paletteId })

        return !error
      }
    } catch (error) {
      console.error("Error in togglePaletteFavorite:", error)
      return false
    }
  }

  static async togglePaletteLike(userId: string, paletteId: string): Promise<boolean> {
    try {
      // Check if already liked
      const { data: existing } = await supabase
        .from("palette_likes")
        .select("id")
        .eq("user_id", userId)
        .eq("palette_id", paletteId)
        .single()

      if (existing) {
        // Remove like
        const { error } = await supabase
          .from("palette_likes")
          .delete()
          .eq("user_id", userId)
          .eq("palette_id", paletteId)

        return !error
      } else {
        // Add like
        const { error } = await supabase.from("palette_likes").insert({ user_id: userId, palette_id: paletteId })

        // Log activity
        await this.logUserActivity(userId, "palette_liked", paletteId)

        return !error
      }
    } catch (error) {
      console.error("Error in togglePaletteLike:", error)
      return false
    }
  }

  static async getUserFavorites(userId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase.from("palette_favorites").select("palette_id").eq("user_id", userId)

      if (error) {
        console.error("Error fetching favorites:", error)
        return []
      }

      return data.map((item) => item.palette_id)
    } catch (error) {
      console.error("Error in getUserFavorites:", error)
      return []
    }
  }

  // =====================================================
  // ANALYTICS AND ACTIVITY
  // =====================================================

  static async logUserActivity(
    userId: string,
    activityType: string,
    resourceId?: string,
    metadata?: any,
  ): Promise<void> {
    try {
      await supabase.from("user_activity").insert({
        user_id: userId,
        activity_type: activityType,
        resource_id: resourceId,
        metadata: metadata || {},
      })
    } catch (error) {
      console.error("Error in logUserActivity:", error)
    }
  }

  static async getUserStats(userId: string): Promise<any> {
    try {
      const { data, error } = await supabase.from("user_stats").select("*").eq("user_id", userId).single()

      if (error) {
        console.error("Error fetching user stats:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Error in getUserStats:", error)
      return null
    }
  }

  // =====================================================
  // SEARCH AND FILTERING
  // =====================================================

  static async searchPalettes(
    query: string,
    filters?: {
      type?: string
      isPublic?: boolean
      userId?: string
    },
  ): Promise<Palette[]> {
    try {
      let dbQuery = supabase.from("palettes").select("*")

      if (query) {
        dbQuery = dbQuery.or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      }

      if (filters?.type) {
        dbQuery = dbQuery.eq("type", filters.type)
      }

      if (filters?.isPublic !== undefined) {
        dbQuery = dbQuery.eq("is_public", filters.isPublic)
      }

      if (filters?.userId) {
        dbQuery = dbQuery.eq("user_id", filters.userId)
      }

      dbQuery = dbQuery.order("created_at", { ascending: false })

      const { data, error } = await dbQuery

      if (error) {
        console.error("Error searching palettes:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Error in searchPalettes:", error)
      return []
    }
  }
}
