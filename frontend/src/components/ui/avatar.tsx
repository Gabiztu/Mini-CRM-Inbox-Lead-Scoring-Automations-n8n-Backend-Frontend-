import * as React from 'react'
import { cn } from '@/lib/utils'

export function Avatar({ name, className }: { name?: string; className?: string }) {
  const initials = (name || '?')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
  return (
    <div
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 text-xs font-medium text-zinc-700',
        className
      )}
    >
      {initials}
    </div>
  )
}
