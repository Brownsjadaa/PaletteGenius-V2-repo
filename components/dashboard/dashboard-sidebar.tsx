"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  Palette,
  Folder,
  Settings,
  Plus,
  ChevronLeft,
  ChevronRight,
  Crown,
  Sparkles,
  BarChart3,
  Users,
  HelpCircle,
  User,
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import Link from "next/link"

interface DashboardSidebarProps {
  user: SupabaseUser
  activeTab: string
  onTabChange: (tab: string) => void
  collapsed: boolean
  onToggleCollapse: () => void
}

export function DashboardSidebar({ user, activeTab, onTabChange, collapsed, onToggleCollapse }: DashboardSidebarProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const mainNavItems = [
    {
      id: "overview",
      label: "Overview",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: "palettes",
      label: "My Palettes",
      icon: Palette,
      badge: "24",
    },
    {
      id: "folders",
      label: "Folders",
      icon: Folder,
      badge: "8",
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
      badge: null,
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      badge: "Pro",
    },
  ]

  const secondaryNavItems = [
    {
      id: "team",
      label: "Team",
      icon: Users,
      badge: null,
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      badge: null,
    },
    {
      id: "help",
      label: "Help & Support",
      icon: HelpCircle,
      badge: null,
    },
  ]

  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 z-50 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-gray-900">PaletteGenius</span>
          </Link>
        )}
        <Button variant="ghost" size="sm" onClick={onToggleCollapse} className="text-gray-500">
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Create Button */}
      <div className="p-4">
        <Button
          onClick={() => router.push("/generator")}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white justify-start"
        >
          <Plus className="w-4 h-4 mr-2" />
          {!collapsed && "Create Palette"}
        </Button>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 px-4">
        <div className="mb-6">
          {!collapsed && <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Workspace</p>}
          <nav className="space-y-1">
            {mainNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? "bg-teal-50 text-teal-700 border border-teal-200"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <Badge
                        variant={item.badge === "Pro" ? "default" : "secondary"}
                        className={`text-xs ${
                          item.badge === "Pro" ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="mb-6">
          {!collapsed && <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Account</p>}
          <nav className="space-y-1">
            {secondaryNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? "bg-teal-50 text-teal-700 border border-teal-200"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto">
        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {user.email?.charAt(0).toUpperCase()}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                <p className="text-xs text-gray-500">Free Plan</p>
              </div>
            )}
          </div>
          {!collapsed && (
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="w-full mt-2 text-gray-600 text-xs">
              Sign Out
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardSidebar
