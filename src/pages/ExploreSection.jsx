import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ChevronLeft, Sparkles, PlayCircle, ClipboardCheck, Search, Bot, Bookmark,
  Building, Hammer, Wrench, GraduationCap, Check, Send,
} from 'lucide-react'
import { Card, Button, ImagePlaceholder } from '../components/ui'
import { sectionByKey, ROUTE_TYPES } from '../data/pathways'
import { routeState, loadDirection, suggestedLean } from '../data/student'
import { allSubjects, titleCase, subjectSlug, subjectReach } from '../data/heap'
import { careers } from '../data/careers'

const ICON = { apprenticeship: Building, tlevel: Hammer, work: Wrench, degree: GraduationCap }

const STYLE = {
  amber: { ring: 'border-amber-300', head: 'text-amber-600', icon: 'bg-amber-500/15 text-amber-500', bar: 'bg-amber-500', soft: 'bg-amber-500/10', banner: 'bg-amber-500/10' },
  sky: { ring: 'border-sky-300', head: 'text-sky-700', icon: 'bg-sky-100 text-sky-600', bar: 'bg-sky-500', soft: 'bg-sky-50', banner: 'bg-sky-50' },
  teal: { ring: 'border-brand-300', head: 'text-brand-700', icon: 'bg-brand-100 text-brand-600', bar: 'bg-brand-500', soft: 'bg-brand-50', banner: 'bg-brand-100' },
  purple: { ring: 'border-purple-300', head: 'text-purple-700', icon: 'bg-purple-100 text-purple-600', bar: 'bg-purple-500', soft: 'bg-purple-50', banner: 'bg-purple-50' },
}

/* Section-specific content. In production this is authored per route. */
const CONTENT = {
  apprenticeships: {
    what: 'What are apprenticeships?',
    clips: ['Meet Sana, 19 — degree apprentice', 'What a week actually looks like', 'The money, honestly'],
    prep: ['Write a CV that works for employers', 'Practise a competency interview', 'Find three employers near you'],
    searchLabel: 'Search apprenticeships',
    searchHint: 'By role, employer or sector',
  },
  training: {
    what: 'What are T-Levels and other training options?',
    clips: ['T-Levels explained in 90 seconds', 'Meet Callum, on a construction T-Level', 'Placement year: what to expect'],
    prep: ['Check what your college offers', 'Talk to someone doing one', 'Understand how the placement works'],
    searchLabel: 'Search training courses',
    searchHint: 'By subject or provider',
  },
  jobs: {
    what: 'What\'s important to know about going to work full time?',
    clips: ['Your first payslip, explained', 'Meet Aisha, 18 — trainee arborist', 'Your rights at work'],
    prep: ['Build your Digital CV', 'Practise an interview', 'Register with local employers'],
    searchLabel: 'Search jobs and careers',
    searchHint: 'By job title or sector',
  },
  university: {
    what: 'What is university?',
    clips: ['Student finance without the jargon', 'Meet Priya, first year Archaeology', 'What a lecture is actually like'],
    prep: ['Draft your personal statement', 'Check entry requirements for your subject', 'Visit an open day'],
    searchLabel: 'Search courses',
    searchHint: 'By subject, university or entry grades',
  },
}

function AgentNote({ children }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-gray-200 bg-gray-50 p-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-700 text-white">
        <Bot size={14} />
      </span>
      <p className="text-xs leading-snug text-gray-600">{children}</p>
    </div>
  )
}

export default function ExploreSection() {
  const { key } = useParams()
  const section = sectionByKey(key)
  const [query, setQuery] = useState('')

  if (!section) {
    return (
      <div className="py-20 text-center text-gray-500">
        Section not found. <Link to="/future" className="font-semibold text-brand-600">Back to My Future</Link>
      </div>
    )
  }

  const meta = ROUTE_TYPES[section.type]
  const style = STYLE[meta.accent]
  const Icon = ICON[section.type]
  const state = routeState[section.type]
  const content = CONTENT[key]
  const lean = loadDirection().lean ?? suggestedLean()
  const pct = Math.round((state.readiness.done / state.readiness.total) * 100)

  /* Search results differ per section — university searches HEAP subjects,
     jobs searches the careers bank. */
  const results = key === 'university'
    ? allSubjects
        .filter((s) => s.Subject.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 6)
        .map((s) => {
          const reach = subjectReach(s.Subject)
          return {
            title: titleCase(s.Subject),
            meta: reach.courses ? `${reach.courses} courses · ${reach.institutions} institutions` : 'Subject area',
            to: `/future/subject/${subjectSlug(s.Subject)}`,
          }
        })
    : careers
        .filter((c) => c.title.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 6)
        .map((c) => ({ title: c.title, meta: c.stats.salary, to: `/future/career/${c.slug}` }))

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className={`rounded-2xl p-7 ${style.banner}`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className={`flex items-center gap-1.5 text-sm font-bold ${style.head}`}>
              <Icon size={16} /> My Future · {meta.short}
            </p>
            <h1 className="mt-2 text-3xl font-light text-gray-600 md:text-4xl">{section.title}</h1>
            <p className="mt-2 max-w-xl text-sm text-gray-600">{section.blurb}</p>
          </div>
          <Link to="/future">
            <Button variant="secondary"><span className="flex items-center gap-1"><ChevronLeft size={15} /> Back</span></Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {/* What is it — human, not dry */}
          <section>
            <h2 className="text-xl font-light text-gray-600">{content.what}</h2>
            <p className="mt-1 text-sm text-gray-500">
              Short clips from people a year or two ahead of you. Captions on everything.
            </p>
            <div className="mt-3 grid gap-4 sm:grid-cols-3">
              {content.clips.map((c) => (
                <Card key={c} className="!p-0 overflow-hidden">
                  <div className="relative">
                    <ImagePlaceholder className="h-28 w-full !rounded-none" />
                    <span className="absolute inset-0 flex items-center justify-center text-white/90">
                      <PlayCircle size={30} />
                    </span>
                  </div>
                  <p className="p-3 text-sm leading-snug font-semibold text-gray-700">{c}</p>
                </Card>
              ))}
            </div>
          </section>

          {/* Preparing — raises readiness */}
          <section>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-xl font-light text-gray-600">Preparing for {meta.short.toLowerCase()}</h2>
              <p className="text-xs text-gray-500">Each one adds an activity to your timeline</p>
            </div>
            <div className="mt-3 space-y-2">
              {content.prep.map((p, i) => (
                <div key={p} className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3">
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                    i < state.readiness.done ? style.bar : 'bg-gray-300'
                  }`}>
                    {i < state.readiness.done ? <Check size={14} /> : i + 1}
                  </span>
                  <p className="flex-1 text-sm font-semibold text-gray-700">{p}</p>
                  <Button small variant={i < state.readiness.done ? 'secondary' : 'primary'}>
                    {i < state.readiness.done ? 'Done' : 'Start'}
                  </Button>
                </div>
              ))}
            </div>
          </section>

          {/* Search — with the agent alongside, not before */}
          <section>
            <h2 className="text-xl font-light text-gray-600">{content.searchLabel}</h2>
            <div className="mt-3 grid gap-4 lg:grid-cols-[1fr_260px]">
              <div>
                <div className="flex gap-2">
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={content.searchHint}
                    className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-500"
                  />
                  <Button><span className="flex items-center gap-1.5"><Search size={15} /> Search</span></Button>
                </div>
                <div className="mt-3 space-y-2">
                  {results.map((r) => (
                    <div key={r.title} className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3">
                      <div className="flex-1">
                        <Link to={r.to} className="text-sm font-bold text-gray-700 hover:text-brand-600">{r.title}</Link>
                        <p className="text-xs text-gray-500">{r.meta}</p>
                      </div>
                      <button className="text-gray-400 hover:text-brand-600" aria-label="Bookmark">
                        <Bookmark size={16} />
                      </button>
                      <Button small variant="secondary">Apply</Button>
                    </div>
                  ))}
                  {results.length === 0 && (
                    <p className="text-sm text-gray-500">Nothing matches "{query}".</p>
                  )}
                </div>
              </div>

              {/* The agent only becomes conversational here */}
              <Card className="flex flex-col border border-gray-200">
                <p className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  <Bot size={15} /> Ask about {meta.short.toLowerCase()}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  I can explain how things work and help you search. I won't tell you which
                  route to choose — that's yours, and your tutor's.
                </p>
                <div className="mt-3 flex-1 space-y-2 text-xs">
                  <p className="rounded-lg rounded-tl-sm bg-gray-100 px-2.5 py-2 text-gray-600">
                    What does "typical offer ABB" actually mean?
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-2 border-t border-gray-200 pt-2">
                  <input className="flex-1 text-xs outline-none" placeholder="Ask a question…" />
                  <Send size={14} className="text-brand-600" />
                </div>
              </Card>
            </div>
          </section>
        </div>

        {/* Right rail */}
        <aside className="space-y-4">
          <Card className={`border-2 ${style.ring}`}>
            <p className="text-xs font-bold tracking-wide text-gray-500 uppercase">
              Your {meta.short.toLowerCase()} readiness
            </p>
            <p className="mt-1 text-3xl font-light text-gray-700">
              {state.readiness.done}<span className="text-lg text-gray-400"> of {state.readiness.total}</span>
            </p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
              <div className={`h-full rounded-full ${style.bar}`} style={{ width: `${pct}%` }} />
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Steps you've completed — not a prediction of how you'd do. Every one you finish
              is something real to talk about with your tutor.
            </p>
          </Card>

          <AgentNote>
            {section.type === 'degree'
              ? `You've spent most of your time in university courses this term. Worth knowing the same careers are reachable through an apprenticeship — I can show you if you're curious.`
              : `Your gauge currently sits ${lean > 60 ? 'towards university' : 'towards work'}, so this route may be less familiar. That's usually a good reason to look.`}
          </AgentNote>

          <Card className={style.soft}>
            <p className="flex items-center gap-1.5 text-sm font-bold text-gray-700">
              <ClipboardCheck size={15} /> How sure are we about this route?
            </p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
              <div className="h-full rounded-full bg-gray-500" style={{ width: `${state.confidence}%` }} />
            </div>
            <p className="mt-2 text-xs text-gray-500">
              {state.confidence}% — {state.gap ? state.gap.toLowerCase() : 'we have a reasonable picture here'}.
            </p>
            {state.gap && (
              <Button small className="mt-3">
                <span className="flex items-center gap-1.5"><Sparkles size={12} /> Answer two questions</span>
              </Button>
            )}
          </Card>
        </aside>
      </div>
    </div>
  )
}
