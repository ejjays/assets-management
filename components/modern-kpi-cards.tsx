"use client"

import { Package, Activity, DollarSign, TrendingUp, Users, AlertTriangle } from "lucide-react"
import { useAssetStore } from "@/lib/asset-store"
import { formatCurrency } from "@/lib/utils"

export function ModernKPICards() {
  const { assets } = useAssetStore()

  const totalAssets = assets.length
  const activeAssets = assets.filter((asset) => asset.status === "Active").length
  const totalValue = assets.reduce((sum, asset) => sum + (asset.value || 0), 0)
  const maintenanceAssets = assets.filter((asset) => asset.status === "Maintenance").length
  // Assuming 'department' might not exist on all assets or might be renamed for a school context.
  // For a school, 'assignedTo' might be more relevant, or a new field 'department'/'faculty'.
  // For now, let's use a placeholder or derive from existing data if possible.
  // If 'assignedTo' can be a department/faculty, then this can be used.
  // Otherwise, it might require a new field in the Asset interface or a different way to categorize.
  const departments = [...new Set(assets.map((asset) => asset.assignedTo || "Unassigned"))].length
  const criticalAssets = assets.filter((asset) => asset.status === "Retired").length

  const kpiData = [
    {
      title: "Total Assets",
      value: totalAssets.toString(),
      description: "All registered assets",
      icon: Package,
      trend: "+12%",
      trendUp: true,
      gradient: "from-blue-500 via-blue-600 to-indigo-700",
      cardBg: "from-blue-50/80 via-indigo-50/60 to-white/90",
      hoverGlow: "hover:shadow-blue-500/25",
    },
    {
      title: "Active Assets",
      value: activeAssets.toString(),
      description: "Currently in use",
      icon: Activity,
      trend: "+8%",
      trendUp: true,
      gradient: "from-emerald-500 via-green-600 to-teal-700",
      cardBg: "from-emerald-50/80 via-green-50/60 to-white/90",
      hoverGlow: "hover:shadow-emerald-500/25",
    },
    {
      title: "Total Value",
      value: formatCurrency(totalValue),
      description: "Asset portfolio value",
      icon: DollarSign,
      trend: "+15%",
      trendUp: true,
      gradient: "from-purple-500 via-violet-600 to-purple-700",
      cardBg: "from-purple-50/80 via-violet-50/60 to-white/90",
      hoverGlow: "hover:shadow-purple-500/25",
    },
    {
      title: "Maintenance",
      value: maintenanceAssets.toString(),
      description: "Assets under maintenance",
      icon: AlertTriangle,
      trend: "-5%",
      trendUp: false,
      gradient: "from-amber-500 via-orange-600 to-red-600",
      cardBg: "from-amber-50/80 via-orange-50/60 to-white/90",
      hoverGlow: "hover:shadow-amber-500/25",
    },
    {
      title: "Departments",
      value: departments.toString(),
      description: "Active departments/faculties",
      icon: Users,
      trend: "+3%",
      trendUp: true,
      gradient: "from-cyan-500 via-blue-600 to-indigo-700",
      cardBg: "from-cyan-50/80 via-blue-50/60 to-white/90",
      hoverGlow: "hover:shadow-cyan-500/25",
    },
    {
      title: "Growth Rate",
      value: "23%",
      description: "Monthly asset growth",
      icon: TrendingUp,
      trend: "+18%",
      trendUp: true,
      gradient: "from-rose-500 via-pink-600 to-purple-700",
      cardBg: "from-rose-50/80 via-pink-50/60 to-white/90",
      hoverGlow: "hover:shadow-rose-500/25",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {kpiData.map((kpi, index) => (
        <div
          key={index}
          className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${kpi.cardBg} backdrop-blur-sm border border-white/60 p-6 transition-all duration-500 hover:scale-105 ${kpi.hoverGlow} hover:shadow-2xl group`}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-50"></div>

          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div
                className={`p-3 rounded-xl bg-gradient-to-br ${kpi.gradient} transition-transform duration-300 group-hover:scale-110`}
              >
                <kpi.icon className="h-6 w-6 text-white" />
              </div>
              <div
                className={`flex items-center text-sm font-medium ${kpi.trendUp ? "text-emerald-600" : "text-red-500"}`}
              >
                <TrendingUp className={`h-4 w-4 mr-1 ${kpi.trendUp ? "" : "rotate-180"}`} />
                {kpi.trend}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-600 tracking-tight">{kpi.title}</h3>
              <p className="text-3xl font-bold text-gray-900 tracking-tight">{kpi.value}</p>
              <p className="text-sm text-gray-500">{kpi.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
