"use client"

import { X, Download } from "lucide-react"

interface QRModalProps {
  asset: any
  isOpen: boolean
  onClose: () => void
}

export function QRModal({ asset, isOpen, onClose }: QRModalProps) {
  if (!isOpen) return null

  const handleDownload = () => {
    // Simulate QR code download
    console.log(`Downloading QR code for ${asset.name}`)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1E1E1E] rounded-lg w-full max-w-sm">
        <div className="p-4 sm:p-6 border-b border-gray-600">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white pr-4">QR Code for: {asset.name}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white p-1 flex-shrink-0">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 text-center space-y-4">
          <div className="bg-white p-3 sm:p-4 rounded-lg inline-block">
            <img src="/placeholder.svg?height=200&width=200" alt="QR Code" className="w-48 h-48 sm:w-56 sm:h-56" />
          </div>

          <p className="text-gray-300 font-mono text-xs sm:text-sm break-all">Asset ID: {asset.id}</p>

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-[#007BFF] text-white rounded-lg hover:bg-[#0056b3] transition-colors font-medium"
            >
              <Download size={16} />
              <span>Download PNG</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
