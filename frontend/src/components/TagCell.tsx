"use client"

import * as React from 'react'
import { useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { updateLead, type Tag as ApiTag } from '@/lib/api'
import { useToast } from '@/components/ui/toast'

export function TagCell({
  id,
  tags,
  availableTags,
  onUpdated,
}: {
  id: string
  tags: ApiTag[]
  availableTags: string[]
  onUpdated: (newTags: ApiTag[]) => void
}) {
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)
  const [newTag, setNewTag] = useState('')
  const { notify } = useToast()

  const tagNames = useMemo(() => tags.map((t) => t.name), [tags])

  async function apply(nextTags: string[]) {
    setPending(true)
    const prev = tags
    onUpdated(nextTags.map((name) => ({ id: name, name, color: '#666', leadId: id } as ApiTag)))
    try {
      const res = await updateLead(id, { tags: nextTags })
      onUpdated(res.tags)
      notify({ title: 'Updated', description: 'Tags updated', variant: 'success' })
    } catch (e) {
      onUpdated(prev)
      notify({ title: 'Update failed', description: String(e), variant: 'error' })
    } finally {
      setPending(false)
    }
  }

  function toggleTag(name: string) {
    const set = new Set(tagNames)
    if (set.has(name)) set.delete(name)
    else set.add(name)
    apply(Array.from(set))
  }

  function addNewTag() {
    const name = newTag.trim()
    if (!name) return
    setNewTag('')
    const set = new Set(tagNames)
    set.add(name)
    apply(Array.from(set))
  }

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <div
        className="flex flex-wrap gap-1.5"
        onClick={(e) => {
          e.stopPropagation()
          setOpen((o) => !o)
        }}
      >
        {tagNames.length ? (
          tagNames.map((name) => (
            <Badge key={name} className="text-white" style={{ backgroundColor: '#666' }}>
              {name}
            </Badge>
          ))
        ) : (
          <span className="text-xs text-zinc-400">—</span>
        )}
      </div>
      {open && (
        <div
          className="absolute z-20 mt-2 w-64 rounded-md border border-zinc-200 bg-white p-2 shadow-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-2 text-xs font-medium text-zinc-600">Available Tags</div>
          <div className="mb-2 flex flex-wrap gap-1.5">
            {Array.from(new Set([...availableTags, ...tagNames])).map((name) => (
              <button
                key={name}
                className={`rounded-full px-2.5 py-0.5 text-xs ${
                  tagNames.includes(name)
                    ? 'bg-zinc-900 text-white'
                    : 'border border-zinc-300 text-zinc-700'
                }`}
                onClick={(e) => {
                  e.stopPropagation()
                  toggleTag(name)
                }}
                disabled={pending}
              >
                {name}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') addNewTag()
              }}
            />
            <Button
              variant="outline"
              onClick={(e) => {
                e.stopPropagation()
                addNewTag()
              }}
              disabled={pending}
            >
              Add
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
