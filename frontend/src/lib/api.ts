export type Tag = {
  id: string
  name: string
  color: string
  leadId: string
}

export type Lead = {
  id: string
  name: string
  email: string
  status: 'NEW' | 'QUALIFIED' | 'WON' | 'LOST' | 'COLD' | 'NEEDS_FOLLOWUP'
  score: number
  source: string | null
  lastInteraction: string | null
  createdAt: string
  updatedAt: string
  tags: Tag[]
}

export type Paginated<T> = {
  items: T[]
  total: number
  page: number
  pageSize: number
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export async function fetchLeads(params: {
  page?: number
  pageSize?: number
  q?: string
  status?: string
} = {}): Promise<Paginated<Lead>> {
  const u = new URL(`${API_BASE}/api/leads`)
  if (params.page) u.searchParams.set('page', String(params.page))
  if (params.pageSize) u.searchParams.set('pageSize', String(params.pageSize))
  if (params.q) u.searchParams.set('q', params.q)
  if (params.status) u.searchParams.set('status', params.status)

  const res = await fetch(u.toString(), { cache: 'no-store' })
  if (!res.ok) throw new Error(`Failed to fetch leads: ${res.status}`)
  return res.json()
}
