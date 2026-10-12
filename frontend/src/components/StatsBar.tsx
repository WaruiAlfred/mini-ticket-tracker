import { useQuery } from '@tanstack/react-query'
import { fetchStats } from '../api/tickets'

const LABELS: Record<string, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  closed: 'Closed',
}

export function StatsBar() {
  const { data, isLoading } = useQuery({ queryKey: ['stats'], queryFn: fetchStats })

  if (isLoading || !data) return null

  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
      {(Object.keys(LABELS) as Array<keyof typeof LABELS>).map((key) => (
        <div key={key} className="flex items-center gap-1.5 whitespace-nowrap">
          <span className="font-semibold text-gray-900">{data[key as keyof typeof data] ?? 0}</span>
          <span>{LABELS[key]}</span>
        </div>
      ))}
    </div>
  )
}
