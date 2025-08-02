"use client"

import type React from "react"
import { useState } from "react"
import { X, Loader2 } from "lucide-react"
import { useAssetStore } from "@/lib/asset-store"
import { useToastStore } from "@/lib/toast-store"

interface AssetModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AssetModal({ isOpen, onClose }: AssetModalProps) {
  const { addAsset } = useAssetStore()
  const { addToast } = useToastStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    status: "",
    assignedTo: "",
    purchaseDate: "",
    warrantyEndDate: "",
    value: "",
    location: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Asset name is required"
    }

    if (!formData.category) {
      newErrors.category = "Category is required"
    }

    if (!formData.status) {
      newErrors.status = "Status is required"
    }

    if (!formData.purchaseDate) {
      newErrors.purchaseDate = "Purchase date is required"
    }

    if (formData.value && isNaN(Number(formData.value))) {
      newErrors.value = "Value must be a valid number"
    }

    if (formData.value && Number(formData.value) < 0) {
      newErrors.value = "Value cannot be negative"
    }

    // Validate warranty date is after purchase date
    if (formData.purchaseDate && formData.warrantyEndDate) {
      if (new Date(formData.warrantyEndDate) <= new Date(formData.purchaseDate)) {
        newErrors.warrantyEndDate = "Warranty end date must be after purchase date"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      addToast({
        type: "error",
        title: "Validation Error",
        description: "Please fix the errors in the form before submitting.",
        duration: 4000,
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Add the asset
      addAsset({
        name: formData.name.trim(),
        category: formData.category,
        status: formData.status,
        assignedTo: formData.assignedTo.trim() || "Unassigned",
        purchaseDate: formData.purchaseDate,
        warrantyEndDate: formData.warrantyEndDate || "",
        value: formData.value ? Number(formData.value) : 0,
        location: formData.location.trim() || "Not specified",
      })

      // Show success toast
      addToast({
        type: "success",
        title: "Asset Created Successfully!",
        description: `${formData.name} has been added to your inventory.`,
        duration: 5000,
      })

      // Reset form and close modal
      setFormData({
        name: "",
        category: "",
        status: "",
        assignedTo: "",
        purchaseDate: "",
        warrantyEndDate: "",
        value: "",
        location: "",
      })
      setErrors({})
      onClose()
    } catch (error) {
      // Show error toast
      addToast({
        type: "error",
        title: "Failed to Create Asset",
        description: "There was an error creating the asset. Please try again.",
        duration: 5000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1E1E1E] rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#1E1E1E] p-4 sm:p-6 border-b border-gray-600 rounded-t-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-white">Add New Asset</h2>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="text-gray-400 hover:text-white p-1 disabled:opacity-50"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Asset Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`w-full px-3 py-3 bg-[#121212] border rounded-lg text-white focus:outline-none text-sm sm:text-base disabled:opacity-50 ${
                errors.name ? "border-red-500 focus:border-red-500" : "border-gray-600 focus:border-[#007BFF]"
              }`}
              placeholder="e.g., MacBook Pro 16-inch"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`w-full px-3 py-3 bg-[#121212] border rounded-lg text-white focus:outline-none text-sm sm:text-base disabled:opacity-50 ${
                errors.category ? "border-red-500 focus:border-red-500" : "border-gray-600 focus:border-[#007BFF]"
              }`}
            >
              <option value="">Select Category</option>
              <option value="Electronics">Electronics</option>
              <option value="Furniture">Furniture</option>
              <option value="Software">Software</option>
              <option value="Office Supplies">Office Supplies</option>
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`w-full px-3 py-3 bg-[#121212] border rounded-lg text-white focus:outline-none text-sm sm:text-base disabled:opacity-50 ${
                errors.status ? "border-red-500 focus:border-red-500" : "border-gray-600 focus:border-[#007BFF]"
              }`}
            >
              <option value="">Select Status</option>
              <option value="In Use">In Use</option>
              <option value="In Storage">In Storage</option>
              <option value="In Repair">In Repair</option>
              <option value="Decommissioned">Decommissioned</option>
            </select>
            {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Assigned To</label>
            <input
              type="text"
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full px-3 py-3 bg-[#121212] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#007BFF] text-sm sm:text-base disabled:opacity-50"
              placeholder="e.g., John Doe or Marketing Team"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full px-3 py-3 bg-[#121212] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#007BFF] text-sm sm:text-base disabled:opacity-50"
              placeholder="e.g., Floor 3, West Wing"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Purchase Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`w-full px-3 py-3 bg-[#121212] border rounded-lg text-white focus:outline-none text-sm sm:text-base disabled:opacity-50 ${
                  errors.purchaseDate ? "border-red-500 focus:border-red-500" : "border-gray-600 focus:border-[#007BFF]"
                }`}
              />
              {errors.purchaseDate && <p className="text-red-500 text-xs mt-1">{errors.purchaseDate}</p>}
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Warranty End Date</label>
              <input
                type="date"
                name="warrantyEndDate"
                value={formData.warrantyEndDate}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`w-full px-3 py-3 bg-[#121212] border rounded-lg text-white focus:outline-none text-sm sm:text-base disabled:opacity-50 ${
                  errors.warrantyEndDate
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-600 focus:border-[#007BFF]"
                }`}
              />
              {errors.warrantyEndDate && <p className="text-red-500 text-xs mt-1">{errors.warrantyEndDate}</p>}
            </div>
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Value</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
              <input
                type="number"
                name="value"
                value={formData.value}
                onChange={handleChange}
                disabled={isSubmitting}
                step="0.01"
                min="0"
                className={`w-full pl-8 pr-3 py-3 bg-[#121212] border rounded-lg text-white focus:outline-none text-sm sm:text-base disabled:opacity-50 ${
                  errors.value ? "border-red-500 focus:border-red-500" : "border-gray-600 focus:border-[#007BFF]"
                }`}
                placeholder="0.00"
              />
            </div>
            {errors.value && <p className="text-red-500 text-xs mt-1">{errors.value}</p>}
          </div>

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-[#007BFF] text-white rounded-lg hover:bg-[#0056b3] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Creating Asset...</span>
                </>
              ) : (
                <span>Save Asset</span>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
