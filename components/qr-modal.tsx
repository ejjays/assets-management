"use client"

import { X, Download, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToastStore } from "@/lib/toast-store"

interface QRModalProps {
  isOpen: boolean
  onClose: () => void
  asset: any
}

export function QRModal({ isOpen, onClose, asset }: QRModalProps) {
  const { addToast } = useToastStore()

  if (!isOpen || !asset) return null

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    `Asset: ${asset.name}\nID: ${asset.id}\nCategory: ${asset.category}\nLocation: ${asset.location}`,
  )}`

  const handleDownload = async () => {
    try {
      const response = await fetch(qrCodeUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${asset.name}-qr-code.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      addToast("QR code downloaded successfully", "success")
    } catch (error) {
      addToast("Failed to download QR code", "error")
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `QR Code for ${asset.name}`,
          text: `Asset: ${asset.name} (ID: ${asset.id})`,
          url: window.location.href,
        })
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback: copy to clipboard
      const text = `Asset: ${asset.name}\nID: ${asset.id}\nCategory: ${asset.category}\nLocation: ${asset.location}`
      navigator.clipboard.writeText(text)
      addToast("Asset details copied to clipboard", "success")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
        <Button variant="ghost" size="sm" onClick={onClose} className="absolute top-4 right-4 h-8 w-8 p-0">
          <X className="h-4 w-4" />
        </Button>

        <div className="text-center space-y-4">
          <h2 className="text-xl font-bold text-gray-900">QR Code</h2>
          <p className="text-sm text-gray-600">Scan to view asset details</p>

          <div className="bg-gray-50 p-6 rounded-xl">
            <img
              src={qrCodeUrl || "/placeholder.svg"}
              alt={`QR Code for ${asset.name}`}
              className="mx-auto w-48 h-48"
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg text-left space-y-2">
            <div className="text-sm">
              <span className="font-medium text-gray-900">Asset:</span>
              <span className="ml-2 text-gray-600">{asset.name}</span>
            </div>
            <div className="text-sm">
              <span className="font-medium text-gray-900">ID:</span>
              <span className="ml-2 text-gray-600">{asset.id}</span>
            </div>
            <div className="text-sm">
              <span className="font-medium text-gray-900">Category:</span>
              <span className="ml-2 text-gray-600">{asset.category}</span>
            </div>
            <div className="text-sm">
              <span className="font-medium text-gray-900">Location:</span>
              <span className="ml-2 text-gray-600">{asset.location}</span>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={handleDownload}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button onClick={handleShare} variant="outline" className="flex-1 bg-transparent">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
