import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, Info, Search, X, Sparkles } from 'lucide-react'
import { Button, Bar, Pill } from '../components/kit'
import { load, save, CORE, isAnswered, toPrefs } from '../profile'
import { findCourses, gradesToPoints } from '../../data/universities'
import { allSubjects, titleCase } from '../../data/heap'

/* Onboarding is a conversation, not a form. One question a screen, each one
   preceded by the thing you need to know in order to answer it honestly.
   Skippable throughout: nothing here is a gate. */
const POPULAR = [
  'PSYCHOLOGY', 'BUSINESS and MANAGEMENT COURSES', 'COMPUTER SCIENCE AND INFORMATION TECHNOLOGY',
  'NURSING and MIDWIFERY', 'LAW', 'SPORTS SCIENCES/STUDIES', 'Criminology', 'MEDIA STUDIES',
  'ENGINEERING (MECHANICAL)', 'ART and DESIGN (GENERAL)',
]

export default function Start() {
  const nav = useNavigate()
  const [p, setP] = useState(load)
  const [i, setI] = useState(0)
  const [q, setQ] = useState('')

  const step = CORE[i]
  const last = i === CORE.length - 1
  const answered = isAnswered(p, step.id)

  const set = (val) => {
    const next = { ...p, answers: { ...p.answers, [step.id]: val }, startedAt: p.startedAt || Date.now() }
    setP(next); save(next)
  }
  const advance = () => (last ? nav('/next') : setI(i + 1))

  const matches = useMemo(() => findCourses(toPrefs(p)).length, [p])
  const picked = p.answers.subjects || []
  const hits = q.length > 1
    ? allSubjects.filter((s) => s.Subject.toLowerCase().includes(q.toLowerCase()) && !picked.includes(s.Subject)).slice(0, 8)
    : []

  return (
    <div className="flex min-h-full flex-col">
      <div className="px-5 pt-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => (i === 0 ? nav('/next') : setI(i - 1))}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600"
            aria-label="Back"
          >
            <ArrowLeft size={18} />
          </button>
          <Bar pct={((i + (answered ? 1 : 0)) / CORE.length) * 100} />
          <button onClick={() => nav('/next')} className="text-xs font-bold text-slate-400">Skip</button>
        </div>
      </div>

      <div className="flex-1 px-5 pt-8">
        <p className="text-xs font-bold tracking-wide text-violet-600 uppercase">{step.eyebrow}</p>

        {step.teach && (
          <div className="mt-3 flex gap-2.5 rounded-2xl bg-violet-50 p-4">
            <Info size={17} className="mt-0.5 shrink-0 text-violet-600" />
            <p className="text-[14px] leading-snug text-violet-900">{step.teach}</p>
          </div>
        )}

        <h1 className="mt-5 text-[26px] leading-tight font-bold tracking-tight text-slate-900">{step.question}</h1>
        {step.help && <p className="mt-1.5 text-[14px] text-slate-500">{step.help}</p>}

        {step.kind === 'choice' && (
          <div className="mt-5 space-y-2.5">
            {step.options.map((o) => {
              const on = p.answers[step.id] === o.v
              return (
                <button
                  key={o.v}
                  onClick={() => set(o.v)}
                  className={`flex w-full items-start gap-3 rounded-2xl border-2 p-4 text-left transition-colors ${
                    on ? 'border-violet-500 bg-violet-50' : 'border-slate-200 active:bg-slate-50'
                  }`}
                >
                  <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${on ? 'border-violet-600 bg-violet-600' : 'border-slate-300'}`}>
                    {on && <Check size={12} className="text-white" strokeWidth={3} />}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[15px] font-bold text-slate-900">{o.label}</span>
                    {o.hint && <span className="mt-0.5 block text-[13px] leading-snug text-slate-500">{o.hint}</span>}
                  </span>
                </button>
              )
            })}
          </div>
        )}

        {step.kind === 'subjects' && (
          <div className="mt-5">
            {picked.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {picked.map((s) => (
                  <button
                    key={s}
                    onClick={() => set(picked.filter((x) => x !== s))}
                    className="flex items-center gap-1.5 rounded-full bg-violet-600 py-2 pr-2.5 pl-3.5 text-[13px] font-bold text-white"
                  >
                    {titleCase(s)} <X size={13} />
                  </button>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2 rounded-2xl border-2 border-slate-200 px-4 focus-within:border-violet-400">
              <Search size={17} className="shrink-0 text-slate-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search subjects"
                className="min-h-[48px] w-full bg-transparent text-[15px] outline-none"
              />
            </div>
            {q.length < 2 && (
              <div className="mt-4">
                <p className="text-xs font-bold tracking-wide text-slate-400 uppercase">Commonly picked</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {POPULAR.filter((s) => !picked.includes(s)).map((s) => (
                    <button
                      key={s}
                      onClick={() => set([...picked, s])}
                      className="min-h-[40px] rounded-full border-2 border-slate-200 px-3.5 text-[13px] font-semibold text-slate-600 active:bg-slate-100"
                    >
                      {titleCase(s)}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-2 space-y-1">
              {hits.map((s) => (
                <button
                  key={s.Subject}
                  onClick={() => { set([...picked, s.Subject]); setQ('') }}
                  className="flex min-h-[48px] w-full items-center rounded-xl px-3 text-left text-[15px] text-slate-700 active:bg-slate-100"
                >
                  {titleCase(s.Subject)}
                </button>
              ))}
              {q.length > 1 && hits.length === 0 && (
                <p className="px-3 py-3 text-[14px] text-slate-500">Nothing matches that. Try a broader word.</p>
              )}
            </div>
          </div>
        )}

        {step.kind === 'grades' && (
          <div className="mt-5">
            <input
              value={p.answers.grades || ''}
              onChange={(e) => set(e.target.value.toUpperCase())}
              placeholder="e.g. BBC"
              className="min-h-[56px] w-full rounded-2xl border-2 border-slate-200 px-4 text-[20px] font-bold tracking-wide uppercase outline-none focus:border-violet-400"
            />
            {gradesToPoints(p.answers.grades) ? (
              <p className="mt-2.5 text-[14px] text-slate-600">
                That is <strong>{gradesToPoints(p.answers.grades)} UCAS points</strong>. We'll tag offers as within reach or a stretch, and show you both.
              </p>
            ) : (
              <p className="mt-2.5 text-[14px] text-slate-500">Leave it blank if you'd rather not say. You can add it later.</p>
            )}
          </div>
        )}

        {answered && (
          <div className="mt-5 flex items-center gap-2 rounded-2xl bg-emerald-50 p-3.5">
            <Sparkles size={16} className="shrink-0 text-emerald-600" />
            <p className="text-[14px] text-emerald-900">
              <strong>{matches}</strong> courses fit you so far
            </p>
          </div>
        )}
      </div>

      <div className="sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent px-5 pt-6 pb-6">
        <Button onClick={advance} className={answered ? '' : 'opacity-40'}>
          {last ? 'See what fits me' : 'Next'} <ArrowRight size={17} />
        </Button>
        {!answered && (
          <button onClick={advance} className="mt-3 w-full text-center text-[13px] font-semibold text-slate-400">
            Skip this one
          </button>
        )}
      </div>
    </div>
  )
}
