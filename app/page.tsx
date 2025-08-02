"use client"

import { useState, useEffect } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Sidebar } from "@/components/sidebar"
import { Dashboard } from "@/components/dashboard"
import { AdminPanel } from "@/components/admin-panel"
import { ModernCharts } from "@/components/modern-charts"
import { ChatInterface } from "@/components/chat-interface"
import { ToastContainer } from "@/components/toast-container"
import { useAssetStore } from "@/lib/asset-store"

export default function Home() {
  const [activeView, setActiveView] = useState<"dashboard" | "admin" | "analytics">("dashboard")
  const [isChatOpen, setIsChatOpen] = useState(false)
  
  // Add asset store to fetch assets for analytics
  const { assets, loading, fetchAssets } = useAssetStore()

  // Fetch assets when component mounts
  useEffect(() => {
    fetchAssets()
  }, [fetchAssets])

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />

        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
            {activeView === "dashboard" ? (
              <Dashboard />
            ) : activeView === "admin" ? (
              <AdminPanel />
            ) : activeView === "analytics" ? (
              // Add a wrapper with header and pass assets prop
              <div className="flex-1 space-y-4 p-4 md:p-6 lg:p-8 pt-16 md:pt-6">
                {/* Header */}
                <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">Analytics</h2>
                    <p className="text-sm md:text-base text-gray-600">Detailed insights and trends for your assets</p>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Live Data • {assets.length} Assets</span>
                  </div>
                </div>

                {/* Show loading or charts */}
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <ModernCharts assets={assets} />
                )}
              </div>
            ) : null}
          </div>
        </main>

        <ChatInterface isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
        <ToastContainer />
      </div>
    </SidebarProvider>
  )
}