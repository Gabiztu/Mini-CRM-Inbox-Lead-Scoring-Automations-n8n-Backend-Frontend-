"use client"

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { cn } from '@/lib/utils'

type Toast = { id: number; title?: string; description?: string; variant?: 'default' | 'error' | 'success' }

const ToastContext = createContext<{ notify: (t: Omit<Toast, 'id'>) => void } | null>(null)

export function ToasterProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const notify = useCallback((t: Omit<Toast, 'id'>) => {
    const id = Date.now() + Math.random()
    const toast: Toast = { id, ...t }
    setToasts((arr) => [...arr, toast])
    setTimeout(() => {
      setToasts((arr) => arr.filter((x) => x.id !== id))
    }, 2500)
  }, [])

  const value = useMemo(() => ({ notify }), [notify])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex w-80 flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              'rounded-md border px-3 py-2 shadow-sm bg-white text-zinc-900',
              t.variant === 'error' && 'border-red-300',
              t.variant === 'success' && 'border-green-300'
            )}
          >
            {t.title && <div className="text-sm font-medium">{t.title}</div>}
            {t.description && <div className="text-xs text-zinc-600">{t.description}</div>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToasterProvider')
  return ctx
}
