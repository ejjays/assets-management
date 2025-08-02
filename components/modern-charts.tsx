"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Line,
  Area,
  AreaChart,
} from "recharts"
import { useAssetStore } from "@/lib/asset-store"

export function ModernCharts() {
  const { assets } = useAssetStore()

  // Modern color palette
  const modernColors = {
    primary: "#3B82F6",
    secondary: "#10B981",
    accent: "#8B5CF6",
    warning: "#F59E0B",
    danger: "#EF4444",
    info: "#06B6D4",
    success: "#22C55E",
    purple: "#A855F7",
    pink: "#EC4899",
    indigo: "#6366F1",
  }

  // Enhanced gradient colors for charts
  const chartColors = [
    "#3B82F6", // Blue
    "#10B981", // Emerald
    "#8B5CF6", // Purple
    "#F59E0B", // Amber
    "#EF4444", // Red
    "#06B6D4", // Cyan
    "#22C55E", // Green
    "#A855F7", // Violet
    "#EC4899", // Pink
    "#6366F1", // Indigo
  ]

  // Category distribution data with modern colors
  const categoryData = [
    {
      name: "Electronics",
      value: assets.filter((a) => a.category === "Electronics").length,
      color: "#3B82F6",
      gradient: "url(#blueGradient)",
    },
    {
      name: "Vehicles",
      value: assets.filter((a) => a.category === "Vehicles").length,
      color: "#10B981",
      gradient: "url(#emeraldGradient)",
    },
    {
      name: "Equipment",
      value: assets.filter((a) => a.category === "Equipment").length,
      color: "#8B5CF6",
      gradient: "url(#purpleGradient)",
    },
    {
      name: "Furniture",
      value: assets.filter((a) => a.category === "Furniture").length,
      color: "#F59E0B",
      gradient: "url(#amberGradient)",
    },
    {
      name: "Mobile",
      value: assets.filter((a) => a.category === "Mobile Devices").length,
      color: "#EC4899",
      gradient: "url(#pinkGradient)",
    },
    {
      name: "IT Hardware",
      value: assets.filter((a) => a.category === "IT Hardware").length,
      color: "#06B6D4",
      gradient: "url(#cyanGradient)",
    },
  ].filter((item) => item.value > 0)

  // Status distribution data with modern colors
  const statusData = [
    {
      name: "Active",
      value: assets.filter((a) => a.status === "Active").length,
      color: "#22C55E",
      fill: "#22C55E",
    },
    {
      name: "Maintenance",
      value: assets.filter((a) => a.status === "Maintenance").length,
      color: "#F59E0B",
      fill: "#F59E0B",
    },
    {
      name: "Retired",
      value: assets.filter((a) => a.status === "Retired").length,
      color: "#EF4444",
      fill: "#EF4444",
    },
  ].filter((item) => item.value > 0)

  // Enhanced trend data with multiple metrics
  const trendData = [
    {
      month: "Jan",
      assets: Math.max(1, assets.length - 30),
      value: Math.max(10, assets.reduce((sum, a) => sum + (a.value || 0), 0) / 1000 - 50),
      maintenance: Math.max(0, assets.filter((a) => a.status === "Maintenance").length - 2),
    },
    {
      month: "Feb",
      assets: Math.max(1, assets.length - 25),
      value: Math.max(15, assets.reduce((sum, a) => sum + (a.value || 0), 0) / 1000 - 40),
      maintenance: Math.max(0, assets.filter((a) => a.status === "Maintenance").length - 1),
    },
    {
      month: "Mar",
      assets: Math.max(1, assets.length - 20),
      value: Math.max(20, assets.reduce((sum, a) => sum + (a.value || 0), 0) / 1000 - 30),
      maintenance: Math.max(0, assets.filter((a) => a.status === "Maintenance").length - 1),
    },
    {
      month: "Apr",
      assets: Math.max(1, assets.length - 15),
      value: Math.max(25, assets.reduce((sum, a) => sum + (a.value || 0), 0) / 1000 - 20),
      maintenance: Math.max(0, assets.filter((a) => a.status === "Maintenance").length),
    },
    {
      month: "May",
      assets: Math.max(1, assets.length - 10),
      value: Math.max(30, assets.reduce((sum, a) => sum + (a.value || 0), 0) / 1000 - 10),
      maintenance: Math.max(0, assets.filter((a) => a.status === "Maintenance").length),
    },
    {
      month: "Jun",
      assets: assets.length,
      value: assets.reduce((sum, a) => sum + (a.value || 0), 0) / 1000,
      maintenance: assets.filter((a) => a.status === "Maintenance").length,
    },
  ]

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm p-4 border border-gray-200/50 rounded-xl shadow-2xl">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === "number" ? entry.value.toLocaleString() : entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-8">
      {/* SVG Gradients for enhanced visuals */}
      <svg width="0" height="0">
        <defs>
          <linearGradient id="blueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#1D4ED8" stopOpacity={0.3} />
          </linearGradient>
          <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10B981" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#047857" stopOpacity={0.3} />
          </linearGradient>
          <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#6D28D9" stopOpacity={0.3} />
          </linearGradient>
          <linearGradient id="amberGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#D97706" stopOpacity={0.3} />
          </linearGradient>
          <linearGradient id="pinkGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#EC4899" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#BE185D" stopOpacity={0.3} />
          </linearGradient>
          <linearGradient id="cyanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#0891B2" stopOpacity={0.3} />
          </linearGradient>
        </defs>
      </svg>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Analytics Overview</h3>
          <p className="text-gray-600 mt-1">Real-time insights and performance metrics</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-500 font-medium">Live Data</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {/* Enhanced Category Distribution */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-gray-900">Asset Distribution</h4>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="white" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 space-y-3">
            {categoryData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: item.color }}></div>
                  <span className="text-gray-700 font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Status Overview */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-gray-900">Asset Status</h4>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={{ stroke: "#e2e8f0" }} />
                <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={{ stroke: "#e2e8f0" }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} stroke="white" strokeWidth={2}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Enhanced Growth Trend */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 lg:col-span-2 xl:col-span-1">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-gray-900">Growth Trends</h4>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="assetGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="valueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={{ stroke: "#e2e8f0" }} />
                <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={{ stroke: "#e2e8f0" }} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="assets"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  fill="url(#assetGradient)"
                  name="Assets"
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ fill: "#10B981", strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, stroke: "#10B981", strokeWidth: 2 }}
                  name="Value (K$)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">Assets</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span className="text-gray-600">Value</span>
              </div>
            </div>
            <span className="font-bold text-emerald-600 text-lg">
              +{Math.round((assets.length / Math.max(1, assets.length - 30)) * 100 - 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
