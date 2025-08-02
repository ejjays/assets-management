"use client"

import { Monitor, Car, Wrench, Sofa, Smartphone, Server, BookOpen, FlaskConical, Library, Printer, Dumbbell, Building } from "lucide-react"
import { useAssetStore } from "@/lib/asset-store"

export function AssetCategoryCards() {
  const { assets } = useAssetStore()

  const categories = [
    {
      name: "Classroom Assets",
      icon: BookOpen,
      count: assets.filter((a) => a.category === "Classroom Assets").length,
      gradient: "from-blue-500 via-cyan-600 to-teal-700",
      cardBg: "from-blue-50/80 via-cyan-50/60 to-white/90",
      hoverGlow: "hover:shadow-blue-500/25",
    },
    {
      name: "Laboratory Equipment",
      icon: FlaskConical,
      count: assets.filter((a) => a.category === "Laboratory Equipment").length,
      gradient: "from-emerald-500 via-green-600 to-lime-700",
      cardBg: "from-emerald-50/80 via-green-50/60 to-white/90",
      hoverGlow: "hover:shadow-emerald-500/25",
    },
    {
      name: "Library Resources",
      icon: Library,
      count: assets.filter((a) => a.category === "Library Resources").length,
      gradient: "from-purple-500 via-violet-600 to-indigo-700",
      cardBg: "from-purple-50/80 via-violet-50/60 to-white/90",
      hoverGlow: "hover:shadow-purple-500/25",
    },
    {
      name: "Office & Admin",
      icon: Building,
      count: assets.filter((a) => a.category === "Office & Admin").length,
      gradient: "from-amber-500 via-orange-600 to-red-600",
      cardBg: "from-amber-50/80 via-orange-50/60 to-white/90",
      hoverGlow: "hover:shadow-amber-500/25",
    },
    {
      name: "Sports & Recreation",
      icon: Dumbbell,
      count: assets.filter((a) => a.category === "Sports & Recreation").length,
      gradient: "from-rose-500 via-pink-600 to-purple-700",
      cardBg: "from-rose-50/80 via-pink-50/60 to-white/90",
      hoverGlow: "hover:shadow-rose-500/25",
    },
    {
      name: "IT Infrastructure",
      icon: Server,
      count: assets.filter((a) => a.category === "IT Infrastructure").length,
      gradient: "from-cyan-500 via-blue-600 to-indigo-700",
      cardBg: "from-cyan-50/80 via-blue-50/60 to-white/90",
      hoverGlow: "hover:shadow-cyan-500/25",
    },
    {
      name: "Furniture & Fixtures",
      icon: Sofa,
      count: assets.filter((a) => a.category === "Furniture & Fixtures").length,
      gradient: "from-yellow-500 via-lime-600 to-green-700",
      cardBg: "from-yellow-50/80 via-lime-50/60 to-white/90",
      hoverGlow: "hover:shadow-yellow-500/25",
    },
    {
      name: "Maintenance & Facilities",
      icon: Wrench,
      count: assets.filter((a) => a.category === "Maintenance & Facilities").length,
      gradient: "from-gray-500 via-slate-600 to-zinc-700",
      cardBg: "from-gray-50/80 via-slate-50/60 to-white/90",
      hoverGlow: "hover:shadow-gray-500/25",
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-6">
      {categories.map((category, index) => (
        <div
          key={index}
          className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${category.cardBg} backdrop-blur-sm border border-white/60 p-4 sm:p-6 text-center transition-all duration-500 hover:scale-105 ${category.hoverGlow} hover:shadow-2xl group cursor-pointer`}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-50"></div>

          {/* Content */}
          <div className="relative z-10">
            <div
              className={`mx-auto mb-3 sm:mb-4 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br ${category.gradient} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
            >
              <category.icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 tracking-tight">{category.name}</h3>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 tracking-tight">{category.count}</p>
            <p className="text-xs sm:text-sm text-gray-500">Assets</p>
          </div>
        </div>
      ))}
    </div>
  )
}
