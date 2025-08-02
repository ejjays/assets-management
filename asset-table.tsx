"use client"

import { useState, useMemo } from "react"
import { Search, MoreVertical, Edit, QrCode, History, Filter } from "lucide-react"
import { QRModal } from "@/components/qr-modal"
import { useAssetStore } from "@/lib/asset-store"

export function AssetTable() {
  const { assets } = useAssetStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [selectedAsset, setSelectedAsset] = useState<any>(null)
  const [showQRModal, setShowQRModal] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Use":
        return "bg-green-100 text-green-800 border border-green-200"
      case "In Repair":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200"
      case "In Storage":
        return "bg-blue-100 text-blue-800 border border-blue-200"
      case "Decommissioned":
        return "bg-red-100 text-red-800 border border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200"
    }
  }

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchesSearch =
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = !categoryFilter || asset.category === categoryFilter
      const matchesStatus = !statusFilter || asset.status === statusFilter

      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [assets, searchTerm, categoryFilter, statusFilter])

  const handleQRGenerate = (asset: any) => {
    setSelectedAsset(asset)
    setShowQRModal(true)
  }

  // Modern Mobile Card Component
  const AssetCard = ({ asset }: { asset: any }) => (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">{asset.name.charAt(0)}</span>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-gray-900 font-semibold text-lg truncate">{asset.name}</h3>
            <p className="text-gray-500 text-sm font-mono">{asset.id}</p>
          </div>
        </div>
        <div className="relative group">
          <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <MoreVertical size={18} className="text-gray-400" />
          </button>
          <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 min-w-[140px]">
            <div className="py-2">
              <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors">
                <Edit size={16} />
                <span className="font-medium">Edit</span>
              </button>
              <button
                onClick={() => handleQRGenerate(asset)}
                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors"
              >
                <QrCode size={16} />
                <span className="font-medium">Generate QR</span>
              </button>
              <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors">
                <History size={16} />
                <span className="font-medium">View History</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <span className="text-gray-500 text-xs font-medium uppercase tracking-wide">Category</span>
          <p className="text-gray-900 font-semibold">{asset.category}</p>
        </div>
        <div className="space-y-1">
          <span className="text-gray-500 text-xs font-medium uppercase tracking-wide">Status</span>
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(asset.status)}`}
          >
            {asset.status}
          </span>
        </div>
        <div className="space-y-1">
          <span className="text-gray-500 text-xs font-medium uppercase tracking-wide">Assigned To</span>
          <p className="text-gray-900 font-semibold">{asset.assignedTo}</p>
        </div>
        <div className="space-y-1">
          <span className="text-gray-500 text-xs font-medium uppercase tracking-wide">Value</span>
          <p className="text-gray-900 font-semibold">${asset.value.toLocaleString()}</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Purchase Date</span>
          <span className="text-gray-900 font-medium">{asset.purchaseDate}</span>
        </div>
      </div>
    </div>
  )

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Asset Inventory</h2>
            <p className="text-gray-600 mt-1">Manage and track all your company assets</p>
          </div>
          <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
            {filteredAssets.length} of {assets.length} assets
          </div>
        </div>

        {/* Modern Search and Filters */}
        <div className="space-y-4">
          <div className="flex space-x-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search assets by name, ID, or assignee..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3 border border-gray-200 rounded-xl transition-all lg:hidden ${
                showFilters
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : "bg-gray-50 text-gray-500 hover:text-gray-700"
              }`}
            >
              <Filter size={20} />
            </button>
          </div>

          {/* Desktop Filters */}
          <div className="hidden lg:flex space-x-4">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Furniture">Furniture</option>
              <option value="Software">Software</option>
              <option value="Office Supplies">Office Supplies</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">All Statuses</option>
              <option value="In Use">In Use</option>
              <option value="In Storage">In Storage</option>
              <option value="In Repair">In Repair</option>
              <option value="Decommissioned">Decommissioned</option>
            </select>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="lg:hidden space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="Software">Software</option>
                <option value="Office Supplies">Office Supplies</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Statuses</option>
                <option value="In Use">In Use</option>
                <option value="In Storage">In Storage</option>
                <option value="In Repair">In Repair</option>
                <option value="Decommissioned">Decommissioned</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {filteredAssets.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg font-medium">No assets found</p>
              <p className="text-gray-400 text-sm">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            filteredAssets.map((asset) => <AssetCard key={asset.id} asset={asset} />)
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 text-gray-600 font-semibold">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </th>
                  <th className="text-left py-4 px-4 text-gray-600 font-semibold">Asset</th>
                  <th className="text-left py-4 px-4 text-gray-600 font-semibold">Category</th>
                  <th className="text-left py-4 px-4 text-gray-600 font-semibold">Status</th>
                  <th className="text-left py-4 px-4 text-gray-600 font-semibold">Assigned To</th>
                  <th className="text-left py-4 px-4 text-gray-600 font-semibold">Value</th>
                  <th className="text-left py-4 px-4 text-gray-600 font-semibold">Purchase Date</th>
                  <th className="text-left py-4 px-4 text-gray-600 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search size={24} className="text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-lg font-medium">No assets found</p>
                      <p className="text-gray-400 text-sm">Try adjusting your search or filter criteria</p>
                    </td>
                  </tr>
                ) : (
                  filteredAssets.map((asset) => (
                    <tr key={asset.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <input type="checkbox" className="rounded border-gray-300" />
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-sm">{asset.name.charAt(0)}</span>
                          </div>
                          <div>
                            <div className="text-gray-900 font-semibold">{asset.name}</div>
                            <div className="text-gray-500 text-sm font-mono">{asset.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-700 font-medium">{asset.category}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(asset.status)}`}
                        >
                          {asset.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-700 font-medium">{asset.assignedTo}</td>
                      <td className="py-4 px-4 text-gray-900 font-semibold">${asset.value.toLocaleString()}</td>
                      <td className="py-4 px-4 text-gray-700">{asset.purchaseDate}</td>
                      <td className="py-4 px-4">
                        <div className="relative group">
                          <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                            <MoreVertical size={16} className="text-gray-400" />
                          </button>
                          <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 min-w-[140px]">
                            <div className="py-2">
                              <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors">
                                <Edit size={16} />
                                <span className="font-medium">Edit</span>
                              </button>
                              <button
                                onClick={() => handleQRGenerate(asset)}
                                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors"
                              >
                                <QrCode size={16} />
                                <span className="font-medium">Generate QR</span>
                              </button>
                              <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors">
                                <History size={16} />
                                <span className="font-medium">View History</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showQRModal && selectedAsset && (
        <QRModal asset={selectedAsset} isOpen={showQRModal} onClose={() => setShowQRModal(false)} />
      )}
    </div>
  )
}
