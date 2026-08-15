import { Link } from 'react-router-dom'
import {
  Building, Hammer, Wrench, GraduationCap, Sparkles, ArrowRight, HelpCircle,
} from 'lucide-react'
import { ROUTE_TYPES } from '../data/pathways'
import { routeState } from '../data/student'

const ICON = { apprenticeship: Building, tlevel: Hammer, work: Wrench, degree: GraduationCap }

const STYLE = {
  amber: { ring: 'border-amber-300', head: 'text-amber-600', icon: 'bg-amber-500/15 text-amber-500', bar: 'bg-amber-500', soft: 'bg-amber-500/10' },
  sky: { ring: 'border-sky-300', head: 'text-sky-700', icon: 'bg-sky-100 text-sky-600', bar: 'bg-sky-500', soft: 'bg-sky-50' },
  teal: { ring: 'border-brand-300', head: 'text-brand-700', icon: 'bg-brand-100 text-brand-600', bar: 'bg-brand-500', soft: 'bg-brand-50' },
  purple: { ring: 'border-purple-300', head: 'text-purple-700', icon: 'bg-purple-100 text-purple-600', bar: 'bg-purple-500', soft: 'bg-purple-50' },
}

/* Readiness is steps completed — never a prediction of success. */
function Readiness({ done, total, style }) {
  const pct = Math.round((done / total) * 100)
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <p className="text-xs font-bold tracking-wide text-gray-500 uppercase">Readiness</p>
        <p className="text-xs font-semibold text-gray-600">{done} of {total} steps</p>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-gray-200">
        <div className={`h-full rounded-full ${style.bar}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export default function ExploreColumn({ section, recommendation }) {
  const meta = ROUTE_TYPES[section.type]
  const style = STYLE[meta.accent]
  const Icon = ICON[section.type]
  const state = routeState[section.type]

  return (
    <div className={`flex flex-col gap-4 rounded-2xl border-2 ${style.ring} bg-white p-5`}>
      <div>
        <span className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full ${style.icon}`}>
          <Icon size={19} />
        </span>
        <h3 className="text-lg leading-snug font-bold text-gray-700">{section.title}</h3>
        <p className="mt-1 text-sm text-gray-500">{section.blurb}</p>
      </div>

      {/* What we recommend — the anti-silo slot. This is where other routes
          get to interrupt, so a student deep in one column still hears about
          the others. */}
      {recommendation && (
        <div className={`rounded-xl p-3 ${style.soft}`}>
          <p className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
            <Sparkles size={13} /> What we recommend
          </p>
          <p className="mt-1 text-xs leading-snug text-gray-600">{recommendation}</p>
        </div>
      )}

      <Readiness {...state.readiness} style={style} />

      {/* Low confidence is a prompt, not a silence */}
      {state.gap && (
        <div className="flex items-start gap-2 rounded-lg bg-gray-50 p-2.5">
          <HelpCircle size={14} className="mt-0.5 shrink-0 text-gray-400" />
          <p className="text-xs leading-snug text-gray-600">
            {state.gap} — <button className="font-semibold text-brand-600 hover:text-brand-700">answer two questions</button>
          </p>
        </div>
      )}

      <Link
        to={`/future/explore/${section.key}`}
        className={`mt-auto flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-bold text-white ${style.bar}`}
      >
        {section.title} <ArrowRight size={16} />
      </Link>
    </div>
  )
}
