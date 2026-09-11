import { PlayCircle, FileText, ListChecks, CalendarDays, MapPin, Check, ArrowRight, BadgeCheck } from 'lucide-react'
import { CTA_LABEL, ENGAGE_LABEL } from '../data/partners'

const KIND_ICON = { video: PlayCircle, article: FileText, quiz: ListChecks, event: CalendarDays }

export function PartnerBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-gray-800 px-2 py-0.5 text-[10px] font-bold text-white" title="Ignite Talent partner. Employers and universities pay to appear on Navigate.">
      <BadgeCheck size={10} /> Ignite Talent partner
    </span>
  )
}

export function PartnerDisclosure() {
  return (
    <p className="text-xs leading-snug text-gray-500">
      Employers, colleges and universities pay to appear here. Navigate decides which readiness
      step their content counts towards, and they never affect what we recommend to you.
    </p>
  )
}

/* Soft-gated CTA: always reachable, prominent only once the student has
   engaged with the content that prepares them for it. */
export default function PartnerCard({ item, stepLabel, engaged, applied, onEngage, onApply }) {
  const Icon = KIND_ICON[item.kind] || FileText
  const opp = item.opp
  const cta = CTA_LABEL[opp.kind]

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-bold text-gray-700">{item.provider}</p>
          <p className="flex items-center gap-1 text-[11px] text-gray-400">
            <MapPin size={10} /> {opp.location.city} · {opp.miles} mi
          </p>
        </div>
        <PartnerBadge />
      </div>

      <div>
        <p className="flex items-center gap-1.5 text-[11px] font-bold tracking-wide text-gray-400 uppercase">
          <Icon size={12} /> {item.kind} · {item.minutes} min
        </p>
        <h3 className="mt-1 text-base leading-snug font-bold text-gray-700">{item.title}</h3>
        <p className="mt-1 text-xs leading-snug text-gray-500">{item.blurb}</p>
      </div>

      {stepLabel && (
        <p className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs ${engaged ? 'bg-brand-100 text-brand-700' : 'bg-gray-50 text-gray-600'}`}>
          {engaged ? <Check size={12} /> : <ArrowRight size={12} />}
          {engaged ? 'Completed: ' : 'Counts towards: '}<strong>{stepLabel}</strong>
        </p>
      )}

      <div className="mt-auto space-y-1.5">
        {engaged ? (
          <>
            <button
              onClick={onApply}
              disabled={applied}
              className={`w-full rounded-lg px-3 py-2 text-sm font-bold ${applied ? 'bg-gray-100 text-gray-400' : 'bg-gray-800 text-white hover:bg-gray-900'}`}
            >
              {applied ? 'Sent to your tutor for review' : `${cta}: ${opp.title}`}
            </button>
            <p className="text-center text-[11px] text-gray-400">SEREN will add what you learned to your skills profile</p>
          </>
        ) : (
          <>
            <button onClick={onEngage} className="w-full rounded-lg bg-brand-500 px-3 py-2 text-sm font-bold text-white hover:bg-brand-600">
              {ENGAGE_LABEL[item.kind]} in SEREN
            </button>
            <button onClick={onApply} disabled={applied} className="w-full text-center text-[11px] font-semibold text-gray-400 hover:text-gray-600">
              {applied ? 'Application sent to your tutor' : `Or skip ahead: ${opp.title.toLowerCase()}`}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
