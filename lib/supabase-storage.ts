import { supabase } from "./supabase"

export class SupabaseStorage {
  // =====================================================
  // AVATAR UPLOAD
  // =====================================================

  static async uploadAvatar(userId: string, file: File): Promise<string | null> {
    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${userId}-${Date.now()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      // Upload file to storage
      const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      })

      if (uploadError) {
        console.error("Error uploading avatar:", uploadError)
        return null
      }

      // Get public URL
      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath)

      return data.publicUrl
    } catch (error) {
      console.error("Error in uploadAvatar:", error)
      return null
    }
  }

  // =====================================================
  // PALETTE IMAGE UPLOAD
  // =====================================================

  static async uploadPaletteImage(userId: string, file: File): Promise<string | null> {
    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${userId}-${Date.now()}.${fileExt}`
      const filePath = `palette-images/${fileName}`

      // Upload file to storage
      const { error: uploadError } = await supabase.storage.from("palette-images").upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      })

      if (uploadError) {
        console.error("Error uploading palette image:", uploadError)
        return null
      }

      // Get public URL
      const { data } = supabase.storage.from("palette-images").getPublicUrl(filePath)

      return data.publicUrl
    } catch (error) {
      console.error("Error in uploadPaletteImage:", error)
      return null
    }
  }

  // =====================================================
  // FILE DELETION
  // =====================================================

  static async deleteFile(bucket: string, filePath: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage.from(bucket).remove([filePath])

      if (error) {
        console.error("Error deleting file:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Error in deleteFile:", error)
      return false
    }
  }

  // =====================================================
  // GET PUBLIC URL
  // =====================================================

  static getPublicUrl(bucket: string, filePath: string): string {
    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)

    return data.publicUrl
  }

  // =====================================================
  // LIST FILES
  // =====================================================

  static async listFiles(bucket: string, folder?: string): Promise<any[]> {
    try {
      const { data, error } = await supabase.storage.from(bucket).list(folder, {
        limit: 100,
        offset: 0,
        sortBy: { column: "created_at", order: "desc" },
      })

      if (error) {
        console.error("Error listing files:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Error in listFiles:", error)
      return []
    }
  }
}
