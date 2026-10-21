import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, FileDown, Info, Check } from 'lucide-react'
import { Card } from '../components/ui'
import { campaignById, logEvent, TEMPLATES } from '../data/sponsored'

/* The content page runs on the partner's colours, not Navigate's, and breaks
   out of the page padding so the hero reaches both edges. Each slot is typed
   and the template fixes the order, so this renders what the campaign declares
   rather than a bespoke layout per sponsor. Every interactive slot reports its
   own engagement. */

/* The layout wraps pages in horizontal padding. Undoing it here is what makes
   the hero feel like somebody else's space rather than a panel in ours. */
const BLEED = '-mx-4 md:-mx-8 xl:-mx-10'

function VideoSlot({ slot, campaign }) {
  const ref = useRef(null)
  const hit = useRef(new Set())

  /* Local hosting is what makes this honest: with a third party embed we could
     log "pressed play" and nothing else. */
  const mark = (action, detail = {}) => {
    if (hit.current.has(action)) return
    hit.current.add(action)
    logEvent(campaign.id, 'interaction', { action, ...detail })
  }

  const onTime = () => {
    const v = ref.current
    if (!v || !v.duration) return
    const pct = (v.currentTime / v.duration) * 100
    for (const m of [25, 50, 75]) if (pct >= m) mark(`video-${m}`)
  }

  return (
    <figure className="mx-auto max-w-4xl">
      <div className="overflow-hidden rounded-2xl shadow-2xl ring-1 ring-black/10">
        <video
          ref={ref}
          src={slot.src}
          poster={slot.poster}
          controls
          playsInline
          preload="metadata"
          className="block w-full bg-black"
          onPlay={() => logEvent(campaign.id, 'interaction', { action: 'video-play' })}
          onPause={() => logEvent(campaign.id, 'interaction', { action: 'video-pause' })}
          onTimeUpdate={onTime}
          onEnded={() => mark('video-complete')}
        />
      </div>
      <figcaption className="mt-3 text-center text-sm text-gray-500">{slot.title} · {slot.length}</figcaption>
    </figure>
  )
}

function FileSlot({ slot, campaign }) {
  const [got, setGot] = useState(false)
  const { ink, accent } = campaign.sponsor
  return (
    <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-6 rounded-2xl p-7 text-white shadow-xl" style={{ backgroundColor: ink }}>
      <div className="flex items-center gap-5">
        <div className="flex h-20 w-16 shrink-0 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/20">
          <FileDown size={26} style={{ color: accent }} />
        </div>
        <div>
          <p className="text-xl font-bold">{slot.title}</p>
          <p className="mt-1 text-sm text-white/70">{slot.format} · {slot.size}</p>
        </div>
      </div>
      <a
        href={slot.src}
        download={slot.filename}
        onClick={() => { logEvent(campaign.id, 'interaction', { action: 'download', file: slot.filename }); setGot(true) }}
        className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-transform hover:scale-[1.02]"
        style={{ backgroundColor: accent, color: ink }}
      >
        {got ? <><Check size={16} /> Download again</> : <><FileDown size={16} /> Download the guide</>}
      </a>
    </div>
  )
}

export default function SponsoredContent() {
  const { id } = useParams()
  const campaign = campaignById(id)
  const logged = useRef(false)

  useEffect(() => {
    if (!campaign || logged.current) return
    logged.current = true
    logEvent(campaign.id, 'content-viewed', { template: campaign.template })
  }, [campaign])

  if (!campaign) {
    return (
      <Card>
        <p className="text-sm text-gray-600">That campaign is not running.</p>
        <Link to="/" className="mt-3 inline-block font-bold text-brand-600">Back to home</Link>
      </Card>
    )
  }

  const slot = (type) => campaign.slots.find((s) => s.type === type)
  const text = slot('text')
  const { ink, accent } = campaign.sponsor

  return (
    <div className={BLEED}>
      {/* Hero: the partner's artwork, full width, with the partnership named
          before anything else is read. */}
      <header className="relative overflow-hidden text-white" style={{ backgroundColor: ink }}>
        <img src={campaign.banner.image} alt="" aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-70" />
        <div className="absolute inset-0"
          style={{ background: `linear-gradient(160deg, ${ink}d9 0%, ${ink}f2 70%)` }} />
        <div className="absolute inset-x-0 bottom-0 h-1.5" style={{ backgroundColor: accent }} />

        <div className="relative mx-auto max-w-5xl px-4 pt-6 pb-14 md:px-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition-colors hover:text-white">
            <ArrowLeft size={15} /> Back to Navigate
          </Link>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <span className="rounded-full bg-white/15 px-3.5 py-1.5 text-[11px] font-bold tracking-wide text-white/90 uppercase backdrop-blur">
              {campaign.sponsor.label}
            </span>
            <img src={campaign.sponsor.logoWhite} alt={campaign.sponsor.name} className="h-7 w-auto" />
          </div>

          <h1 className="mt-5 max-w-3xl text-4xl leading-[1.05] font-bold tracking-tight md:text-6xl">
            {text?.heading}
          </h1>
          {text?.standfirst && (
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/80">{text.standfirst}</p>
          )}
        </div>
      </header>

      <div className="bg-white">
        <div className="mx-auto max-w-5xl px-4 py-12 md:px-8">
          {campaign.template === 'video' && <VideoSlot slot={slot('video')} campaign={campaign} />}
          {campaign.template === 'download' && <FileSlot slot={slot('file')} campaign={campaign} />}
          {campaign.template === 'article' && (
            <article className="mx-auto max-w-2xl">
              {slot('body')?.paragraphs.map((p, i) => (
                <p
                  key={p.slice(0, 24)}
                  className={i === 0
                    ? 'text-xl leading-relaxed text-gray-700 first-letter:float-left first-letter:mt-1 first-letter:mr-3 first-letter:text-6xl first-letter:leading-[0.8] first-letter:font-bold'
                    : 'mt-5 text-lg leading-relaxed text-gray-600'}
                  style={i === 0 ? { '--tw-first-letter-color': ink } : undefined}
                >
                  {p}
                </p>
              ))}
            </article>
          )}

          <p className="mt-10 text-center text-xs text-gray-400">
            {TEMPLATES[campaign.template].name} template · campaign {campaign.id}
          </p>
        </div>
      </div>

      {/* Back inside Navigate's voice: what the student is owed about who sees
          what they did here. */}
      <div className="border-t border-gray-200 bg-brand-50 px-4 py-10 md:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="flex gap-3">
            <Info size={20} className="mt-0.5 shrink-0 text-brand-600" />
            <div className="text-sm text-gray-600">
              <p className="font-bold text-gray-700">Why you are seeing this</p>
              <p className="mt-1.5 leading-relaxed">
                {campaign.sponsor.name} works with your college to put this together. Navigate chose
                where it appears — they cannot see who you are, and they never will. They are told how
                many students watched or downloaded something, not which ones.
              </p>
            </div>
          </div>
          <p className="mt-6 text-xs text-gray-400">
            Prototype only. {campaign.sponsor.name} is an invented organisation and this material is
            placeholder content, not advice.
          </p>
        </div>
      </div>
    </div>
  )
}
