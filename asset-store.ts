"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Asset {
  id: string
  name: string
  category: string
  status: string
  assignedTo: string
  purchaseDate: string
  warrantyEndDate: string
  value: number
  imageUrl: string
  location?: string
  history: Array<{
    action: string
    date: string
    user: string
    details?: string
  }>
}

interface AssetStore {
  assets: Asset[]
  addAsset: (asset: Omit<Asset, "id" | "imageUrl" | "history">) => void
  updateAsset: (id: string, asset: Partial<Asset>) => void
  deleteAsset: (id: string) => void
  getAssetById: (id: string) => Asset | undefined
  getAssetsByCategory: (category: string) => Asset[]
  getAssetsByStatus: (status: string) => Asset[]
  searchAssets: (query: string) => Asset[]
}

// Initial mock data
const initialAssets: Asset[] = [
  {
    id: "ASSET-00123",
    name: "16-inch MacBook Pro M3",
    category: "Electronics",
    status: "In Use",
    assignedTo: "Jane Doe",
    purchaseDate: "2024-01-15",
    warrantyEndDate: "2026-01-15",
    value: 2499.99,
    imageUrl: "/placeholder.svg?height=32&width=32",
    location: "Floor 7, West Wing",
    history: [
      { action: "Created", date: "2024-01-15", user: "Admin" },
      { action: "Assigned", date: "2024-01-16", user: "Admin", details: "Assigned to Jane Doe" },
    ],
  },
  {
    id: "ASSET-00124",
    name: "Herman Miller Chair",
    category: "Furniture",
    status: "In Storage",
    assignedTo: "Unassigned",
    purchaseDate: "2023-11-20",
    warrantyEndDate: "2028-11-20",
    value: 899.99,
    imageUrl: "/placeholder.svg?height=32&width=32",
    location: "Warehouse B",
    history: [
      { action: "Created", date: "2023-11-20", user: "Admin" },
      { action: "Moved to Storage", date: "2024-01-10", user: "Admin" },
    ],
  },
  {
    id: "ASSET-00125",
    name: 'Dell Monitor 27"',
    category: "Electronics",
    status: "In Repair",
    assignedTo: "John Smith",
    purchaseDate: "2023-08-10",
    warrantyEndDate: "2026-08-10",
    value: 349.99,
    imageUrl: "/placeholder.svg?height=32&width=32",
    location: "IT Department",
    history: [
      { action: "Created", date: "2023-08-10", user: "Admin" },
      { action: "Assigned", date: "2023-08-11", user: "Admin", details: "Assigned to John Smith" },
      { action: "Sent for Repair", date: "2024-01-20", user: "IT Support", details: "Screen flickering issue" },
    ],
  },
  {
    id: "ASSET-00126",
    name: "Adobe Creative Suite",
    category: "Software",
    status: "In Use",
    assignedTo: "Design Team",
    purchaseDate: "2024-02-01",
    warrantyEndDate: "2025-02-01",
    value: 599.99,
    imageUrl: "/placeholder.svg?height=32&width=32",
    location: "Digital License",
    history: [
      { action: "Created", date: "2024-02-01", user: "Admin" },
      { action: "Licensed", date: "2024-02-01", user: "Admin", details: "Licensed to Design Team" },
    ],
  },
  {
    id: "ASSET-00127",
    name: "Standing Desk",
    category: "Furniture",
    status: "In Use",
    assignedTo: "Mike Johnson",
    purchaseDate: "2023-12-05",
    warrantyEndDate: "2026-12-05",
    value: 799.99,
    imageUrl: "/placeholder.svg?height=32&width=32",
    location: "Floor 5, East Wing",
    history: [
      { action: "Created", date: "2023-12-05", user: "Admin" },
      { action: "Assigned", date: "2023-12-06", user: "Admin", details: "Assigned to Mike Johnson" },
    ],
  },
  {
    id: "ASSET-00128",
    name: "Wireless Headphones",
    category: "Electronics",
    status: "Decommissioned",
    assignedTo: "Unassigned",
    purchaseDate: "2022-06-15",
    warrantyEndDate: "2024-06-15",
    value: 299.99,
    imageUrl: "/placeholder.svg?height=32&width=32",
    location: "Storage",
    history: [
      { action: "Created", date: "2022-06-15", user: "Admin" },
      { action: "Decommissioned", date: "2024-01-15", user: "Admin", details: "End of life cycle" },
    ],
  },
  {
    id: "ASSET-00129",
    name: "Office Printer",
    category: "Electronics",
    status: "In Use",
    assignedTo: "Reception",
    purchaseDate: "2023-09-20",
    warrantyEndDate: "2026-09-20",
    value: 449.99,
    imageUrl: "/placeholder.svg?height=32&width=32",
    location: "Reception Area",
    history: [
      { action: "Created", date: "2023-09-20", user: "Admin" },
      { action: "Installed", date: "2023-09-21", user: "IT Support", details: "Installed at Reception" },
    ],
  },
  {
    id: "ASSET-00130",
    name: "Conference Table",
    category: "Furniture",
    status: "In Use",
    assignedTo: "Meeting Room A",
    purchaseDate: "2023-07-12",
    warrantyEndDate: "2028-07-12",
    value: 1299.99,
    imageUrl: "/placeholder.svg?height=32&width=32",
    location: "Meeting Room A",
    history: [
      { action: "Created", date: "2023-07-12", user: "Admin" },
      { action: "Installed", date: "2023-07-13", user: "Facilities", details: "Installed in Meeting Room A" },
    ],
  },
  {
    id: "ASSET-00131",
    name: "Projector",
    category: "Electronics",
    status: "In Repair",
    assignedTo: "Meeting Room B",
    purchaseDate: "2023-10-08",
    warrantyEndDate: "2026-10-08",
    value: 699.99,
    imageUrl: "/placeholder.svg?height=32&width=32",
    location: "Meeting Room B",
    history: [
      { action: "Created", date: "2023-10-08", user: "Admin" },
      { action: "Installed", date: "2023-10-09", user: "IT Support" },
      { action: "Sent for Repair", date: "2024-01-25", user: "IT Support", details: "Lamp replacement needed" },
    ],
  },
  {
    id: "ASSET-00132",
    name: "Office Supplies Kit",
    category: "Office Supplies",
    status: "In Storage",
    assignedTo: "Unassigned",
    purchaseDate: "2024-01-30",
    warrantyEndDate: "2025-01-30",
    value: 89.99,
    imageUrl: "/placeholder.svg?height=32&width=32",
    location: "Supply Closet",
    history: [
      { action: "Created", date: "2024-01-30", user: "Admin" },
      { action: "Stocked", date: "2024-01-30", user: "Admin", details: "Added to supply inventory" },
    ],
  },
]

export const useAssetStore = create<AssetStore>()(
  persist(
    (set, get) => ({
      assets: initialAssets,

      addAsset: (assetData) => {
        const newAsset: Asset = {
          ...assetData,
          id: `ASSET-${String(Date.now()).slice(-5).padStart(5, "0")}`,
          imageUrl: `/placeholder.svg?height=32&width=32&query=${encodeURIComponent(assetData.name)}`,
          history: [
            {
              action: "Created",
              date: new Date().toISOString().split("T")[0],
              user: "Admin",
              details: "Asset created via admin panel",
            },
          ],
        }

        set((state) => ({
          assets: [...state.assets, newAsset],
        }))
      },

      updateAsset: (id, updates) => {
        set((state) => ({
          assets: state.assets.map((asset) =>
            asset.id === id
              ? {
                  ...asset,
                  ...updates,
                  history: [
                    ...asset.history,
                    {
                      action: "Updated",
                      date: new Date().toISOString().split("T")[0],
                      user: "Admin",
                      details: "Asset information updated",
                    },
                  ],
                }
              : asset,
          ),
        }))
      },

      deleteAsset: (id) => {
        set((state) => ({
          assets: state.assets.filter((asset) => asset.id !== id),
        }))
      },

      getAssetById: (id) => {
        return get().assets.find((asset) => asset.id === id)
      },

      getAssetsByCategory: (category) => {
        return get().assets.filter((asset) => asset.category === category)
      },

      getAssetsByStatus: (status) => {
        return get().assets.filter((asset) => asset.status === status)
      },

      searchAssets: (query) => {
        const assets = get().assets
        const lowercaseQuery = query.toLowerCase()
        return assets.filter(
          (asset) =>
            asset.name.toLowerCase().includes(lowercaseQuery) ||
            asset.id.toLowerCase().includes(lowercaseQuery) ||
            asset.category.toLowerCase().includes(lowercaseQuery) ||
            asset.assignedTo.toLowerCase().includes(lowercaseQuery),
        )
      },
    }),
    {
      name: "asset-storage",
    },
  ),
)
