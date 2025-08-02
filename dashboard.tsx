"use client"

import { ModernKPICards } from "@/components/modern-kpi-cards"
import { AssetCategoryCards } from "@/components/asset-category-cards"
import { ModernCharts } from "@/components/modern-charts"
import { AssetTable } from "@/components/asset-table"

export function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="p-6 space-y-8 w-full">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Asset Dashboard</h1>
          <p className="text-gray-600">Monitor and manage your company assets</p>
        </div>

        <ModernKPICards />
        <AssetCategoryCards />
        <ModernCharts />
        <AssetTable />
      </div>
    </div>
  )
}
