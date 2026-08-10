import { Link } from 'react-router-dom'
import {
  GraduationCap, Building, Briefcase, BookOpen, Award, Wrench,
  ChevronRight, Clock, PoundSterling, Sparkles, ArrowRight,
} from 'lucide-react'
import { ROUTE_TYPES } from '../data/pathways'
import { subjectByName, subjectReach, typicalOfferForSubject, titleCase, subjectSlug } from '../data/heap'

const ACCENT = {
  teal: { chip: 'bg-brand-100 text-brand-700', border: 'border-brand-300', head: 'text-brand-700', dot: 'bg-brand-500' },
  amber: { chip: 'bg-amber-500/15 text-amber-600', border: 'border-amber-300', head: 'text-amber-600', dot: 'bg-amber-500' },
  purple: { chip: 'bg-purple-100 text-purple-700', border: 'border-purple-300', head: 'text-purple-700', dot: 'bg-purple-500' },
}

const KIND_ICON = {
  college: BookOpen,
  university: GraduationCap,
  apprenticeship: Building,
  work: Wrench,
  job: Briefcase,
  professional: Award,
}

function Step({ step, accent, index }) {
  const Icon = KIND_ICON[step.kind] || Briefcase
  return (
    <div className="flex flex-1 items-stretch gap-2">
      <div className={`flex-1 rounded-xl border ${ACCENT[accent].border} bg-white p-3`}>
        <p className="flex items-center gap-1.5 text-xs font-bold tracking-wide text-gray-400 uppercase">
          <span className={`flex h-4 w-4 items-center justify-center rounded-full text-[9px] text-white ${ACCENT[accent].dot}`}>
            {index + 1}
          </span>
          <Icon size={13} className="text-gray-400" />
          {step.duration || ''}
        </p>
        <p className="mt-1.5 text-sm font-bold text-gray-700">{step.label}</p>
        <p className="mt-0.5 text-xs leading-snug text-gray-500">{step.detail}</p>
      </div>
    </div>
  )
}

export default function Pathway({ route, matches = false }) {
  const meta = ROUTE_TYPES[route.type]
  const accent = ACCENT[meta.accent]
  const subject = route.subject ? subjectByName(route.subject) : null
  const reach = subject ? subjectReach(route.subject) : null
  const offer = subject ? typicalOfferForSubject(route.subject) : null

  return (
    <div className={`rounded-2xl border-2 ${accent.border} bg-white/60 p-4`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className={`text-xs font-bold tracking-wide uppercase ${accent.head}`}>{meta.label}</p>
          <p className="text-lg font-bold text-gray-700">{route.name}</p>
        </div>
        {matches && (
          <span className="flex items-center gap-1.5 rounded-full bg-gray-700 px-3 py-1 text-xs font-bold text-white">
            <Sparkles size={12} /> Closest to your direction
          </span>
        )}
      </div>

      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-gray-500">
        <span className="flex items-center gap-1.5"><Clock size={13} className="text-gray-400" /> {route.duration}</span>
        <span className="flex items-center gap-1.5"><PoundSterling size={13} className="text-gray-400" /> {route.earn}</span>
      </div>

      {/* Steps */}
      <div className="mt-4 flex flex-col gap-2 lg:flex-row lg:items-stretch">
        {route.steps.map((s, i) => (
          <div key={s.label} className="flex flex-1 items-center gap-2">
            <Step step={s} accent={meta.accent} index={i} />
            {i < route.steps.length - 1 && (
              <ChevronRight size={18} className="hidden shrink-0 text-gray-300 lg:block" />
            )}
          </div>
        ))}
      </div>

      {/* Real HEAP data behind the study stage */}
      {subject && reach?.courses > 0 && (
        <Link
          to={`/future/subject/${subjectSlug(route.subject)}`}
          className={`mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg px-3 py-2 text-xs font-semibold ${accent.chip}`}
        >
          <GraduationCap size={14} />
          {titleCase(route.subject)} — {reach.courses} courses at {reach.institutions} universities &amp; colleges
          {offer && <span className="opacity-80">· typical offer {offer}</span>}
          <ArrowRight size={13} className="ml-auto" />
        </Link>
      )}
    </div>
  )
}
