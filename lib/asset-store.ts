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

// Sample data for demonstration, tailored for Bestlink College of the Philippines
const sampleAssets: Asset[] = [
  {
    id: "BCP-AST-001",
    name: "Classroom Projector (G-301)",
    category: "Classroom Assets",
    status: "Active",
    location: "Guidance Office - Room 301",
    purchaseDate: "2025-01-15",
    value: 700,
    description: "Projector for classroom presentations in G-301.",
    serialNumber: "CPRG3012023001",
    manufacturer: "Epson",
    model: "PowerLite E20",
  },
  {
    id: "BCP-AST-002",
    name: "Chemistry Lab Microscope",
    category: "Laboratory Equipment",
    status: "Active",
    location: "Main Building - Chemistry Lab 1",
    purchaseDate: "2025-03-20",
    value: 1200,
    description: "Compound microscope for chemistry experiments.",
    serialNumber: "CLMCL12022002",
    manufacturer: "Olympus",
    model: "CX23",
  },
  {
    id: "BCP-AST-003",
    name: "Library Computer Workstation 1",
    category: "Library Resources",
    status: "Active",
    location: "Library - Computer Area",
    purchaseDate: "2025-01-10",
    value: 850,
    assignedTo: "General Use",
    description: "Student workstation in the main library.",
    serialNumber: "LCW1LIB2023003",
    manufacturer: "Dell",
    model: "OptiPlex 3000",
  },
  {
    id: "BCP-AST-004",
    name: "Admin Office Printer",
    category: "Office & Admin",
    status: "Active",
    location: "Admin Building - Registrar's Office",
    purchaseDate: "2025-02-05",
    value: 400,
    description: "Multi-function printer for daily administrative tasks.",
    serialNumber: "AOPR2022004",
    manufacturer: "Brother",
    model: "MFC-L2700DW",
  },
  {
    id: "BCP-AST-005",
    name: "Basketball Court Net Set",
    category: "Sports & Recreation",
    status: "Active",
    location: "Sports Complex - Basketball Court",
    purchaseDate: "2025-04-12",
    value: 150,
    description: "Replacement nets for basketball hoops.",
    serialNumber: "BCNS2023005",
    manufacturer: "Spalding",
    model: "Heavy Duty Net",
  },
  {
    id: "BCP-AST-006",
    name: "Main Server Rack",
    category: "IT Infrastructure",
    status: "Active",
    location: "Main Server Room",
    purchaseDate: "2025-01-20",
    value: 5000,
    description: "Primary server rack housing network and academic servers.",
    serialNumber: "MSR2022006",
    manufacturer: "HP",
    model: "ProLiant DL380",
  },
  {
    id: "BCP-AST-007",
    name: "Student Lounge Sofa Set",
    category: "Furniture & Fixtures",
    status: "Active",
    location: "Student Lounge - Ground Floor",
    purchaseDate: "2025-03-12",
    value: 900,
    description: "Comfortable sofa set for student relaxation area.",
    serialNumber: "SLSS2023007",
    manufacturer: "IKEA",
    model: "FRIHETEN",
  },
  {
    id: "BCP-AST-008",
    name: "Plumbing Repair Kit",
    category: "Maintenance & Facilities",
    status: "Active",
    location: "Facilities Office",
    purchaseDate: "2025-06-01",
    value: 300,
    assignedTo: "Maintenance Team",
    description: "Toolkit for general plumbing repairs across campus.",
    serialNumber: "PRK2023008",
    manufacturer: "Stanley",
    model: "Master Kit",
  },
  {
    id: "BCP-AST-009",
    name: "Biology Lab Fume Hood",
    category: "Laboratory Equipment",
    status: "Maintenance",
    location: "Main Building - Biology Lab 2",
    purchaseDate: "2025-02-15",
    value: 3000,
    description: "Ventilation system for safe handling of chemicals.",
    serialNumber: "BLFHBL22021009",
    manufacturer: "Labconco",
    model: "Protector XL",
  },
  {
    id: "BCP-AST-010",
    name: "Conference Table (Faculty Room)",
    category: "Furniture & Fixtures",
    status: "Active",
    location: "Faculty Room - 2nd Floor",
    purchaseDate: "2025-02-28",
    value: 600,
    description: "Large table for faculty meetings.",
    serialNumber: "CTFR2023010",
    manufacturer: "Haworth",
    model: "Compose Table",
  },
]

export const useAssetStore = create<AssetStore>()(
  persist(
    (set, get) => ({
      assets: sampleAssets,

      addAsset: (asset) => {
        const newAsset: Asset = {
          ...asset,
          id: asset.id || `BCP-AST-${Date.now()}`.slice(0, 12), // Ensure unique and BCP-specific ID
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
