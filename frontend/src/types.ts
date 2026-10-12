export type Status = 'open' | 'in_progress' | 'closed'
export type Priority = 'low' | 'medium' | 'high'

export interface Ticket {
  id: string
  title: string
  description: string
  status: Status
  priority: Priority
  created_at: string
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export type TicketStats = Record<Status, number>
