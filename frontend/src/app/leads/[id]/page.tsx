import Link from 'next/link'
import { LeadDetailClient } from '@/components/LeadDetailClient'

export default function LeadDetailPage({ params }: { params: { id: string } }) {
  const id = params.id
  return (
    <div className="mx-auto w-full max-w-6xl space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Lead Details</h1>
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          ← Back to Dashboard
        </Link>
      </div>
      <LeadDetailClient id={id} />
    </div>
  )
}
