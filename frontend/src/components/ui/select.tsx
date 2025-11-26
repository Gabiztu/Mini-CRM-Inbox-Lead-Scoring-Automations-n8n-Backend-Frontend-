import * as React from 'react'
import { cn } from '@/lib/utils'

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      'h-9 w-full rounded-md border border-zinc-300 bg-transparent px-3 text-sm focus-visible:outline-none',
      className
    )}
    {...props}
  >
    {children}
  </select>
))
Select.displayName = 'Select'
