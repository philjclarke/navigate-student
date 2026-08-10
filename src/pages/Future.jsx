import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Signpost, BriefcaseBusiness, GraduationCap, Compass, Sparkles, Info,
  ChevronRight, Building, Wrench,
} from 'lucide-react'
import { Card, Button, StatusPill } from '../components/ui'
import DirectionWizard from '../components/DirectionWizard'
import signpostImg from '../assets/my-future-signpost.png'
import { subjectByName, coursesForSubject, titleCase, subjectSlug, splitList } from '../data/heap'
import { student, signals, suggestedLean, loadDirection, saveDirection } from '../data/student'

const CAREERS = [
  { title: 'Arborist/Tree Surgeon', pill: 'Favourited', reason: 'You favourited this career', blurb: 'Demand for experienced workers has risen due to greater public interest in the environment.' },
  { title: 'Museum Curator', pill: 'New match', reason: 'Linked to your Archaeology interest', blurb: 'Care for collections and bring history to life for the public.' },
  { title: 'Cartoonist', pill: 'Favourited', reason: 'You favourited this career', blurb: 'If you have a popular and recognisable character you are likely to progress rapidly.' },
  { title: 'Field Archaeologist', pill: 'New match', reason: 'Direct route from your destination subject', blurb: 'Work on excavations for water boards, forestry, civil engineering and surveying organisations.' },
]

function DirectionDial({ lean, dataLean, onChange }) {
  return (
    <div>
      <div className="relative pt-8">
        {/* data suggestion marker — transparent to clicks so it never blocks the thumb */}
        <div
          className="pointer-events-none absolute top-0 -translate-x-1/2 text-center"
          style={{ left: `${dataLean}%` }}
        >
          <span className="rounded-full bg-gray-700 px-2 py-0.5 text-[10px] font-bold whitespace-nowrap text-white">
            our suggestion
          </span>
          <div className="mx-auto h-3 w-px bg-gray-700" />
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={lean}
          onChange={(e) => onChange(Number(e.target.value))}
          className="direction-dial w-full"
          aria-label="Your direction between work and university"
        />
      </div>
      <div className="mt-1 flex justify-between text-xs font-bold text-gray-500">
        <span className="flex items-center gap-1"><Wrench size={12} /> Straight into work</span>
        <span>Earn while learning</span>
        <span className="flex items-center gap-1"><GraduationCap size={13} /> University</span>
      </div>
    </div>
  )
}

function SubjectCard({ name }) {
  const courses = coursesForSubject(name)
  const unis = new Set(courses.map((c) => c.University))
  const subj = subjectByName(name)
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-100 text-purple-600">
          <GraduationCap size={17} />
        </span>
        <StatusPill>Subject area</StatusPill>
      </div>
      <h3 className="text-lg leading-snug font-bold text-gray-700">{titleCase(name)}</h3>
      <p className="line-clamp-3 text-sm text-gray-500">{subj?.Intro}</p>
      <p className="text-xs font-semibold text-gray-500">
        {courses.length} courses · {unis.size} universities &amp; colleges
      </p>
      <Link to={`/future/subject/${subjectSlug(name)}`} className="mt-auto">
        <Button small>Explore subject</Button>
      </Link>
    </Card>
  )
}

function ApprenticeshipCard({ name }) {
  const subj = subjectByName(name)
  if (!subj?.DegreeApprenticeships) return null
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/15 text-amber-500">
          <Building size={17} />
        </span>
        <StatusPill>Degree apprenticeship</StatusPill>
      </div>
      <h3 className="text-lg leading-snug font-bold text-gray-700">{titleCase(name)} — earn while you learn</h3>
      <p className="line-clamp-4 text-sm text-gray-500">{subj.DegreeApprenticeships}</p>
      <Link to={`/future/subject/${subjectSlug(name)}`} className="mt-auto">
        <Button small variant="secondary">See the study route</Button>
      </Link>
    </Card>
  )
}

export default function Future() {
  const [direction, setDirection] = useState(loadDirection)
  const [wizardOpen, setWizardOpen] = useState(false)
  const [filter, setFilter] = useState('All')
  const [showSignals, setShowSignals] = useState(false)

  const dataLean = suggestedLean()
  const lean = direction.lean ?? dataLean

  const update = (next) => {
    setDirection(next)
    saveDirection(next)
  }

  const interests = direction.interests
  const apprenticeshipSubjects = useMemo(
    () => interests.filter((i) => subjectByName(i)?.DegreeApprenticeships),
    [interests],
  )

  const showCareers = filter === 'All' || filter === 'Careers'
  const showCourses = filter === 'All' || filter === 'University'
  const showApprentice = filter === 'All' || filter === 'Apprenticeships'

  /* Order the feed by lean: university-heavy leans put subjects first */
  const academicFirst = lean >= 50

  const careerCards = showCareers && CAREERS.map((c) => (
    <Card key={c.title} className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-brand-600">
          <BriefcaseBusiness size={17} />
        </span>
        <StatusPill>{c.pill}</StatusPill>
      </div>
      <h3 className="text-lg leading-snug font-bold text-gray-700">{c.title}</h3>
      <p className="flex items-center gap-1.5 text-xs font-semibold text-brand-600">
        <Sparkles size={12} /> {c.reason}
      </p>
      <p className="line-clamp-3 text-sm text-gray-500">{c.blurb}</p>
      <div className="mt-auto"><Button small>View Career</Button></div>
    </Card>
  ))

  const subjectCards = showCourses && interests.map((name) => <SubjectCard key={name} name={name} />)
  const apprenticeCards = showApprentice && apprenticeshipSubjects.map((name) => (
    <ApprenticeshipCard key={`app-${name}`} name={name} />
  ))

  return (
    <div className="space-y-6">
      {/* Banner + direction dial */}
      <div className="rounded-2xl bg-brand-100 p-7">
        <div className="grid items-center gap-6 lg:grid-cols-[3fr_2fr]">
          <div>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="flex items-center gap-1.5 text-sm font-bold text-brand-600">
                  <Signpost size={16} /> Future
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
              Your gateway to what comes after college — careers, university courses and
              apprenticeships, shaped around what we're learning about you. It's always
              your choice: slide the dial to explore in any direction.
            </p>

            <Card className="mt-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-bold text-gray-700">Your direction</p>
                <button
                  onClick={() => setShowSignals(!showSignals)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700"
                >
                  <Info size={13} /> Why do we suggest this?
                </button>
              </div>
              <div className="mt-3">
                <DirectionDial
                  lean={lean}
                  dataLean={dataLean}
                  onChange={(v) => update({ ...direction, lean: v })}
                />
              </div>
              <p className="mt-3 text-center text-sm text-gray-600" aria-live="polite">
                {lean >= 65 ? (
                  <>You're exploring <strong>university and college courses</strong> first</>
                ) : lean <= 35 ? (
                  <>You're exploring <strong>careers and apprenticeships</strong> first</>
                ) : (
                  <>You're exploring <strong>a balanced mix</strong> of careers and courses</>
                )}
                {lean !== dataLean && (
                  <button
                    onClick={() => update({ ...direction, lean: dataLean })}
                    className="ml-2 text-xs font-semibold text-brand-600 hover:text-brand-700"
                  >
                    Reset to our suggestion
                  </button>
                )}
              </p>
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
                    These signals only shape the order of suggestions — they never limit what you can explore.
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

      <div className="grid gap-6 lg:grid-cols-[1fr_290px]">
        <div>
          {/* Filter */}
          <div className="mb-4 flex flex-wrap gap-2">
            {['All', 'Careers', 'University', 'Apprenticeships'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                  filter === f ? 'bg-brand-500 text-white' : 'bg-white text-gray-600 hover:bg-brand-100'
                }`}
              >
                {f === 'University' ? 'University & courses' : f}
              </button>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {academicFirst
              ? [subjectCards, apprenticeCards, careerCards]
              : [careerCards, apprenticeCards, subjectCards]}
          </div>
        </div>

        {/* Right rail */}
        <aside className="space-y-4">
          <Card className="border border-purple-200">
            <p className="text-xs font-bold tracking-wide text-gray-500 uppercase">Your next destination</p>
            <p className="mt-1 text-lg font-semibold text-purple-700">{student.destination.pathway}</p>
            <p className="text-sm text-purple-600">{student.destination.focus}</p>
            <div className="mt-3 rounded-lg bg-brand-50 p-3 text-sm text-gray-600">
              <p className="flex items-start gap-1.5">
                <Sparkles size={14} className="mt-0.5 shrink-0 text-brand-500" />
                Your recent activity still supports this — Archaeology courses are shown in
                your feed. If your direction shifts, we'll let you know before suggesting a change.
              </p>
            </div>
            <p className="mt-3 text-xs text-gray-400">Changing your destination is always your choice.</p>
          </Card>
          <Link to="/future/careers-bank" className="block">
            <Button variant="secondary" className="w-full">Go to the Careers Bank</Button>
          </Link>
        </aside>
      </div>

      <DirectionWizard
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onComplete={update}
      />
    </div>
  )
}
