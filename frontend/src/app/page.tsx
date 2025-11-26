import { LeadTable } from '@/components/LeadTable'
import { ExportCsvButton } from '@/components/ExportCsvButton'

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-zinc-900">Leads</h1>
          <ExportCsvButton />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-6">
        <LeadTable />
      </main>
    </div>
  )
}
