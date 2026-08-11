import { useState } from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'
import {
  BriefcaseBusiness, ChevronLeft, Heart, Award, PoundSterling, Users, TrendingUp,
  Check, Lightbulb, GraduationCap, Building, Clock, MapPin, Wrench, ExternalLink,
} from 'lucide-react'
import { Card, Button, StatusPill, ImagePlaceholder } from '../components/ui'
import RouteComparison from '../components/RouteComparison'
import { careerBySlug } from '../data/careers'
import { pathwaysForCareer } from '../data/pathways'
import { subjectByName, coursesForSubject, titleCase, subjectSlug } from '../data/heap'
import { student, loadDirection, suggestedLean } from '../data/student'

const TABS = ['Is it for me?', 'What training will I need?', 'What can I expect?', 'Explore further']

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon size={16} className="mt-0.5 shrink-0 text-brand-500" />
      <div>
        <p className="text-xs font-bold tracking-wide text-gray-400 uppercase">{label}</p>
        <p className="text-sm font-semibold text-gray-700">{value}</p>
      </div>
    </div>
  )
}

function TagRow({ icon: Icon, label, tags }) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-sm font-bold text-gray-700">
        <Icon size={15} className="text-brand-500" /> {label}
      </p>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {tags.map((t) => (
          <span key={t} className="rounded-full bg-brand-100 px-2.5 py-1 text-xs font-semibold text-brand-700">
            <Check size={11} className="mr-1 inline" />{t}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function CareerDetail() {
  const { slug } = useParams()
  const career = careerBySlug(slug)
  const [params, setParams] = useSearchParams()
  const tab = Number(params.get('tab')) || 0
  const setTab = (i) => setParams(i ? { tab: String(i) } : {}, { replace: true })
  const [saved, setSaved] = useState(student.favouritedCareers.includes(career?.title))
  const lean = loadDirection().lean ?? suggestedLean()

  if (!career) {
    return (
      <div className="py-20 text-center text-gray-500">
        Career not found.{' '}
        <Link to="/future" className="font-semibold text-brand-600">Back to My Future</Link>
      </div>
    )
  }

  const routes = pathwaysForCareer(slug)
  const otherSubjects = career.heapSubjects.filter(
    (s) => subjectByName(s) && !routes.some((r) => r.subject === s),
  )

  const tabContent = [
    /* Is it for me? */
    <div key="fit" className="space-y-5">
      <div>
        <p className="font-bold text-gray-700">This could be the job for you if…</p>
        <ul className="mt-2 space-y-2">
          {career.isItForMe.bullets.map((b) => (
            <li key={b} className="flex items-start gap-2 text-sm text-gray-600">
              <Check size={15} className="mt-0.5 shrink-0 text-brand-500" /> {b}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="font-bold text-gray-700">Things to consider</p>
        <div className="mt-2 space-y-3">
          {career.isItForMe.consider.map((c) => (
            <div key={c.title} className="rounded-lg bg-brand-50 p-3">
              <p className="text-sm font-bold text-gray-700">{c.title}</p>
              <p className="mt-1 text-sm text-gray-600">{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>,

    /* Training */
    <div key="training" className="space-y-5">
      <div className="rounded-xl bg-brand-500 p-4 text-white">
        <p className="flex items-center gap-2 text-sm font-bold"><Award size={16} /> Typical route</p>
        <p className="mt-1.5 text-sm">{career.training.callout}</p>
      </div>
      <div>
        <p className="font-bold text-gray-700">Minimum qualifications</p>
        <p className="mt-1.5 text-sm text-gray-600">{career.training.minimumQuals}</p>
      </div>
      {routes.length > 0 && (
        <div>
          <p className="font-bold text-gray-700">
            Routes to becoming {/^[aeiou]/i.test(career.title) ? 'an' : 'a'} {career.title.toLowerCase()}
          </p>
          <p className="mt-1 mb-3 text-sm text-gray-500">
            There is more than one way to get there. Compare them on the same timeline — how long
            each takes, and what each one asks of you.
          </p>
          <RouteComparison routes={routes} lean={lean} />
        </div>
      )}

      {otherSubjects.length > 0 && (
        <div>
          <p className="text-sm font-bold text-gray-700">Other related subject areas</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {otherSubjects.map((s) => (
              <Link
                key={s}
                to={`/future/subject/${subjectSlug(s)}`}
                className="rounded-full border border-brand-300 bg-white px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-50"
              >
                {titleCase(s)}
              </Link>
            ))}
          </div>
        </div>
      )}
      <div className="rounded-xl bg-amber-500/10 p-4">
        <p className="flex items-center gap-2 text-sm font-bold text-gray-700"><Lightbulb size={16} className="text-amber-500" /> Top tip</p>
        <p className="mt-1.5 text-sm text-gray-600">{career.training.topTip}</p>
      </div>
    </div>,

    /* Expect */
    <div key="expect" className="space-y-5">
      {career.expect.paragraphs.map((p) => (
        <p key={p} className="text-sm leading-relaxed text-gray-600">{p}</p>
      ))}
      <div className="space-y-4">
        <TagRow icon={Clock} label="Hours" tags={career.expect.hours} />
        <TagRow icon={MapPin} label="Location" tags={career.expect.location} />
        <TagRow icon={Wrench} label="Type of work" tags={career.expect.typeOfWork} />
      </div>
    </div>,

    /* Explore further */
    <div key="explore" className="space-y-5">
      {career.related.length > 0 && (
        <div>
          <p className="font-bold text-gray-700">Related careers</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {career.related.map((slug) => {
              const rel = careerBySlug(slug)
              if (!rel) return null
              return (
                <Link
                  key={slug}
                  to={`/future/career/${slug}`}
                  onClick={() => setTab(0)}
                  className="block rounded-xl border border-brand-200 p-4 transition-colors hover:border-brand-400"
                >
                  <p className="flex items-center gap-2 font-bold text-gray-700">
                    <BriefcaseBusiness size={16} className="text-brand-500" /> {rel.title}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-500">{rel.summary}</p>
                </Link>
              )
            })}
          </div>
        </div>
      )}
      <div>
        <p className="font-bold text-gray-700">Useful links</p>
        <ul className="mt-2 space-y-2">
          {career.usefulLinks.map((l) => (
            <li key={l.url}>
              <a
                href={l.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700"
              >
                <ExternalLink size={14} /> {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>,
  ]

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-brand-100 p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="flex items-center gap-1.5 text-sm font-bold text-brand-600">
              <BriefcaseBusiness size={16} /> Future · Career
            </p>
            <h1 className="mt-2 text-3xl font-light text-gray-600 md:text-4xl">{career.title}</h1>
          </div>
          <div className="flex gap-2">
            <Button variant={saved ? 'primary' : 'secondary'} onClick={() => setSaved(!saved)}>
              <span className="flex items-center gap-1.5">
                <Heart size={15} fill={saved ? 'currentColor' : 'none'} />
                {saved ? 'On your Dashboard' : 'Add to Dashboard'}
              </span>
            </Button>
            <Link to="/future">
              <Button variant="secondary"><span className="flex items-center gap-1"><ChevronLeft size={15} /> Back</span></Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        {/* Left column — photo, summary, stats */}
        <div className="space-y-4">
          <ImagePlaceholder className="h-52 w-full" />
          <Card>
            <p className="text-sm leading-relaxed text-gray-600">{career.summary}</p>
          </Card>
          <Card className="space-y-4">
            <Stat icon={Award} label="Qualification level" value={career.stats.qualification} />
            <Stat icon={PoundSterling} label="Typical salary" value={career.stats.salary} />
            <Stat icon={Users} label="Competition for places" value={career.stats.competition} />
            <Stat icon={TrendingUp} label="Demand for this role" value={career.stats.demand} />
          </Card>
        </div>

        {/* Right column — tabs */}
        <Card className="self-start">
          <div className="flex flex-wrap gap-1 border-b border-gray-200">
            {TABS.map((t, i) => (
              <button
                key={t}
                onClick={() => setTab(i)}
                className={`rounded-t-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
                  tab === i
                    ? 'border-b-2 border-brand-500 text-brand-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="pt-5">{tabContent[tab]}</div>
        </Card>
      </div>
    </div>
  )
}
