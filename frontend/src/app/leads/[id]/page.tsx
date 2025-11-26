import Link from 'next/link'
import { fetchLeadDetails, fetchMessages } from '@/lib/api'
import { LeadInfoCard } from '@/components/LeadInfoCard'
import { MessageTimeline } from '@/components/MessageTimeline'
import { Separator } from '@/components/ui/separator'

export default async function LeadDetailPage({ params }: { params: { id: string } }) {
  const id = params.id
  let lead: Awaited<ReturnType<typeof fetchLeadDetails>> | null = null
  let messages: Awaited<ReturnType<typeof fetchMessages>> = []

  try {
    ;[lead, messages] = await Promise.all([fetchLeadDetails(id), fetchMessages(id)])
  } catch (e) {
    lead = null
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Lead Details</h1>
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          ← Back to Dashboard
        </Link>
      </div>

      {!lead ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-6 text-center text-sm text-zinc-600">
          Lead Not Found
        </div>
      ) : (
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
      )}
    </div>
  )
}
