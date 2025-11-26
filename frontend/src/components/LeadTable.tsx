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
import { useRouter } from 'next/navigation'
import { StatusCell } from '@/components/StatusCell'
import { TagCell } from '@/components/TagCell'

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
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [allLeads, setAllLeads] = useState<Lead[]>([])

  const [q, setQ] = useState('')
  const [status, setStatus] = useState<(typeof STATUSES)[number]>('ALL')
  const [scoreRange, setScoreRange] = useState<'ALL' | '0-10' | '11-30' | '31-50' | '51-100'>('ALL')
  const [tagFilter, setTagFilter] = useState<'ALL' | string>('ALL')

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
    if (tagFilter !== 'ALL') {
      rows = rows.filter((l) => (l.tags || []).some((t) => t.name === tagFilter))
    }
    if (scoreRange !== 'ALL') {
      const [minStr, maxStr] = scoreRange.split('-')
      const min = Number(minStr)
      const max = Number(maxStr)
      rows = rows.filter((l) => l.score >= min && l.score <= max)
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

  const availableTags = useMemo(() => {
    const set = new Set<string>()
    for (const l of allLeads) for (const t of l.tags || []) set.add(t.name)
    return Array.from(set).sort()
  }, [allLeads])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search leads (name or email)"
            className="pl-8"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Status filter */}
          <div className="w-44">
            <Select value={status} onChange={(e) => setStatus(e.target.value as any)}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s === 'NEEDS_FOLLOWUP' ? 'NEEDS FOLLOWUP' : s}
                </option>
              ))}
            </Select>
          </div>
          {/* Score range filter */}
          <div className="w-40">
            <Select value={scoreRange} onChange={(e) => setScoreRange(e.target.value as any)}>
              <option value="ALL">ALL SCORES</option>
              <option value="0-10">0–10</option>
              <option value="11-30">11–30</option>
              <option value="31-50">31–50</option>
              <option value="51-100">51–100</option>
            </Select>
          </div>
          {/* Tag filter */}
          <div className="w-44">
            <Select value={tagFilter} onChange={(e) => setTagFilter(e.target.value as any)}>
              <option value="ALL">ALL TAGS</option>
              {availableTags.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          </div>
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
                <TableRow
                  key={l.id}
                  onClick={() => router.push(`/leads/${l.id}`)}
                  className="cursor-pointer"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar name={l.name} />
                      <div>
                        <div className="font-medium text-zinc-900">{l.name}</div>
                        <div className="text-xs text-zinc-500">{l.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <StatusCell
                      id={l.id}
                      value={l.status}
                      onUpdated={(newStatus) =>
                        setAllLeads((rows) => rows.map((x) => (x.id === l.id ? { ...x, status: newStatus as any } : x)))
                      }
                    />
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <TagCell
                      id={l.id}
                      tags={l.tags || []}
                      availableTags={availableTags}
                      onUpdated={(newTags) =>
                        setAllLeads((rows) => rows.map((x) => (x.id === l.id ? { ...x, tags: newTags } : x)))
                      }
                    />
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
