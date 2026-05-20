import type { ReactNode } from 'react'

type StatusVariant = 'open' | 'in_progress' | 'resolved' | 'closed'
type PriorityVariant = 'low' | 'medium' | 'high' | 'critical'

const statusStyles: Record<StatusVariant, string> = {
  open: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-amber-100 text-amber-700',
  resolved: 'bg-green-100 text-green-700',
  closed: 'bg-neutral-100 text-neutral-600',
}

const priorityStyles: Record<PriorityVariant, string> = {
  low: 'bg-neutral-100 text-neutral-600',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-amber-100 text-amber-700',
  critical: 'bg-red-100 text-red-700',
}

interface BadgeProps {
  variant: string
  children: ReactNode
}

export function Badge({ variant, children }: BadgeProps) {
  const style =
    statusStyles[variant as StatusVariant] ??
    priorityStyles[variant as PriorityVariant] ??
    'bg-neutral-100 text-neutral-600'

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${style}`}>
      {children}
    </span>
  )
}
