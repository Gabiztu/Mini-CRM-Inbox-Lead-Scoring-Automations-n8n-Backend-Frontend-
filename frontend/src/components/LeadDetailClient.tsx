"use client"

import * as React from 'react'
import { useEffect, useState } from 'react'
import { fetchLeadDetails, fetchMessages, type Lead, type Message } from '@/lib/api'
import { LeadInfoCard } from '@/components/LeadInfoCard'
import { MessageTimeline } from '@/components/MessageTimeline'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

export function LeadDetailClient({ id }: { id: string }) {
  const [lead, setLead] = useState<Lead | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    Promise.all([fetchLeadDetails(id), fetchMessages(id)])
      .then(([l, m]) => {
        if (!mounted) return
        setLead(l)
        setMessages(m)
        setError(null)
      })
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false))
    return () => {
      mounted = false
    }
  }, [id])

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
