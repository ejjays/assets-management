"use client"

import { useState } from "react"
import { Plus, Download, Upload, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AssetTable } from "@/components/asset-table"
import { AssetModal } from "@/components/asset-modal"
import { useAssetStore } from "@/lib/asset-store"
import { useToastStore } from "@/lib/toast-store"

export function AdminPanel() {
  const { assets, addAsset, updateAsset, deleteAsset } = useAssetStore()
  const { addToast } = useToastStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAsset, setEditingAsset] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")

  const categories = ["all", "Electronics", "Vehicles", "Equipment", "Furniture", "Mobile Devices", "IT Hardware"]

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || asset.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const handleAddAsset = () => {
    setEditingAsset(null)
    setIsModalOpen(true)
  }

  const handleEditAsset = (asset: any) => {
    setEditingAsset(asset)
    setIsModalOpen(true)
  }

  const handleSaveAsset = (assetData: any) => {
    if (editingAsset) {
      updateAsset(editingAsset.id, assetData)
      addToast("Asset updated successfully", "success")
    } else {
      addAsset(assetData)
      addToast("Asset added successfully", "success")
    }
    setIsModalOpen(false)
    setEditingAsset(null)
  }

  const handleDeleteAsset = (assetId: string) => {
    deleteAsset(assetId)
    addToast("Asset deleted successfully", "success")
  }

  const handleExport = () => {
    const dataStr = JSON.stringify(assets, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const exportFileDefaultName = "assets.json"
    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
    addToast("Assets exported successfully", "success")
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-6 lg:p-8 pt-16 md:pt-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">Asset Management</h2>
          <p className="text-sm md:text-base text-gray-600">Manage and track all your company assets</p>
        </div>

        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <Button
            onClick={handleAddAsset}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Asset
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" disabled>
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4 bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex-1">
          <Input
            placeholder="Search assets by name, ID, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{filteredAssets.length}</div>
          <div className="text-sm text-gray-600">
            {searchTerm || filterCategory !== "all" ? "Filtered" : "Total"} Assets
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {filteredAssets.filter((a) => a.status === "Active").length}
          </div>
          <div className="text-sm text-gray-600">Active</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-yellow-600">
            {filteredAssets.filter((a) => a.status === "Maintenance").length}
          </div>
          <div className="text-sm text-gray-600">Maintenance</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-red-600">
            {filteredAssets.filter((a) => a.status === "Retired").length}
          </div>
          <div className="text-sm text-gray-600">Retired</div>
        </div>
      </div>

      {/* Asset Table */}
      <AssetTable assets={filteredAssets} onEdit={handleEditAsset} onDelete={handleDeleteAsset} />

      {/* Asset Modal */}
      <AssetModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingAsset(null)
        }}
        onSave={handleSaveAsset}
        asset={editingAsset}
      />
    </div>
  )
}
