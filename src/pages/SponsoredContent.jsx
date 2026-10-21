import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, FileDown, Info, Check } from 'lucide-react'
import { Card } from '../components/ui'
import { campaignById, logEvent, TEMPLATES } from '../data/sponsored'

/* The content page runs on the partner's colours, not Navigate's, but it keeps
   Navigate's furniture: the page margins and rounded panels that every other
   screen uses. Nothing here runs edge to edge. Each slot is typed and the
   template fixes the order, so this renders what the campaign declares rather
   than a bespoke layout per sponsor. Every interactive slot reports its own
   engagement. */

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
    <figure>
      <div className="overflow-hidden rounded-xl shadow-2xl ring-1 ring-white/15">
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
      <figcaption className="mt-3 text-sm text-white/60">{slot.title} · {slot.length}</figcaption>
    </figure>
  )
}

function FileSlot({ slot, campaign }) {
  const [got, setGot] = useState(false)
  const { ink, accent } = campaign.sponsor
  return (
    <div className="flex flex-wrap items-center justify-between gap-6 rounded-xl bg-white/10 p-7 ring-1 ring-white/15">
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
    <div className="space-y-6">
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-brand-600 hover:text-brand-700">
        <ArrowLeft size={15} /> Back to home
      </Link>

      {/* One panel, not two: the resource sits beside the pitch rather than
          adrift beneath it, and takes the larger share of the row. Stacks on
          anything narrower than a laptop. */}
      <section className="relative overflow-hidden rounded-2xl text-white" style={{ backgroundColor: ink }}>
        <img src={campaign.banner.image} alt="" aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-70" />
        <div className="absolute inset-0"
          style={{ background: `linear-gradient(160deg, ${ink}d9 0%, ${ink}f2 70%)` }} />
        <div className="absolute inset-x-0 bottom-0 h-1.5" style={{ backgroundColor: accent }} />

        <div className="relative grid gap-8 p-6 md:p-8 lg:grid-cols-[2fr_3.4fr] lg:items-center lg:gap-10 lg:p-10">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-white/15 px-3.5 py-1.5 text-[11px] font-bold tracking-wide text-white/90 uppercase backdrop-blur">
                {campaign.sponsor.label}
              </span>
              <img src={campaign.sponsor.logoWhite} alt={campaign.sponsor.name} className="h-6 w-auto" />
            </div>

            <h1 className="mt-5 text-4xl leading-[1.05] font-bold tracking-tight">{text?.heading}</h1>
            {text?.standfirst && (
              <p className="mt-4 text-lg leading-relaxed text-white/80">{text.standfirst}</p>
            )}
          </div>

          <div>
            {campaign.template === 'video' && <VideoSlot slot={slot('video')} campaign={campaign} />}
            {campaign.template === 'download' && <FileSlot slot={slot('file')} campaign={campaign} />}
            {campaign.template === 'article' && (
              <article className="rounded-xl bg-white p-6 ring-1 ring-white/15 md:p-8">
                {slot('body')?.paragraphs.map((p, i) => (
                  <p key={p.slice(0, 24)}
                    className={i === 0
                      ? 'text-lg leading-relaxed text-gray-700'
                      : 'mt-4 leading-relaxed text-gray-600'}>
                    {p}
                  </p>
                ))}
              </article>
            )}
          </div>
        </div>

        <p className="relative px-6 pb-5 text-xs text-white/40 md:px-8 lg:px-10">
          {TEMPLATES[campaign.template].name} template · campaign {campaign.id}
        </p>
      </section>

      {/* Navigate's voice again: what the student is owed about who sees what
          they did here. The one block that should not look like the sponsor. */}
      <Card className="bg-brand-50">
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
        <p className="mt-5 text-xs text-gray-400">
          Prototype only. {campaign.sponsor.name} is an invented organisation and this material is
          placeholder content, not advice.
        </p>
      </Card>
    </div>
  )
}
