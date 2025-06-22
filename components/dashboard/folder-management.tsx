"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Folder, Plus, Trash2, Search, MoreHorizontal, Calendar } from "lucide-react"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"
import { CreateFolderModal } from "@/components/dashboard/create-folder-modal"

interface FolderType {
  id: string
  name: string
  created_at: string
  palette_count: number
}

interface FolderManagementProps {
  user: User
}

export function FolderManagement({ user }: FolderManagementProps) {
  const [folders, setFolders] = useState<FolderType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    fetchFolders()
  }, [user])

  const fetchFolders = async () => {
    try {
      // Get folders with palette count
      const { data: foldersData, error: foldersError } = await supabase
        .from("folders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (foldersError) throw foldersError

      // Get palette counts for each folder
      const foldersWithCounts = await Promise.all(
        (foldersData || []).map(async (folder) => {
          const { count } = await supabase.from("palettes").select("id", { count: "exact" }).eq("folder_id", folder.id)

          return {
            ...folder,
            palette_count: count || 0,
          }
        }),
      )

      setFolders(foldersWithCounts)
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

  const filteredFolders = folders.filter((folder) => folder.name.toLowerCase().includes(searchQuery.toLowerCase()))

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
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
          <h2 className="text-2xl font-bold text-gray-900">Folders</h2>
          <p className="text-gray-600">
            {filteredFolders.length} folder{filteredFolders.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="bg-teal-600 hover:bg-teal-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Folder
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search folders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Folders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredFolders.map((folder) => (
          <Card key={folder.id} className="group hover:shadow-lg transition-shadow duration-200 cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center">
                  <Folder className="w-6 h-6 text-teal-600" />
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <h3 className="font-semibold text-gray-900 mb-2 truncate">{folder.name}</h3>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(folder.created_at).toLocaleDateString()}</span>
                </div>
                <Badge variant="secondary">
                  {folder.palette_count} palette{folder.palette_count !== 1 ? "s" : ""}
                </Badge>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Open
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteFolder(folder.id)
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFolders.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Folder className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No folders found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery ? "Try adjusting your search terms" : "Create your first folder to organize your palettes"}
          </p>
          <Button onClick={() => setShowCreateModal(true)} className="bg-teal-600 hover:bg-teal-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Folder
          </Button>
        </div>
      )}

      <CreateFolderModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        user={user}
        onFolderCreated={fetchFolders}
      />
    </div>
  )
}
