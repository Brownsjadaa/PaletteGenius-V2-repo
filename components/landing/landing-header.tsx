"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Palette, Menu, X, User, Settings, FolderOpen, LogOut, PaletteIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { supabase } from "@/lib/supabase"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"

interface LandingHeaderProps {
  user: SupabaseUser | null
  onGetStarted: () => void
}

export function LandingHeader({ user, onGetStarted }: LandingHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  const navigation = [
    { name: "Features", href: "#features" },
    { name: "Templates", href: "/templates" },
    { name: "How it Works", href: "#how-it-works" },
    { name: "Pricing", href: "#pricing" },
  ]

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  const handleLogoClick = () => {
    router.push("/")
  }

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Now clickable */}
          <button onClick={handleLogoClick} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">PaletteGenius</span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-teal-600 font-medium transition-colors"
                onClick={(e) => {
                  if (item.href.startsWith("/")) {
                    e.preventDefault()
                    handleNavigation(item.href)
                  }
                }}
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 hover:bg-gray-50">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.user_metadata?.avatar_url || "/placeholder.svg"} />
                      <AvatarFallback className="bg-teal-100 text-teal-700">
                        {user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium text-gray-900">
                        {user.user_metadata?.full_name || user.email?.split("@")[0]}
                      </span>
                      <span className="text-xs text-gray-500">{user.email}</span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleNavigation("/dashboard")}>
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavigation("/generator")}>
                    <PaletteIcon className="mr-2 h-4 w-4" />
                    Color Generator
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavigation("/dashboard?tab=palettes")}>
                    <FolderOpen className="mr-2 h-4 w-4" />
                    My Palettes
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavigation("/dashboard?tab=settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={async () => {
                      await supabase.auth.signOut()
                      router.push("/")
                    }}
                    className="text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" onClick={() => handleNavigation("/auth")}>
                  Sign In
                </Button>
                <Button onClick={onGetStarted} className="bg-teal-600 hover:bg-teal-700 text-white">
                  Get Started Free
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4">
            <div className="space-y-4">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block text-gray-600 hover:text-teal-600 font-medium"
                  onClick={(e) => {
                    if (item.href.startsWith("/")) {
                      e.preventDefault()
                      handleNavigation(item.href)
                    }
                    setMobileMenuOpen(false)
                  }}
                >
                  {item.name}
                </a>
              ))}
              <div className="pt-4 space-y-2">
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={user.user_metadata?.avatar_url || "/placeholder.svg"} />
                        <AvatarFallback className="bg-teal-100 text-teal-700">
                          {user.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">
                          {user.user_metadata?.full_name || user.email?.split("@")[0]}
                        </span>
                        <span className="text-xs text-gray-500">{user.email}</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleNavigation("/dashboard")}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleNavigation("/generator")}
                    >
                      <PaletteIcon className="mr-2 h-4 w-4" />
                      Color Generator
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-red-600 hover:text-red-600"
                      onClick={async () => {
                        await supabase.auth.signOut()
                        router.push("/")
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button variant="outline" className="w-full" onClick={() => handleNavigation("/auth")}>
                      Sign In
                    </Button>
                    <Button onClick={onGetStarted} className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                      Get Started Free
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
