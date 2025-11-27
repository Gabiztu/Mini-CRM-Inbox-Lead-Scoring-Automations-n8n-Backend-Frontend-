"use client"

import * as React from 'react'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { fetchLeadDetails, fetchMessages, fetchScoreHistory, type Lead, type Message, type ScoringEvent } from '@/lib/api'
import { LeadInfoCard } from '@/components/LeadInfoCard'
import { MessageTimeline } from '@/components/MessageTimeline'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { ScoreHistory } from '@/components/ScoreHistory'

export function LeadDetailClient({ id }: { id: string }) {
  const params = useParams() as { id?: string } | null
  const effectiveId = id ?? params?.id ?? ''
  const [lead, setLead] = useState<Lead | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [events, setEvents] = useState<ScoringEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!effectiveId) return
    let mounted = true
    setLoading(true)
    Promise.all([fetchLeadDetails(effectiveId), fetchMessages(effectiveId), fetchScoreHistory(effectiveId)])
      .then(([l, m, ev]) => {
        if (!mounted) return
        setLead(l)
        setMessages(m)
        setEvents(ev)
        setError(null)
      })
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false))
    return () => {
      mounted = false
    }
  }, [effectiveId])

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Skeleton className="h-52 w-full" />
        </div>
        <div className="lg:col-span-8">
          <div className="rounded-lg border border-zinc-200 bg-white">
            <div className="px-4 py-3 text-sm font-medium">Message Timeline</div>
            <Separator />
            <div className="space-y-2 p-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {error}
      </div>
    )
  }

  if (!effectiveId) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-6 text-center text-sm text-zinc-600">
        Invalid lead URL
      </div>
    )
  }

  if (!lead) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-6 text-center text-sm text-zinc-600">
        Lead Not Found
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
      <div className="lg:col-span-4">
        <LeadInfoCard lead={lead} />
        <div className="mt-4">
          <ScoreHistory events={events} />
        </div>
      </div>
      <div className="lg:col-span-8">
        <div className="rounded-lg border border-zinc-200 bg-white">
          <div className="px-4 py-3 text-sm font-medium">Message Timeline</div>
          <Separator />
          <div className="p-3">
            <MessageTimeline messages={messages} />
          </div>
        </div>
      </div>
    </div>
  )
}
