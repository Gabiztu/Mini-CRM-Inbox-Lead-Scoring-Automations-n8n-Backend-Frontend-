import * as React from 'react'
import { cn } from '@/lib/utils'

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: 'default' | 'secondary' | 'outline'
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const base = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium'
  const styles = {
    default: 'bg-zinc-900 text-white',
    secondary: 'bg-zinc-100 text-zinc-900',
    outline: 'border border-zinc-200 text-zinc-900',
  } as const
  return <span className={cn(base, styles[variant], className)} {...props} />
}
