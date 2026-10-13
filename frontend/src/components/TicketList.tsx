import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { fetchStats, fetchTickets } from '../api/tickets'
import type { Status } from '../types'
import { TicketRow } from './TicketRow'

const FILTERS: Array<Status | 'all'> = ['all', 'open', 'in_progress', 'closed']

export function TicketList() {
  const [filter, setFilter] = useState<Status | 'all'>('all')
  const [page, setPage] = useState(1)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['tickets', filter, page],
    queryFn: () => fetchTickets(filter, page),
  })

  const { data: stats } = useQuery({ queryKey: ['stats'], queryFn: fetchStats })

  function countFor(f: Status | 'all') {
    if (!stats) return null
    if (f === 'all') return Object.values(stats).reduce((sum, count) => sum + count, 0)
    return stats[f] ?? 0
  }

  function changeFilter(next: Status | 'all') {
    setFilter(next)
    setPage(1)
  }

  const pageSize = 10
  const totalPages = data ? Math.max(1, Math.ceil(data.count / pageSize)) : 1

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <h2 className="text-sm font-semibold text-gray-900">Tickets</h2>
        <div className="flex gap-1">
          {FILTERS.map((f) => {
            const count = countFor(f)
            return (
              <button
                key={f}
                onClick={() => changeFilter(f)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                  filter === f ? 'bg-accent text-white' : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {f === 'all' ? 'All' : f.replace('_', ' ')}
                {count !== null && <span className="ml-1 opacity-75">{count}</span>}
              </button>
            )
          })}
        </div>
      </div>

      {isLoading && <p className="px-4 py-6 text-sm text-gray-400">Loading tickets…</p>}
      {isError && <p className="px-4 py-6 text-sm text-red-600">Couldn&apos;t load tickets.</p>}
      {data && data.results.length === 0 && (
        <p className="px-4 py-6 text-sm text-gray-400">No tickets yet.</p>
      )}

      {data?.results.map((ticket) => <TicketRow key={ticket.id} ticket={ticket} />)}

      {data && data.count > pageSize && (
        <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={!data.previous}
            className="rounded-md border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-xs text-gray-500">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!data.next}
            className="rounded-md border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
