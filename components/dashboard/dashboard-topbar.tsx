"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Bell, Settings, Plus, Filter } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js"

interface DashboardTopbarProps {
  user: User
}

export function DashboardTopbar({ user }: DashboardTopbarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const bellRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  // Dummy search handler for now
  const onSearch = (term: string) => {
    // TODO: Wire this to palette search logic
    // For now, just log
    console.log("Searching palettes for:", term);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="relative"
              onClick={() => setShowNotifications((prev) => !prev)}
              ref={bellRef}
              aria-label="Show notifications"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 bg-red-500 text-white text-xs flex items-center justify-center">
                3
              </Badge>
            </Button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-xl border border-gray-100 z-50">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Notifications</span>
                  <span className="text-xs text-gray-400">Recent</span>
                </div>
                <ul className="divide-y divide-gray-100 max-h-72 overflow-y-auto">
                  <li className="px-4 py-3 hover:bg-gray-50 transition flex gap-3 items-start">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full flex items-center justify-center text-white">
                      <Bell className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">Your palette <span className="font-semibold text-teal-600">"Summer Vibes"</span> was approved!</p>
                      <span className="text-xs text-gray-500">Just now</span>
                    </div>
                  </li>
                  {/* Add more demo notifications here if desired */}
                </ul>
                <div className="px-4 py-2 border-t border-gray-100 text-center">
                  <button className="text-xs text-teal-600 hover:underline font-medium">View all notifications</button>
                </div>
              </div>
            )}
          </div>

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
          {/* Search for palettes */}
          <form
            onSubmit={e => {
              e.preventDefault();
              onSearch(searchTerm);
            }}
            className="flex items-center gap-2"
          >
            <Input
              type="text"
              placeholder="Search palettes..."
              className="w-48"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <Button type="submit" variant="outline" size="sm">
              <Search className="w-4 h-4 mr-1" />
              Search
            </Button>
          </form>
          <Button
            className="bg-teal-600 hover:bg-teal-700 text-white"
            onClick={() => router.push("/generator")}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Palette
          </Button>
        </div>
      </div>
    </div>
  )
}
