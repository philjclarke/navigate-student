import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { MapPin, Bookmark, SlidersHorizontal, Search, X } from 'lucide-react'
import { Header, Card, Pill, Button, Toast } from '../components/kit'
import { load, save, toPrefs } from '../profile'
import { findCourses, courseKey } from '../../data/universities'
import { titleCase } from '../../data/heap'

const WHERE = [['home', 'Close'], ['nearby', 'Nearby'], ['anywhere', 'Anywhere']]

export default function Explore() {
  const [p, setP] = useState(load)
  const [q, setQ] = useState('')
  const [filters, setFilters] = useState(false)
  const [limit, setLimit] = useState(12)
  const [toast, setToast] = useState(null)
  const say = (m) => { setToast(m); setTimeout(() => setToast(null), 2000) }

  const [params, setParams] = useSearchParams()
  const subject = params.get('subject')

  /* A related subject arrives from a course page. We swap the subject but keep
     the rest of their preferences, so it is exploration, not a reset. */
  const prefs = useMemo(() => {
    const base = toPrefs(p)
    return subject ? { ...base, subjects: [subject] } : base
  }, [p, subject])
  const all = useMemo(() => findCourses(prefs), [prefs])
  const results = useMemo(() => {
    const s = q.toLowerCase()
    return s ? all.filter((c) => `${c.CourseName} ${c.University}`.toLowerCase().includes(s)) : all
  }, [all, q])

  const setWhere = (v) => {
    const n = { ...p, answers: { ...p.answers, distance: v } }
    setP(n); save(n)
  }
  const toggle = (k) => {
    const n = { ...p, shortlist: p.shortlist.includes(k) ? p.shortlist.filter((x) => x !== k) : [...p.shortlist, k] }
    setP(n); save(n); say(p.shortlist.includes(k) ? 'Removed' : 'Saved')
  }

  return (
    <div>
      <Toast msg={toast} />
      <Header eyebrow="Explore" title="Find a course" />

      <div className="sticky top-0 z-30 border-b border-slate-100 bg-white/95 px-5 pb-3 backdrop-blur">
        <div className="flex items-center gap-2 rounded-2xl bg-slate-100 px-4">
          <Search size={17} className="shrink-0 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Course or university"
            className="min-h-[48px] w-full bg-transparent text-[15px] outline-none"
          />
          {q && <button onClick={() => setQ('')} className="p-1 text-slate-400"><X size={16} /></button>}
        </div>
        <div className="mt-2.5 flex items-center gap-2">
          <button
            onClick={() => setFilters(!filters)}
            className="flex min-h-[36px] items-center gap-1.5 rounded-full bg-slate-900 px-3.5 text-[13px] font-bold text-white"
          >
            <SlidersHorizontal size={14} /> Filters
          </button>
          <p className="text-[13px] text-slate-500">{results.length} courses</p>
        </div>
        {filters && (
          <div className="mt-3 rounded-2xl bg-slate-50 p-3.5">
            <p className="mb-2 text-[11px] font-bold tracking-wide text-slate-400 uppercase">How far from college</p>
            <div className="flex gap-2">
              {WHERE.map(([v, label]) => (
                <button
                  key={v}
                  onClick={() => setWhere(v)}
                  className={`min-h-[40px] flex-1 rounded-xl text-[13px] font-bold ${
                    prefs.where === v ? 'bg-violet-600 text-white' : 'bg-white text-slate-600'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {prefs.subjects.length > 0 && (
              <>
                <p className="mt-3 mb-2 text-[11px] font-bold tracking-wide text-slate-400 uppercase">Subjects</p>
                <div className="flex flex-wrap gap-1.5">
                  {prefs.subjects.map((s) => <Pill key={s} tone="violet">{titleCase(s)}</Pill>)}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {subject && (
        <div className="mx-5 mt-4 flex items-center gap-3 rounded-2xl bg-violet-50 p-3.5">
          <p className="flex-1 text-[13px] leading-snug text-violet-900">
            Showing <span className="font-bold">{titleCase(subject)}</span>, a subject related to yours.
            Your other preferences still apply.
          </p>
          <button
            onClick={() => setParams({})}
            className="min-h-[40px] shrink-0 rounded-full bg-white px-3.5 text-[13px] font-bold text-violet-700"
          >
            Clear
          </button>
        </div>
      )}

      <div className="space-y-3 px-5 pt-4">
        {results.slice(0, limit).map((c) => {
          const k = courseKey(c)
          const on = p.shortlist.includes(k)
          return (
            <Card key={k} className="!p-4">
              <Link to={`/next/course/${encodeURIComponent(k)}`} className="block">
                <p className="text-[12px] font-bold text-violet-700">{c.University}</p>
                <p className="mt-0.5 text-[17px] leading-snug font-bold text-slate-900">{c.CourseName}</p>
                <p className="mt-1 text-[13px] text-slate-500">{c.Qualification} · {c.LengthOfFullTimeCourse}</p>
              </Link>
              <p className="mt-1.5 flex items-center gap-1 text-[13px] text-slate-500">
                <MapPin size={12} /> {c.inst?.location?.city || 'UK'}
                {c.miles != null && ` · ${c.miles} mi`}{c.inst?.travel && ` · ${c.inst.travel}`}
              </p>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                <Pill>{c.GradesOffer?.replace(/\.$/, '') || c.PointsOfferBand}</Pill>
                {c.reach === 'reach' && <Pill tone="violet">Within reach</Pill>}
                {c.reach === 'safe' && <Pill tone="green">Comfortable</Pill>}
                {c.reach === 'stretch' && <Pill tone="amber">A stretch</Pill>}
              </div>
              <button
                onClick={() => toggle(k)}
                className={`mt-3.5 flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-2xl text-[14px] font-bold ${
                  on ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                <Bookmark size={15} fill={on ? 'currentColor' : 'none'} /> {on ? 'Saved' : 'Save'}
              </button>
            </Card>
          )
        })}
        {results.length === 0 && (
          <Card className="text-center">
            <p className="text-[15px] text-slate-600">Nothing matches that yet.</p>
            <p className="mt-1 text-[13px] text-slate-500">Try widening how far you would go, or add another subject.</p>
          </Card>
        )}
        {results.length > limit && (
          <Button variant="quiet" onClick={() => setLimit(limit + 12)}>Show more</Button>
        )}
      </div>
    </div>
  )
}
