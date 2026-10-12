import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { deleteTicket, updateTicket } from '../api/tickets'
import type { Priority, Status, Ticket } from '../types'
import { PriorityBadge } from './PriorityBadge'
import { StatusBadge } from './StatusBadge'

const STATUS_OPTIONS: Status[] = ['open', 'in_progress', 'closed']
const PRIORITY_OPTIONS: Priority[] = ['low', 'medium', 'high']

export function TicketRow({ ticket }: { ticket: Ticket }) {
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(ticket.title)
  const [description, setDescription] = useState(ticket.description)

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ['tickets'] })
    queryClient.invalidateQueries({ queryKey: ['stats'] })
  }

  const updateMutation = useMutation({
    mutationFn: updateTicket,
    onSuccess: () => {
      invalidate()
      setIsEditing(false)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTicket,
    onSuccess: invalidate,
  })

  function handleSave() {
    updateMutation.mutate({ id: ticket.id, title, description })
  }

  function handleCancel() {
    setTitle(ticket.title)
    setDescription(ticket.description)
    setIsEditing(false)
  }

  function handleDelete() {
    if (confirm(`Delete "${ticket.title}"?`)) {
      deleteMutation.mutate(ticket.id)
    }
  }

  if (isEditing) {
    return (
      <div className="flex flex-col gap-2 border-b border-gray-100 px-4 py-3 last:border-b-0">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-accent focus:outline-none"
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-accent focus:outline-none"
        />
        <select
          value={ticket.priority}
          onChange={(e) =>
            updateMutation.mutate({ id: ticket.id, priority: e.target.value as Priority })
          }
          className="rounded-md border border-gray-300 px-2 py-1 text-xs focus:border-accent focus:outline-none"
        >
          {PRIORITY_OPTIONS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="rounded-md bg-accent px-3 py-1 text-xs font-medium text-white hover:bg-accent-dark disabled:opacity-50"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="rounded-md border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 border-b border-gray-100 px-4 py-3 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="min-w-0 sm:flex-1">
        <p className="truncate text-sm font-medium text-gray-900">{ticket.title}</p>
        {ticket.description && (
          <p className="truncate text-xs text-gray-500">{ticket.description}</p>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
        <PriorityBadge priority={ticket.priority} />
        <StatusBadge status={ticket.status} />
        <select
          value={ticket.status}
          onChange={(e) =>
            updateMutation.mutate({ id: ticket.id, status: e.target.value as Status })
          }
          disabled={updateMutation.isPending}
          className="rounded-md border border-gray-300 px-2 py-1 text-xs focus:border-accent focus:outline-none disabled:opacity-50"
        >
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              Move to {status.replace('_', ' ')}
            </option>
          ))}
        </select>
        <button
          onClick={() => setIsEditing(true)}
          aria-label="Edit ticket"
          title="Edit"
          className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
          aria-label="Delete ticket"
          title="Delete"
          className="rounded-md p-1.5 text-red-600 hover:bg-red-50 disabled:opacity-50"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}
