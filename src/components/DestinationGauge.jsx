import { Wrench, Building, GraduationCap, Hammer } from 'lucide-react'
import { ROUTE_TYPES } from '../data/pathways'

const ZONES = [
  { type: 'work', icon: Wrench },
  { type: 'apprenticeship', icon: Building },
  { type: 'tlevel', icon: Hammer },
  { type: 'degree', icon: GraduationCap },
]

/* The next destination gauge — always shows Navigate's recommendation, but the
   student can move their own marker anywhere. We never move theirs. */
export default function DestinationGauge({ lean, dataLean, confidence, onChange }) {
  const nearest = ZONES.reduce((best, z) =>
    Math.abs(ROUTE_TYPES[z.type].lean - lean) < Math.abs(ROUTE_TYPES[best.type].lean - lean) ? z : best,
  )

  return (
    <div>
      <div className="relative pt-9">
        {/* Navigate's recommendation — click-transparent so it never blocks the thumb */}
        <div
          className="pointer-events-none absolute top-0 -translate-x-1/2 text-center"
          style={{ left: `${dataLean}%` }}
        >
          <span className="rounded-full bg-gray-700 px-2.5 py-0.5 text-[10px] font-bold whitespace-nowrap text-white">
            Navigate suggests
          </span>
          <div className="mx-auto h-3.5 w-px bg-gray-700" />
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={lean}
          onChange={(e) => onChange(Number(e.target.value))}
          className="destination-gauge w-full"
          aria-label="Your next destination, from straight into work through to university"
        />
      </div>

      {/* Zone labels */}
      <div className="mt-2 grid grid-cols-4 gap-1">
        {ZONES.map(({ type, icon: Icon }) => {
          const active = nearest.type === type
          return (
            <button
              key={type}
              onClick={() => onChange(ROUTE_TYPES[type].lean)}
              className={`flex flex-col items-center gap-1 rounded-lg px-1 py-1.5 text-center transition-colors ${
                active ? 'bg-gray-700 text-white' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <Icon size={14} />
              <span className="text-[11px] leading-tight font-bold">{ROUTE_TYPES[type].short}</span>
            </button>
          )
        })}
      </div>

      {confidence != null && (
        <p className="mt-3 text-center text-xs text-gray-500">
          Navigate is <strong>{confidence}% confident</strong> in this suggestion.
          The more we know about you, the better it gets.
        </p>
      )}
    </div>
  )
}
