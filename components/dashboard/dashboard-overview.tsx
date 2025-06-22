"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Palette, Folder, Clock, Star, Download, Users, BarChart3, ArrowUpRight, Plus } from "lucide-react"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { CreateFolderModal } from "./create-folder-modal"

interface DashboardOverviewProps {
  user: User
  onTabChange: (tab: string) => void
}

interface Stats {
  totalPalettes: number
  totalFolders: number
  recentActivity: number
  favoriteCount: number
}

interface RecentPalette {
  id: string
  name: string
  colors: string[]
  created_at: string
  is_favorite: boolean
}

export function DashboardOverview({ user, onTabChange }: DashboardOverviewProps) {
  const [stats, setStats] = useState<Stats>({
    totalPalettes: 0,
    totalFolders: 0,
    recentActivity: 0,
    favoriteCount: 0,
  })
  const [recentPalettes, setRecentPalettes] = useState<RecentPalette[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [user])

  const fetchDashboardData = async () => {
    try {
      // Fetch stats
      const [palettesResult, foldersResult, favoritesResult] = await Promise.all([
        supabase.from("palettes").select("id", { count: "exact" }).eq("user_id", user.id),
        supabase.from("folders").select("id", { count: "exact" }).eq("user_id", user.id),
        supabase.from("palettes").select("id", { count: "exact" }).eq("user_id", user.id).eq("is_favorite", true),
      ])

      // Fetch recent palettes
      const { data: recentData } = await supabase
        .from("palettes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(6)

      setStats({
        totalPalettes: palettesResult.count || 0,
        totalFolders: foldersResult.count || 0,
        recentActivity: 12, // Mock data
        favoriteCount: favoritesResult.count || 0,
      })

      setRecentPalettes(recentData || [])
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: "Total Palettes",
      value: stats.totalPalettes,
      change: "+12%",
      changeType: "positive" as const,
      icon: Palette,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Folders",
      value: stats.totalFolders,
      change: "+3",
      changeType: "positive" as const,
      icon: Folder,
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "Recent Activity",
      value: stats.recentActivity,
      change: "This week",
      changeType: "neutral" as const,
      icon: Clock,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Favorites",
      value: stats.favoriteCount,
      change: "+2",
      changeType: "positive" as const,
      icon: Star,
      color: "bg-yellow-50 text-yellow-600",
    },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
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
      {/* Welcome Banner */}
      <Card className="bg-gradient-to-r from-teal-500 to-blue-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Welcome back to PaletteGenius!</h2>
              <p className="text-teal-100 mb-4">
                You've created {stats.totalPalettes} beautiful palettes. Ready to create more?
              </p>
              <Button onClick={() => router.push("/generator")} className="bg-white text-teal-600 hover:bg-gray-100">
                <Plus className="w-4 h-4 mr-2" />
                Create New Palette
              </Button>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
                <Palette className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm text-gray-600 mb-2">{stat.title}</p>
                <div className="flex items-center gap-1">
                  <Badge
                    variant="secondary"
                    className={`text-xs ${
                      stat.changeType === "positive"
                        ? "bg-green-50 text-green-700"
                        : stat.changeType === "negative"
                          ? "bg-red-50 text-red-700"
                          : "bg-gray-50 text-gray-700"
                    }`}
                  >
                    {stat.change}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Palettes */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">Recent Palettes</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard?tab=palettes")}>
              View All
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPalettes.slice(0, 4).map((palette) => (
                <div key={palette.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      {palette.colors.slice(0, 4).map((color, index) => (
                        <div
                          key={index}
                          className="w-6 h-6 rounded border border-gray-200"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{palette.name}</p>
                      <p className="text-sm text-gray-500">{new Date(palette.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {palette.is_favorite && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {recentPalettes.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Palette className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No palettes yet. Create your first one!</p>
                  <Button onClick={() => router.push("/generator")} className="mt-4 bg-teal-600 hover:bg-teal-700">
                    Create Palette
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={() => router.push("/generator")}
              className="w-full justify-start bg-teal-600 hover:bg-teal-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Palette
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => setShowCreateFolderModal(true)}>
              <Folder className="w-4 h-4 mr-2" />
              Create Folder
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => onTabChange("team")}>
              <Users className="w-4 h-4 mr-2" />
              Invite Team Member
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => onTabChange("analytics")}>
              <BarChart3 className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
          </CardContent>

          {/* Add the CreateFolderModal before the closing div */}
          <CreateFolderModal
            isOpen={showCreateFolderModal}
            onClose={() => setShowCreateFolderModal(false)}
            user={user}
            onFolderCreated={fetchDashboardData}
          />
        </Card>
      </div>

      {/* Usage Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Usage This Month</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-teal-600 mb-2">{stats.totalPalettes}</div>
              <p className="text-sm text-gray-600">Palettes Created</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-teal-600 h-2 rounded-full" style={{ width: "75%" }}></div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">156</div>
              <p className="text-sm text-gray-600">Colors Extracted</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: "60%" }}></div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">89</div>
              <p className="text-sm text-gray-600">Exports Made</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: "45%" }}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
