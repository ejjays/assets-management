"use client"

import { useState } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Sidebar } from "@/components/sidebar"
import { Dashboard } from "@/components/dashboard"
import { AdminPanel } from "@/components/admin-panel"
import { ChatInterface } from "@/components/chat-interface"
import { ToastContainer } from "@/components/toast-container"

export default function Home() {
  const [activeView, setActiveView] = useState<"dashboard" | "admin">("dashboard")
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />

        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto">{activeView === "dashboard" ? <Dashboard /> : <AdminPanel />}</div>
        </main>

        <ChatInterface isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
        <ToastContainer />
      </div>
    </SidebarProvider>
  )
}
