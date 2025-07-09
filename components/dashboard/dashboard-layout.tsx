"use client"

import type React from "react"
import { useState } from "react"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar"
import type { User } from "@supabase/supabase-js"

interface DashboardLayoutProps {
  user: User
  activeTab: string
  onTabChange: (tab: string) => void
  children: React.ReactNode
}

/**
 * Main shell for the dashboard—sidebar, topbar, and content area.
 */
function DashboardLayoutComponent({ user, activeTab, onTabChange, children }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen flex bg-gray-50">
      <DashboardSidebar
        user={user}
        activeTab={activeTab}
        onTabChange={onTabChange}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className={`flex flex-1 flex-col transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <DashboardTopbar user={user} />
        <main className="flex-1 overflow-auto">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}

/* Named export (preferred) */
export { DashboardLayoutComponent as DashboardLayout }
/* Default export (fallback)  */
export default DashboardLayoutComponent
