"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { DashboardOverview } from "@/components/dashboard/dashboard-overview"
import { PaletteManagement } from "@/components/dashboard/palette-management"
import { FolderManagement } from "@/components/dashboard/folder-management"
import { SettingsPanel } from "@/components/dashboard/settings-panel"
import { AnalyticsPanel } from "@/components/dashboard/analytics-panel"
import { TeamPanel } from "@/components/dashboard/team-panel"
import { HelpPanel } from "@/components/dashboard/help-panel"
import { ProfilePanel } from "@/components/dashboard/profile-panel"

const TAB_LIST = [
  { slug: "overview", label: "Overview" },
  { slug: "palettes", label: "My Palettes" },
  { slug: "folders", label: "Folders" },
  { slug: "profile", label: "Profile" },
  { slug: "analytics", label: "Analytics" },
  { slug: "team", label: "Team" },
  { slug: "settings", label: "Settings" },
  { slug: "help", label: "Help" },
] as const
type TabSlug = (typeof TAB_LIST)[number]["slug"]

export default function DashboardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const initialTab = (searchParams.get("tab") as TabSlug) ?? "overview"
  const [activeTab, setActiveTab] = useState<TabSlug>(initialTab)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // --- 1. Check auth once on mount ----------------------------------------
  useEffect(() => {
    let mounted = true

    const init = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (error || !session) {
        router.replace("/auth")
        return
      }

      if (mounted) {
        setUser(session.user)
        setLoading(false)
      }
    }

    init()

    // --- 2. Keep listening for auth changes -------------------------------
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return

      if (!session) {
        router.replace("/auth")
      } else {
        setUser(session.user)
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [router])

  // --- 3. Sync activeTab to the URL ---------------------------------------
  const handleTabChange = (tab: TabSlug) => {
    setActiveTab(tab)
    const params = new URLSearchParams(searchParams.toString())
    params.set("tab", tab)
    router.replace(`/dashboard?${params.toString()}`)
  }

  // --- 4. UI states --------------------------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-500">Loading dashboard…</p>
      </div>
    )
  }

  if (!user) {
    // Just in case the redirect hasn’t happened yet
    return null
  }

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <DashboardOverview user={user} onTabChange={handleTabChange} />

      case "palettes":
        return <PaletteManagement user={user} />

      case "folders":
        return <FolderManagement user={user} />

      case "profile":
        return <ProfilePanel user={user} />

      case "analytics":
        return <AnalyticsPanel user={user} />

      case "team":
        return <TeamPanel user={user} />

      case "settings":
        return <SettingsPanel user={user} />

      case "help":
        return <HelpPanel />

      default:
        return <DashboardOverview user={user} onTabChange={handleTabChange} />
    }
  }

  return (
    <DashboardLayout user={user} activeTab={activeTab} onTabChange={handleTabChange}>
      {renderContent()}
    </DashboardLayout>
  )
}
