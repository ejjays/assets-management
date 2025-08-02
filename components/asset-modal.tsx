"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Banknote, User, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Define the Asset interface to match your MongoDB document structure, including optional _id for new assets
interface Asset {
  _id?: string; // Optional for new assets, required for existing ones
  name: string;
  category: string;
  status: "Active" | "Maintenance" | "Retired";
  location: string;
  purchaseDate: string;
  value: number;
  assignedTo?: string;
  description?: string;
  serialNumber?: string;
  manufacturer?: string;
  model?: string;
}

interface AssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (asset: Asset) => void; // Expects a complete Asset object
  initialData?: Asset | null; // Renamed from 'asset' to 'initialData' for clarity
}

export function AssetModal({ isOpen, onClose, onSave, initialData }: AssetModalProps) {
  const [formData, setFormData] = useState<Omit<Asset, '_id'> & { _id?: string, value: string }>({
    name: "",
    category: "",
    status: "Active",
    location: "",
    purchaseDate: "",
    value: "", // Keep as string for input field
    assignedTo: "",
    description: "",
    serialNumber: "",
    manufacturer: "",
    model: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) { // Only reset/populate when modal opens or initialData changes
      if (initialData) {
        // Populate form for editing
        setFormData({
          _id: initialData._id, // Keep _id for updates
          name: initialData.name || "",
          category: initialData.category || "",
          status: initialData.status || "Active",
          location: initialData.location || "",
          purchaseDate: initialData.purchaseDate || "",
          value: initialData.value?.toString() || "", // Convert number to string for input
          assignedTo: initialData.assignedTo || "",
          description: initialData.description || "",
          serialNumber: initialData.serialNumber || "",
          manufacturer: initialData.manufacturer || "",
          model: initialData.model || "",
        });
      } else {
        // Reset form for adding new asset
        setFormData({
          name: "",
          category: "",
          status: "Active",
          location: "",
          purchaseDate: "",
          value: "",
          assignedTo: "",
          description: "",
          serialNumber: "",
          manufacturer: "",
          model: "",
        });
      }
      setErrors({}); // Clear errors when modal opens
    }
  }, [initialData, isOpen]);

  const categories = [
    "Classroom Assets",
    "Laboratory Equipment",
    "Library Resources",
    "Office & Admin",
    "Sports & Recreation",
    "IT Infrastructure",
    "Furniture & Fixtures",
    "Maintenance & Facilities",
  ];

  const statuses = ["Active", "Maintenance", "Retired"];

  const locations = [
    "Main Building - Ground Floor",
    "Main Building - 2nd Floor",
    "Main Building - 3rd Floor",
    "Admin Building - Ground Floor",
    "Admin Building - 2nd Floor",
    "Sports Complex",
    "Library",
    "Laboratory Wing",
    "Faculty Room",
    "Guidance Office",
    "Clinic",
    "Canteen",
    "Auditorium",
    "Main Server Room",
    "Warehouse",
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Asset name is required";
    }
    if (!formData.category) {
      newErrors.category = "Category is required";
    }
    if (!formData.location) {
      newErrors.location = "Location is required";
    }
    if (!formData.purchaseDate) {
      newErrors.purchaseDate = "Purchase date is required";
    }
    if (!formData.value || isNaN(Number(formData.value)) || Number(formData.value) <= 0) {
      newErrors.value = "Valid value is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Prepare data for saving
    const assetToSave: Asset = {
      ...formData,
      value: Number(formData.value), // Convert value back to number for submission
    };

    onSave(assetToSave); // Pass the structured asset data to the onSave prop
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">{initialData ? "Edit Asset" : "Add New Asset"}</h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Package className="w-5 h-5 mr-2" />
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Asset Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter asset name"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-sm text-red-600">{errors.category}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Select value={formData.location} onValueChange={(value) => handleInputChange("location", value)}>
                  <SelectTrigger className={errors.location ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.location && <p className="text-sm text-red-600">{errors.location}</p>}
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Banknote className="w-5 h-5 mr-2" />
              Financial Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="value">Asset Value (₱) *</Label>
                <Input
                  id="value"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.value}
                  onChange={(e) => handleInputChange("value", e.target.value)}
                  placeholder="0.00"
                  className={errors.value ? "border-red-500" : ""}
                />
                {errors.value && <p className="text-sm text-red-600">{errors.value}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="purchaseDate">Purchase Date *</Label>
                <Input
                  id="purchaseDate"
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => handleInputChange("purchaseDate", e.target.value)}
                  className={errors.purchaseDate ? "border-red-500" : ""}
                />
                {errors.purchaseDate && <p className="text-sm text-red-600">{errors.purchaseDate}</p>}
              </div>
            </div>
          </div>

          {/* Assignment & Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Assignment & Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assignedTo">Assigned To</Label>
                <Input
                  id="assignedTo"
                  value={formData.assignedTo}
                  onChange={(e) => handleInputChange("assignedTo", e.target.value)}
                  placeholder="Employee name or department"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="serialNumber">Serial Number</Label>
                <Input
                  id="serialNumber"
                  value={formData.serialNumber}
                  onChange={(e) => handleInputChange("serialNumber", e.target.value)}
                  placeholder="Enter serial number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="manufacturer">Manufacturer</Label>
                <Input
                  id="manufacturer"
                  value={formData.manufacturer}
                  onChange={(e) => handleInputChange("manufacturer", e.target.value)}
                  placeholder="Enter manufacturer"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => handleInputChange("model", e.target.value)}
                  placeholder="Enter model"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Enter asset description, notes, or additional details..."
                rows={3}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-6 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 sm:flex-none bg-transparent">
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {initialData ? "Update Asset" : "Add Asset"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
