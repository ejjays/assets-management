"use client"

import { TrendingUp, TrendingDown } from "lucide-react"
import { useAssetStore } from "@/lib/asset-store"
import { useMemo } from "react"

export function ModernKPICards() {
  const { assets } = useAssetStore()

  const kpis = useMemo(() => {
    const totalAssets = assets.length
    const assetsInUse = assets.filter((asset) => asset.status === "In Use").length
    const inRepair = assets.filter((asset) => asset.status === "In Repair").length
    const lowStockAlerts = assets.filter((asset) => asset.category === "Office Supplies").length < 5 ? 1 : 0

    return [
      {
        title: "Total Assets",
        value: totalAssets.toLocaleString(),
        trend: "+12%",
        trendUp: true,
        subtitle: "vs last month",
        color: "from-blue-500 to-blue-600",
      },
      {
        title: "Assets In Use",
        value: assetsInUse.toLocaleString(),
        trend: "+8%",
        trendUp: true,
        subtitle: "vs last month",
        color: "from-green-500 to-green-600",
      },
      {
        title: "In Repair",
        value: inRepair.toString(),
        trend: "-2%",
        trendUp: false,
        subtitle: "vs last month",
        color: "from-orange-500 to-orange-600",
      },
    ]
  }, [assets])

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {kpis.map((kpi, index) => (
        <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 text-sm font-medium">{kpi.title}</h3>
            <div className="flex items-center space-x-1">
              {kpi.trendUp ? (
                <TrendingUp size={14} className="text-green-500" />
              ) : (
                <TrendingDown size={14} className="text-red-500" />
              )}
              <span className={`text-xs font-medium ${kpi.trendUp ? "text-green-500" : "text-red-500"}`}>
                {kpi.trend}
              </span>
            </div>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{kpi.value}</div>
              <div className="text-gray-500 text-xs">{kpi.subtitle}</div>
            </div>

            {/* Mini trend chart */}
            <div className="w-20 h-8">
              <svg viewBox="0 0 80 32" className="w-full h-full">
                <defs>
                  <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop
                      offset="0%"
                      className={`${kpi.trendUp ? "text-green-500" : "text-red-500"}`}
                      stopOpacity="0.3"
                    />
                    <stop
                      offset="100%"
                      className={`${kpi.trendUp ? "text-green-500" : "text-red-500"}`}
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>
                <path
                  d={kpi.trendUp ? "M0,24 Q20,16 40,12 T80,8" : "M0,8 Q20,12 40,16 T80,24"}
                  fill="none"
                  stroke={kpi.trendUp ? "#10b981" : "#ef4444"}
                  strokeWidth="2"
                />
                <path
                  d={
                    kpi.trendUp ? "M0,24 Q20,16 40,12 T80,8 L80,32 L0,32 Z" : "M0,8 Q20,12 40,16 T80,24 L80,32 L0,32 Z"
                  }
                  fill={`url(#gradient-${index})`}
                />
              </svg>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
