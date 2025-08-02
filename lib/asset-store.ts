import { create } from "zustand"
import { persist } from "zustand/middleware"

interface Asset {
  id: string
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
  addAsset: (asset: Omit<Asset, "id"> & { id?: string }) => void
  updateAsset: (id: string, asset: Partial<Asset>) => void
  deleteAsset: (id: string) => void
  getAssetById: (id: string) => Asset | undefined
}

// Sample data for demonstration
const sampleAssets: Asset[] = [
  {
    id: "AST-001",
    name: "MacBook Pro 16-inch",
    category: "Electronics",
    status: "Active",
    location: "Building A - Floor 2",
    purchaseDate: "2023-01-15",
    value: 2499,
    assignedTo: "John Smith",
    description: "Primary development laptop",
    serialNumber: "MBP2023001",
    manufacturer: "Apple",
    model: "MacBook Pro 16-inch M2",
  },
  {
    id: "AST-002",
    name: "Dell UltraSharp Monitor",
    category: "Electronics",
    status: "Active",
    location: "Building A - Floor 2",
    purchaseDate: "2023-02-20",
    value: 599,
    assignedTo: "John Smith",
    description: "4K external monitor",
    serialNumber: "DU4K2023002",
    manufacturer: "Dell",
    model: "UltraSharp U2720Q",
  },
  {
    id: "AST-003",
    name: "Company Vehicle - Honda Civic",
    category: "Vehicles",
    status: "Active",
    location: "Parking Lot A",
    purchaseDate: "2022-06-10",
    value: 25000,
    assignedTo: "Sales Team",
    description: "Company car for client visits",
    serialNumber: "HC2022VIN123",
    manufacturer: "Honda",
    model: "Civic 2022",
  },
  {
    id: "AST-004",
    name: "Industrial Printer",
    category: "Equipment",
    status: "Maintenance",
    location: "Building B - Floor 1",
    purchaseDate: "2021-11-05",
    value: 1200,
    description: "High-volume document printer",
    serialNumber: "IP2021004",
    manufacturer: "HP",
    model: "LaserJet Enterprise M608dn",
  },
  {
    id: "AST-005",
    name: "Conference Room Table",
    category: "Furniture",
    status: "Active",
    location: "Building A - Conference Room 1",
    purchaseDate: "2023-03-12",
    value: 800,
    description: "Large conference table for 12 people",
    serialNumber: "CRT2023005",
    manufacturer: "Steelcase",
    model: "Series 1 Conference Table",
  },
  {
    id: "AST-006",
    name: "iPhone 14 Pro",
    category: "Mobile Devices",
    status: "Active",
    location: "Mobile",
    purchaseDate: "2023-09-20",
    value: 999,
    assignedTo: "Sarah Johnson",
    description: "Company mobile phone",
    serialNumber: "IP14P2023006",
    manufacturer: "Apple",
    model: "iPhone 14 Pro 128GB",
  },
  {
    id: "AST-007",
    name: "Network Server",
    category: "IT Hardware",
    status: "Active",
    location: "Building A - Server Room",
    purchaseDate: "2022-08-15",
    value: 4500,
    description: "Main application server",
    serialNumber: "NS2022007",
    manufacturer: "Dell",
    model: "PowerEdge R740",
  },
  {
    id: "AST-008",
    name: "Ergonomic Office Chair",
    category: "Furniture",
    status: "Active",
    location: "Building A - Floor 2",
    purchaseDate: "2023-04-18",
    value: 450,
    assignedTo: "Mike Wilson",
    description: "Adjustable ergonomic chair",
    serialNumber: "EOC2023008",
    manufacturer: "Herman Miller",
    model: "Aeron Chair",
  },
  {
    id: "AST-009",
    name: "Wireless Projector",
    category: "Electronics",
    status: "Active",
    location: "Building A - Conference Room 2",
    purchaseDate: "2023-05-22",
    value: 750,
    description: "4K wireless presentation projector",
    serialNumber: "WP2023009",
    manufacturer: "Epson",
    model: "PowerLite 2247U",
  },
  {
    id: "AST-010",
    name: "Forklift",
    category: "Equipment",
    status: "Active",
    location: "Warehouse",
    purchaseDate: "2021-12-08",
    value: 15000,
    assignedTo: "Warehouse Team",
    description: "Electric forklift for warehouse operations",
    serialNumber: "FL2021010",
    manufacturer: "Toyota",
    model: "8FBRE20",
  },
]

export const useAssetStore = create<AssetStore>()(
  persist(
    (set, get) => ({
      assets: sampleAssets,

      addAsset: (asset) => {
        const newAsset: Asset = {
          ...asset,
          id: asset.id || `AST-${Date.now()}`,
        }
        set((state) => ({
          assets: [...state.assets, newAsset],
        }))
      },

      updateAsset: (id, updatedAsset) => {
        set((state) => ({
          assets: state.assets.map((asset) => (asset.id === id ? { ...asset, ...updatedAsset } : asset)),
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
    }),
    {
      name: "asset-storage",
    },
  ),
)
