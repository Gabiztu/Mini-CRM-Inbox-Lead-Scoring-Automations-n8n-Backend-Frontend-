"use client"

import * as React from 'react'
import { useState } from 'react'
import { updateLead } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'

const STATUSES = ['NEW', 'QUALIFIED', 'WON', 'LOST', 'COLD', 'NEEDS_FOLLOWUP'] as const
const statusBadgeClasses: Record<string, string> = {
  NEW: 'bg-blue-600',
  QUALIFIED: 'bg-purple-600',
  WON: 'bg-green-600',
  LOST: 'bg-red-600',
  COLD: 'bg-gray-500',
  NEEDS_FOLLOWUP: 'bg-amber-600',
}

export function StatusCell({
  id,
  value,
  onUpdated,
}: {
  id: string
  value: (typeof STATUSES)[number]
  onUpdated: (newStatus: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)
  const { notify } = useToast()

  async function apply(next: string) {
    if (next === value) return setOpen(false)
    setPending(true)
    onUpdated(next) // optimistic
    try {
      await updateLead(id, { status: next as any })
      notify({ title: 'Updated', description: 'Status updated', variant: 'success' })
    } catch (e) {
      onUpdated(value) // revert
      notify({ title: 'Update failed', description: String(e), variant: 'error' })
    } finally {
      setPending(false)
      setOpen(false)
    }
  }

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white ${
          statusBadgeClasses[value] || 'bg-zinc-600'
        }`}
        onClick={(e) => {
          e.stopPropagation()
          setOpen((o) => !o)
        }}
        disabled={pending}
      >
        {value === 'NEEDS_FOLLOWUP' ? 'NEEDS FOLLOWUP' : value}
      </button>
      {open && (
        <div
          className="absolute z-20 mt-2 w-40 rounded-md border border-zinc-200 bg-white p-1 shadow-sm"
          onClick={(e) => e.stopPropagation()}
        >
          {STATUSES.map((s) => (
            <Button
              key={s}
              variant="ghost"
              className="h-8 w-full justify-start text-left"
              onClick={(e) => {
                e.stopPropagation()
                apply(s)
              }}
            >
              {s === 'NEEDS_FOLLOWUP' ? 'NEEDS FOLLOWUP' : s}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
