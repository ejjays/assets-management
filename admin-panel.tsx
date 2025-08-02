"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { AssetModal } from "@/components/asset-modal"

export function AdminPanel() {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="p-6 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Manage Assets</h1>
            <p className="text-gray-600 mt-1">Add, edit, and organize your company assets</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-sm w-full sm:w-auto"
          >
            <Plus size={20} />
            <span>New Asset</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-gray-600 mb-6 text-sm sm:text-base">
            Use the "New Asset" button above to add assets to your inventory.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <h3 className="text-gray-900 font-semibold mb-3 text-sm sm:text-base">Quick Actions</h3>
              <ul className="text-gray-600 text-xs sm:text-sm space-y-2">
                <li>• Add new assets</li>
                <li>• Bulk import from CSV</li>
                <li>• Generate reports</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <h3 className="text-gray-900 font-semibold mb-3 text-sm sm:text-base">Asset Categories</h3>
              <ul className="text-gray-600 text-xs sm:text-sm space-y-2">
                <li>• Electronics (245)</li>
                <li>• Furniture (156)</li>
                <li>• Software (67)</li>
                <li>• Office Supplies (14)</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 sm:col-span-2 lg:col-span-1">
              <h3 className="text-gray-900 font-semibold mb-3 text-sm sm:text-base">Recent Activity</h3>
              <ul className="text-gray-600 text-xs sm:text-sm space-y-2">
                <li>• 3 assets added today</li>
                <li>• 2 status updates</li>
                <li>• 1 asset retired</li>
              </ul>
            </div>
          </div>
        </div>

        {showModal && <AssetModal isOpen={showModal} onClose={() => setShowModal(false)} />}
      </div>
    </div>
  )
}
