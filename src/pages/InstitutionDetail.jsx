import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { GraduationCap, ChevronLeft, ExternalLink, CalendarPlus, PoundSterling, BookOpen, Handshake } from 'lucide-react'
import PartnerCard, { PartnerDisclosure } from '../components/PartnerCard'
import { itemsForProvider, loadEngaged, saveEngaged, loadPartnerApplications, savePartnerApplications } from '../data/partners'

/* The university readiness steps, as listed in Explore University. A partner
   item from this institution completes one of them. */
const UNI_STEPS = ['Draft your personal statement', 'Check entry requirements for your subject', 'Visit an open day']
import { Card, Button } from '../components/ui'
import { ReachPill, OfferPill, Place, useToast, FeeCapNote, InternationalFees } from '../components/UniBits'
import UniSubNav from '../components/UniSubNav'
import { titleCase, splitList, subjectByName, subjectSlug } from '../data/heap'
import {
  institution, loadPrefs, gradesToPoints, reachFor, courseKey, offerPoints,
  loadShortlist, saveShortlist, loadPlan, savePlan,
} from '../data/universities'

function Block({ icon: Icon, title, children }) {
  if (!children) return null
  return (
    <Card>
      <p className="flex items-center gap-2 text-sm font-bold text-gray-700"><Icon size={15} className="text-purple-500" /> {title}</p>
      <div className="mt-2 text-sm leading-relaxed text-gray-600">{children}</div>
    </Card>
  )
}

export default function InstitutionDetail() {
  const { name } = useParams()
  const inst = institution(decodeURIComponent(name))
  const prefs = loadPrefs()
  const points = gradesToPoints(prefs.grades)
  const [shortlist, setShortlist] = useState(loadShortlist)
  const [toast, show] = useToast()
  const [engaged, setEngaged] = useState(loadEngaged)
  const [applied, setApplied] = useState(loadPartnerApplications)

  if (!inst) {
    return (
      <div className="py-20 text-center text-gray-500">
        Institution not found. <Link to="/universities" className="font-semibold text-purple-600">Back to Universities</Link>
      </div>
    )
  }

  const fromUni = itemsForProvider(inst.University)
  const engage = (it) => {
    if (engaged.includes(it.id)) return
    const n = [...engaged, it.id]; setEngaged(n); saveEngaged(n)
    show('Opened in SEREN — added to your university readiness')
  }
  const applyOpp = (opp) => {
    if (applied.some((a) => a.opportunity === opp.id)) return
    const n = [...applied, { opportunity: opp.id, title: opp.title, provider: opp.provider, kind: opp.kind, at: new Date().toISOString(), status: 'Waiting for tutor review' }]
    setApplied(n); savePartnerApplications(n)
    show('Booked — your tutor will see this')
  }
  const mine = inst.courses.filter((c) => splitList(c.RelatedSubjectAreas).some((s) => prefs.subjects.includes(s)))
  /* Derived from the course list, so the page has substance even when HEAP's
     editorial fields for this institution are empty. */
  const subjectsHere = [...new Set(inst.courses.flatMap((c) => splitList(c.RelatedSubjectAreas)))]
    .filter((s) => subjectByName(s)).sort()
  const offers = inst.courses.map(offerPoints).filter(Boolean)
  const offerRange = offers.length ? [Math.min(...offers), Math.max(...offers)] : null
  const others = inst.courses.filter((c) => !mine.includes(c))

  const toggle = (c) => {
    const k = courseKey(c)
    const next = shortlist.includes(k) ? shortlist.filter((x) => x !== k) : [...shortlist, k]
    setShortlist(next); saveShortlist(next)
    show(shortlist.includes(k) ? 'Removed from your shortlist' : 'Added to your shortlist')
  }
  const openDay = () => {
    savePlan([...loadPlan(), { title: `Open day at ${inst.University}`, date: new Date().toISOString(), key: `openday||${inst.University}` }])
    show('Open day added to your timeline')
  }

  const CourseRow = ({ c }) => {
    const k = courseKey(c)
    return (
      <div className="flex items-center gap-3 border-t border-gray-100 py-2.5 first:border-t-0">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-700">{c.CourseName} <span className="text-xs font-normal text-gray-400">· {c.Qualification} · {c.LengthOfFullTimeCourse}</span></p>
          <div className="mt-1 flex flex-wrap gap-1.5"><OfferPill course={c} /><ReachPill reach={reachFor(points, c)} /></div>
        </div>
        <button
          onClick={() => toggle(c)}
          className={`rounded-lg border px-2.5 py-1 text-xs font-bold ${shortlist.includes(k) ? 'border-brand-500 bg-brand-500 text-white' : 'border-gray-300 text-gray-600'}`}
        >
          {shortlist.includes(k) ? 'Shortlisted' : 'Shortlist'}
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {toast}
      <UniSubNav />
      <div className="rounded-2xl bg-purple-50 p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="flex items-center gap-1.5 text-sm font-bold text-purple-700"><GraduationCap size={16} /> Universities · {inst.Subtype || inst.Type}</p>
            <h1 className="mt-2 text-3xl font-light text-gray-600 md:text-4xl">{inst.University}</h1>
            <div className="mt-2"><Place inst={inst} /></div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={openDay}><span className="flex items-center gap-1.5"><CalendarPlus size={15} /> Add an open day</span></Button>
            <Link to="/universities/matches"><Button variant="secondary"><span className="flex items-center gap-1"><ChevronLeft size={15} /> Back</span></Button></Link>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-4">
          {inst.WebAddress && (
            <a href={inst.WebAddress.startsWith('http') ? inst.WebAddress : `https://${inst.WebAddress}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm font-semibold text-purple-700 hover:underline">
              <ExternalLink size={13} /> {inst.WebAddress}
            </a>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        <div className="space-y-4">
          <Card>
            <div className="grid gap-4 sm:grid-cols-3">
              <div><p className="text-3xl font-light text-gray-700">{inst.courses.length}</p><p className="text-xs text-gray-500">courses in HEAP</p></div>
              <div><p className="text-3xl font-light text-gray-700">{subjectsHere.length}</p><p className="text-xs text-gray-500">subject areas</p></div>
              <div>
                <p className="text-3xl font-light text-gray-700">{offerRange ? `${offerRange[0]}–${offerRange[1]}` : '—'}</p>
                <p className="text-xs text-gray-500">UCAS points, typical offers</p>
              </div>
            </div>
          </Card>
          {subjectsHere.length > 0 && (
            <Card>
              <p className="flex items-center gap-2 text-sm font-bold text-gray-700"><BookOpen size={15} className="text-purple-500" /> What you can study here</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {subjectsHere.map((s) => (
                  <Link
                    key={s}
                    to={`/future/subject/${subjectSlug(s)}`}
                    className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${
                      prefs.subjects.includes(s) ? 'border-purple-400 bg-purple-50 text-purple-700' : 'border-gray-200 text-gray-600 hover:border-purple-300'
                    }`}
                  >
                    {titleCase(s)}
                  </Link>
                ))}
              </div>
            </Card>
          )}
          <Block icon={PoundSterling} title="What it costs">
            <FeeCapNote />
            <div className="mt-3"><InternationalFees text={inst.Fees} /></div>
          </Block>

          {/* What HEAP leaves empty, the university can supply itself via Ignite Talent */}
          {fromUni.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 text-lg font-light text-gray-600">
                <Handshake size={16} className="text-gray-400" /> From {inst.University}
              </h2>
              <div className="mt-1"><PartnerDisclosure /></div>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                {fromUni.map((it) => (
                  <PartnerCard
                    key={it.id}
                    item={it}
                    stepLabel={UNI_STEPS[it.develops.step]}
                    engaged={engaged.includes(it.id)}
                    applied={applied.some((a) => a.opportunity === it.opp.id)}
                    onEngage={() => engage(it)}
                    onApply={() => applyOpp(it.opp)}
                  />
                ))}
              </div>
            </section>
          )}
        </div>

        <aside>
          <Card>
            <p className="font-bold text-gray-700">Courses here <span className="ml-1 text-sm font-normal text-gray-400">{inst.courses.length}</span></p>
            {mine.length > 0 && (
              <>
                <p className="mt-3 text-[11px] font-bold tracking-wide text-purple-600 uppercase">In your subjects</p>
                <div className="mt-1">{mine.map((c) => <CourseRow key={courseKey(c)} c={c} />)}</div>
              </>
            )}
            {others.length > 0 && (
              <details className="mt-3">
                <summary className="cursor-pointer text-[11px] font-bold tracking-wide text-gray-400 uppercase">Everything else ({others.length})</summary>
                <div className="mt-1 max-h-96 overflow-y-auto">{others.map((c) => <CourseRow key={courseKey(c)} c={c} />)}</div>
              </details>
            )}
          </Card>
        </aside>
      </div>
    </div>
  )
}
