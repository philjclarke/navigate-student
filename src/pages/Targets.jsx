import { Target, CalendarDays, Clock } from 'lucide-react'
import { PageBanner, Button } from '../components/ui'

function TargetCard({ title, date, type, hours }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl bg-white shadow-sm">
      <div className="flex-1 space-y-1.5 p-4 text-sm">
        <p className="font-bold">{title}</p>
        <p className="flex items-center gap-1.5"><CalendarDays size={14} className="text-brand-500" /><strong>Completion Date:</strong> {date}</p>
        {type && <p className="flex items-center gap-1.5"><Target size={14} className="text-brand-500" /><strong>Target Type:</strong> {type}</p>}
        <p className="flex items-center gap-1.5"><Clock size={14} className="text-brand-500" /><strong>Hours to date:</strong> {hours}</p>
      </div>
      <button className="bg-brand-500 py-2.5 text-sm font-bold text-white hover:bg-brand-600">View Target</button>
    </div>
  )
}

const OVERDUE = [
  { title: 'Test Link', date: '14/06/2022', type: 'Early Years Placement', hours: '18h 23m' },
  { title: 'First target!', date: '07/02/2023', type: 'Careers & Progression', hours: '19h 8m' },
  { title: 'This is a new target', date: '05/05/2023', type: 'My Future', hours: '16h 23m' },
  { title: 'A new target', date: '05/05/2023', type: 'My Future', hours: '18h 23m' },
  { title: 'sdfgsg', date: '18/10/2023', type: 'T-Level Employability', hours: '5h 1m' },
  { title: 'Test Target', date: '26/04/2024', type: 'Enrichment', hours: '0h 0m' },
  { title: 'test add target', date: '15/05/2024', type: 'Careers & Progression', hours: '0h 0m' },
  { title: 'Test Target', date: '17/05/2024', type: 'Academic', hours: '2h 0m' },
]

const SUBMITTED = [
  { title: 'A new target', date: '30/09/2020', type: 'Personal', hours: '6h 0m' },
]

const COMPLETED = [
  { title: 'Target for Go Live', date: '22/10/2025' },
  { title: 'new target speed test', date: '06/05/2025' },
]

export default function Targets() {
  return (
    <div className="space-y-6">
      <PageBanner icon={Target} eyebrow="Targets" title="My Targets" action={<Button>Add a Target</Button>} />

      <section className="rounded-2xl bg-brand-100 p-5">
        <h2 className="mb-4 font-bold text-gray-700">Overdue Targets</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {OVERDUE.map((t, i) => <TargetCard key={i} {...t} />)}
        </div>
      </section>

      <section className="rounded-2xl bg-brand-100 p-5">
        <h2 className="mb-4 font-bold text-gray-700">Targets Submitted for Review</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {SUBMITTED.map((t, i) => <TargetCard key={i} {...t} />)}
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-xl font-light text-gray-600">Completed Targets</h2>
        <div className="text-sm">
          {COMPLETED.map((t) => (
            <div key={t.title} className="grid grid-cols-[1fr_auto] items-center gap-4 border-t border-dashed border-gray-300 py-3 sm:grid-cols-[220px_200px_1fr_auto]">
              <p className="font-bold">{t.title}</p>
              <p>Completed {t.date}</p>
              <p className="hidden sm:block">Target set by Jason Gould</p>
              <p className="font-bold">View Target</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
