import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GraduationCap, School, Search, Sparkles, X, Plus, ArrowRight } from 'lucide-react'
import { Card, Button, ImagePlaceholder } from '../components/ui'
import { ShortlistLink, FeeCapNote } from '../components/UniBits'
import { allSubjects, titleCase } from '../data/heap'
import {
  loadPrefs, savePrefs, findCourses, gradesToPoints, KNOWN, COLLEGE, loadShortlist,
} from '../data/universities'

const WHERE = [
  { v: 'home', label: 'Close to college', hint: 'Within about 20 miles — you could live at home' },
  { v: 'nearby', label: 'Nearby', hint: 'Up to a couple of hours away' },
  { v: 'anywhere', label: 'Anywhere in the UK', hint: 'Distance is no object' },
]
const COST = [
  { v: 'low', label: 'Keep it as low as I can' },
  { v: 'balance', label: 'A factor, not the deciding one' },
  { v: 'not-deciding', label: 'Not what I\'ll decide on' },
]
const SHAPE = [
  { v: 'three', label: 'Three years, done' },
  { v: 'placement', label: 'Include a placement year' },
  { v: 'any', label: 'Not fussed yet' },
]

function Options({ items, value, onChange, cols = 3 }) {
  return (
    <div className={`grid gap-2 sm:grid-cols-${cols}`}>
      {items.map((o) => (
        <button
          key={o.v}
          onClick={() => onChange(o.v)}
          className={`rounded-xl border-2 px-3 py-2.5 text-left transition-colors ${
            value === o.v ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
          }`}
        >
          <p className="text-sm font-bold text-gray-700">{o.label}</p>
          {o.hint && <p className="text-xs text-gray-500">{o.hint}</p>}
        </button>
      ))}
    </div>
  )
}

function Q({ n, title, children }) {
  return (
    <div>
      <p className="mb-2 text-sm font-bold text-gray-700">
        <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-[11px] text-white">{n}</span>
        {title}
      </p>
      {children}
    </div>
  )
}

export default function Universities() {
  const navigate = useNavigate()
  const [prefs, setPrefs] = useState(loadPrefs)
  const [subjectQuery, setSubjectQuery] = useState('')
  const [search, setSearch] = useState('')
  const shortlist = loadShortlist()

  const set = (patch) => {
    const next = { ...prefs, ...patch }
    setPrefs(next)
    savePrefs(next)
  }

  const matches = useMemo(() => findCourses(prefs), [prefs])
  const points = gradesToPoints(prefs.grades)
  const institutions = new Set(matches.map((m) => m.University)).size

  const subjectHits = subjectQuery.length > 1
    ? allSubjects.filter((s) => s.Subject.toLowerCase().includes(subjectQuery.toLowerCase()) && !prefs.subjects.includes(s.Subject)).slice(0, 6)
    : []

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-purple-50 p-7">
        <div className="grid items-center gap-6 lg:grid-cols-[3fr_2fr]">
          <div>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <p className="flex items-center gap-1.5 text-sm font-bold text-purple-700">
                <GraduationCap size={16} /> Universities
              </p>
              <ShortlistLink count={shortlist.length} />
            </div>
            <h1 className="mt-2 text-3xl font-light text-gray-600 md:text-4xl">
              Find a university that fits how you want to live
            </h1>
            <p className="mt-3 max-w-xl text-sm text-gray-600">
              Most course finders start with the subject. We'll start with you — where you'd
              rather be, what you can afford, how long you want to study — and then find the
              courses that fit. Real courses, real entry requirements, from every UK university.
            </p>
            <form
              onSubmit={(e) => { e.preventDefault(); navigate(`/universities/matches?q=${encodeURIComponent(search)}`) }}
              className="mt-4 flex max-w-md gap-2"
            >
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Already know? Search a course or university…"
                className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-purple-500"
              />
              <Button variant="secondary"><Search size={15} /></Button>
            </form>
          </div>
          <ImagePlaceholder className="hidden h-56 lg:block" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <Card className="space-y-6">
          <div>
            <h2 className="text-xl font-light text-gray-600">Your investigation</h2>
            <p className="text-sm text-gray-500">Five quick questions. Change your mind any time — the matches update as you go.</p>
          </div>

          <Q n={1} title="Where do you want to be?">
            <Options items={WHERE} value={prefs.where} onChange={(v) => set({ where: v })} />
            <p className="mt-1.5 flex items-center gap-1 text-xs text-gray-400">
              <School size={12} /> Measured from {COLLEGE.label} — the closest thing we have to home
            </p>
          </Q>

          <Q n={2} title="How much does cost matter?">
            <Options items={COST} value={prefs.cost} onChange={(v) => set({ cost: v })} />
            <FeeCapNote className="mt-2" />
            <p className="mt-1 text-xs text-gray-400">
              Because the cap is the same everywhere, cost really comes down to living costs and whether you stay at home. We'll use your answer once we can compare those.
            </p>
          </Q>

          <Q n={3} title="What shape of course?">
            <Options items={SHAPE} value={prefs.shape} onChange={(v) => set({ shape: v })} />
          </Q>

          <Q n={4} title="Your predicted grades (optional)">
            <div className="flex flex-wrap items-center gap-3">
              <input
                value={prefs.grades}
                onChange={(e) => set({ grades: e.target.value })}
                placeholder="e.g. BBC or A*AB"
                className="w-40 rounded-lg border border-gray-300 px-3 py-2 text-sm uppercase outline-none focus:border-purple-500"
              />
              {points ? (
                <span className="text-sm text-gray-600">= <strong>{points} UCAS points</strong> — we'll tell you which offers are within reach</span>
              ) : (
                <span className="text-xs text-gray-400">Leave blank and we'll just show the offers</span>
              )}
            </div>
          </Q>

          <Q n={5} title="Subjects you're interested in">
            <div className="flex flex-wrap gap-2">
              {prefs.subjects.map((s) => (
                <span key={s} className="flex items-center gap-1.5 rounded-full bg-purple-500 px-3 py-1.5 text-xs font-bold text-white">
                  {titleCase(s)}
                  <button onClick={() => set({ subjects: prefs.subjects.filter((x) => x !== s) })} aria-label={`Remove ${s}`}>
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div className="relative mt-2 max-w-sm">
              <input
                value={subjectQuery}
                onChange={(e) => setSubjectQuery(e.target.value)}
                placeholder="Add a subject…"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-purple-500"
              />
              {subjectHits.length > 0 && (
                <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
                  {subjectHits.map((s) => (
                    <button
                      key={s.Subject}
                      onClick={() => { set({ subjects: [...prefs.subjects, s.Subject] }); setSubjectQuery('') }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-purple-50"
                    >
                      <Plus size={13} className="text-purple-500" /> {titleCase(s.Subject)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Q>
        </Card>

        <aside className="space-y-4">
          <Card className="border-2 border-purple-300">
            <p className="text-xs font-bold tracking-wide text-gray-500 uppercase">Right now</p>
            <p className="mt-1 text-3xl font-light text-gray-700">{matches.length} <span className="text-lg text-gray-400">courses</span></p>
            <p className="text-sm text-gray-500">at {institutions} universities and colleges match your answers</p>
            <Link to="/universities/matches" className="mt-4 block">
              <Button className="w-full !bg-purple-600 hover:!bg-purple-700">
                <span className="flex items-center justify-center gap-2">See my matches <ArrowRight size={15} /></span>
              </Button>
            </Link>
          </Card>

          <Card>
            <p className="flex items-center gap-1.5 text-sm font-bold text-gray-700">
              <Sparkles size={14} className="text-purple-500" /> What we already know
            </p>
            <p className="mt-1 text-xs text-gray-500">From your placements, assessments and profile. We've used it to start you off — change anything.</p>
            <ul className="mt-3 space-y-3">
              {KNOWN.map((k) => (
                <li key={k.label} className="border-l-2 border-purple-200 pl-3">
                  <p className="text-xs font-semibold text-gray-700">{k.label}</p>
                  <p className="text-xs text-gray-500">→ {k.implies}</p>
                </li>
              ))}
            </ul>
          </Card>
        </aside>
      </div>
    </div>
  )
}
