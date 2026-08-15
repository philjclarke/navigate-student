import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Signpost, Compass, Info, ChevronRight, ClipboardList, Sparkles } from 'lucide-react'
import { Card, Button } from '../components/ui'
import DirectionWizard from '../components/DirectionWizard'
import DestinationGauge from '../components/DestinationGauge'
import ExploreColumn from '../components/ExploreColumn'
import signpostImg from '../assets/my-future-signpost.png'
import { EXPLORE_SECTIONS, ROUTE_TYPES, orderForGauge } from '../data/pathways'
import {
  student, signals, surveys, suggestedLean, loadDirection, saveDirection,
  overallConfidence, leastKnownRoute, routeState,
} from '../data/student'

/* "What we recommend" is the anti-silo mechanism: in each column it can point
   somewhere else entirely, so a student deep in one route still hears about
   the others. */
function recommendationFor(type, lean) {
  const least = leastKnownRoute()
  const nearest = orderForGauge(
    EXPLORE_SECTIONS.map((s) => ({ type: s.type })), lean,
  )[0].type

  if (type === least && type !== nearest) {
    return `Your gauge sits away from here, but we know least about this route. Worth a look before you rule it out.`
  }
  if (type === 'apprenticeship' && lean > 65) {
    return `You're leaning towards university — but Archaeology has a salaried apprenticeship route that reaches the same jobs without the debt.`
  }
  if (type === 'degree' && lean < 40) {
    return `You're leaning towards work. Some of the careers you've saved do ask for a degree, so it's worth knowing what that route looks like.`
  }
  if (type === nearest) {
    return `This is closest to where you've set your gauge, so we'd start here.`
  }
  /* Every column says something — a column that stays silent is a column the
     student quietly stops considering. */
  return {
    apprenticeship: `Apprenticeships exist in more fields than most people expect, including the ones you've been looking at.`,
    tlevel: `T-Levels include a substantial industry placement, which is worth knowing about even if you're heading elsewhere.`,
    work: `Your saved careers live here — including how to reach them without a degree.`,
    degree: `Not ruled out. Some of the careers you've saved list a degree as the usual route.`,
  }[type]
}

export default function Future() {
  const [direction, setDirection] = useState(loadDirection)
  const [wizardOpen, setWizardOpen] = useState(false)
  const [showSignals, setShowSignals] = useState(false)

  const dataLean = suggestedLean()
  const lean = direction.lean ?? dataLean
  const confidence = overallConfidence()

  const update = (next) => {
    setDirection(next)
    saveDirection(next)
  }

  const ordered = orderForGauge(EXPLORE_SECTIONS, lean)
  const leadType = ordered[0].type

  return (
    <div className="space-y-6">
      {/* Banner + gauge */}
      <div className="rounded-2xl bg-brand-100 p-7">
        <div className="grid items-center gap-6 lg:grid-cols-[3fr_2fr]">
          <div>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="flex items-center gap-1.5 text-sm font-bold text-brand-600">
                  <Signpost size={16} /> Navigate Next
                </p>
                <h1 className="mt-2 text-3xl font-light text-gray-600 md:text-4xl">My Future</h1>
              </div>
              <Button onClick={() => setWizardOpen(true)}>
                <span className="flex items-center gap-2"><Compass size={16} />
                  {direction.baselined ? 'Retake the direction finder' : 'Find my direction'}
                </span>
              </Button>
            </div>
            <p className="mt-3 text-sm text-gray-600">
              Wherever you're heading after college — a job, an apprenticeship, technical study
              or university — this is where you work it out. Move the gauge to explore in any
              direction. It's always your choice.
            </p>

            <Card className="mt-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-bold text-gray-700">Your next destination</p>
                <button
                  onClick={() => setShowSignals(!showSignals)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700"
                >
                  <Info size={13} /> Why do we suggest this?
                </button>
              </div>
              <div className="mt-2">
                <DestinationGauge
                  lean={lean}
                  dataLean={dataLean}
                  confidence={confidence}
                  onChange={(v) => update({ ...direction, lean: v })}
                />
              </div>
              {showSignals && (
                <div className="mt-4 rounded-lg bg-brand-50 p-4">
                  <p className="text-xs font-bold tracking-wide text-gray-500 uppercase">
                    What's shaping our suggestion
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {signals.map((s) => (
                      <li key={s.label} className="flex items-start gap-2 text-sm text-gray-600">
                        <ChevronRight size={14} className="mt-0.5 shrink-0 text-brand-500" />
                        <span>{s.label} <span className="text-xs text-gray-400">({s.source})</span></span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-xs text-gray-500">
                    These signals shape the order things appear in — they never limit what you can explore.
                  </p>
                </div>
              )}
            </Card>
          </div>

          <img
            src={signpostImg}
            alt="Two students at a signpost, considering their direction"
            className="mx-auto hidden max-h-80 w-full max-w-md object-contain lg:block"
          />
        </div>
      </div>

      {/* Confidence strand */}
      <Card className="border border-brand-300">
        <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
          <div>
            <p className="flex items-center gap-1.5 text-sm font-bold text-gray-700">
              <ClipboardList size={15} className="text-brand-500" /> How well do we know you?
            </p>
            <p className="mt-2 text-3xl font-light text-gray-700">{confidence}%</p>
            <p className="mt-1 text-sm text-gray-500">
              We're most sure about {ROUTE_TYPES.degree.short.toLowerCase()} and least sure about{' '}
              {ROUTE_TYPES[leastKnownRoute()].short.toLowerCase()}. Answering a few more questions
              makes every suggestion on this page better.
            </p>
            <div className="mt-3 space-y-1.5">
              {Object.entries(routeState).map(([type, s]) => (
                <div key={type} className="flex items-center gap-2">
                  <span className="w-28 shrink-0 text-xs text-gray-500">{ROUTE_TYPES[type].short}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-200">
                    <div className="h-full rounded-full bg-gray-500" style={{ width: `${s.confidence}%` }} />
                  </div>
                  <span className="w-8 text-right text-xs text-gray-400">{s.confidence}%</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-bold text-gray-700">Surveys and assessments</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {surveys.map((s) => (
                <div key={s.title} className="rounded-xl border border-gray-200 p-3">
                  <p className="text-sm leading-snug font-bold text-gray-700">{s.title}</p>
                  <p className="mt-0.5 text-xs text-gray-500">Improves our view of {s.raises}</p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-200">
                    <div className="h-full rounded-full bg-brand-500" style={{ width: `${s.progress}%` }} />
                  </div>
                  <button className="mt-2 text-xs font-bold text-brand-600 hover:text-brand-700">
                    {s.cta} →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* The four routes */}
      <div>
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-2xl font-light text-gray-600">Where could you go next?</h2>
          <p className="flex items-center gap-1.5 text-xs text-gray-500">
            <Sparkles size={12} className="text-brand-500" />
            Ordered by where your gauge sits — {ROUTE_TYPES[leadType].short.toLowerCase()} first
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {ordered.map((section) => (
            <ExploreColumn
              key={section.key}
              section={section}
              recommendation={recommendationFor(section.type, lean)}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link to="/future/careers-bank">
          <Button variant="secondary">Go to the Careers Bank</Button>
        </Link>
        <div className="rounded-lg bg-purple-50 px-4 py-2.5 text-sm">
          <span className="text-gray-500">Your declared destination:</span>{' '}
          <strong className="text-purple-700">{student.destination.pathway}</strong>
          <span className="text-purple-600"> · {student.destination.focus}</span>
        </div>
      </div>

      <DirectionWizard open={wizardOpen} onClose={() => setWizardOpen(false)} onComplete={update} />
    </div>
  )
}
