import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight, Sparkles, MapPin, CalendarDays, Check, X, Info,
  GraduationCap, Building, Clock, Bookmark,
} from 'lucide-react'
import { Card, Button, Pill, Ring, Bar, Rail, Toast } from '../components/kit'
import {
  load, save, confidence, unanswered, coreComplete, readiness, toPrefs, isAnswered,
} from '../profile'
import { findCourses, courseKey } from '../../data/universities'
import rocket from '../../assets/nav-rocket.png'

/* The feed is composed, not fixed. What appears depends on how much we know:
   little, and it fills with things that teach and ask; more, and it fills with
   matches, tasks and opportunities. */
export default function Feed() {
  const nav = useNavigate()
  const [p, setP] = useState(load)
  const [toast, setToast] = useState(null)
  const say = (m) => { setToast(m); setTimeout(() => setToast(null), 2200) }

  const conf = confidence(p)
  const r = readiness(p)
  const prefs = useMemo(() => toPrefs(p), [p])
  const matches = useMemo(() => (coreComplete(p) || isAnswered(p, 'subjects') ? findCourses(prefs) : []), [prefs, p])
  const open = unanswered(p).filter((q) => !q.core)
  const nextStep = r.steps.find((s) => !s.done)

  const update = (fn) => { const n = fn({ ...p }); setP(n); save(n) }
  const answer = (id, v) => { update((n) => ({ ...n, answers: { ...n.answers, [id]: v } })); say('Thanks, that helps') }
  const toggleSave = (k) => update((n) => ({
    ...n, shortlist: n.shortlist.includes(k) ? n.shortlist.filter((x) => x !== k) : [...n.shortlist, k],
  }))
  const dismiss = (id) => update((n) => ({ ...n, dismissed: [...n.dismissed, id] }))
  const shown = (id) => !p.dismissed.includes(id)

  /* Brand new: the whole screen is an invitation, not a dashboard. */
  if (conf === 0) {
    return (
      <div className="pb-10">
        <div className="relative h-[186px] overflow-hidden bg-gradient-to-br from-violet-200 via-violet-100 to-sky-100">
          <div className="absolute -top-12 -left-10 h-44 w-44 rounded-full bg-white/50 blur-2xl" />
          <div className="absolute -right-8 -bottom-12 h-40 w-40 rounded-full bg-sky-200/60 blur-2xl" />
          <span className="absolute top-5 left-5 rounded-full bg-white/70 px-3 py-1 text-[11px] font-bold tracking-wide text-violet-700 uppercase">
            Universities
          </span>
          <img
            src={rocket}
            alt="A student riding a rocket"
            className="absolute bottom-0 left-[54%] h-[182px] w-auto max-w-none -translate-x-1/2 drop-shadow-xl"
          />
        </div>
        <div className="px-5 pt-7">
        <h1 className="text-[32px] leading-[1.1] font-bold tracking-tight text-slate-900">
          Let's work out what happens after college.
        </h1>
        <p className="mt-4 text-[16px] leading-relaxed text-slate-600">
          Four quick questions, about two minutes. We'll explain things as we go,
          and you can change your answers whenever you like.
        </p>
        <div className="mt-6 space-y-3">
          {[
            ['See courses that actually fit you', 'Matched on where you would go, what you can afford and what you want to study'],
            ['Know what to do next', 'One step at a time, at your own pace'],
            ['Change your mind as often as you like', 'Nothing here is final, and nothing is shared until you want it to be'],
          ].map(([t, s]) => (
            <div key={t} className="flex gap-3">
              <Check size={18} className="mt-0.5 shrink-0 text-emerald-600" strokeWidth={3} />
              <div>
                <p className="text-[15px] font-bold text-slate-900">{t}</p>
                <p className="text-[13px] text-slate-500">{s}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Button onClick={() => nav('/next/start')}>Start <ArrowRight size={17} /></Button>
          <Link to="/next/explore" className="mt-3 block text-center text-[14px] font-semibold text-slate-500">
            Or just have a look around
          </Link>
        </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-4">
      <Toast msg={toast} />

      <header className="relative mb-4 min-h-[136px] overflow-hidden bg-gradient-to-br from-violet-200 via-violet-100 to-sky-100 px-5 pt-5 pb-6">
        <div className="absolute -top-10 -left-8 h-36 w-36 rounded-full bg-white/50 blur-2xl" />
        <img
          src={rocket}
          alt=""
          aria-hidden="true"
          className="absolute right-0 bottom-0 h-[122px] w-auto max-w-none"
        />
        <div className="relative pr-[108px]">
          <p className="text-[13px] font-semibold text-violet-700">Afternoon, Jason</p>
          <h1 className="mt-0.5 text-[24px] leading-tight font-bold tracking-tight text-slate-900">
            {nextStep ? nextStep.label : 'You are in good shape'}
          </h1>
        </div>
      </header>

      <div className="space-y-3 px-5">

        {/* Pinned: readiness, always steps and never odds */}
        <Card className="!p-4">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <Ring done={r.done} total={r.total} />
              <span className="absolute inset-0 flex items-center justify-center text-[15px] font-bold text-slate-900">{r.done}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-bold text-slate-900">{r.done} of {r.total} steps done</p>
              <p className="mt-0.5 text-[13px] leading-snug text-slate-500">
                Things you've done so far. There's no score and no pass mark.
              </p>
            </div>
            <Link to="/next/me" className="shrink-0 text-violet-600"><ArrowRight size={20} /></Link>
          </div>
        </Card>

        {/* Finish onboarding if core is incomplete */}
        {!coreComplete(p) && (
          <Card className="border-violet-200 bg-violet-50 !p-4">
            <p className="text-[15px] font-bold text-slate-900">Finish setting up</p>
            <p className="mt-1 text-[13px] text-slate-600">
              A couple more answers and we can be a lot more useful.
            </p>
            <Button onClick={() => nav('/next/start')} className="mt-3 !min-h-[44px]">Pick up where you left off</Button>
          </Card>
        )}

        {/* A question, inline. This is how confidence climbs. */}
        {open.length > 0 && shown(`q-${open[0].id}`) && (
          <Card className="!p-5">
            <div className="flex items-start justify-between gap-2">
              <Pill tone="violet">Quick question</Pill>
              <button onClick={() => dismiss(`q-${open[0].id}`)} className="-mt-1 -mr-1 p-1 text-slate-300" aria-label="Not now">
                <X size={16} />
              </button>
            </div>
            <div className="mt-3 flex gap-2.5 rounded-2xl bg-slate-50 p-3.5">
              <Info size={16} className="mt-0.5 shrink-0 text-slate-500" />
              <p className="text-[13px] leading-snug text-slate-600">{open[0].teach}</p>
            </div>
            <p className="mt-3.5 text-[17px] leading-snug font-bold text-slate-900">{open[0].question}</p>
            <div className="mt-3 space-y-2">
              {(open[0].options || []).map((o) => (
                <button
                  key={o.v}
                  onClick={() => answer(open[0].id, o.v)}
                  className="min-h-[48px] w-full rounded-2xl border-2 border-slate-200 px-4 text-left text-[15px] font-semibold text-slate-800 active:bg-slate-50"
                >
                  {o.label}
                </button>
              ))}
            </div>
          </Card>
        )}

        {/* Matches */}
        {matches.length > 0 && (
          <div className="pt-2">
            <div className="mb-2.5 flex items-end justify-between">
              <div>
                <h2 className="text-[19px] font-bold tracking-tight text-slate-900">Courses that fit you</h2>
                <p className="text-[13px] text-slate-500">{matches.length} found, closest first</p>
              </div>
              <Link to="/next/explore" className="pb-0.5 text-[13px] font-bold text-violet-600">See all</Link>
            </div>
            <Rail>
              {matches.slice(0, 6).map((c) => {
                const k = courseKey(c)
                const on = p.shortlist.includes(k)
                return (
                  <div key={k} className="w-[268px] shrink-0 snap-start rounded-3xl border border-slate-200 bg-white p-4">
                    <div className="mb-3 h-20 rounded-2xl bg-gradient-to-br from-violet-200 via-slate-100 to-sky-200" />
                    <p className="text-[12px] font-bold text-violet-700">{c.University}</p>
                    <p className="mt-0.5 line-clamp-2 text-[16px] leading-snug font-bold text-slate-900">{c.CourseName}</p>
                    <p className="mt-1.5 flex items-center gap-1 text-[12px] text-slate-500">
                      <MapPin size={11} /> {c.inst?.location?.city || 'UK'}
                      {c.miles != null && ` · ${c.miles} mi`}
                    </p>
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      <Pill>{c.GradesOffer?.replace(/\.$/, '') || c.PointsOfferBand}</Pill>
                      {c.reach === 'reach' && <Pill tone="violet">Within reach</Pill>}
                      {c.reach === 'safe' && <Pill tone="green">Comfortable</Pill>}
                      {c.reach === 'stretch' && <Pill tone="amber">A stretch</Pill>}
                    </div>
                    <button
                      onClick={() => toggleSave(k)}
                      className={`mt-3 flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-2xl text-[14px] font-bold ${
                        on ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <Bookmark size={15} fill={on ? 'currentColor' : 'none'} /> {on ? 'Saved' : 'Save'}
                    </button>
                  </div>
                )
              })}
            </Rail>
          </div>
        )}

        {/* The next task, made concrete */}
        {nextStep && shown(`t-${nextStep.id}`) && (
          <Card className="!p-5">
            <Pill tone="sky">Next step</Pill>
            <p className="mt-3 text-[17px] leading-snug font-bold text-slate-900">{nextStep.label}</p>
            <p className="mt-1.5 text-[14px] leading-snug text-slate-600">
              {{
                subjects: 'Pick the subject areas you are drawn to and everything else starts working.',
                life: 'Tell us how far you would go and how the money feels.',
                grades: 'Add your predicted grades so we can tag what is within reach.',
                shortlist: "Most people apply to five. Save anything you are curious about.",
                research: "Pick one and have a proper look at the modules, how it is assessed and the place itself.",
                openday: 'Nothing tells you more in an afternoon. They do fill up, so worth booking early.',
                statement: 'One statement covers all five of your choices, and your tutor will help you with it.',
                reference: 'Worth asking early, as tutors write a lot of these in December.',
              }[nextStep.id]}
            </p>
            <Button
              variant="dark"
              className="mt-4 !min-h-[44px]"
              onClick={() => {
                if (['subjects', 'life', 'grades'].includes(nextStep.id)) return nav('/next/start')
                if (nextStep.id === 'shortlist') return nav('/next/explore')
                update((n) => ({ ...n, done: { ...n.done, [nextStep.id]: true } })); say('Marked as done')
              }}
            >
              {['subjects', 'life', 'grades'].includes(nextStep.id) ? 'Answer now'
                : nextStep.id === 'shortlist' ? 'Find courses' : 'Mark as done'}
            </Button>
          </Card>
        )}

        {/* Opportunity, clearly labelled as paid for */}
        {shown('opp-openday') && (
          <Card className="!p-0 overflow-hidden">
            <div className="h-24 bg-gradient-to-br from-amber-200 via-rose-100 to-violet-200" />
            <div className="p-5">
              <div className="flex items-center justify-between">
                <Pill tone="amber">Near you</Pill>
                <span className="text-[11px] font-bold text-slate-400">Partner</span>
              </div>
              <p className="mt-2.5 text-[17px] leading-snug font-bold text-slate-900">Autumn Open Day</p>
              <p className="text-[13px] text-slate-500">University of Kent · Canterbury · 16 miles</p>
              <p className="mt-2 flex items-center gap-1.5 text-[13px] text-slate-600">
                <CalendarDays size={14} /> Saturday 17 October
              </p>
              <Button
                variant="secondary"
                className="mt-4 !min-h-[44px]"
                onClick={() => { update((n) => ({ ...n, done: { ...n.done, openday: true } })); say('Added to your timeline') }}
              >
                Book a place
              </Button>
            </div>
          </Card>
        )}

        {/* Anti silo: the other routes get to interrupt */}
        {shown('nudge-appr') && (
          <Card className="border-amber-200 bg-amber-50 !p-5">
            <div className="flex items-start justify-between gap-2">
              <Pill tone="amber">Worth knowing</Pill>
              <button onClick={() => dismiss('nudge-appr')} className="-mt-1 -mr-1 p-1 text-amber-400" aria-label="Dismiss">
                <X size={16} />
              </button>
            </div>
            <p className="mt-3 text-[17px] leading-snug font-bold text-slate-900">
              You could reach the same jobs without the debt
            </p>
            <p className="mt-1.5 text-[14px] leading-snug text-slate-700">
              Archaeology has a salaried apprenticeship route. Six years instead of five,
              paid the whole way, no tuition fees. Might be worth a look.
            </p>
            <Button variant="secondary" className="mt-4 !min-h-[44px]" onClick={() => say('Would open the apprenticeship route')}>
              <Building size={16} /> Compare the routes
            </Button>
          </Card>
        )}

        {/* Confidence, stated plainly */}
        <Card className="!p-4">
          <div className="flex items-center justify-between">
            <p className="text-[14px] font-bold text-slate-900">How well we know you</p>
            <span className="text-[14px] font-bold text-violet-700">{conf}%</span>
          </div>
          <div className="mt-2.5"><Bar pct={conf} /></div>
          <p className="mt-2 text-[12px] leading-snug text-slate-500">
            {conf < 50
              ? 'The more you tell us, the better this gets at finding things for you.'
              : 'Enough to be useful. The odd question here and there keeps it sharp.'}
          </p>
        </Card>

        {/* Deadline */}
        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-rose-100">
              <Clock size={18} className="text-rose-600" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-bold text-slate-900">UCAS deadline</p>
              <p className="text-[13px] text-slate-500">29 January. Earlier is better.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
