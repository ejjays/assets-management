"use client"
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react"
import { useToastStore, type Toast } from "@/lib/toast-store"

const ToastComponent = ({ toast }: { toast: Toast }) => {
  const { removeToast } = useToastStore()

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircle className="text-green-500" size={20} />
      case "error":
        return <AlertCircle className="text-red-500" size={20} />
      case "warning":
        return <AlertTriangle className="text-yellow-500" size={20} />
      case "info":
        return <Info className="text-blue-500" size={20} />
    }
  }

  const getBorderColor = () => {
    switch (toast.type) {
      case "success":
        return "border-l-green-500"
      case "error":
        return "border-l-red-500"
      case "warning":
        return "border-l-yellow-500"
      case "info":
        return "border-l-blue-500"
    }
  }

  return (
    <div
      className={`
        bg-[#1E1E1E] border border-gray-600 border-l-4 ${getBorderColor()}
        rounded-lg p-4 shadow-lg transform transition-all duration-300 ease-in-out
        hover:shadow-xl max-w-sm w-full
      `}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-medium text-sm">{toast.title}</h4>
          {toast.description && <p className="text-gray-400 text-xs mt-1 leading-relaxed">{toast.description}</p>}
        </div>
        <button
          onClick={() => removeToast(toast.id)}
          className="flex-shrink-0 text-gray-400 hover:text-white transition-colors p-1"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}

export function ToastContainer() {
  const { toasts } = useToastStore()

  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2">
      {toasts.map((toast) => (
        <ToastComponent key={toast.id} toast={toast} />
      ))}
    </div>
  )
}
