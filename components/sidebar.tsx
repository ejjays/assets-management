"use client"

import { useState } from "react"
import { LayoutDashboard, Settings, Package, BarChart3, Users, FileText, Menu, X, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/components/ui/sidebar"

interface SidebarProps {
  activeView: "dashboard" | "admin"
  setActiveView: (view: "dashboard" | "admin") => void
}

export function Sidebar({ activeView, setActiveView }: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const { state } = useSidebar()

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      view: "dashboard" as const,
    },
    {
      id: "admin",
      label: "Asset Management",
      icon: Package,
      view: "admin" as const,
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      disabled: true,
    },
    {
      id: "users",
      label: "Users",
      icon: Users,
      disabled: true,
    },
    {
      id: "reports",
      label: "Reports",
      icon: FileText,
      disabled: true,
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      disabled: true,
    },
  ]

  const handleMenuClick = (item: (typeof menuItems)[0]) => {
    if (!item.disabled && item.view) {
      setActiveView(item.view)
      setIsMobileOpen(false)
    }
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-50 md:hidden bg-white shadow-md"
        onClick={() => setIsMobileOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
          state === "collapsed" && "md:w-16",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className={cn("flex items-center space-x-3", state === "collapsed" && "md:justify-center")}>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              {(state !== "collapsed" || isMobileOpen) && (
                <div>
                  <h1 className="text-lg font-bold text-gray-900">AssetFlow</h1>
                  <p className="text-xs text-gray-500">Management System</p>
                </div>
              )}
            </div>

            {/* Mobile Close Button */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMobileOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = activeView === item.view

                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start h-11 px-3",
                      isActive && "bg-gradient-to-r from-blue-600 to-purple-600 text-white",
                      item.disabled && "opacity-50 cursor-not-allowed",
                      state === "collapsed" && "md:justify-center md:px-2",
                    )}
                    onClick={() => handleMenuClick(item)}
                    disabled={item.disabled}
                  >
                    <Icon className={cn("h-5 w-5", (state !== "collapsed" || isMobileOpen) && "mr-3")} />
                    {(state !== "collapsed" || isMobileOpen) && <span className="truncate">{item.label}</span>}
                    {item.disabled && (state !== "collapsed" || isMobileOpen) && (
                      <span className="ml-auto text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">Soon</span>
                    )}
                  </Button>
                )
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className={cn("flex items-center space-x-3", state === "collapsed" && "md:justify-center")}>
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">A</span>
              </div>
              {(state !== "collapsed" || isMobileOpen) && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
                  <p className="text-xs text-gray-500 truncate">admin@bcp.edu.ph</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
