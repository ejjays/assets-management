import { create } from "zustand"

interface Asset {
  _id?: string  // Changed from 'id' to '_id' to match MongoDB
  name: string
  category: string
  status: "Active" | "Maintenance" | "Retired"
  location: string
  purchaseDate: string
  value: number
  assignedTo?: string
  description?: string
  serialNumber?: string
  manufacturer?: string
  model?: string
}

interface AssetStore {
  assets: Asset[]
  loading: boolean
  fetchAssets: () => Promise<void>
  addAsset: (asset: Omit<Asset, "_id">) => Promise<void>
  updateAsset: (id: string, asset: Partial<Asset>) => Promise<void>
  deleteAsset: (id: string) => Promise<void>
  getAssetById: (id: string) => Asset | undefined
}

export const useAssetStore = create<AssetStore>()((set, get) => ({
  assets: [],
  loading: false,

  fetchAssets: async () => {
    set({ loading: true })
    try {
      const response = await fetch('/api/assets')
      if (!response.ok) throw new Error('Failed to fetch assets')
      const assets = await response.json()
      set({ assets, loading: false })
    } catch (error) {
      console.error('Error fetching assets:', error)
      set({ loading: false })
    }
  },

  addAsset: async (asset) => {
    try {
      const response = await fetch('/api/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(asset),
      })
      if (!response.ok) throw new Error('Failed to add asset')
      const newAsset = await response.json()
      set((state) => ({ assets: [...state.assets, newAsset] }))
    } catch (error) {
      console.error('Error adding asset:', error)
      throw error
    }
  },

  updateAsset: async (id, updatedAsset) => {
    try {
      const response = await fetch('/api/assets', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: id, ...updatedAsset }),
      })
      if (!response.ok) throw new Error('Failed to update asset')
      set((state) => ({
        assets: state.assets.map((asset) => 
          asset._id === id ? { ...asset, ...updatedAsset } : asset
        ),
      }))
    } catch (error) {
      console.error('Error updating asset:', error)
      throw error
    }
  },

  deleteAsset: async (id) => {
    try {
      const response = await fetch(`/api/assets?id=${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete asset')
      set((state) => ({ assets: state.assets.filter((asset) => asset._id !== id) }))
    } catch (error) {
      console.error('Error deleting asset:', error)
      throw error
    }
  },

  getAssetById: (id) => {
    return get().assets.find((asset) => asset._id === id)
  },
}))