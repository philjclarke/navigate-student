import { Building2, SquarePen, Check, Info, CheckCircle2 } from 'lucide-react'
import { PageBanner } from '../components/ui'

function TaskRow({ label, action, done = false }) {
  return (
    <div className="flex items-center justify-between gap-3 bg-brand-500 px-3 py-2 text-white">
      <span className="flex items-center gap-2.5 text-sm">
        {done ? <Check size={15} /> : <SquarePen size={15} />} {label}
      </span>
      <button
        className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-bold ${
          done ? 'border border-white text-white' : 'bg-white text-gray-700'
        }`}
      >
        {action} ›
      </button>
    </div>
  )
}

function PlacementCard({ name, status, tasks, pending = false, submit = false }) {
  return (
    <div className="flex flex-col rounded-2xl bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-xl font-light text-gray-700">{name}</h3>
        <span className="flex items-center gap-1.5 text-sm font-semibold">
          <Info size={15} /> {status}
        </span>
      </div>
      <div className="space-y-1.5">
        {tasks.map((t) => <TaskRow key={t.label} {...t} />)}
      </div>
      {pending && (
        <p className="mt-4 text-sm text-gray-500">
          Your placement has been added and is waiting for the Placement Co-ordinator to approve.
        </p>
      )}
      {submit && (
        <button className="mx-auto mt-5 flex items-center gap-2 rounded-lg bg-navy-800 px-4 py-2 text-sm font-bold text-white hover:bg-navy-900">
          <CheckCircle2 size={16} /> Submit Placement as complete
        </button>
      )}
    </div>
  )
}

const FULL_TASKS = (checklistDone) => [
  { label: 'Placement details', action: 'Edit' },
  checklistDone
    ? { label: 'Pre Placement Checklist', action: 'View', done: true }
    : { label: 'Pre Placement Checklist', action: 'Complete' },
  { label: 'Confirm attendance and complete Journal', action: 'Add / Edit' },
  { label: 'Your Feedback', action: 'Complete' },
]

const PENDING = ['The Education Company', 'New Employer 101', 'Hengist Field', 'EdCo', 'EdCo', 'Loop Design', 'Hengist Field']

export default function Placements() {
  return (
    <div className="space-y-6">
      <PageBanner icon={Building2} eyebrow="Placements" title="My Placements" />

      <section className="rounded-2xl bg-brand-100 p-5">
        <h2 className="mb-4 font-bold text-gray-700">In Progress</h2>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <PlacementCard name="Employer Import Test" status="Active" tasks={FULL_TASKS(false)} submit />
          <PlacementCard name="Hengist Field" status="Active" tasks={FULL_TASKS(true)} submit />
        </div>
      </section>

      <section className="rounded-2xl bg-brand-100 p-5">
        <h2 className="mb-4 font-bold text-gray-700">Pending</h2>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {PENDING.map((name, i) => (
            <PlacementCard
              key={`${name}-${i}`}
              name={name}
              status="Pending"
              tasks={[{ label: 'Placement details', action: 'View', done: true }]}
              pending
            />
          ))}
        </div>
      </section>
    </div>
  )
}
