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
import { useInView } from "react-intersection-observer"
import { useState, useEffect, useMemo, RefObject } from "react"

interface Asset {
  _id: string;
  name: string;
  category: string;
  status: "Active" | "Maintenance" | "Retired";
  location: string;
  purchaseDate: string;
  value: number;
  assignedTo?: string;
}

interface ModernChartsProps {
  assets: Asset[];
  scrollContainerRef?: RefObject<HTMLDivElement>; // New prop for the scroll container ref
}

const useAnimateOnInView = (rootRef?: RefObject<HTMLDivElement>) => {
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.1,
    root: rootRef?.current, // Use the provided root ref, or default to viewport
    rootMargin: "200px 0px",
  })
  const [key, setKey] = useState(0)

  useEffect(() => {
    if (inView) {
      setKey((prevKey) => prevKey + 1)
    }
  }, [inView])

  return { ref, key, inView }
}

export function ModernCharts({ assets = [], scrollContainerRef }: ModernChartsProps) {
  // Using a default empty array for assets to prevent 'undefined' errors
  
  const { ref: pieChartRef, key: pieChartKey, inView: pieChartInView } = useAnimateOnInView(scrollContainerRef)
  const { ref: barChartRef, key: barChartKey, inView: barChartInView } = useAnimateOnInView(scrollContainerRef)
  const { ref: areaChartRef, key: areaChartKey, inView: areaChartInView } = useAnimateOnInView(scrollContainerRef)

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
    "#D946EF", // Fuchsia
    "#14B8A6", // Teal
  ]

  // Category distribution data with modern colors
  const categoryData = useMemo(
    () =>
      [
        {
          name: "Classroom Assets",
          value: assets.filter((a) => a.category === "Classroom Assets").length,
          color: chartColors[0],
          gradient: "url(#blueGradient)",
        },
        {
          name: "Laboratory Equipment",
          value: assets.filter((a) => a.category === "Laboratory Equipment").length,
          color: chartColors[1],
          gradient: "url(#emeraldGradient)",
        },
        {
          name: "Library Resources",
          value: assets.filter((a) => a.category === "Library Resources").length,
          color: chartColors[2],
          gradient: "url(#purpleGradient)",
        },
        {
          name: "Office & Admin",
          value: assets.filter((a) => a.category === "Office & Admin").length,
          color: chartColors[3],
          gradient: "url(#amberGradient)",
        },
        {
          name: "Sports & Recreation",
          value: assets.filter((a) => a.category === "Sports & Recreation").length,
          color: chartColors[4],
          gradient: "url(#dangerGradient)", 
        },
        {
          name: "IT Infrastructure",
          value: assets.filter((a) => a.category === "IT Infrastructure").length,
          color: chartColors[5],
          gradient: "url(#cyanGradient)",
        },
        {
          name: "Furniture & Fixtures",
          value: assets.filter((a) => a.category === "Furniture & Fixtures").length,
          color: chartColors[6],
          gradient: "url(#successGradient)", 
        },
        {
          name: "Maintenance & Facilities",
          value: assets.filter((a) => a.category === "Maintenance & Facilities").length,
          color: chartColors[7],
          gradient: "url(#purpleGradient)", 
        },
      ],
    [assets],
  )

  // Status distribution data with modern colors
  const statusData = useMemo(
    () =>
      [
        {
          name: "Active",
          value: assets.filter((a) => a.status === "Active").length,
          color: modernColors.success,
          fill: modernColors.success,
        },
        {
          name: "Maintenance",
          value: assets.filter((a) => a.status === "Maintenance").length,
          color: modernColors.warning,
          fill: modernColors.warning,
        },
        {
          name: "Retired",
          value: assets.filter((a) => a.status === "Retired").length,
          color: modernColors.danger,
          fill: modernColors.danger,
        },
      ],
    [assets],
  )

  // Enhanced trend data with multiple metrics
  const trendData = useMemo(
    () =>
      [
        {
          month: "Jan",
          assets: Math.max(1, assets.length > 0 ? assets.length - 30 : 0),
          value: Math.max(10, assets.length > 0 ? assets.reduce((sum, a) => sum + (a.value || 0), 0) / 1000 - 50 : 0),
          maintenance: Math.max(0, assets.length > 0 ? assets.filter((a) => a.status === "Maintenance").length - 2 : 0),
        },
        {
          month: "Feb",
          assets: Math.max(1, assets.length > 0 ? assets.length - 25 : 0),
          value: Math.max(15, assets.length > 0 ? assets.reduce((sum, a) => sum + (a.value || 0), 0) / 1000 - 40 : 0),
          maintenance: Math.max(0, assets.length > 0 ? assets.filter((a) => a.status === "Maintenance").length - 1 : 0),
        },
        {
          month: "Mar",
          assets: Math.max(1, assets.length > 0 ? assets.length - 20 : 0),
          value: Math.max(20, assets.length > 0 ? assets.reduce((sum, a) => sum + (a.value || 0), 0) / 1000 - 30 : 0),
          maintenance: Math.max(0, assets.length > 0 ? assets.filter((a) => a.status === "Maintenance").length - 1 : 0),
        },
        {
          month: "Apr",
          assets: Math.max(1, assets.length > 0 ? assets.length - 15 : 0),
          value: Math.max(25, assets.length > 0 ? assets.reduce((sum, a) => sum + (a.value || 0), 0) / 1000 - 20 : 0),
          maintenance: Math.max(0, assets.length > 0 ? assets.filter((a) => a.status === "Maintenance").length : 0),
        },
        {
          month: "May",
          assets: Math.max(1, assets.length > 0 ? assets.length - 10 : 0),
          value: Math.max(30, assets.length > 0 ? assets.reduce((sum, a) => sum + (a.value || 0), 0) / 1000 - 10 : 0),
          maintenance: Math.max(0, assets.length > 0 ? assets.filter((a) => a.status === "Maintenance").length : 0),
        },
        {
          month: "Jun",
          assets: assets.length,
          value: assets.reduce((sum, a) => sum + (a.value || 0), 0) / 1000,
          maintenance: assets.filter((a) => a.status === "Maintenance").length,
        },
      ],
    [assets],
  )

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
          <linearGradient id="dangerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#EF4444" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#B91C1C" stopOpacity={0.3} />
          </linearGradient>
          <linearGradient id="cyanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#0891B2" stopOpacity={0.3} />
          </linearGradient>
          <linearGradient id="successGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#22C55E" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#15803D" stopOpacity={0.3} />
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
        <div
          ref={pieChartRef}
          className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-gray-900">Asset Distribution</h4>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
          <div className="flex-1 min-h-[16rem]">
            {pieChartInView && (
              <ResponsiveContainer width="100%" height="100%" key={pieChartKey}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    isAnimationActive={true}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="white" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            )}
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
        <div
          ref={barChartRef}
          className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col"
>
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-gray-900">Asset Status</h4>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          </div>
          <div className="min-h-[16rem] lg:h-96 lg:flex-initial">
            {barChartInView && (
              <ResponsiveContainer width="100%" height="100%" key={barChartKey}>
                <BarChart data={statusData} margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={{ stroke: "#e2e8f0" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={{ stroke: "#e2e8f0" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} stroke="white" strokeWidth={2}>
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))
}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Enhanced Growth Trend */}
        <div
          ref={areaChartRef}
          className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 lg:col-span-2 xl:col-span-1 flex flex-col"
>
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-gray-900">Growth Trends</h4>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
          </div>
          <div className="min-h-[16rem] lg:h-96 lg:flex-initial">
            {areaChartInView && (
              <ResponsiveContainer width="100%" height="100%" key={areaChartKey}>
                <AreaChart data={trendData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
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
            )}
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
