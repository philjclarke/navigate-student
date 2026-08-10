import { useState } from 'react'
import { Compass, X, ChevronRight, ChevronLeft } from 'lucide-react'
import { Button } from './ui'
import { allSubjects, titleCase } from '../data/heap'
import { seededInterests, suggestedLean } from '../data/student'

const STEP1 = [
  { label: 'I want to start earning as soon as I can', hint: 'Straight into work or an apprenticeship', score: 0 },
  { label: "I'd like to earn while I keep learning", hint: 'Higher or degree apprenticeships', score: 35 },
  { label: 'I want to study my subject in more depth', hint: 'University or college HE course', score: 90 },
  { label: "I honestly don't know yet", hint: "That's fine — that's what this is for", score: 50 },
]

const STEP3 = [
  { label: 'Not for me', score: 0 },
  { label: "I'd manage it", score: 35 },
  { label: "I'm happy in a classroom", score: 70 },
  { label: "It's where I do my best work", score: 100 },
]

export default function DirectionWizard({ open, onClose, onComplete }) {
  const [step, setStep] = useState(0)
  const [ambition, setAmbition] = useState(null)
  const [interests, setInterests] = useState(seededInterests)
  const [study, setStudy] = useState(null)
  const [search, setSearch] = useState('')

  if (!open) return null

  const lean = ambition !== null && study !== null
    ? Math.round(ambition * 0.5 + study * 0.3 + suggestedLean() * 0.2)
    : null

  const filtered = allSubjects.filter((s) =>
    s.Subject.toLowerCase().includes(search.toLowerCase()),
  )

  const toggle = (name) =>
    setInterests((cur) =>
      cur.includes(name) ? cur.filter((i) => i !== name) : [...cur, name],
    )

  const steps = [
    /* Step 0 — intro */
    <div key="intro" className="text-center">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-brand-600">
        <Compass size={30} />
      </span>
      <h2 className="mt-4 text-2xl font-light text-gray-700">Let's find your direction</h2>
      <p className="mx-auto mt-3 max-w-md text-sm text-gray-500">
        A few quick questions to set a starting point. Nothing is locked in — you can
        change direction at any time, and this just helps us show you the most relevant
        careers, courses and apprenticeships first.
      </p>
      <Button className="mt-6" onClick={() => setStep(1)}>Let's go</Button>
    </div>,

    /* Step 1 — ambition */
    <div key="ambition">
      <h2 className="text-xl font-light text-gray-700">Which of these sounds most like you right now?</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {STEP1.map((o) => (
          <button
            key={o.label}
            onClick={() => setAmbition(o.score)}
            className={`rounded-xl border-2 p-4 text-left transition-colors ${
              ambition === o.score ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-brand-300'
            }`}
          >
            <p className="font-bold text-gray-700">{o.label}</p>
            <p className="mt-1 text-sm text-gray-500">{o.hint}</p>
          </button>
        ))}
      </div>
    </div>,

    /* Step 2 — interests */
    <div key="interests">
      <h2 className="text-xl font-light text-gray-700">Which subjects interest you?</h2>
      <p className="mt-1 text-sm text-gray-500">
        We've pre-selected a few based on your activity — add or remove as many as you like.
      </p>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search subjects…"
        className="mt-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
      />
      <div className="mt-3 flex max-h-64 flex-wrap content-start gap-2 overflow-y-auto">
        {filtered.map((s) => (
          <button
            key={s.Subject}
            onClick={() => toggle(s.Subject)}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
              interests.includes(s.Subject)
                ? 'border-brand-500 bg-brand-500 text-white'
                : 'border-gray-300 text-gray-600 hover:border-brand-400'
            }`}
          >
            {titleCase(s.Subject)}
          </button>
        ))}
      </div>
    </div>,

    /* Step 3 — study appetite */
    <div key="study">
      <h2 className="text-xl font-light text-gray-700">How do you feel about a few more years of classroom study?</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {STEP3.map((o) => (
          <button
            key={o.label}
            onClick={() => setStudy(o.score)}
            className={`rounded-xl border-2 p-4 text-left font-bold text-gray-700 transition-colors ${
              study === o.score ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-brand-300'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>,

    /* Step 4 — result */
    <div key="result" className="text-center">
      <h2 className="text-2xl font-light text-gray-700">Here's your starting point</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
        Based on your answers and what we already know about you, we'll lean your
        suggestions{' '}
        <strong>
          {lean >= 65 ? 'towards university and college courses'
            : lean <= 35 ? 'towards careers and apprenticeships'
            : 'towards a balanced mix of both'}
        </strong>
        . You stay in control — slide the dial on your dashboard any time.
      </p>
      <div className="mx-auto mt-6 max-w-md">
        <div className="relative h-3 rounded-full bg-gradient-to-r from-brand-400 to-purple-400">
          <span
            className="absolute -top-1.5 h-6 w-6 -translate-x-1/2 rounded-full border-4 border-white bg-gray-700 shadow"
            style={{ left: `${lean}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-xs font-semibold text-gray-500">
          <span>Straight into work</span><span>University</span>
        </div>
      </div>
      <p className="mt-4 text-sm text-gray-500">{interests.length} subject interests selected</p>
      <Button className="mt-5" onClick={() => { onComplete({ lean, interests, baselined: true }); onClose() }}>
        Save my starting point
      </Button>
    </div>,
  ]

  const canNext = (step === 1 && ambition !== null) || step === 2 || (step === 3 && study !== null)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-y-auto rounded-2xl bg-white p-7 shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" aria-label="Close">
          <X size={20} />
        </button>
        {step > 0 && step < 4 && (
          <p className="mb-4 text-xs font-bold tracking-wide text-brand-600 uppercase">Step {step} of 3</p>
        )}
        {steps[step]}
        {step > 0 && step < 4 && (
          <div className="mt-6 flex justify-between">
            <Button variant="secondary" onClick={() => setStep(step - 1)}>
              <span className="flex items-center gap-1"><ChevronLeft size={15} /> Back</span>
            </Button>
            <Button onClick={() => setStep(step + 1)} disabled={!canNext} className={!canNext ? 'opacity-40' : ''}>
              <span className="flex items-center gap-1">Next <ChevronRight size={15} /></span>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
