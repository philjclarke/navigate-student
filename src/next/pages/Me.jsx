import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Circle, ChevronRight, RotateCcw } from 'lucide-react'
import { Header, Card, Pill, Button, Ring, Bar } from '../components/kit'
import { load, save, confidence, readiness, QUESTIONS, isAnswered, reset } from '../profile'
import { titleCase } from '../../data/heap'

export default function Me() {
  const nav = useNavigate()
  const [p, setP] = useState(load)
  const r = readiness(p)
  const conf = confidence(p)

  const tick = (id) => {
    const n = { ...p, done: { ...p.done, [id]: !p.done[id] } }
    setP(n); save(n)
  }

  const answerLabel = (q) => {
    const v = p.answers[q.id]
    if (!isAnswered(p, q.id)) return null
    if (q.kind === 'subjects') return v.map(titleCase).join(', ')
    if (q.kind === 'grades') return v
    return (q.options || []).find((o) => o.v === v)?.label || String(v)
  }

  return (
    <div>
      <Header eyebrow="Me" title="Where you are up to" />

      <div className="space-y-3 px-5">
        <Card className="!p-4">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <Ring done={r.done} total={r.total} size={64} />
              <span className="absolute inset-0 flex items-center justify-center text-[17px] font-bold text-slate-900">{r.done}</span>
            </div>
            <div>
              <p className="text-[15px] font-bold text-slate-900">University readiness</p>
              <p className="text-[13px] text-slate-500">{r.done} of {r.total} steps completed</p>
            </div>
          </div>
          <p className="mt-3 text-[12px] leading-snug text-slate-500">
            This is what you've done so far. It isn't a score, and it says nothing about how you'd do.
          </p>
          <div className="mt-3 space-y-0.5">
            {r.steps.map((s) => {
              const manual = ['research', 'openday', 'statement', 'reference'].includes(s.id)
              return (
                <button
                  key={s.id}
                  onClick={() => manual && tick(s.id)}
                  disabled={!manual}
                  className="flex min-h-[44px] w-full items-center gap-3 rounded-xl px-1 text-left active:bg-slate-50 disabled:active:bg-transparent"
                >
                  {s.done
                    ? <Check size={18} className="shrink-0 text-violet-600" strokeWidth={3} />
                    : <Circle size={18} className="shrink-0 text-slate-300" />}
                  <span className={`text-[14px] ${s.done ? 'text-slate-900' : 'text-slate-500'}`}>{s.label}</span>
                </button>
              )
            })}
          </div>
        </Card>

        <Card className="!p-4">
          <div className="flex items-center justify-between">
            <p className="text-[15px] font-bold text-slate-900">How well we know you</p>
            <span className="text-[15px] font-bold text-violet-700">{conf}%</span>
          </div>
          <div className="mt-2.5"><Bar pct={conf} /></div>
          <p className="mt-2 text-[12px] leading-snug text-slate-500">
            This just helps us put the right things in front of you first.
          </p>
        </Card>

        <Card className="!p-4">
          <p className="text-[15px] font-bold text-slate-900">Your answers</p>
          <p className="mt-0.5 text-[13px] text-slate-500">Change any of these whenever you like.</p>
          <div className="mt-2 divide-y divide-slate-100">
            {QUESTIONS.map((q) => (
              <button key={q.id} onClick={() => nav('/next/start')} className="flex min-h-[52px] w-full items-center gap-3 py-2 text-left">
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] text-slate-500">{q.eyebrow}</p>
                  <p className="truncate text-[14px] font-semibold text-slate-900">
                    {answerLabel(q) || <span className="font-normal text-slate-400">Not answered yet</span>}
                  </p>
                </div>
                <ChevronRight size={17} className="shrink-0 text-slate-300" />
              </button>
            ))}
          </div>
        </Card>

        <button
          onClick={() => { if (window.confirm('Clear everything and start over?')) reset() }}
          className="flex min-h-[48px] w-full items-center justify-center gap-2 text-[13px] font-semibold text-slate-400"
        >
          <RotateCcw size={14} /> Reset this prototype
        </button>
      </div>
    </div>
  )
}
