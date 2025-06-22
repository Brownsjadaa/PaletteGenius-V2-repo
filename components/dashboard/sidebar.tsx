"use client"
import { Button } from "@/components/ui/button"
import { Palette, Folder, Star, Settings, HelpCircle, LogOut, Crown, Plus } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

interface DashboardSidebarProps {
  activeView: "palettes" | "folders"
  onViewChange: (view: "palettes" | "folders") => void
  onCreateFolder: () => void
}

export function DashboardSidebar({ activeView, onViewChange, onCreateFolder }: DashboardSidebarProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const menuItems = [
    {
      id: "palettes",
      label: "My Palettes",
      icon: Palette,
      active: activeView === "palettes",
      onClick: () => onViewChange("palettes"),
    },
    {
      id: "folders",
      label: "Folders",
      icon: Folder,
      active: activeView === "folders",
      onClick: () => onViewChange("folders"),
    },
    {
      id: "favorites",
      label: "Favorites",
      icon: Star,
      active: false,
      onClick: () => {},
    },
  ]

  const generalItems = [
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      onClick: () => {},
    },
    {
      id: "help",
      label: "Support & Help",
      icon: HelpCircle,
      onClick: () => {},
    },
  ]

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Palette className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-semibold">PaletteGenius</span>
        </div>
      </div>

      {/* Menu Section */}
      <div className="flex-1 px-4 py-6">
        <div className="mb-8">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">Menu</p>
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={item.onClick}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  item.active ? "bg-indigo-600 text-white" : "text-gray-300 hover:text-white hover:bg-gray-800"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mb-8">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">General</p>
          <nav className="space-y-2">
            {generalItems.map((item) => (
              <button
                key={item.id}
                onClick={item.onClick}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Premium Plan Section */}
        <div className="bg-gray-800 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Crown className="w-5 h-5 text-yellow-500" />
            <span className="font-semibold text-sm">Premium Plan</span>
          </div>
          <p className="text-xs text-gray-400 mb-4">Upgrade your free plan. PaletteGenius into premium plan.</p>
          <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium" size="sm">
            See detail
          </Button>
        </div>

        {/* Create Folder Button */}
        <Button onClick={onCreateFolder} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white mb-4" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Create Folder
        </Button>
      </div>

      {/* User Section */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">A</span>
            </div>
            <div>
              <p className="text-sm font-medium">Athan's Workspace</p>
              <p className="text-xs text-gray-400">Free plan</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-gray-400 hover:text-white">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
