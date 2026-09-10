import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Bookmark, CalendarPlus, Send, MapPin, Check, ExternalLink } from 'lucide-react'
import { REACH_LABEL, offerPoints } from '../data/universities'

const REACH_STYLE = {
  safe: 'bg-brand-100 text-brand-700',
  reach: 'bg-purple-100 text-purple-700',
  stretch: 'bg-amber-500/15 text-amber-700',
}

export function ReachPill({ reach }) {
  if (!reach) return null
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${REACH_STYLE[reach]}`}>
      {REACH_LABEL[reach]}
    </span>
  )
}

export function OfferPill({ course }) {
  const text = (course.GradesOffer || '').replace(/\.$/, '') || course.PointsOfferBand
  if (!text) return <span className="text-[11px] text-gray-400">Offer not listed</span>
  const pts = offerPoints(course)
  return (
    <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-bold text-gray-700">
      {text}{pts ? <span className="font-normal text-gray-400"> · {pts} pts</span> : null}
    </span>
  )
}

export function Place({ inst, compact = false }) {
  if (!inst?.location) return <span className="text-xs text-gray-400">Location not yet known</span>
  return (
    <span className="flex items-center gap-1 text-xs text-gray-500">
      <MapPin size={12} className="text-gray-400" />
      {inst.location.city}{compact || inst.location.region === inst.location.city ? '' : `, ${inst.location.region}`}
      {inst.miles != null && <span className="text-gray-400"> · {inst.miles} mi · {inst.travel}</span>}
    </span>
  )
}

/* Three commitments from the Miro board: bookmark, add an activity, apply. */
export function CourseActions({ course, saved, onSave, onPlan, onApply, applied }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={onSave}
        className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors ${
          saved ? 'border-brand-500 bg-brand-500 text-white' : 'border-gray-300 text-gray-600 hover:border-brand-400'
        }`}
      >
        <Bookmark size={13} fill={saved ? 'currentColor' : 'none'} /> {saved ? 'Shortlisted' : 'Shortlist'}
      </button>
      <button
        onClick={onPlan}
        className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-bold text-gray-600 hover:border-brand-400"
      >
        <CalendarPlus size={13} /> Add to my timeline
      </button>
      <button
        onClick={onApply}
        disabled={applied}
        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold ${
          applied ? 'bg-gray-100 text-gray-400' : 'bg-purple-600 text-white hover:bg-purple-700'
        }`}
      >
        {applied ? <><Check size={13} /> Application recorded</> : <><Send size={13} /> Record an application</>}
      </button>
    </div>
  )
}

export function useToast() {
  const [msg, setMsg] = useState(null)
  const show = useCallback((m) => {
    setMsg(m)
    setTimeout(() => setMsg(null), 2600)
  }, [])
  const toast = msg ? (
    <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-gray-800 px-4 py-2 text-sm font-semibold text-white shadow-lg">
      {msg}
    </div>
  ) : null
  return [toast, show]
}

/* One standard line about what a UK student actually pays, with a link to
   the authoritative source. Used wherever cost appears, because HEAP's fee
   figures are for international students and must never be mistaken for
   the student's own number. */
export const FEE_CAP = { amount: '£9,535', year: '2025/26', url: 'https://www.gov.uk/student-finance' }

export function FeeCapNote({ className = '' }) {
  return (
    <p className={`text-xs leading-relaxed text-gray-500 ${className}`}>
      If you're from England, tuition fees are capped at <strong className="text-gray-700">{FEE_CAP.amount} a year</strong> for {FEE_CAP.year}, wherever in the UK you study. A tuition fee loan covers it, so nothing is paid up front.{' '}
      <a href={FEE_CAP.url} target="_blank" rel="noreferrer" className="font-semibold text-purple-700 hover:underline">
        Check the latest figures on GOV.UK <ExternalLink size={11} className="inline" />
      </a>
    </p>
  )
}

export function InternationalFees({ text }) {
  if (!text) return null
  return (
    <div className="rounded-lg bg-gray-50 p-3">
      <p className="text-[11px] font-bold tracking-wide text-gray-500 uppercase">Fees for international students</p>
      <p className="mt-1 text-sm text-gray-700">{text}</p>
      <p className="mt-1 text-xs text-gray-400">
        This is what the university charges students from outside the UK. If you're a UK student, the cap above is what applies to you.
      </p>
    </div>
  )
}

export function ShortlistLink({ count }) {
  return (
    <Link to="/universities/shortlist" className="flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-700">
      <Bookmark size={14} /> My shortlist{count ? ` (${count})` : ''}
    </Link>
  )
}
