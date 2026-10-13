import { isAxiosError } from 'axios'

export function getErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError(error) && error.response?.data) {
    const data = error.response.data
    if (typeof data === 'string') return data
    const firstField = Object.values(data)[0]
    if (Array.isArray(firstField)) return String(firstField[0])
    if (typeof firstField === 'string') return firstField
  }
  return fallback
}
