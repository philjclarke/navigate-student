import { Link } from 'react-router-dom'
import { Building, Wrench, GraduationCap, PoundSterling, House } from 'lucide-react'
import { Card, Button, StatusPill } from './ui'
import { ROUTE_TYPES, routeYears } from '../data/pathways'

const STYLE = {
  amber: { icon: 'bg-amber-500/15 text-amber-500', head: 'text-amber-600', bar: ['bg-amber-500/30', 'bg-amber-500'] },
  teal: { icon: 'bg-brand-100 text-brand-600', head: 'text-brand-700', bar: ['bg-brand-300', 'bg-brand-500'] },
  purple: { icon: 'bg-purple-100 text-purple-600', head: 'text-purple-700', bar: ['bg-purple-200', 'bg-purple-500'] },
}

const ICON = { apprenticeship: Building, work: Wrench, degree: GraduationCap }

/* A route card leads with the destination, not the subject — "become a field
   archaeologist, this way" — because a route only means anything once you
   know where it ends. */
export default function RouteCard({ career, route }) {
  const meta = ROUTE_TYPES[route.type]
  const style = STYLE[meta.accent]
  const Icon = ICON[route.type]
  const years = routeYears(route)

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className={`flex h-9 w-9 items-center justify-center rounded-full ${style.icon}`}>
          <Icon size={17} />
        </span>
        <StatusPill>Route</StatusPill>
      </div>

      <div>
        <p className={`text-[11px] font-bold tracking-wide uppercase ${style.head}`}>{meta.label}</p>
        <h3 className="text-lg leading-snug font-bold text-gray-700">Become {/^[aeiou]/i.test(career.title) ? 'an' : 'a'} {career.title.toLowerCase()}</h3>
      </div>

      {/* Miniature of the same track used in the full comparison */}
      <div className="flex h-2 gap-0.5" aria-hidden="true">
        {route.steps.map((s) => (
          <div
            key={s.label}
            style={{ flexGrow: s.years, flexBasis: 0, minWidth: '0.75rem' }}
            className={`rounded-full ${style.bar[s.kind === 'college' ? 0 : 1]}`}
          />
        ))}
      </div>
      <p className="-mt-1 text-xs font-semibold text-gray-600">
        {route.arrival} in {years} years
      </p>

      <div className="space-y-1.5">
        <p className="flex items-start gap-1.5 text-xs text-gray-500">
          <PoundSterling size={13} className="mt-0.5 shrink-0 text-gray-400" /> {route.factors.money}
        </p>
        <p className="flex items-start gap-1.5 text-xs text-gray-500">
          <House size={13} className="mt-0.5 shrink-0 text-gray-400" /> {route.factors.home}
        </p>
      </div>

      <Link to={`/future/career/${career.slug}?tab=1`} className="mt-auto">
        <Button small>Compare all routes</Button>
      </Link>
    </Card>
  )
}
