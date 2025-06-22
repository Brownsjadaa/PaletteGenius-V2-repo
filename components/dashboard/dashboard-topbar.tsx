"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Bell, Settings, Plus, Filter, Grid, List } from "lucide-react"
import type { User } from "@supabase/supabase-js"

interface DashboardTopbarProps {
  user: User
}

export function DashboardTopbar({ user }: DashboardTopbarProps) {
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Greeting */}
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            {getGreeting()}, {user.email?.split("@")[0]}! 👋
          </h1>
          <p className="text-sm text-gray-600">Here's what's happening with your palettes today.</p>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input placeholder="Search palettes..." className="pl-10 w-64" />
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-5 h-5 text-gray-600" />
            <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 bg-red-500 text-white text-xs flex items-center justify-center">
              3
            </Badge>
          </Button>

          {/* Settings */}
          <Button variant="ghost" size="sm">
            <Settings className="w-5 h-5 text-gray-600" />
          </Button>
        </div>
      </div>

      {/* Secondary toolbar */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Badge variant="secondary" className="bg-teal-50 text-teal-700">
            24 palettes
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <Button variant="ghost" size="sm" className="bg-white shadow-sm">
              <Grid className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <List className="w-4 h-4" />
            </Button>
          </div>

          <Button className="bg-teal-600 hover:bg-teal-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Palette
          </Button>
        </div>
      </div>
    </div>
  )
}
