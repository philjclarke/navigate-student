import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, FileDown, Info, Check, Play, RotateCcw, CheckCircle2 } from 'lucide-react'
import { Card } from '../components/ui'
import { campaignById, logEvent, TEMPLATES, watched, markWatch, PROGRAMME } from '../data/sponsored'

/* The content page runs on the partner's colours, not Navigate's, but it keeps
   Navigate's furniture: the page margins and rounded panels that every other
   screen uses. Nothing here runs edge to edge. Each slot is typed and the
   template fixes the order, so this renders what the campaign declares rather
   than a bespoke layout per sponsor. Every interactive slot reports its own
   engagement. */

/* The stage. A poster that becomes a player on click — the same mechanism we
   would need for a YouTube or Vimeo facade, so the interaction does not change
   if hosting ever moves. What changes is how much we can see: hosted here, we
   get play, quarters and completion; embedded elsewhere, the click is all. */
function VideoStage({ video, campaign, playing, onPlay }) {
  const ref = useRef(null)
  const hit = useRef(new Set())

  useEffect(() => { hit.current = new Set() }, [video.id])

  const mark = (action, extra = {}) => {
    if (hit.current.has(action)) return
    hit.current.add(action)
    logEvent(campaign.id, 'interaction', { action, video: video.id, title: video.title, ...extra })
  }

  const onTime = () => {
    const v = ref.current
    if (!v || !v.duration) return
    const pct = (v.currentTime / v.duration) * 100
    for (const m of [25, 50, 75]) if (pct >= m) mark(`video-${m}`)
    markWatch(campaign.id, video.id, { pct })
  }

  if (!playing) {
    return (
      <button
        onClick={onPlay}
        className="group relative block w-full overflow-hidden rounded-xl shadow-2xl ring-1 ring-white/15"
        aria-label={`Play ${video.title}`}
      >
        <img src={video.poster} alt="" className="aspect-video w-full object-cover" />
        <span className="absolute inset-0 flex items-center justify-center bg-black/25 transition-colors group-hover:bg-black/15">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 shadow-lg transition-transform group-hover:scale-105">
            <Play size={26} className="ml-1 text-gray-800" fill="currentColor" />
          </span>
        </span>
        <span className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent px-4 py-3 text-left">
          <span className="block text-base font-bold text-white">{video.title}</span>
          <span className="block text-xs text-white/70">{video.length}</span>
        </span>
      </button>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl shadow-2xl ring-1 ring-white/15">
      <video
        ref={ref}
        key={video.id}
        src={video.src}
        poster={video.poster}
        controls
        autoPlay
        playsInline
        preload="metadata"
        className="block aspect-video w-full bg-black"
        onPlay={() => logEvent(campaign.id, 'interaction', { action: 'video-play', video: video.id, title: video.title })}
        onPause={() => logEvent(campaign.id, 'interaction', { action: 'video-pause', video: video.id })}
        onTimeUpdate={onTime}
        onEnded={() => {
          mark('video-complete')
          markWatch(campaign.id, video.id, { pct: 100, complete: true })
        }}
      />
    </div>
  )
}

/* One tab per film, sitting directly under the stage. Discreet on purpose:
   the student is choosing a chapter, not browsing a catalogue. Each still
   carries where they got to, which is the beginning of the gamification —
   a record of what they have done, which is the only kind of progress this
   product uses anywhere else. */
function FilmTab({ video, campaign, index, active, onPick }) {
  const state = watched(campaign.id)[video.id]
  const done = state?.complete
  const partway = !done && state?.pct > 5
  const { accent } = campaign.sponsor

  return (
    <button
      onClick={onPick}
      aria-current={active}
      className={`relative overflow-hidden rounded-lg px-3 py-2.5 text-left transition-colors ${
        active ? 'bg-white/15' : 'bg-white/5 hover:bg-white/10'
      }`}
    >
      <span className="absolute inset-x-0 top-0 h-0.5" style={{ backgroundColor: active ? accent : 'transparent' }} />
      <span className="flex items-center gap-1.5">
        <span className="text-[11px] font-bold text-white/40">{index + 1}</span>
        {done && <CheckCircle2 size={12} className="text-emerald-400" />}
        {partway && <Play size={10} className="text-white/50" fill="currentColor" />}
      </span>
      <span className="mt-0.5 block truncate text-[13px] font-bold text-white">{video.title}</span>
      <span className="block truncate text-[11px] text-white/50">
        {done
          ? `Watched ${new Date(state.last).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`
          : partway ? `${state.pct}% in` : video.length}
      </span>
      {partway && (
        <span className="absolute inset-x-0 bottom-0 h-0.5 bg-white/15">
          <span className="block h-full" style={{ width: `${state.pct}%`, backgroundColor: accent }} />
        </span>
      )}
    </button>
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
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(false)
  const stage = useRef(null)

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
  const slots = (type) => campaign.slots.filter((s) => s.type === type)
  const text = slot('text')
  const films = slots('video')
  const { ink, accent } = campaign.sponsor

  const seen = films.filter((v) => watched(campaign.id)[v.id]?.complete).length
  const play = (i) => {
    setActive(i)
    setPlaying(true)
    logEvent(campaign.id, 'interaction', { action: 'video-selected', video: films[i].id })
    /* The stage is above the choosers, so picking from down here would start a
       film the student cannot see. */
    stage.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

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

        <div className="relative grid gap-8 p-6 md:p-8 lg:grid-cols-[2fr_3.4fr] lg:items-start lg:gap-10 lg:p-10">
          {/* The programme first, then who paid for it, then the words. All in
              this column, so the stage keeps the full height of the panel. */}
          <div>
            <p className="text-2xl font-bold tracking-tight" style={{ color: accent }}>
              {PROGRAMME.hashtag}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-white/15 px-3 py-1.5 text-[10px] font-bold tracking-wide text-white/90 uppercase backdrop-blur">
                {campaign.sponsor.label}
              </span>
              <img src={campaign.sponsor.logoWhite} alt={campaign.sponsor.name} className="h-5 w-auto" />
            </div>

            <h1 className="mt-5 text-4xl leading-[1.05] font-bold tracking-tight">{text?.heading}</h1>
            {text?.standfirst && (
              <p className="mt-4 text-lg leading-relaxed text-white/80">{text.standfirst}</p>
            )}
            {text?.reason && (
              <div className="mt-5 border-l-2 pl-4" style={{ borderColor: accent }}>
                <p className="text-[11px] font-bold tracking-wide text-white/60 uppercase">Why watch this</p>
                <p className="mt-1.5 text-sm leading-relaxed text-white/75">{text.reason}</p>
              </div>
            )}
            {films.length > 1 && (
              <p className="mt-5 text-sm font-semibold text-white/70">
                {seen === films.length
                  ? `All ${films.length} watched`
                  : `${seen} of ${films.length} watched`}
              </p>
            )}
          </div>

          <div ref={stage} className="scroll-mt-6">
            {campaign.template === 'video' && (
              <>
                <VideoStage
                  video={films[active]} campaign={campaign}
                  playing={playing} onPlay={() => play(active)}
                />
                {films.length > 1 && (
                  <div className="mt-2.5 grid gap-2 sm:grid-cols-3">
                    {films.map((v, i) => (
                      <FilmTab key={v.id} video={v} campaign={campaign} index={i}
                        active={i === active} onPick={() => play(i)} />
                    ))}
                  </div>
                )}
              </>
            )}
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
