import { apiClient } from './client'
import type { PaginatedResponse, Priority, Status, Ticket, TicketStats } from '../types'

export async function fetchTickets(status?: Status | 'all', page = 1) {
  const { data } = await apiClient.get<PaginatedResponse<Ticket>>('/tickets', {
    params: { status: status && status !== 'all' ? status : undefined, page },
  })
  return data
}

export async function fetchStats() {
  const { data } = await apiClient.get<TicketStats>('/tickets/stats')
  return data
}

export interface CreateTicketPayload {
  title: string
  description?: string
  priority: Priority
}

export async function createTicket(payload: CreateTicketPayload) {
  const { data } = await apiClient.post<Ticket>('/tickets', payload)
  return data
}

export interface UpdateTicketPayload {
  id: string
  title?: string
  description?: string
  status?: Status
  priority?: Priority
}

export async function updateTicket({ id, ...payload }: UpdateTicketPayload) {
  const { data } = await apiClient.patch<Ticket>(`/tickets/${id}`, payload)
  return data
}

export async function deleteTicket(id: string) {
  await apiClient.delete(`/tickets/${id}`)
}
