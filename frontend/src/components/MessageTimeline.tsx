"use client"

import * as React from 'react'
import { Message } from '@/lib/api'
import { ScrollArea } from '@/components/ui/scroll-area'
import { format } from 'date-fns'

export function MessageTimeline({ messages }: { messages: Message[] }) {
  return (
    <ScrollArea className="h-[calc(100vh-220px)] pr-2">
      <div className="space-y-3">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.direction === 'OUTBOUND' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`${
                m.direction === 'OUTBOUND'
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-100 text-zinc-900'
              } max-w-[75%] rounded-lg px-3 py-2 text-sm shadow-sm`}
            >
              <div className="whitespace-pre-wrap">{m.content}</div>
              <div className="mt-1 text-[10px] opacity-70">
                {format(new Date(m.timestamp), 'MMM d, h:mm a')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
