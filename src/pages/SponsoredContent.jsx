import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, FileDown, Info } from 'lucide-react'
import { Card, Button } from '../components/ui'
import { campaignById, logEvent, TEMPLATES } from '../data/sponsored'

/* The content page. Each slot is typed and the template fixes the order, so
   this renders what the campaign declares rather than a bespoke layout per
   sponsor. Every interactive slot reports its own engagement. */

function VideoSlot({ slot, campaignId }) {
  const ref = useRef(null)
  const hit = useRef(new Set())

  /* Local hosting is what makes this honest: with a third party embed we could
     log "pressed play" and nothing else. */
  const mark = (action, detail = {}) => {
    if (hit.current.has(action)) return
    hit.current.add(action)
    logEvent(campaignId, 'interaction', { action, ...detail })
  }

  const onTime = () => {
    const v = ref.current
    if (!v || !v.duration) return
    const pct = (v.currentTime / v.duration) * 100
    for (const m of [25, 50, 75]) if (pct >= m) mark(`video-${m}`)
  }

  return (
    <figure className="mt-5">
      <video
        ref={ref}
        src={slot.src}
        poster={slot.poster}
        controls
        playsInline
        preload="metadata"
        className="w-full rounded-xl bg-black"
        onPlay={() => logEvent(campaignId, 'interaction', { action: 'video-play' })}
        onPause={() => logEvent(campaignId, 'interaction', { action: 'video-pause' })}
        onTimeUpdate={onTime}
        onEnded={() => mark('video-complete')}
      />
      <figcaption className="mt-2 text-xs text-gray-400">{slot.title} · {slot.length}</figcaption>
    </figure>
  )
}

function FileSlot({ slot, campaignId }) {
  const [got, setGot] = useState(false)
  return (
    <Card className="mt-5 flex flex-wrap items-center justify-between gap-4 border border-gray-300">
      <div>
        <p className="font-bold text-gray-700">{slot.title}</p>
        <p className="mt-0.5 text-sm text-gray-500">{slot.format} · {slot.size}</p>
      </div>
      <a
        href={slot.src}
        download={slot.filename}
        onClick={() => { logEvent(campaignId, 'interaction', { action: 'download', file: slot.filename }); setGot(true) }}
      >
        <Button>
          <span className="flex items-center gap-2"><FileDown size={15} /> {got ? 'Download again' : 'Download'}</span>
        </Button>
      </a>
    </Card>
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
        <Link to="/" className="mt-3 inline-block"><Button>Back to home</Button></Link>
      </Card>
    )
  }

  const slot = (type) => campaign.slots.find((s) => s.type === type)
  const text = slot('text')

  return (
    <div className="space-y-6">
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-brand-600 hover:text-brand-700">
        <ArrowLeft size={15} /> Back to home
      </Link>

      <Card className="border border-gray-300">
        {/* Logo slot. The partnership is named in words as well, so it does not
            depend on recognising a brand mark. */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-4">
          <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
            {campaign.sponsor.label}
          </p>
          <img src={slot('logo')?.src} alt={campaign.sponsor.name} className="h-8 w-auto" />
        </div>

        <h1 className="mt-5 text-3xl font-light text-gray-600 md:text-4xl">{text?.heading}</h1>
        {text?.standfirst && <p className="mt-3 max-w-2xl text-gray-500">{text.standfirst}</p>}

        {campaign.template === 'video' && <VideoSlot slot={slot('video')} campaignId={campaign.id} />}
        {campaign.template === 'download' && <FileSlot slot={slot('file')} campaignId={campaign.id} />}
        {campaign.template === 'article' && (
          <div className="mt-5 max-w-2xl space-y-4">
            {slot('body')?.paragraphs.map((p) => (
              <p key={p.slice(0, 24)} className="text-gray-600">{p}</p>
            ))}
          </div>
        )}

        <p className="mt-6 text-xs text-gray-400">
          {TEMPLATES[campaign.template].name} template · campaign {campaign.id}
        </p>
      </Card>

      {/* What the student is owed: who sees what they did here. */}
      <Card className="flex gap-3 bg-brand-50">
        <Info size={18} className="mt-0.5 shrink-0 text-brand-600" />
        <div className="text-sm text-gray-600">
          <p className="font-bold text-gray-700">Why you are seeing this</p>
          <p className="mt-1">
            {campaign.sponsor.name} works with your college to put this together. Navigate chose
            where it appears — they cannot see who you are, and they never will. They are told how
            many students watched or downloaded something, not which ones.
          </p>
        </div>
      </Card>

      <p className="text-xs text-gray-400">
        Prototype only. {campaign.sponsor.name} is an invented organisation and this material is
        placeholder content, not advice.
      </p>
    </div>
  )
}
