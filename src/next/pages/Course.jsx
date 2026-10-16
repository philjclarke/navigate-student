import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft, Bookmark, MapPin, Clock, GraduationCap, Briefcase, Hammer,
  ExternalLink, Info, ChevronDown, ChevronRight, Compass,
} from 'lucide-react'
import { Card, Button, Pill, Toast } from '../components/kit'
import { load, save } from '../profile'
import {
  courseByKey, courseKey, institution, coursesAt, offerPoints, gradesToPoints,
  reachFor, hasPlacementYear, COLLEGE,
} from '../../data/universities'
import { allCourses, subjectByName, splitList, titleCase } from '../../data/heap'

/* What HEAP holds about a single course is thin — eight fields, most of them
   about the offer. Everything else on this page is either joined from the
   subject profile (one per subject, written by HEAP), derived by us (distance,
   reach), or openly declared as missing. Nothing here is invented. */

function Block({ title, icon: Icon, children, source }) {
  return (
    <Card className="!p-5">
      <div className="flex items-center gap-2">
        {Icon && <Icon size={16} className="text-violet-600" />}
        <h2 className="text-[16px] font-bold text-slate-900">{title}</h2>
      </div>
      <div className="mt-2.5">{children}</div>
      {source && <p className="mt-3 text-[11px] text-slate-400">{source}</p>}
    </Card>
  )
}

function Expandable({ text, at = 260 }) {
  const [open, setOpen] = useState(false)
  const long = text.length > at
  return (
    <>
      <p className="text-[14px] leading-relaxed text-slate-600">
        {open || !long ? text : `${text.slice(0, at).trimEnd()}…`}
      </p>
      {long && (
        <button onClick={() => setOpen(!open)} className="mt-2 flex min-h-[32px] items-center gap-1 text-[13px] font-bold text-violet-600">
          {open ? 'Show less' : 'Read more'} <ChevronDown size={14} className={open ? 'rotate-180' : ''} />
        </button>
      )}
    </>
  )
}

function MiniCourse({ c }) {
  const inst = institution(c.University)
  return (
    <Link
      to={`/next/course/${encodeURIComponent(courseKey(c))}`}
      className="flex min-h-[56px] items-center gap-3 border-t border-slate-100 py-2.5 first:border-0"
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-bold text-slate-900">{c.CourseName}</p>
        <p className="truncate text-[12px] text-slate-500">
          {c.University}{inst?.miles != null && ` · ${inst.miles} mi`}
        </p>
      </div>
      <ChevronRight size={16} className="shrink-0 text-slate-300" />
    </Link>
  )
}

export default function Course() {
  const { key } = useParams()
  const nav = useNavigate()
  const [p, setP] = useState(load)
  const [toast, setToast] = useState(null)
  const say = (m) => { setToast(m); setTimeout(() => setToast(null), 2000) }

  const k = decodeURIComponent(key || '')
  const c = courseByKey(k)

  const inst = useMemo(() => (c ? institution(c.University) : null), [c])
  const subjects = useMemo(
    () => (c ? splitList(c.RelatedSubjectAreas).map(subjectByName).filter(Boolean) : []),
    [c],
  )
  const elsewhere = useMemo(() => {
    if (!c) return []
    return allCourses
      .filter((x) => x.CourseName === c.CourseName && x.University !== c.University)
      .map((x) => ({ ...x, miles: institution(x.University)?.miles ?? null }))
      .sort((a, b) => (a.miles ?? 1e9) - (b.miles ?? 1e9))
      .slice(0, 3)
  }, [c])
  const alsoHere = useMemo(() => {
    if (!c) return []
    const mine = new Set(splitList(c.RelatedSubjectAreas))
    return coursesAt(c.University)
      .filter((x) => x.CourseName !== c.CourseName && splitList(x.RelatedSubjectAreas).some((s) => mine.has(s)))
      .slice(0, 3)
  }, [c])

  if (!c) {
    return (
      <div className="px-5 pt-8">
        <p className="text-[15px] text-slate-600">We could not find that course.</p>
        <Link to="/next/explore" className="mt-4 block"><Button>Back to search</Button></Link>
      </div>
    )
  }

  const saved = p.shortlist.includes(k)
  const toggle = () => {
    const n = { ...p, shortlist: saved ? p.shortlist.filter((x) => x !== k) : [...p.shortlist, k] }
    setP(n); save(n); say(saved ? 'Removed from saved' : 'Saved')
  }

  const prof = subjects[0]
  const myPoints = gradesToPoints(p.answers.grades || '')
  const offer = offerPoints(c)
  const reach = reachFor(myPoints, c)
  const grades = (c.GradesOffer || '').replace(/\.$/, '')

  /* Said plainly, and never as a verdict on the student. */
  const standing = {
    safe: `Your predicted ${p.answers.grades} is above what they usually ask for.`,
    reach: `Your predicted ${p.answers.grades} is around what they usually ask for.`,
    stretch: `This asks for more than you are predicted at the moment. People do apply anyway, and offers are sometimes made below the published level.`,
  }[reach]

  return (
    <div className="pb-8">
      <Toast msg={toast} />

      <div className="flex items-center justify-between px-3 pt-3">
        <button onClick={() => nav(-1)} className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-600" aria-label="Back">
          <ArrowLeft size={18} />
        </button>
        <button
          onClick={toggle}
          className={`flex h-11 items-center gap-1.5 rounded-full px-4 text-[14px] font-bold ${saved ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-700'}`}
        >
          <Bookmark size={15} fill={saved ? 'currentColor' : 'none'} /> {saved ? 'Saved' : 'Save'}
        </button>
      </div>

      <header className="px-5 pt-4 pb-5">
        <p className="text-[13px] font-bold text-violet-700">{c.University}</p>
        <h1 className="mt-1 text-[26px] leading-tight font-bold tracking-tight text-slate-900">{c.CourseName}</h1>
        <div className="mt-3 space-y-1.5 text-[13px] text-slate-500">
          <p className="flex items-center gap-1.5">
            <GraduationCap size={14} /> {c.Qualification}
            {c.LengthOfFullTimeCourse && <><Clock size={14} className="ml-1.5" /> {c.LengthOfFullTimeCourse}</>}
          </p>
          <p className="flex items-center gap-1.5">
            <MapPin size={14} />
            {inst?.location?.city || 'UK'}
            {inst?.miles != null && ` · ${inst.miles} miles from college`}
          </p>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {inst?.Subtype && <Pill>{inst.Subtype}</Pill>}
          {hasPlacementYear(c) && <Pill tone="sky">Placement year</Pill>}
          {reach === 'safe' && <Pill tone="green">Comfortable</Pill>}
          {reach === 'reach' && <Pill tone="violet">Within reach</Pill>}
          {reach === 'stretch' && <Pill tone="amber">A stretch</Pill>}
        </div>
      </header>

      <div className="space-y-3 px-5">

        <Block title="What they ask for" icon={GraduationCap} source="Offers from HEAP. How it compares is worked out from your predicted grades.">
          <div className="grid grid-cols-3 gap-2 text-center">
            {[['A levels', grades || '—'], ['UCAS points', c.PointsOfferBand || '—'], ['IB', (c.IBOffer || '—').replace(/^IB\s*/, '')]].map(([l, v]) => (
              <div key={l} className="rounded-2xl bg-slate-50 py-3">
                <p className="text-[16px] font-bold text-slate-900">{v}</p>
                <p className="mt-0.5 text-[11px] text-slate-500">{l}</p>
              </div>
            ))}
          </div>
          {standing && (
            <p className="mt-3 rounded-2xl bg-violet-50 p-3.5 text-[14px] leading-snug text-violet-900">{standing}</p>
          )}
          {!myPoints && (
            <div className="mt-3 rounded-2xl bg-slate-50 p-3.5">
              <p className="text-[14px] leading-snug text-slate-600">
                Add your predicted grades and we will tell you how this one sits for you.
              </p>
              <Link to="/next/me" className="mt-2.5 block">
                <Button variant="secondary">Add my grades</Button>
              </Link>
            </div>
          )}
        </Block>

        {prof?.Intro && (
          <Block title={`What ${titleCase(prof.Subject)} involves`} icon={Compass} source={`HEAP's profile for ${titleCase(prof.Subject)} — about the subject, not this particular course.`}>
            <Expandable text={prof.Intro} />
          </Block>
        )}

        {prof?.SubjectRequirementsPreferences && (
          <Block title="Subjects they tend to look for" icon={Info} source="HEAP, for the subject generally. The offer above is the one that applies here.">
            <Expandable text={prof.SubjectRequirementsPreferences} at={200} />
          </Block>
        )}

        {prof?.CareerNote && (
          <Block title="Where it can lead" icon={Briefcase} source="HEAP's career note for this subject.">
            <Expandable text={prof.CareerNote} at={220} />
          </Block>
        )}

        {/* University is one route to this subject, not the only one. */}
        {prof?.DegreeApprenticeships && (
          <Block title="You could also do this as an apprenticeship" icon={Hammer} source="Degree apprenticeship providers listed by HEAP for this subject.">
            <p className="text-[14px] leading-relaxed text-slate-600">
              A degree apprenticeship means being employed and paid while you study, with your fees covered.
              For this subject HEAP lists: <span className="font-semibold text-slate-900">{prof.DegreeApprenticeships.replace(/\.$/, '')}</span>.
            </p>
          </Block>
        )}

        {prof && (splitList(prof.RelatedSubjects).length > 0 || prof.OtherDegreeSubjectsForConsideration) && (
          <Block title="If you like this, look at these too" icon={Compass} source="HEAP's related subjects.">
            <div className="flex flex-wrap gap-2">
              {splitList(prof.RelatedSubjects).map((s) => (
                <Link
                  key={s}
                  to={`/next/explore?subject=${encodeURIComponent(s)}`}
                  className="flex min-h-[40px] items-center rounded-full border-2 border-slate-200 px-3.5 text-[13px] font-semibold text-slate-600"
                >
                  {titleCase(s)}
                </Link>
              ))}
            </div>
            {prof.OtherDegreeSubjectsForConsideration && (
              <p className="mt-3 text-[13px] leading-relaxed text-slate-500">
                Also worth a look: {prof.OtherDegreeSubjectsForConsideration.replace(/\.$/, '')}.
              </p>
            )}
          </Block>
        )}

        {elsewhere.length > 0 && (
          <Block title="The same course elsewhere" icon={MapPin} source="HEAP course list, nearest to your college first.">
            {elsewhere.map((x) => <MiniCourse key={courseKey(x)} c={x} />)}
          </Block>
        )}

        {alsoHere.length > 0 && (
          <Block title={`Related courses at ${inst?.AbbreviatedName || c.University}`} icon={GraduationCap} source="HEAP course list for this university.">
            {alsoHere.map((x) => <MiniCourse key={courseKey(x)} c={x} />)}
          </Block>
        )}

        <Block title="The money" icon={Info} source="Fee cap from GOV.UK. HEAP's fee field covers international students, so we do not show it here.">
          <p className="text-[14px] leading-relaxed text-slate-600">
            Tuition is capped at £9,535 a year and a loan covers all of it, so you pay nothing up front.
            What varies between places is rent and living costs, which we cannot show you yet.
          </p>
          <a
            href="https://www.gov.uk/student-finance"
            target="_blank"
            rel="noreferrer"
            className="mt-2.5 flex min-h-[40px] items-center gap-1.5 text-[13px] font-bold text-violet-600"
          >
            How student finance works <ExternalLink size={13} />
          </a>
        </Block>

        {/* Saying what we do not know is part of being trustworthy about what we do. */}
        <Block title="What we cannot tell you yet">
          <p className="text-[14px] leading-relaxed text-slate-600">
            We do not hold the modules, how the course is assessed, what graduates go on to earn,
            or when the open days are. The university's own site is the place for those.
          </p>
          {inst?.WebAddress && (
            <a
              href={inst.WebAddress.startsWith('http') ? inst.WebAddress : `https://${inst.WebAddress}`}
              target="_blank"
              rel="noreferrer"
              className="mt-2.5 flex min-h-[44px] items-center gap-1.5 text-[14px] font-bold text-violet-600"
            >
              Visit {inst.AbbreviatedName || c.University} <ExternalLink size={14} />
            </a>
          )}
        </Block>

        <div className="pt-1">
          <Button onClick={toggle} variant={saved ? 'quiet' : 'primary'}>
            <Bookmark size={16} fill={saved ? 'none' : 'currentColor'} />
            {saved ? 'Remove from saved' : 'Save this course'}
          </Button>
          <p className="mt-2.5 text-center text-[12px] text-slate-400">
            Distances are measured from {COLLEGE.label}.
          </p>
        </div>
      </div>
    </div>
  )
}
