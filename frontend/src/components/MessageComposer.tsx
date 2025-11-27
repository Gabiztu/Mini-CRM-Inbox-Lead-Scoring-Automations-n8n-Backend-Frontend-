"use client"

import * as React from 'react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { createMessage, type Message } from '@/lib/api'

export function MessageComposer({
  leadId,
  onSent,
}: {
  leadId: string
  onSent?: (msg: Message) => void
}) {
  const [direction, setDirection] = useState<'INBOUND' | 'OUTBOUND'>('INBOUND')
  const [content, setContent] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function send() {
    const text = content.trim()
    if (!text) return
    setPending(true)
    setError(null)
    try {
      const msg = await createMessage({ leadId, content: text, direction })
      setContent('')
      onSent?.(msg)
    } catch (e) {
      setError(String(e))
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="rounded-lg border border-zinc-200 bg-white">
      <div className="px-4 py-3 text-sm font-medium">Compose Message</div>
      <div className="space-y-2 p-3">
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</div>
        )}
        <div className="flex items-center gap-2">
          <div className="w-40">
            <Select value={direction} onChange={(e) => setDirection(e.target.value as any)}>
              <option value="INBOUND">INBOUND</option>
              <option value="OUTBOUND">OUTBOUND</option>
            </Select>
          </div>
          <textarea
            className="min-h-[44px] w-full resize-y rounded-md border border-zinc-300 px-3 py-2 text-sm focus-visible:outline-none"
            placeholder="Type a message"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) send()
            }}
          />
          <Button onClick={send} disabled={pending || !content.trim()}>
            {pending ? 'Sending…' : 'Send'}
          </Button>
        </div>
      </div>
    </div>
  )
}
