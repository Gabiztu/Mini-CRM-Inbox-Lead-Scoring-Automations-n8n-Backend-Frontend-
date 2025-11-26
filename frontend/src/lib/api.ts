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

export type Message = {
  id: string
  leadId: string
  content: string
  direction: 'INBOUND' | 'OUTBOUND' | string
  timestamp: string
}

// Use IPv4 loopback on the server to avoid potential IPv6 ::1 resolution issues with "localhost" on Windows.
// Keep localhost for browser requests to match CORS origin exactly.
const API_BASE =
  typeof window === 'undefined'
    ? process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000'
    : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

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

export async function updateLead(
  id: string,
  data: Partial<Pick<Lead, 'name' | 'email' | 'status' | 'score' | 'source'>> & { tags?: string[] }
): Promise<Lead> {
  const res = await fetch(`${API_BASE}/api/leads/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(`Failed to update lead: ${res.status}`)
  return res.json()
}

export async function fetchLeadDetails(id: string): Promise<Lead> {
  const res = await fetch(`${API_BASE}/api/leads/${id}`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Failed to fetch lead: ${res.status}`)
  return res.json()
}

export async function fetchMessages(leadId: string): Promise<Message[]> {
  const res = await fetch(`${API_BASE}/api/messages/${leadId}`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Failed to fetch messages: ${res.status}`)
  return res.json()
}
