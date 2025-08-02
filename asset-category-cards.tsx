"use client"

import { useAssetStore } from "@/lib/asset-store"
import { useMemo } from "react"
import { Monitor, Armchair, Code, Package } from "lucide-react"

export function AssetCategoryCards() {
  const { assets } = useAssetStore()

  const categoryData = useMemo(() => {
    const categories = assets.reduce((acc: any, asset) => {
      if (!acc[asset.category]) {
        acc[asset.category] = { count: 0, totalValue: 0 }
      }
      acc[asset.category].count += 1
      acc[asset.category].totalValue += asset.value
      return acc
    }, {})

    return [
      {
        name: "Electronics",
        count: categories.Electronics?.count || 0,
        value: categories.Electronics?.totalValue || 0,
        icon: Monitor,
        gradient: "from-blue-400 via-blue-500 to-blue-600",
        bgPattern: "bg-gradient-to-br from-blue-50 to-blue-100",
        tags: ["Hardware", "Tech"],
      },
      {
        name: "Furniture",
        count: categories.Furniture?.count || 0,
        value: categories.Furniture?.totalValue || 0,
        icon: Armchair,
        gradient: "from-green-400 via-green-500 to-green-600",
        bgPattern: "bg-gradient-to-br from-green-50 to-green-100",
        tags: ["Office", "Comfort"],
      },
      {
        name: "Software",
        count: categories.Software?.count || 0,
        value: categories.Software?.totalValue || 0,
        icon: Code,
        gradient: "from-purple-400 via-purple-500 to-purple-600",
        bgPattern: "bg-gradient-to-br from-purple-50 to-purple-100",
        tags: ["Digital", "License"],
      },
      {
        name: "Office Supplies",
        count: categories["Office Supplies"]?.count || 0,
        value: categories["Office Supplies"]?.totalValue || 0,
        icon: Package,
        gradient: "from-orange-400 via-orange-500 to-orange-600",
        bgPattern: "bg-gradient-to-br from-orange-50 to-orange-100",
        tags: ["Supplies", "Daily"],
      },
    ]
  }, [assets])

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Asset Categories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categoryData.map((category, index) => {
          const Icon = category.icon
          return (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              {/* Header with gradient and icon */}
              <div className={`h-32 ${category.bgPattern} relative overflow-hidden`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-10`}></div>
                <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-sm">
                  <span className="text-sm font-bold text-gray-900">
                    ${Math.round(category.value).toLocaleString()}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4">
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${category.gradient} rounded-xl flex items-center justify-center shadow-lg`}
                  >
                    <Icon size={24} className="text-white" />
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute top-2 left-2 w-16 h-16 bg-white/20 rounded-full blur-xl"></div>
                <div className="absolute bottom-2 right-2 w-12 h-12 bg-white/10 rounded-full blur-lg"></div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-1">{category.name}</h3>
                <p className="text-gray-500 text-sm mb-3">{category.count} items in inventory</p>

                <div className="flex flex-wrap gap-1">
                  {category.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
