import { Link } from 'react-router-dom'
import {
  GraduationCap, House, PoundSterling, Brain, Users, Sparkles, ArrowRight, Flag, Lightbulb,
} from 'lucide-react'
import { ROUTE_TYPES, routeYears, orderForGauge, closestToLean } from '../data/pathways'
import { subjectByName, subjectReach, typicalOfferForSubject, titleCase, subjectSlug } from '../data/heap'

const ACCENT = {
  amber: { head: 'text-amber-600', border: 'border-amber-300', chip: 'bg-amber-500/15 text-amber-700', dot: 'bg-amber-500' },
  sky: { head: 'text-sky-700', border: 'border-sky-300', chip: 'bg-sky-100 text-sky-700', dot: 'bg-sky-500' },
  teal: { head: 'text-brand-700', border: 'border-brand-300', chip: 'bg-brand-100 text-brand-700', dot: 'bg-brand-500' },
  purple: { head: 'text-purple-700', border: 'border-purple-300', chip: 'bg-purple-100 text-purple-700', dot: 'bg-purple-500' },
}

/* [pre-study stage, main stage] — lets the first Level 3 block read as lighter
   groundwork and the committing stage read as the substance of the route. */
const SEG = {
  amber: ['bg-amber-500/25 text-amber-700', 'bg-amber-500 text-white'],
  sky: ['bg-sky-200 text-sky-800', 'bg-sky-500 text-white'],
  teal: ['bg-brand-300 text-brand-800', 'bg-brand-500 text-white'],
  purple: ['bg-purple-200 text-purple-800', 'bg-purple-500 text-white'],
}

const FACTOR_META = [
  ['home', House, 'Where you live'],
  ['money', PoundSterling, 'Money'],
  ['effort', Brain, 'Where the effort goes'],
  ['competition', Users, 'What makes it hard'],
]

const formatYears = (y) =>
  y === 0.5 ? '6 months' : `${y} ${y === 1 ? 'year' : 'years'}`

/* Stages are laid out with flex-grow proportional to their length, so the
   scale holds — but each carries a minimum width so short stages stay
   readable rather than collapsing into a sliver. Flexbox absorbs the
   difference in the trailing spacer, so stages can never overlap. */
function Track({ route, axisMax }) {
  const accent = ROUTE_TYPES[route.type].accent
  const total = routeYears(route)
  return (
    <div className="flex h-16 gap-1">
      {route.steps.map((s) => (
        <div
          key={s.label}
          title={`${s.label} — ${s.detail}`}
          style={{ flexGrow: s.years, flexBasis: 0, minWidth: '5.5rem' }}
          className={`flex h-16 flex-col justify-center overflow-hidden rounded-md px-2.5 ${
            SEG[accent][s.kind === 'college' ? 0 : 1]
          }`}
        >
          <p className="text-xs leading-tight font-bold">{s.label}</p>
          <p className="text-[10px] leading-tight opacity-90">{formatYears(s.years)}</p>
        </div>
      ))}
      {axisMax > total && (
        <div style={{ flexGrow: axisMax - total, flexBasis: 0 }} aria-hidden="true" />
      )}
    </div>
  )
}

export default function RouteComparison({ routes, lean }) {
  if (!routes.length) return null
  const ordered = orderForGauge(routes, lean)
  const closest = closestToLean(routes, lean)
  const axisMax = Math.max(...routes.map(routeYears))
  const ticks = Array.from({ length: Math.floor(axisMax) + 1 }, (_, i) => i)

  return (
    <div className="space-y-3">
      {/* Shared time axis */}
      <div className="hidden md:flex">
        <div className="w-56 shrink-0" />
        <div className="relative flex-1">
          <div className="flex justify-between text-[10px] font-bold tracking-wide text-gray-400 uppercase">
            {ticks.map((t) => (
              <span key={t}>{t === 0 ? 'Now' : `${t}yr`}</span>
            ))}
          </div>
        </div>
        <div className="w-44 shrink-0" />
      </div>

      {ordered.map((route) => {
        const meta = ROUTE_TYPES[route.type]
        const accent = ACCENT[meta.accent]
        const years = routeYears(route)
        const subject = route.subject ? subjectByName(route.subject) : null
        const reach = subject ? subjectReach(route.subject) : null
        const offer = subject ? typicalOfferForSubject(route.subject) : null

        return (
          <div key={route.name} className={`rounded-2xl border-2 ${accent.border} bg-white p-4`}>
            <div className="flex flex-col gap-3 md:flex-row md:items-start">
              {/* Route identity */}
              <div className="w-56 shrink-0">
                <p className={`text-[11px] font-bold tracking-wide uppercase ${accent.head}`}>{meta.label}</p>
                <p className="text-sm leading-snug font-bold text-gray-700">{route.name}</p>
                {route === closest && (
                  <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-gray-700 px-2 py-0.5 text-[10px] font-bold text-white">
                    <Sparkles size={10} /> Closest to your dial
                  </span>
                )}
              </div>

              {/* Proportional track */}
              <div className="flex-1">
                <Track route={route} axisMax={axisMax} />
              </div>

              {/* Arrival */}
              <div className="flex w-44 shrink-0 items-start gap-2">
                <span className={`mt-1 flex h-5 w-5 items-center justify-center rounded-full ${accent.dot}`}>
                  <Flag size={11} className="text-white" />
                </span>
                <div>
                  <p className="text-sm leading-snug font-bold text-gray-700">{route.arrival}</p>
                  <p className="text-xs text-gray-500">in {years} years</p>
                </div>
              </div>
            </div>

            {/* Human trade-offs */}
            <div className="mt-3 grid gap-x-5 gap-y-2 border-t border-gray-100 pt-3 sm:grid-cols-2 xl:grid-cols-4">
              {FACTOR_META.map(([key, Icon, label]) => (
                <div key={key} className="flex items-start gap-2">
                  <Icon size={14} className="mt-0.5 shrink-0 text-gray-400" />
                  <div>
                    <p className="text-[10px] font-bold tracking-wide text-gray-400 uppercase">{label}</p>
                    <p className="text-xs leading-snug text-gray-600">{route.factors[key]}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* One clear next action per route, matched to how you'd actually
                pursue it: courses for a degree, Navigate's own Opportunities
                area for the routes that start with finding an employer. */}
            {route.type === 'degree'
              ? subject && reach?.courses > 0 && (
                  <Link
                    to={`/future/subject/${subjectSlug(route.subject)}`}
                    className={`mt-3 flex flex-wrap items-center gap-x-2 rounded-lg px-3 py-2 text-xs font-semibold ${accent.chip}`}
                  >
                    <GraduationCap size={14} />
                    {titleCase(route.subject)} — {reach.courses} courses at {reach.institutions} universities &amp; colleges
                    {offer && <span className="opacity-80">· typical offer {offer}</span>}
                    <ArrowRight size={13} className="ml-auto" />
                  </Link>
                )
              : (
                  <Link
                    to="/opportunities"
                    className={`mt-3 flex flex-wrap items-center gap-x-2 rounded-lg px-3 py-2 text-xs font-semibold ${accent.chip}`}
                  >
                    <Lightbulb size={14} />
                    {route.type === 'apprenticeship'
                      ? 'Find apprenticeships and employers on Navigate'
                      : 'Find placements and work opportunities on Navigate'}
                    <ArrowRight size={13} className="ml-auto" />
                  </Link>
                )}
          </div>
        )
      })}

      <p className="text-xs text-gray-400">
        Routes are ordered by where your gauge sits, with technical and vocational routes leading
        when it's line-ball. Nothing here is ruled out — the order is a starting point, not a ranking.
      </p>
    </div>
  )
}
