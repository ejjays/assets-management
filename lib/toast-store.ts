import { create } from "zustand"

interface Toast {
  id: string
  message: string
  type: "success" | "error" | "warning" | "info"
  duration?: number
}

interface ToastStore {
  toasts: Toast[]
  addToast: (message: string, type?: Toast["type"], duration?: number) => void
  removeToast: (id: string) => void
  clearToasts: () => void
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],

  addToast: (message, type = "info", duration = 5000) => {
    const id = Math.random().toString(36).substr(2, 9)
    const toast: Toast = { id, message, type, duration }

    set((state) => ({
      toasts: [...state.toasts, toast],
    }))
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }))
  },

  clearToasts: () => {
    set({ toasts: [] })
  },
}))
