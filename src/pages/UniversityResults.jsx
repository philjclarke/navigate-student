import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { GraduationCap, ChevronLeft, SlidersHorizontal, Sparkles, X } from 'lucide-react'
import { Card, Button } from '../components/ui'
import { ReachPill, OfferPill, Place, CourseActions, useToast, ShortlistLink } from '../components/UniBits'
import { titleCase } from '../data/heap'
import {
  loadPrefs, savePrefs, findCourses, gradesToPoints,
  loadShortlist, saveShortlist, loadPlan, savePlan, loadApplications, saveApplications,
} from '../data/universities'

const WHERE = [['home', 'Stay at home'], ['nearby', 'Nearby'], ['anywhere', 'Anywhere']]
const SETTING = [['any', 'Any'], ['city', 'City'], ['campus', 'Campus'], ['town', 'Town'], ['coastal', 'Coast']]
const SHAPE = [['any', 'Any'], ['three', '3 years'], ['placement', 'Placement year']]

function Seg({ items, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-1">
      {items.map(([v, label]) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={`rounded-md px-2.5 py-1 text-xs font-bold ${
            value === v ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-purple-100'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

export default function UniversityResults() {
  const [params] = useSearchParams()
  const q = (params.get('q') || '').toLowerCase()
  const [prefs, setPrefs] = useState(loadPrefs)
  const [shortlist, setShortlist] = useState(loadShortlist)
  const [applications, setApplications] = useState(loadApplications)
  const [limit, setLimit] = useState(24)
  const [toast, show] = useToast()

  const set = (patch) => { const n = { ...prefs, ...patch }; setPrefs(n); savePrefs(n) }
  const points = gradesToPoints(prefs.grades)

  const results = useMemo(() => {
    const all = findCourses(q ? { ...prefs, where: 'anywhere' } : prefs)
    return q
      ? all.filter((c) => `${c.CourseName} ${c.University}`.toLowerCase().includes(q))
      : all
  }, [prefs, q])

  const toggleSave = (c) => {
    const next = shortlist.includes(c.key) ? shortlist.filter((k) => k !== c.key) : [...shortlist, c.key]
    setShortlist(next); saveShortlist(next)
    show(shortlist.includes(c.key) ? 'Removed from your shortlist' : 'Added to your shortlist')
  }
  const plan = (c) => {
    const p = loadPlan()
    savePlan([...p, { title: `Look into ${c.CourseName} at ${c.University}`, date: new Date().toISOString(), key: c.key }])
    show('Added to your timeline as an activity')
  }
  const apply = (c) => {
    const next = [...applications, { key: c.key, course: c.CourseName, university: c.University, at: new Date().toISOString() }]
    setApplications(next); saveApplications(next)
    show('Application recorded — Navigate will pass this on')
  }

  return (
    <div className="space-y-5">
      {toast}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="flex items-center gap-1.5 text-sm font-bold text-purple-700">
            <GraduationCap size={16} /> Universities
          </p>
          <h1 className="text-2xl font-light text-gray-600 md:text-3xl">
            {q ? <>Results for “{params.get('q')}”</> : 'Your matches'}
            <span className="ml-3 text-base text-gray-400">{results.length} courses</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <ShortlistLink count={shortlist.length} />
          <Link to="/universities">
            <Button variant="secondary"><span className="flex items-center gap-1"><ChevronLeft size={15} /> Change my answers</span></Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[250px_1fr]">
        {/* Filters mirror the investigation so the student can keep adjusting */}
        <aside className="space-y-4 self-start rounded-2xl bg-white p-4 shadow-sm">
          <p className="flex items-center gap-1.5 text-sm font-bold text-gray-700"><SlidersHorizontal size={14} /> Refine</p>
          <div>
            <p className="mb-1 text-[11px] font-bold tracking-wide text-gray-400 uppercase">Where</p>
            <Seg items={WHERE} value={prefs.where} onChange={(v) => set({ where: v })} />
          </div>
          <div>
            <p className="mb-1 text-[11px] font-bold tracking-wide text-gray-400 uppercase">Setting</p>
            <Seg items={SETTING} value={prefs.setting} onChange={(v) => set({ setting: v })} />
          </div>
          <div>
            <p className="mb-1 text-[11px] font-bold tracking-wide text-gray-400 uppercase">Course shape</p>
            <Seg items={SHAPE} value={prefs.shape} onChange={(v) => set({ shape: v })} />
          </div>
          <div>
            <p className="mb-1 text-[11px] font-bold tracking-wide text-gray-400 uppercase">Predicted grades</p>
            <input
              value={prefs.grades}
              onChange={(e) => set({ grades: e.target.value })}
              placeholder="e.g. BBC"
              className="w-full rounded-lg border border-gray-300 px-2.5 py-1.5 text-sm uppercase outline-none focus:border-purple-500"
            />
            {points && <p className="mt-1 text-xs text-gray-500">{points} points — offers tagged against this</p>}
          </div>
          <div>
            <p className="mb-1 text-[11px] font-bold tracking-wide text-gray-400 uppercase">Subjects</p>
            <div className="flex flex-wrap gap-1">
              {prefs.subjects.map((s) => (
                <span key={s} className="flex items-center gap-1 rounded-full bg-purple-100 px-2 py-0.5 text-[11px] font-bold text-purple-700">
                  {titleCase(s)}
                  <button onClick={() => set({ subjects: prefs.subjects.filter((x) => x !== s) })}><X size={10} /></button>
                </span>
              ))}
            </div>
            <Link to="/universities" className="mt-1 block text-xs font-semibold text-purple-600">Add subjects →</Link>
          </div>
        </aside>

        <div className="space-y-3">
          {results.length === 0 && (
            <Card className="text-center text-sm text-gray-500">
              Nothing matches yet. Try widening “where”, or add another subject.
            </Card>
          )}
          {results.slice(0, limit).map((c) => (
            <Card key={c.key} className="space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <Link to={`/universities/institution/${encodeURIComponent(c.University)}`} className="text-xs font-bold text-purple-700 hover:underline">
                    {c.University}
                  </Link>
                  <h3 className="text-lg leading-snug font-bold text-gray-700">
                    {c.CourseName}
                    <span className="ml-2 text-sm font-normal text-gray-400">{c.Qualification} · {c.LengthOfFullTimeCourse}</span>
                  </h3>
                  <div className="mt-1"><Place inst={c.inst} /></div>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <OfferPill course={c} />
                  <ReachPill reach={c.reach} />
                </div>
              </div>

              <ul className="flex flex-wrap gap-x-4 gap-y-1">
                {c.reasons.map((r) => (
                  <li key={r} className="flex items-center gap-1 text-xs text-gray-500">
                    <Sparkles size={11} className="text-purple-400" /> {r}
                  </li>
                ))}
                {c.inst?.Fees && !c.reasons.some((r) => r.startsWith('Lower fees')) && (
                  <li className="text-xs text-gray-400">Fees: {c.inst.Fees.slice(0, 60)}</li>
                )}
              </ul>

              <CourseActions
                course={c}
                saved={shortlist.includes(c.key)}
                applied={applications.some((a) => a.key === c.key)}
                onSave={() => toggleSave(c)}
                onPlan={() => plan(c)}
                onApply={() => apply(c)}
              />
            </Card>
          ))}
          {results.length > limit && (
            <div className="text-center">
              <Button variant="secondary" onClick={() => setLimit(limit + 24)}>Show more</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
