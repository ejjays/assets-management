"use client"

import { useParams } from "next/navigation"

// Mock asset data for the mobile detail view
const mockAsset = {
  id: "ASSET-00123",
  name: "16-inch MacBook Pro M3",
  category: "Electronics",
  status: "In Use",
  warrantyEndDate: "2026-01-15",
  imageUrl: "/placeholder.svg?height=300&width=300",
}

export default function AssetDetailPage() {
  const params = useParams()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Use":
        return "bg-[#28A745] text-white"
      case "In Repair":
        return "bg-[#FFC107] text-black"
      case "In Storage":
        return "bg-[#FD7E14] text-white"
      case "Decommissioned":
        return "bg-[#DC3545] text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <div className="max-w-lg mx-auto">
        {/* Asset Image */}
        <div className="w-full">
          <img
            src={mockAsset.imageUrl || "/placeholder.svg"}
            alt={mockAsset.name}
            className="w-full h-48 sm:h-64 object-cover"
          />
        </div>

        {/* Asset Details */}
        <div className="p-4 sm:p-6 space-y-6">
          <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight">{mockAsset.name}</h1>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-700">
              <span className="text-[#888888] text-sm sm:text-base">Asset ID</span>
              <span className="text-white font-mono text-sm sm:text-base break-all ml-4">{mockAsset.id}</span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-700">
              <span className="text-[#888888] text-sm sm:text-base">Status</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(mockAsset.status)}`}>
                {mockAsset.status}
              </span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-700">
              <span className="text-[#888888] text-sm sm:text-base">Category</span>
              <span className="text-white text-sm sm:text-base">{mockAsset.category}</span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-700">
              <span className="text-[#888888] text-sm sm:text-base">Warranty End Date</span>
              <span className="text-white text-sm sm:text-base">{mockAsset.warrantyEndDate}</span>
            </div>
          </div>

          <div className="bg-[#1E1E1E] rounded-lg p-4 mt-6">
            <p className="text-gray-400 text-xs sm:text-sm text-center leading-relaxed">
              This is a public view of the asset information. For management features, please access the admin
              dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
