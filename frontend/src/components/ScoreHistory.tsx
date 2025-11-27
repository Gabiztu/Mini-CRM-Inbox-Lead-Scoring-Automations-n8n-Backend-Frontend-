"use client"

import * as React from 'react'
import { ScoringEvent } from '@/lib/api'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export function ScoreHistory({ events }: { events: ScoringEvent[] }) {
  return (
    <Card>
      <div className="px-4 py-3 text-sm font-medium">Score History</div>
      <Separator />
      <div className="max-h-80 overflow-y-auto p-3">
        {events.length === 0 ? (
          <div className="text-sm text-zinc-500">No scoring events yet.</div>
        ) : (
          <ul className="space-y-2 text-sm">
            {events.map((e) => (
              <li key={e.id} className="flex items-center justify-between rounded-md border border-zinc-200 bg-white px-3 py-2">
                <div>
                  <span className={e.delta >= 0 ? 'text-green-700' : 'text-red-700'}>
                    {e.delta >= 0 ? '+' : ''}
                    {e.delta}
                  </span>{' '}
                  → <span className="font-medium">{e.newScore}</span>
                </div>
                <div className="text-xs text-zinc-500">{new Date(e.createdAt).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  )
}
