"use client"

import * as React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { fetchLeads, Lead } from '@/lib/api'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

const STATUSES = ['ALL', 'NEW', 'QUALIFIED', 'WON', 'LOST', 'COLD', 'NEEDS_FOLLOWUP'] as const

const statusBadgeClasses: Record<string, string> = {
  NEW: 'bg-blue-600',
  QUALIFIED: 'bg-purple-600',
  WON: 'bg-green-600',
  LOST: 'bg-red-600',
  COLD: 'bg-gray-500',
  NEEDS_FOLLOWUP: 'bg-amber-600',
}

export function LeadTable() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [allLeads, setAllLeads] = useState<Lead[]>([])

  const [q, setQ] = useState('')
  const [status, setStatus] = useState<(typeof STATUSES)[number]>('ALL')

  // UI pagination (client-side)
  const [page, setPage] = useState(1)
  const pageSize = 10

  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetchLeads({ page: 1, pageSize: 1000 })
      .then((res) => {
        if (!mounted) return
        setAllLeads(res.items)
        setError(null)
      })
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false))
    return () => {
      mounted = false
    }
  }, [])

  // Filtering
  const filtered = useMemo(() => {
    const qLower = q.trim().toLowerCase()
    let rows = allLeads
    if (qLower) {
      rows = rows.filter((l) => l.name.toLowerCase().includes(qLower) || l.email.toLowerCase().includes(qLower))
    }
    if (status !== 'ALL') {
      rows = rows.filter((l) => l.status === status)
    }
    return rows
  }, [allLeads, q, status])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageItems = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  useEffect(() => {
    // Reset to page 1 on filter change
    setPage(1)
  }, [q, status])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search leads (name or email)"
            className="pl-8"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="w-48">
          <Select value={status} onChange={(e) => setStatus(e.target.value as any)}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s === 'NEEDS_FOLLOWUP' ? 'NEEDS FOLLOWUP' : s}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Last Interaction</TableHead>
              <TableHead>Source</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading &&
              Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-56" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-24 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-8" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                </TableRow>
              ))}

            {!loading && error && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-red-600">
                  {error}
                </TableCell>
              </TableRow>
            )}

            {!loading && !error && pageItems.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-zinc-500">
                  No leads found
                </TableCell>
              </TableRow>
            )}

            {!loading && !error &&
              pageItems.map((l) => (
                <TableRow key={l.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar name={l.name} />
                      <div>
                        <div className="font-medium text-zinc-900">{l.name}</div>
                        <div className="text-xs text-zinc-500">{l.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white ${statusBadgeClasses[l.status] || 'bg-zinc-600'}`}>
                      {l.status === 'NEEDS_FOLLOWUP' ? 'NEEDS FOLLOWUP' : l.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                      {l.tags?.length ? (
                        l.tags.map((t) => (
                          <Badge
                            key={t.id}
                            className="text-white"
                            style={{ backgroundColor: t.color || '#666' }}
                          >
                            {t.name}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-zinc-400">—</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{l.score}</TableCell>
                  <TableCell>
                    {l.lastInteraction ? (
                      <span className="text-zinc-700">
                        {formatDistanceToNow(new Date(l.lastInteraction), { addSuffix: true })}
                      </span>
                    ) : (
                      <span className="text-zinc-400">—</span>
                    )}
                  </TableCell>
                  <TableCell>{l.source || <span className="text-zinc-400">—</span>}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-zinc-600">
          Page {currentPage} of {totalPages} • {filtered.length} result(s)
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
