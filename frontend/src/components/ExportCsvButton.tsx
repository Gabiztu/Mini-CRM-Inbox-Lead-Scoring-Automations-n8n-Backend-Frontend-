"use client"

import * as React from 'react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function ExportCsvButton() {
  const [loading, setLoading] = useState(false)

  async function handleExport() {
    setLoading(true)
    const endpoints = [
      'http://localhost:4000/api/export/n8n',
      'http://localhost:4000/api/export',
    ]
    for (const url of endpoints) {
      try {
        const res = await fetch(url, { method: 'GET' })
        if (!res.ok) continue
        const blob = await res.blob()
        const a = document.createElement('a')
        const href = URL.createObjectURL(blob)
        a.href = href
        a.download = 'leads-export.csv'
        document.body.appendChild(a)
        a.click()
        a.remove()
        URL.revokeObjectURL(href)
        break
      } catch (_) {
        // try next
      }
    }
    setLoading(false)
  }

  return (
    <Button onClick={handleExport} disabled={loading} variant="outline">
      {loading ? 'Exporting…' : 'Export CSV'}
    </Button>
  )
}
