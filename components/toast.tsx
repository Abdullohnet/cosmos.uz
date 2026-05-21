'use client'

import { create } from 'zustand'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

interface ToastStore {
  toasts: Toast[]
  show: (message: string, type?: ToastType, duration?: number) => void
  remove: (id: string) => void
}

export const useToast = create<ToastStore>((set) => ({
  toasts: [],
  show: (message, type = 'success', duration = 3000) => {
    const id = Math.random().toString(36).slice(2)
    set(state => ({ toasts: [...state.toasts, { id, message, type, duration }] }))
    setTimeout(() => set(state => ({ toasts: state.toasts.filter(t => t.id !== id) })), duration)
  },
  remove: (id) => set(state => ({ toasts: state.toasts.filter(t => t.id !== id) })),
}))

const icons = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
}

const colors = {
  success: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
  error: 'border-red-500/40 bg-red-500/10 text-red-400',
  info: 'border-primary/40 bg-primary/10 text-primary',
  warning: 'border-yellow-500/40 bg-yellow-500/10 text-yellow-400',
}

export function ToastContainer() {
  const { toasts, remove } = useToast()

  return (
    <div className="fixed top-20 right-4 z-[200] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map(toast => {
          const Icon = icons[toast.type]
          return (
            <motion.div key={toast.id}
              layout
              initial={{ opacity: 0, x: 60, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              className={cn(
                'pointer-events-auto flex items-center gap-3 pl-4 pr-3 py-3 rounded-xl border glass-strong backdrop-blur-xl shadow-xl min-w-[240px] max-w-[340px]',
                colors[toast.type]
              )}>
              <Icon className="w-4 h-4 flex-shrink-0" />
              <p className="text-sm font-medium text-foreground flex-1">{toast.message}</p>
              <button onClick={() => remove(toast.id)} className="p-0.5 rounded-lg hover:bg-secondary/50 transition-colors flex-shrink-0">
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
