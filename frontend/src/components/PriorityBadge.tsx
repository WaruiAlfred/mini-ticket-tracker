import type { Priority } from '../types'

const STYLES: Record<Priority, string> = {
  low: 'text-gray-500',
  medium: 'text-accent-dark',
  high: 'text-red-600',
}

const DOT: Record<Priority, string> = {
  low: 'bg-gray-400',
  medium: 'bg-accent',
  high: 'bg-red-600',
}

const LABELS: Record<Priority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${STYLES[priority]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${DOT[priority]}`} />
      {LABELS[priority]}
    </span>
  )
}
