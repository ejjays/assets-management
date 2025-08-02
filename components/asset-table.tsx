"use client"

import { useState } from "react"
import { Edit, Trash2, QrCode, MoreHorizontal, Package, Calendar, DollarSign, MapPin, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { QRModal } from "@/components/qr-modal"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency, formatDate } from "@/lib/utils" // Import formatCurrency and formatDate from utils

interface Asset {
  _id?: string; // Changed to optional for robust handling
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
  onAddAsset: () => void; // New prop for adding an asset
}

export function AssetTable({ assets = [], onEdit, onDelete, onAddAsset }: AssetTableProps) {
  const [qrModalOpen, setQrModalOpen] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5 // Changed to 5 items per page as requested
  const maxPageButtons = 5 // Maximum number of page number buttons to display

  // Calculate pagination values
  const totalPages = Math.ceil(assets.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentAssets = assets.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

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

  // Calculate visible page numbers
  const getVisiblePageNumbers = () => {
    const pages: (number | string)[] = []
    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2))
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1)

    if (endPage - startPage + 1 < maxPageButtons) {
      startPage = Math.max(1, endPage - maxPageButtons + 1)
    }

    if (startPage > 1) {
      pages.push(1)
      if (startPage > 2) pages.push("...")
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push("...")
      pages.push(totalPages)
    }
    return pages
  }

  if (assets.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No assets found</h3>
        <p className="text-gray-500 mb-4">Get started by adding your first asset to the system.</p>
        <Button 
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          onClick={onAddAsset} 
        >
          Add Your First Asset
        </Button>
      </div>
    )
  }

  return (
    <>
      {/* Mobile Card View */}
      <div className="block lg:hidden space-y-4">
        {currentAssets.map((asset) => (
          <div
            key={asset._id?.toString() || asset.name} // Safely access _id and use name as fallback key
            className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-gray-900 truncate">{asset.name}</h3>
                <p className="text-sm text-gray-600">ID: {asset._id?.toString() || 'N/A'}</p> {/* Safely display _id */}
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
                  <DropdownMenuItem onClick={() => onDelete(asset._id?.toString() as string)} className="text-red-600 focus:text-red-600"> {/* Safely pass _id for deletion */}
                    <Trash2 className="h-4 w-4 mr-2" />
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
            {currentAssets.map((asset) => (
              <TableRow key={asset._id?.toString() || asset.name} className="hover:bg-gray-50">
                <TableCell>
                  <div>
                    <div className="font-medium text-gray-900">{asset.name}</div>
                    <div className="text-sm text-gray-500">ID: {asset._id?.toString() || 'N/A'}</div>
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
                      onClick={() => onDelete(asset._id?.toString() as string)}
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center p-4 bg-white rounded-xl border border-gray-200 mt-4 space-x-2">
          <Button
            variant="outline"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            size="icon"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {getVisiblePageNumbers().map((pageNumber, index) =>
            typeof pageNumber === "number" ? (
              <Button
                key={pageNumber}
                variant={currentPage === pageNumber ? "default" : "outline"}
                onClick={() => handlePageChange(pageNumber)}
                size="icon"
              >
                {pageNumber}
              </Button>
            ) : (
              <span key={index} className="px-2 text-gray-500">
                {pageNumber}
              </span>
            ),
          )}

          <Button
            variant="outline"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            size="icon"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* QR Modal */}
      <QRModal isOpen={qrModalOpen} onClose={() => setQrModalOpen(false)} asset={selectedAsset} />
    </>
  )
}
