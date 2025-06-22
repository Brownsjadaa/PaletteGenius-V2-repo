"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, Eye, Download, Users, Palette, ArrowUpRight, ArrowDownRight } from "lucide-react"
import type { User } from "@supabase/supabase-js"

interface AnalyticsPanelProps {
  user: User
}

export function AnalyticsPanel({ user }: AnalyticsPanelProps) {
  const [timeRange, setTimeRange] = useState("7d")

  const analyticsData = {
    totalViews: 1247,
    totalDownloads: 89,
    totalShares: 34,
    popularPalettes: [
      { name: "Ocean Breeze", views: 156, downloads: 23 },
      { name: "Sunset Glow", views: 134, downloads: 19 },
      { name: "Forest Deep", views: 98, downloads: 15 },
    ],
    weeklyStats: [
      { day: "Mon", views: 45, downloads: 8 },
      { day: "Tue", views: 52, downloads: 12 },
      { day: "Wed", views: 38, downloads: 6 },
      { day: "Thu", views: 67, downloads: 15 },
      { day: "Fri", views: 71, downloads: 18 },
      { day: "Sat", views: 43, downloads: 9 },
      { day: "Sun", views: 29, downloads: 4 },
    ],
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
          <p className="text-gray-600">Track your palette performance and engagement</p>
        </div>
        <div className="flex gap-2">
          {["7d", "30d", "90d"].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange(range)}
              className={timeRange === range ? "bg-teal-600 hover:bg-teal-700" : ""}
            >
              {range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : "90 Days"}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.totalViews.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">+12.5%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Downloads</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.totalDownloads}</p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">+8.2%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <Download className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Shares</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.totalShares}</p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowDownRight className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-600">-2.1%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Avg. Rating</p>
                <p className="text-2xl font-bold text-gray-900">4.8</p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">+0.3</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-teal-600" />
              Weekly Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.weeklyStats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 w-12">{stat.day}</span>
                  <div className="flex-1 mx-4">
                    <div className="flex gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-teal-600 h-2 rounded-full"
                          style={{ width: `${(stat.views / 80) * 100}%` }}
                        />
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(stat.downloads / 20) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{stat.views}</div>
                    <div className="text-xs text-gray-500">{stat.downloads}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-teal-600 rounded-full" />
                <span className="text-sm text-gray-600">Views</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full" />
                <span className="text-sm text-gray-600">Downloads</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Popular Palettes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-teal-600" />
              Top Performing Palettes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.popularPalettes.map((palette, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-teal-400 to-blue-500 rounded-lg" />
                    <div>
                      <p className="font-medium text-gray-900">{palette.name}</p>
                      <p className="text-sm text-gray-500">{palette.views} views</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-teal-50 text-teal-700">
                    {palette.downloads} downloads
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
