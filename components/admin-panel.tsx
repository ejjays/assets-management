"use client"

import { useState, useEffect, useRef } from "react"
import { Plus, Download, Upload, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AssetTable } from "@/components/asset-table"
import { AssetModal } from "@/components/asset-modal"
import { useAssetStore } from "@/lib/asset-store"
import { useToastStore } from "@/lib/toast-store"

export function AdminPanel() {
  const { assets, loading, fetchAssets, addAsset, updateAsset, deleteAsset } = useAssetStore()
  const { addToast } = useToastStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [jsonInput, setJsonInput] = useState("")
  const [editingAsset, setEditingAsset] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")

  const fileInputRef = useRef<HTMLInputElement>(null); // Reintroduced useRef for file input

  const categories = ["all", "Classroom Assets", "Laboratory Equipment", "Library Resources", "Office & Admin", "Sports & Recreation", "IT Infrastructure", "Furniture & Fixtures", "Maintenance & Facilities"]

  useEffect(() => {
    fetchAssets()
  }, [fetchAssets])

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  const handleSaveAsset = async (assetData: any) => {
    try {
      if (editingAsset) {
        await updateAsset(editingAsset._id, assetData)
        addToast("Asset updated successfully", "success")
      } else {
        await addAsset(assetData)
        addToast("Asset added successfully", "success")
      }
      setIsModalOpen(false)
      setEditingAsset(null)
    } catch (error) {
      addToast("Failed to save asset", "error")
    }
  }

  const handleDeleteAsset = async (assetId: string) => {
    try {
      await deleteAsset(assetId)
      addToast("Asset deleted successfully", "success")
    } catch (error) {
      addToast("Failed to delete asset", "error")
    }
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

  // Handle import click to open the modal (can be from button or file selection)
  const handleImportClick = () => {
    setJsonInput(""); // Clear previous input
    setIsImportModalOpen(true);
  };

  // Centralized function to process imported assets (from paste or file)
  const processImportedAssets = async (importedAssets: any[]) => {
    if (!Array.isArray(importedAssets)) {
      addToast("Imported data is not a valid JSON array of assets.", "error");
      return;
    }

    let successCount = 0;
    let failCount = 0;

    for (const asset of importedAssets) {
      try {
        // Remove _id if present, as MongoDB will generate a new one on insert
        const { _id, ...assetToSave } = asset;
        await addAsset(assetToSave);
        successCount++;
      } catch (innerError) {
        console.error("Failed to add individual asset:", asset.name, innerError);
        failCount++;
      }
    }

    if (successCount > 0) {
      addToast(`Successfully imported ${successCount} assets.`, "success");
    } else if (failCount > 0) {
      addToast(`Failed to import all assets. ${failCount} errors occurred.`, "error");
    } else {
      addToast("No assets found in the imported data.", "warning");
    }

    setIsImportModalOpen(false);
    setJsonInput(""); // Clear the input after successful import
    fetchAssets(); // Refresh assets after import
  };

  // Handle JSON paste and import logic
  const handleImportJson = async () => {
    if (!jsonInput.trim()) {
      addToast("Please paste JSON data to import.", "error");
      return;
    }

    try {
      const importedAssets: any[] = JSON.parse(jsonInput);
      await processImportedAssets(importedAssets);
    } catch (error) {
      console.error("Error parsing or importing assets:", error);
      addToast(`Failed to import assets: ${(error as Error).message}`, "error");
    }
  };

  // Handle file selection and import logic
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      addToast("No file selected", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const importedAssets: any[] = JSON.parse(content);
        await processImportedAssets(importedAssets); // Use the centralized function
      } catch (error) {
        console.error("Error parsing or importing assets from file:", error);
        addToast(`Failed to import assets from file: ${(error as Error).message}`, "error");
      }
    };
    reader.readAsText(file);
  };

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
          <Button variant="outline" onClick={handleImportClick}>
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

      {/* New: Import JSON Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 relative shadow-2xl">
            <Button variant="ghost" size="sm" onClick={() => setIsImportModalOpen(false)} className="absolute top-4 right-4 h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Import Assets</h3>
            <p className="text-gray-600 mb-4">Paste your asset data in JSON array format below, or choose a file.</p>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md mb-4 font-mono text-sm"
              rows={10}
              placeholder='[{"name": "Projector", "category": "Classroom Assets", "status": "Active", "location": "Room 201", "purchaseDate": "2023-01-15", "value": 1200}]
'
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
            ></textarea>
            <div className="flex space-x-2">
              {/* Hidden file input for direct file selection */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                style={{ display: 'none' }}
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1"
              >
                Choose from files
              </Button>
              <Button
                onClick={handleImportJson}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                Import Assets
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
