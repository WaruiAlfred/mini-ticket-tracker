import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'
import { getErrorMessage } from '../api/errors'
import { createTicket } from '../api/tickets'
import type { Priority } from '../types'

export function TicketForm() {
  const queryClient = useQueryClient()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')

  const mutation = useMutation({
    mutationFn: createTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
      setTitle('')
      setDescription('')
      setPriority('medium')
      toast.success('Ticket created')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Couldn't create ticket"))
    },
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    mutation.mutate({ title, description, priority })
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-gray-900">New ticket</h2>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-accent focus:outline-none"
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-accent focus:outline-none"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-accent focus:outline-none"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button
          type="submit"
          disabled={mutation.isPending}
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-dark disabled:opacity-50"
        >
          {mutation.isPending ? 'Adding…' : 'Add ticket'}
        </button>
      </div>
    </form>
  )
}
