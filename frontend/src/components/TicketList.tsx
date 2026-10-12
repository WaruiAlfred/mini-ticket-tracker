import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { fetchTickets } from '../api/tickets'
import type { Status } from '../types'
import { TicketRow } from './TicketRow'

const FILTERS: Array<Status | 'all'> = ['all', 'open', 'in_progress', 'closed']

export function TicketList() {
  const [filter, setFilter] = useState<Status | 'all'>('all')

  const { data, isLoading, isError } = useQuery({
    queryKey: ['tickets', filter],
    queryFn: () => fetchTickets(filter),
  })

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <h2 className="text-sm font-semibold text-gray-900">Tickets</h2>
        <div className="flex gap-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                filter === f ? 'bg-accent text-white' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {f === 'all' ? 'All' : f.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {isLoading && <p className="px-4 py-6 text-sm text-gray-400">Loading tickets…</p>}
      {isError && <p className="px-4 py-6 text-sm text-red-600">Couldn&apos;t load tickets.</p>}
      {data && data.results.length === 0 && (
        <p className="px-4 py-6 text-sm text-gray-400">No tickets yet.</p>
      )}

      {data?.results.map((ticket) => <TicketRow key={ticket.id} ticket={ticket} />)}
    </div>
  )
}
