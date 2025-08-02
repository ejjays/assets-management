"use client"

import { useMemo } from "react"
import { Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Bar, BarChart } from "recharts"
import { useAssetStore } from "@/lib/asset-store"

export function ModernCharts() {
  const { assets } = useAssetStore()

  const growthData = useMemo(() => {
    const monthlyCounts: { [key: string]: number } = {}

    assets.forEach((asset) => {
      const dateKey = asset.purchaseDate.substring(0, 7)
      monthlyCounts[dateKey] = (monthlyCounts[dateKey] || 0) + 1
    })

    const sortedMonths = Object.keys(monthlyCounts).sort()
    let cumulativeCount = 0

    return sortedMonths.slice(-6).map((month) => {
      cumulativeCount += monthlyCounts[month]
      const [year, monthNum] = month.split("-")
      const monthName = new Date(Number.parseInt(year), Number.parseInt(monthNum) - 1, 1).toLocaleString("default", {
        month: "short",
      })
      return {
        month: monthName,
        assets: cumulativeCount,
        newAssets: monthlyCounts[month],
      }
    })
  }, [assets])

  const statusData = useMemo(() => {
    const statusCounts = assets.reduce((acc: any, asset) => {
      acc[asset.status] = (acc[asset.status] || 0) + 1
      return acc
    }, {})

    return [
      {
        status: "In Use",
        count: statusCounts["In Use"] || 0,
        percentage: Math.round(((statusCounts["In Use"] || 0) / assets.length) * 100),
      },
      {
        status: "Storage",
        count: statusCounts["In Storage"] || 0,
        percentage: Math.round(((statusCounts["In Storage"] || 0) / assets.length) * 100),
      },
      {
        status: "Repair",
        count: statusCounts["In Repair"] || 0,
        percentage: Math.round(((statusCounts["In Repair"] || 0) / assets.length) * 100),
      },
      {
        status: "Retired",
        count: statusCounts["Decommissioned"] || 0,
        percentage: Math.round(((statusCounts["Decommissioned"] || 0) / assets.length) * 100),
      },
    ]
  }, [assets])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      {/* Asset Growth Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Asset Growth</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={growthData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Bar dataKey="newAssets" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Line
                type="monotone"
                dataKey="assets"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Status Distribution */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Asset Status</h3>
        <div className="space-y-4">
          {statusData.map((item, index) => {
            const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"]
            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: colors[index] }}></div>
                  <span className="text-gray-700 font-medium">{item.status}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: colors[index],
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-gray-900 w-8">{item.percentage}%</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
