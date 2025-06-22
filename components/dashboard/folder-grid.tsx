"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Folder, Plus, Trash2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

interface FolderType {
  id: string
  name: string
  created_at: string
  palette_count: number
}

interface FolderGridProps {
  user: User
  onFolderSelect: (folderId: string) => void
}

export function FolderGrid({ user, onFolderSelect }: FolderGridProps) {
  const [folders, setFolders] = useState<FolderType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFolders()
  }, [user])

  const fetchFolders = async () => {
    try {
      const { data, error } = await supabase
        .from("folders")
        .select(`
          *,
          palettes(count)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error

      const foldersWithCount =
        data?.map((folder) => ({
          ...folder,
          palette_count: folder.palettes?.[0]?.count || 0,
        })) || []

      setFolders(foldersWithCount)
    } catch (error) {
      console.error("Error fetching folders:", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteFolder = async (folderId: string) => {
    try {
      const { error } = await supabase.from("folders").delete().eq("id", folderId)

      if (error) throw error

      setFolders(folders.filter((f) => f.id !== folderId))
    } catch (error) {
      console.error("Error deleting folder:", error)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="w-12 h-12 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded"></div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">My Folders</h2>
        <p className="text-gray-600">
          {folders.length} folder{folders.length !== 1 ? "s" : ""} found
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {folders.map((folder) => (
          <Card
            key={folder.id}
            className="group hover:shadow-lg transition-shadow duration-200 cursor-pointer"
            onClick={() => onFolderSelect(folder.id)}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Folder className="w-6 h-6 text-indigo-600" />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteFolder(folder.id)
                  }}
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
              </div>

              <h3 className="font-semibold text-gray-900 mb-2 truncate">{folder.name}</h3>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{new Date(folder.created_at).toLocaleDateString()}</span>
                <Badge variant="secondary">
                  {folder.palette_count} palette{folder.palette_count !== 1 ? "s" : ""}
                </Badge>
              </div>
            </div>
          </Card>
        ))}

        {folders.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Folder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No folders found</h3>
            <p className="text-gray-600 mb-4">Create your first folder to organize your palettes.</p>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Folder
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
