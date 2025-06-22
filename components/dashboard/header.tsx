"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Grid, List, Filter } from "lucide-react"
import type { User } from "@supabase/supabase-js"

interface DashboardHeaderProps {
  user: User
  activeView: "palettes" | "folders"
  selectedFolder: string | null
  onCreateFolder: () => void
}

export function DashboardHeader({ user, activeView, selectedFolder, onCreateFolder }: DashboardHeaderProps) {
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  return (
    <div className="bg-white border-b border-gray-200 px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{getGreeting()}, what will you create today? 👋</h1>
          <p className="text-gray-600">
            {activeView === "palettes"
              ? "Manage and organize your color palettes"
              : "Organize your palettes into folders"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            What's new
          </Badge>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input placeholder={`Search ${activeView}...`} className="pl-10 w-80" />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <Button variant="ghost" size="sm" className="bg-white shadow-sm">
              <Grid className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <List className="w-4 h-4" />
            </Button>
          </div>

          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="w-4 h-4 mr-2" />
            {activeView === "palettes" ? "Create Palette" : "Create Folder"}
          </Button>
        </div>
      </div>
    </div>
  )
}
