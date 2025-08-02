"use client"

import { useState, useEffect } from "react"
import { ModernKPICards } from "@/components/modern-kpi-cards"
import { AssetCategoryCards } from "@/components/asset-category-cards"
import { ModernCharts } from "@/components/modern-charts"
import { AssetTable } from "@/components/asset-table"
import { AssetModal } from "@/components/asset-modal" // Assuming this is your modal for add/edit
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Define the Asset interface to match your MongoDB document structure
interface Asset {
  _id: string;
  name: string;
  category: string;
  status: "Active" | "Maintenance" | "Retired";
  location: string;
  purchaseDate: string;
  value: number;
  assignedTo?: string;
  // Add any other fields your assets have
}

export function Dashboard() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const { toast } = useToast();

  // Function to fetch assets from the API
  const fetchAssets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/assets');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Asset[] = await response.json();
      setAssets(data);
    } catch (e) {
      console.error("Failed to fetch assets:", e);
      setError("Failed to load assets. Please ensure your MongoDB is running and accessible.");
      toast({
        title: "Error",
        description: "Failed to load assets. " + (e instanceof Error ? e.message : String(e)),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch assets on component mount
  useEffect(() => {
    fetchAssets();
  }, []);

  // Handlers for CRUD operations
  const handleAddAssetClick = () => {
    setEditingAsset(null); // Clear any previous editing state
    setIsModalOpen(true);
  };

  const handleEditAssetClick = (asset: Asset) => {
    setEditingAsset(asset);
    setIsModalOpen(true);
  };

  const handleSaveAsset = async (assetData: Omit<Asset, '_id'> & { _id?: string }) => {
    try {
      const method = assetData._id ? 'PUT' : 'POST';
      const url = '/api/assets';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assetData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      toast({
        title: "Success",
        description: `Asset ${assetData._id ? 'updated' : 'added'} successfully.`, 
        variant: "success",
      });
      setIsModalOpen(false);
      fetchAssets(); // Refresh the list of assets after save
    } catch (e) {
      console.error("Failed to save asset:", e);
      toast({
        title: "Error",
        description: `Failed to save asset: ${e instanceof Error ? e.message : String(e)}`, 
        variant: "destructive",
      });
    }
  };

  const handleDeleteAsset = async (assetId: string) => {
    if (!window.confirm("Are you sure you want to delete this asset?")) {
      return;
    }
    try {
      const response = await fetch(`/api/assets?id=${assetId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      toast({
        title: "Success",
        description: "Asset deleted successfully.",
        variant: "success",
      });
      fetchAssets(); // Refresh the list of assets after deletion
    } catch (e) {
      console.error("Failed to delete asset:", e);
      toast({
        title: "Error",
        description: `Failed to delete asset: ${e instanceof Error ? e.message : String(e)}`, 
        variant: "destructive",
      });
    }
  };

  // Render loading and error states
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 w-full flex items-center justify-center">
        <p className="text-gray-600">Loading assets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 w-full p-6 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-red-600 mb-4">Error Loading Dashboard</h1>
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={fetchAssets} className="bg-blue-600 hover:bg-blue-700">Retry</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="p-6 space-y-8 w-full">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Asset Dashboard</h1>
            <p className="text-gray-600">Monitor and manage your company assets</p>
          </div>
          <Button 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            onClick={handleAddAssetClick}
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Add New Asset
          </Button>
        </div>

        <ModernKPICards assets={assets} /> {/* Pass assets to KPI cards */}
        <AssetCategoryCards assets={assets} /> {/* Pass assets to Category Cards */}
        <ModernCharts assets={assets} /> {/* Pass assets to Charts */}
        
        <AssetTable 
          assets={assets}
          onEdit={handleEditAssetClick}
          onDelete={handleDeleteAsset}
          onAddAsset={handleAddAssetClick}
        />
      </div>

      <AssetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAsset}
        initialData={editingAsset}
      />
    </div>
  );
}
