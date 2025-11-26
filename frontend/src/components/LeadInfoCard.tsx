"use client"

import * as React from 'react'
import { Lead } from '@/lib/api'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

const statusBadgeClasses: Record<string, string> = {
  NEW: 'bg-blue-600',
  QUALIFIED: 'bg-purple-600',
  WON: 'bg-green-600',
  LOST: 'bg-red-600',
  COLD: 'bg-gray-500',
  NEEDS_FOLLOWUP: 'bg-amber-600',
}

export function LeadInfoCard({ lead }: { lead: Lead }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Avatar name={lead.name} />
          <div>
            <div className="text-base font-semibold text-zinc-900">{lead.name}</div>
            <div className="text-xs text-zinc-600">{lead.email}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="space-y-1">
            <div className="text-xs text-zinc-500">Status</div>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white ${
                statusBadgeClasses[lead.status] || 'bg-zinc-600'
              }`}
            >
              {lead.status === 'NEEDS_FOLLOWUP' ? 'NEEDS FOLLOWUP' : lead.status}
            </span>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-zinc-500">Source</div>
            <div className="text-zinc-800">{lead.source || '—'}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-zinc-500">Score</div>
            <Badge className="bg-zinc-900 text-white">{lead.score}</Badge>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-zinc-500">Tags</div>
            <div className="flex flex-wrap gap-1.5">
              {lead.tags?.length ? (
                lead.tags.map((t) => (
                  <Badge key={t.id} className="text-white" style={{ backgroundColor: t.color || '#666' }}>
                    {t.name}
                  </Badge>
                ))
              ) : (
                <span className="text-xs text-zinc-400">—</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
