"use client"

import { LayoutDashboard, SlidersHorizontal, Settings } from "lucide-react"

interface SidebarProps {
  activeView: string
  setActiveView: (view: string) => void
  isMobileOpen: boolean
  setIsMobileOpen: (open: boolean) => void
}

export function Sidebar({ activeView, setActiveView, isMobileOpen, setIsMobileOpen }: SidebarProps) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "admin", label: "Admin Panel", icon: SlidersHorizontal },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  const handleNavClick = (viewId: string) => {
    setActiveView(viewId)
    setIsMobileOpen(false) // Close mobile sidebar after selection
  }

  return (
    <div
      className={`
      fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
      ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      lg:flex lg:flex-col shadow-sm
    `}
    >
      <div className="p-4 pt-20 lg:pt-4">
        <div className="mb-8 hidden lg:block">
          <h2 className="text-xl font-bold text-gray-900">Asset Manager</h2>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeView === item.id

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors text-left ${
                  isActive
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Icon size={20} />
                <span className="text-sm sm:text-base font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
