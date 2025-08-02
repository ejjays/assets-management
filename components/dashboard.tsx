"use client"

import { useEffect } from "react"
import { ModernKPICards } from "@/components/modern-kpi-cards"
import { AssetCategoryCards } from "@/components/asset-category-cards"
import { ModernCharts } from "@/components/modern-charts"
import { useAssetStore } from "@/lib/asset-store"

export function Dashboard() {
  const { assets, loading, fetchAssets } = useAssetStore()

  // Fetch assets when component mounts
  useEffect(() => {
    fetchAssets()
  }, [fetchAssets])

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-6 lg:p-8 pt-16 md:pt-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-6 lg:p-8 pt-16 md:pt-6">
      {/* Header */}
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">Asset Dashboard</h2>
          <p className="text-sm md:text-base text-gray-600">Overview of your asset management system</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Live Data • {assets.length} Assets</span>
        </div>
      </div>

      {/* KPI Cards - Pass assets as prop */}
      <ModernKPICards assets={assets} />

      {/* Category Cards - Pass assets as prop */}
      <AssetCategoryCards assets={assets} />

      {/* Charts - Pass assets as prop */}
      <ModernCharts assets={assets} />
    </div>
  )
}