import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Minus, X, Play, FileDown, FileText, Maximize2 } from 'lucide-react'
import { Button } from './ui'
import {
  pickCampaign, advanceRotation, isMinimised, setMinimised, setDismissed, logEvent, controls,
} from '../data/sponsored'

const ICON = { video: Play, download: FileDown, article: FileText }

/* One advert, chosen once per page load. Picking inside a useState initialiser
   matters: re-renders must not reshuffle the rotation under the student. */
export function useSponsored(host) {
  const [campaign] = useState(() => pickCampaign(host))
  const [small, setSmall] = useState(() => (campaign ? isMinimised(campaign.id) : false))
  const [gone, setGone] = useState(false)
  const logged = useRef(false)

  useEffect(() => {
    if (!campaign || logged.current) return
    logged.current = true
    /* A minimised advert is not the same as a shown one, so the form travels
       with the event rather than being lost in a single count. */
    logEvent(campaign.id, 'shown', { form: small ? 'minimised' : 'full', host })
    advanceRotation()
  }, [campaign, small, host])

  return {
    campaign: gone ? null : campaign,
    small,
    minimise: () => { setMinimised(campaign.id, true); setSmall(true); logEvent(campaign.id, 'minimised', {}) },
    restore: () => { setMinimised(campaign.id, false); setSmall(false); logEvent(campaign.id, 'restored', {}) },
    dismiss: () => { setDismissed(campaign.id, true); setGone(true); logEvent(campaign.id, 'dismissed', {}) },
  }
}

/* The partnership line. Text, always present, never only a logo — the audience
   is 16 to 18 and the relationship has to be obvious without being decoded. */
function Partnership({ campaign, className = '' }) {
  return (
    <p className={`text-xs font-semibold tracking-wide text-gray-500 uppercase ${className}`}>
      {campaign.sponsor.label}
    </p>
  )
}

function Refusals({ onMinimise, onDismiss, tone = 'light' }) {
  const mode = controls()
  const c = tone === 'light'
    ? 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
    : 'text-white/70 hover:bg-white/15 hover:text-white'
  return (
    <div className="flex shrink-0 gap-1">
      {mode !== 'dismiss' && (
        <button onClick={onMinimise} title="Minimise — back next time you log in"
          aria-label="Minimise this advert" className={`flex h-8 w-8 items-center justify-center rounded-lg ${c}`}>
          <Minus size={17} />
        </button>
      )}
      {mode !== 'minimise' && (
        <button onClick={onDismiss} title="Dismiss — do not show me this again"
          aria-label="Dismiss this advert" className={`flex h-8 w-8 items-center justify-center rounded-lg ${c}`}>
          <X size={17} />
        </button>
      )}
    </div>
  )
}

/* The advert itself, sized to sit in the home page grid where a panel would. */
export function SponsoredPanel({ campaign, onMinimise, onDismiss }) {
  const nav = useNavigate()
  const Icon = ICON[campaign.template] || Play

  const open = () => {
    logEvent(campaign.id, 'advert-clicked', {})
    nav(`/sponsored/${campaign.id}`)
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-300 bg-white">
      <div className="flex items-start justify-between gap-3 px-5 pt-4">
        <Partnership campaign={campaign} />
        <Refusals onMinimise={onMinimise} onDismiss={onDismiss} />
      </div>
      <div className="grid gap-4 px-5 pt-3 pb-5 sm:grid-cols-[1fr_200px] sm:items-center">
        <div>
          <h2 className="text-2xl font-light text-gray-600">{campaign.banner.heading}</h2>
          <p className="mt-2 text-sm text-gray-500">{campaign.banner.blurb}</p>
          <Button className="mt-4" onClick={open}>
            <span className="flex items-center gap-2"><Icon size={15} /> {campaign.banner.cta}</span>
          </Button>
        </div>
        <button onClick={open} className="order-first sm:order-none" aria-label={campaign.banner.heading}>
          <img src={campaign.banner.image} alt="" className="h-32 w-full rounded-xl object-cover sm:h-28" />
        </button>
      </div>
    </div>
  )
}

/* Minimised: a static image that reopens it. It takes a cell of its own rather
   than sitting inside the panel it gave back, so nothing reads as an
   endorsement by whichever panel it happens to land next to. */
export function SponsoredTile({ campaign, onRestore, onDismiss }) {
  return (
    <div className="flex items-center gap-4 overflow-hidden rounded-2xl border border-dashed border-gray-300 bg-white p-3">
      <button onClick={onRestore} className="shrink-0" aria-label={`Reopen ${campaign.banner.heading}`}>
        <img src={campaign.banner.image} alt={campaign.banner.heading} className="aspect-video w-32 rounded-xl object-cover sm:w-44" />
      </button>
      <div className="flex min-w-0 flex-1 flex-col justify-center py-1">
        <Partnership campaign={campaign} className="!text-[10px]" />
        <p className="mt-1 truncate text-lg font-light text-gray-600">{campaign.banner.heading}</p>
        <button onClick={onRestore} className="mt-1.5 flex items-center gap-1 text-sm font-bold text-brand-600 hover:text-brand-700">
          <Maximize2 size={13} /> Reopen
        </button>
      </div>
      {controls() !== 'minimise' && (
        <button onClick={onDismiss} title="Dismiss — do not show me this again"
          aria-label="Dismiss this advert"
          className="flex h-8 w-8 shrink-0 items-center justify-center self-start rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600">
          <X size={16} />
        </button>
      )}
    </div>
  )
}

/* The welcome-banner placement: narrower, and on the brand wash rather than white. */
export function SponsoredInline({ campaign, small, onMinimise, onDismiss, onRestore }) {
  const nav = useNavigate()
  const open = () => { logEvent(campaign.id, 'advert-clicked', {}); nav(`/sponsored/${campaign.id}`) }

  if (small) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-dashed border-brand-300 bg-white/70 p-2.5">
        <img src={campaign.banner.image} alt="" className="h-12 w-20 shrink-0 rounded-lg object-cover" />
        <div className="min-w-0 flex-1">
          <Partnership campaign={campaign} className="truncate !text-[10px]" />
          <button onClick={onRestore} className="text-xs font-bold text-brand-600 hover:text-brand-700">Reopen</button>
        </div>
        {controls() !== 'minimise' && (
          <button onClick={onDismiss} aria-label="Dismiss this advert" className="text-gray-400 hover:text-gray-600"><X size={15} /></button>
        )}
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-gray-300 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <Partnership campaign={campaign} />
        <Refusals onMinimise={onMinimise} onDismiss={onDismiss} />
      </div>
      <button onClick={open} className="mt-2.5 block w-full text-left">
        <img src={campaign.banner.image} alt="" className="h-28 w-full rounded-lg object-cover" />
        <p className="mt-2.5 text-lg font-light text-gray-600">{campaign.banner.heading}</p>
        <p className="mt-1 text-sm text-gray-500">{campaign.banner.blurb}</p>
        <span className="mt-2 inline-block text-sm font-bold text-brand-600">{campaign.banner.cta} →</span>
      </button>
    </div>
  )
}
