import { useState } from 'react'
import { Clock, Plus, Bold, List, ListOrdered, Link2, Undo2, Indent, Outdent } from 'lucide-react'
import { PageBanner, Card, Button, FauxSelect, ImagePlaceholder } from '../components/ui'
import Flyout from '../components/Flyout'

const ENTRIES = [
  {
    title: 'Enrichment - Testing since TLS update',
    date: '13/01/2026',
    body: 'I learned about testing, it was a productive day where we all had a chance to be very involved with E2E process - overall I felt like everyone had equal opportunity to contribute.',
  },
  {
    title: 'Careers fair visit',
    date: '02/12/2025',
    body: 'Attended the regional careers fair and spoke to three employers about industry placements.',
  },
]

export default function Timeline() {
  const [addOpen, setAddOpen] = useState(false)
  return (
    <div className="space-y-6">
      <PageBanner icon={Clock} eyebrow="Timeline" title="My Timeline" />

      <div className="flex justify-center">
        <Button onClick={() => setAddOpen(true)}>
          <span className="flex items-center gap-2"><Plus size={16} /> Add Activity</span>
        </Button>
      </div>

      <div className="space-y-4">
        {ENTRIES.map((e) => (
          <Card key={e.title} className="flex gap-5">
            <div className="flex-1">
              <div className="flex justify-between gap-4">
                <h3 className="font-bold">{e.title}</h3>
                <p className="text-sm">{e.date}</p>
              </div>
              <p className="mt-2 text-sm text-gray-500">{e.body}</p>
            </div>
            <ImagePlaceholder className="hidden h-24 w-36 shrink-0 sm:block" />
          </Card>
        ))}
      </div>

      <Flyout open={addOpen} onClose={() => setAddOpen(false)} icon={Clock} title="Add a New Activity" wide>
        <div className="space-y-5">
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-600">Date of activity:</label>
            <input type="date" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          </div>
          <div className="flex flex-wrap items-end gap-4">
            {['Hours', 'Minutes'].map((u) => (
              <div key={u}>
                <label className="mb-1 block text-sm font-semibold text-gray-600">{u}:</label>
                <input type="number" min="0" defaultValue="0" className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm" />
              </div>
            ))}
            <p className="pb-2 text-sm text-gray-500">Duration: 0h 0m</p>
          </div>
          <div>
            <p className="mb-1 text-sm font-semibold text-gray-600">Did you find this activity useful?</p>
            <div className="flex gap-2">
              <Button small>Yes</Button>
              <Button small variant="secondary">No</Button>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-600">Activity type:</label>
            <FauxSelect className="w-full" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-600">Describe your activity:</label>
            <div className="rounded-lg border border-gray-300">
              <div className="flex items-center gap-3 border-b border-gray-200 px-3 py-2 text-gray-500">
                <span className="text-xs font-semibold">Format</span>
                <Bold size={15} /><List size={15} /><ListOrdered size={15} />
                <Outdent size={15} /><Indent size={15} /><Link2 size={15} /><Undo2 size={15} />
              </div>
              <textarea rows={6} className="w-full rounded-b-lg px-3 py-2 text-sm outline-none" />
            </div>
          </div>
          <Button>Save this activity</Button>
        </div>
      </Flyout>
    </div>
  )
}
