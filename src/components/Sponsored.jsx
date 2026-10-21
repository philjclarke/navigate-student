import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Minus, X, Play, FileDown, FileText, Maximize2, ArrowRight, Megaphone, Clock, Film } from 'lucide-react'
import {
  pickCampaign, advanceRotation, isMinimised, setMinimised, setDismissed, logEvent, controls,
} from '../data/sponsored'

/* Sponsored content is deliberately not skinned like Navigate. It carries the
   partner's colours, sits on its own artwork and uses a different type scale,
   so a student can tell at a glance that somebody else is speaking. That is a
   disclosure requirement as much as a design one. */

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

/* Named in words, not left to a logo: the audience is 16 to 18 and the
   relationship has to be legible without recognising a brand mark. */
function Partnership({ campaign, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold tracking-wide text-white/90 uppercase backdrop-blur ${className}`}>
      {campaign.sponsor.label}
    </span>
  )
}

function Refusals({ onMinimise, onDismiss }) {
  const mode = controls()
  const cls = 'flex h-8 w-8 items-center justify-center rounded-full bg-black/25 text-white/80 backdrop-blur transition-colors hover:bg-black/45 hover:text-white'
  return (
    <div className="flex shrink-0 gap-1.5">
      {mode !== 'dismiss' && (
        <button onClick={onMinimise} title="Minimise — back next time you log in"
          aria-label="Minimise this advert" className={cls}><Minus size={16} /></button>
      )}
      {mode !== 'minimise' && (
        <button onClick={onDismiss} title="Dismiss — do not show me this again"
          aria-label="Dismiss this advert" className={cls}><X size={16} /></button>
      )}
    </div>
  )
}

/* The advert, sized to stand in for a home page panel. Full bleed artwork, the
   partner's ink, and a scrim heavy enough to keep type readable over whatever
   image a sponsor supplies. */
export function SponsoredPanel({ campaign, onMinimise, onDismiss }) {
  const nav = useNavigate()
  const Icon = ICON[campaign.template] || Play
  const { ink, accent } = campaign.sponsor

  const open = () => {
    logEvent(campaign.id, 'advert-clicked', {})
    nav(`/sponsored/${campaign.id}`)
  }

  return (
    <div className="relative min-h-[270px] overflow-hidden rounded-2xl text-white" style={{ backgroundColor: ink }}>
      <img src={campaign.banner.image} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(100deg, ${ink}f5 0%, ${ink}e0 42%, ${ink}55 100%)` }}
      />
      <div className="absolute inset-x-0 bottom-0 h-1.5" style={{ backgroundColor: accent }} />

      <div className="relative flex min-h-[270px] flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <Partnership campaign={campaign} />
          <Refusals onMinimise={onMinimise} onDismiss={onDismiss} />
        </div>

        <div className="mt-auto max-w-[26rem] pt-6">
          <h2 className="text-3xl leading-tight font-bold tracking-tight">{campaign.banner.heading}</h2>
          <p className="mt-2 text-sm leading-relaxed text-white/80">{campaign.banner.blurb}</p>
          <button
            onClick={open}
            className="mt-4 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-transform hover:scale-[1.02]"
            style={{ backgroundColor: accent, color: ink }}
          >
            <Icon size={15} /> {campaign.banner.cta}
          </button>
        </div>
      </div>
    </div>
  )
}

/* Minimised: a static image that reopens it. It takes a cell of its own rather
   than sitting inside the panel it gave back, so nothing reads as an
   endorsement by whichever panel it happens to land next to. */
export function SponsoredTile({ campaign, onRestore, onDismiss }) {
  const { ink, accent } = campaign.sponsor
  return (
    <div className="relative flex items-center gap-4 overflow-hidden rounded-2xl p-3 text-white" style={{ backgroundColor: ink }}>
      <button onClick={onRestore} className="shrink-0" aria-label={`Reopen ${campaign.banner.heading}`}>
        <img src={campaign.banner.image} alt={campaign.banner.heading} className="aspect-video w-32 rounded-xl object-cover sm:w-44" />
      </button>
      <div className="flex min-w-0 flex-1 flex-col justify-center py-1">
        <p className="text-[10px] font-bold tracking-wide text-white/60 uppercase">{campaign.sponsor.label}</p>
        <p className="mt-1 truncate text-lg font-bold">{campaign.banner.heading}</p>
        <button onClick={onRestore} className="mt-1.5 flex items-center gap-1 text-sm font-bold" style={{ color: accent }}>
          <Maximize2 size={13} /> Reopen
        </button>
      </div>
      {controls() !== 'minimise' && (
        <button onClick={onDismiss} title="Dismiss — do not show me this again"
          aria-label="Dismiss this advert"
          className="flex h-8 w-8 shrink-0 items-center justify-center self-start rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white">
          <X size={16} />
        </button>
      )}
    </div>
  )
}

/* Navigate's own announcement strip, borrowed for a campaign.

   It is the most Navigate-looking option of the four, which is its strength
   and its risk: a student reads the shape before they read the words, and this
   shape currently means "the college is telling you something". So the partner
   is named in the line directly under the heading rather than in a corner, the
   badge and the button take the sponsor's colours, and the strip carries a
   coloured edge that none of Navigate's own announcements have. */
const META_ICON = { video: Film, download: FileDown, article: Clock }

function metaFor(campaign) {
  const s = (t) => campaign.slots.find((x) => x.type === t)
  if (campaign.template === 'video') return `Video · ${s('video')?.length}`
  if (campaign.template === 'download') return `${s('file')?.format} · ${s('file')?.size}`
  const words = (s('body')?.paragraphs || []).join(' ').split(/\s+/).length
  return `${Math.max(1, Math.round(words / 200))} minute read`
}

export function SponsoredStrip({ campaign, small, onMinimise, onDismiss, onRestore }) {
  const nav = useNavigate()
  const { ink, accent } = campaign.sponsor
  const Icon = META_ICON[campaign.template] || Megaphone
  const open = () => { logEvent(campaign.id, 'advert-clicked', {}); nav(`/sponsored/${campaign.id}`) }

  if (small) {
    return (
      <div className="flex items-center gap-3 overflow-hidden rounded-2xl p-2.5 text-white" style={{ backgroundColor: ink }}>
        <img src={campaign.banner.image} alt="" className="h-11 w-20 shrink-0 rounded-lg object-cover" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold">{campaign.banner.heading}</p>
          <p className="truncate text-[11px] text-white/60">{campaign.sponsor.label}</p>
        </div>
        <button onClick={onRestore} className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold" style={{ color: accent }}>
          <Maximize2 size={13} /> Reopen
        </button>
        {controls() !== 'minimise' && (
          <button onClick={onDismiss} aria-label="Dismiss this advert"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white">
            <X size={16} />
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-2xl text-white" style={{ backgroundColor: ink }}>
      <img src={campaign.banner.image} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0"
        style={{ background: `linear-gradient(95deg, ${ink}f7 0%, ${ink}e8 45%, ${ink}66 100%)` }} />
      <div className="absolute inset-y-0 left-0 w-2" style={{ backgroundColor: accent }} />

      <div className="relative flex flex-wrap items-center gap-5 p-5 pl-7 md:gap-8 md:p-6 md:pl-9">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur">
          <Megaphone size={22} />
        </span>

        <div className="min-w-[15rem] flex-1">
          <p className="text-[11px] font-bold tracking-wide text-white/70 uppercase">{campaign.sponsor.label}</p>
          <h2 className="mt-1 text-2xl leading-tight font-bold tracking-tight">{campaign.banner.heading}</h2>
          <p className="mt-1.5 text-sm text-white/75">{campaign.banner.blurb}</p>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-white/60">
            <Icon size={14} /> {metaFor(campaign)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={open}
            className="rounded-full px-5 py-2.5 text-sm font-bold transition-transform hover:scale-[1.02]"
            style={{ backgroundColor: accent, color: ink }}
          >
            {campaign.banner.cta}
          </button>
          <Refusals onMinimise={onMinimise} onDismiss={onDismiss} />
        </div>
      </div>
    </div>
  )
}

/* The welcome banner placement: narrower, so the artwork leads and the type
   underneath it stays short. */
export function SponsoredInline({ campaign, small, onMinimise, onDismiss, onRestore }) {
  const nav = useNavigate()
  const { ink, accent } = campaign.sponsor
  const open = () => { logEvent(campaign.id, 'advert-clicked', {}); nav(`/sponsored/${campaign.id}`) }

  if (small) {
    return (
      <div className="flex items-center gap-3 rounded-xl p-2.5 text-white" style={{ backgroundColor: ink }}>
        <img src={campaign.banner.image} alt="" className="h-12 w-20 shrink-0 rounded-lg object-cover" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[10px] font-bold tracking-wide text-white/60 uppercase">{campaign.sponsor.label}</p>
          <button onClick={onRestore} className="text-xs font-bold" style={{ color: accent }}>Reopen</button>
        </div>
        {controls() !== 'minimise' && (
          <button onClick={onDismiss} aria-label="Dismiss this advert" className="text-white/60 hover:text-white"><X size={15} /></button>
        )}
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl text-white" style={{ backgroundColor: ink }}>
      <div className="relative">
        <button onClick={open} className="block w-full" aria-label={campaign.banner.heading}>
          <img src={campaign.banner.image} alt="" className="h-32 w-full object-cover" />
        </button>
        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
          <Partnership campaign={campaign} className="!text-[10px]" />
          <Refusals onMinimise={onMinimise} onDismiss={onDismiss} />
        </div>
      </div>
      <button onClick={open} className="block w-full p-4 text-left">
        <p className="text-xl font-bold">{campaign.banner.heading}</p>
        <p className="mt-1 text-sm text-white/75">{campaign.banner.blurb}</p>
        <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold" style={{ color: accent }}>
          {campaign.banner.cta} <ArrowRight size={14} />
        </span>
      </button>
    </div>
  )
}
