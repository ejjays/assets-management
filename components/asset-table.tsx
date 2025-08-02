"use client"

import { useState } from "react"
import { Edit, Trash2, QrCode, MoreHorizontal, Package, Calendar, DollarSign, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { QRModal } from "@/components/qr-modal"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Asset {
  id: string
  name: string
  category: string
  status: "Active" | "Maintenance" | "Retired"
  location: string
  purchaseDate: string
  value: number
  assignedTo?: string
}

interface AssetTableProps {
  assets: Asset[]
  onEdit: (asset: Asset) => void
  onDelete: (assetId: string) => void
}

export function AssetTable({ assets, onEdit, onDelete }: AssetTableProps) {
  const [qrModalOpen, setQrModalOpen] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)

  const handleShowQR = (asset: Asset) => {
    setSelectedAsset(asset)
    setQrModalOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200"
      case "Maintenance":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Retired":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (assets.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No assets found</h3>
        <p className="text-gray-500 mb-4">Get started by adding your first asset to the system.</p>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          Add Your First Asset
        </Button>
      </div>
    )
  }

  return (
    <>
      {/* Mobile Card View */}
      <div className="block lg:hidden space-y-4">
        {assets.map((asset) => (
          <div
            key={asset.id}
            className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-gray-900 truncate">{asset.name}</h3>
                <p className="text-sm text-gray-600">ID: {asset.id}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(asset)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShowQR(asset)}>
                    <QrCode className="w-4 h-4 mr-2" />
                    QR Code
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(asset.id)} className="text-red-600 focus:text-red-600">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="flex items-center space-x-2">
                <Package className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{asset.category}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{asset.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{formatCurrency(asset.value)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{formatDate(asset.purchaseDate)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Badge className={getStatusColor(asset.status)}>{asset.status}</Badge>
              {asset.assignedTo && <span className="text-xs text-gray-500">Assigned to: {asset.assignedTo}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-xl border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-gray-900">Asset</TableHead>
              <TableHead className="font-semibold text-gray-900">Category</TableHead>
              <TableHead className="font-semibold text-gray-900">Status</TableHead>
              <TableHead className="font-semibold text-gray-900">Location</TableHead>
              <TableHead className="font-semibold text-gray-900">Value</TableHead>
              <TableHead className="font-semibold text-gray-900">Purchase Date</TableHead>
              <TableHead className="font-semibold text-gray-900">Assigned To</TableHead>
              <TableHead className="font-semibold text-gray-900 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((asset) => (
              <TableRow key={asset.id} className="hover:bg-gray-50">
                <TableCell>
                  <div>
                    <div className="font-medium text-gray-900">{asset.name}</div>
                    <div className="text-sm text-gray-500">ID: {asset.id}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-gray-900">{asset.category}</span>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(asset.status)}>{asset.status}</Badge>
                </TableCell>
                <TableCell>
                  <span className="text-gray-900">{asset.location}</span>
                </TableCell>
                <TableCell>
                  <span className="font-medium text-gray-900">{formatCurrency(asset.value)}</span>
                </TableCell>
                <TableCell>
                  <span className="text-gray-900">{formatDate(asset.purchaseDate)}</span>
                </TableCell>
                <TableCell>
                  <span className="text-gray-900">{asset.assignedTo || "Unassigned"}</span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleShowQR(asset)} className="h-8 w-8 p-0">
                      <QrCode className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onEdit(asset)} className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(asset.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* QR Modal */}
      <QRModal isOpen={qrModalOpen} onClose={() => setQrModalOpen(false)} asset={selectedAsset} />
    </>
  )
}
