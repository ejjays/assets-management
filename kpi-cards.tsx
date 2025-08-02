"use client"

import { Database, CheckCircle, Wrench, AlertTriangle } from "lucide-react"
import { useAssetStore } from "@/lib/asset-store"
import { useMemo } from "react"

export function KPICards() {
  const { assets } = useAssetStore()

  const kpis = useMemo(() => {
    const totalAssets = assets.length
    const assetsInUse = assets.filter((asset) => asset.status === "In Use").length
    const inRepair = assets.filter((asset) => asset.status === "In Repair").length

    // Calculate low stock alerts (for demo purposes, let's say Office Supplies with < 5 items)
    const officeSupplies = assets.filter((asset) => asset.category === "Office Supplies").length
    const lowStockAlerts = officeSupplies < 5 ? 1 : 0

    return [
      {
        title: "Total Assets",
        value: totalAssets.toString(),
        icon: Database,
        color: "text-white",
      },
      {
        title: "Assets In Use",
        value: assetsInUse.toString(),
        icon: CheckCircle,
        color: "text-white",
      },
      {
        title: "In Repair",
        value: inRepair.toString(),
        icon: Wrench,
        color: "text-[#FFC107]",
      },
      {
        title: "Low Stock Alerts",
        value: lowStockAlerts.toString(),
        icon: AlertTriangle,
        color: "text-[#DC3545]",
      },
    ]
  }, [assets])

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon
        return (
          <div key={index} className="bg-[#1E1E1E] rounded-lg p-3 sm:p-4 lg:p-6">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Icon size={20} className="text-gray-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-[#888888] mb-1 truncate">{kpi.title}</p>
                <p className={`text-lg sm:text-xl lg:text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
