import { useParams, Link } from 'react-router-dom'
import { GraduationCap, ChevronLeft, BriefcaseBusiness, Building, Lightbulb } from 'lucide-react'
import { Card, Button, StatusPill } from '../components/ui'
import { careersForSubject } from '../data/careers'
import { ROUTE_TYPES } from '../data/pathways'
import {
  subjectByName, coursesGroupedByUni, universityInfo, titleCase, subjectSlug, splitList,
} from '../data/heap'

function Callout({ icon: Icon, tint, title, children }) {
  return (
    <div className={`rounded-xl p-4 ${tint}`}>
      <p className="flex items-center gap-2 text-sm font-bold text-gray-700">
        <Icon size={16} /> {title}
      </p>
      <div className="mt-2 text-sm text-gray-600">{children}</div>
    </div>
  )
}

export default function SubjectDetail() {
  const { subject: raw } = useParams()
  const name = decodeURIComponent(raw)
  const subj = subjectByName(name)
  const grouped = coursesGroupedByUni(name)

  if (!subj) {
    return (
      <div className="py-20 text-center text-gray-500">
        Subject not found.{' '}
        <Link to="/future" className="font-semibold text-brand-600">Back to My Future</Link>
      </div>
    )
  }

  const related = splitList(subj.RelatedSubjects)
  const leadsTo = careersForSubject(name)

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-brand-100 p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="flex items-center gap-1.5 text-sm font-bold text-brand-600">
              <GraduationCap size={16} /> Future · Subject area
            </p>
            <h1 className="mt-2 text-3xl font-light text-gray-600 md:text-4xl">{titleCase(subj.Subject)}</h1>
          </div>
          <Link to="/future">
            <Button variant="secondary"><span className="flex items-center gap-1"><ChevronLeft size={15} /> Back</span></Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <Card>
            <p className="text-sm leading-relaxed text-gray-600">{subj.Intro}</p>
          </Card>

          {leadsTo.length > 0 && (
            <div id="leads-to">
              <p className="font-bold text-gray-700">Where this subject can take you</p>
              <p className="mt-1 text-sm text-gray-500">
                This subject is one stage of a longer journey. These are the destinations it leads
                to — open one to compare every route there, not just the university one.
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {leadsTo.map((c) => (
                  <Link
                    key={c.slug}
                    to={`/future/career/${c.slug}?tab=1`}
                    className="block rounded-xl border border-brand-200 bg-white p-4 transition-colors hover:border-brand-400"
                  >
                    <p className="flex items-center gap-2 font-bold text-gray-700">
                      <BriefcaseBusiness size={16} className="text-brand-500" /> {c.title}
                    </p>
                    <p className="mt-1 line-clamp-2 text-sm text-gray-500">{c.summary}</p>
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {c.routeTypes.map((t) => (
                        <span
                          key={t}
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            ROUTE_TYPES[t].accent === 'amber' ? 'bg-amber-500/15 text-amber-700'
                              : ROUTE_TYPES[t].accent === 'teal' ? 'bg-brand-100 text-brand-700'
                              : 'bg-purple-100 text-purple-700'
                          }`}
                        >
                          {ROUTE_TYPES[t].label}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {subj.CareerNote && (
            <Callout icon={BriefcaseBusiness} tint="bg-brand-100" title="An honest note on job prospects">
              {subj.CareerNote}
            </Callout>
          )}

          {subj.SubjectRequirementsPreferences && (
            <Callout icon={Lightbulb} tint="bg-purple-50" title="What courses usually ask for">
              {subj.SubjectRequirementsPreferences}
            </Callout>
          )}

          {related.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-bold text-gray-700">Related subjects</p>
              <div className="flex flex-wrap gap-2">
                {related.map((r) =>
                  subjectByName(r) ? (
                    <Link
                      key={r}
                      to={`/future/subject/${subjectSlug(r)}`}
                      className="rounded-full border border-brand-300 bg-white px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-50"
                    >
                      {titleCase(r)}
                    </Link>
                  ) : (
                    <span key={r} className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-500">
                      {titleCase(r)}
                    </span>
                  ),
                )}
              </div>
            </div>
          )}
        </div>

        <aside>
          <Card>
            <p className="font-bold text-gray-700">
              Courses in this subject
              <span className="ml-2 text-sm font-normal text-gray-400">
                {grouped.reduce((n, [, c]) => n + c.length, 0)} courses · {grouped.length} institutions
              </span>
            </p>
            <div className="mt-3 max-h-[560px] space-y-4 overflow-y-auto pr-1">
              {grouped.slice(0, 25).map(([uni, courses]) => {
                const info = universityInfo(uni)
                return (
                  <div key={uni} className="rounded-lg border border-gray-100 p-3">
                    <p className="text-sm font-bold text-gray-700">{uni}</p>
                    {info && <p className="text-xs text-gray-400">{info.Subtype || info.Type}</p>}
                    <ul className="mt-2 space-y-1.5">
                      {courses.slice(0, 4).map((c, i) => (
                        <li key={i} className="flex items-start justify-between gap-2 text-sm">
                          <span className="text-gray-600">
                            {c.CourseName}
                            <span className="text-xs text-gray-400"> · {c.Qualification}</span>
                          </span>
                          {(c.GradesOffer || c.PointsOfferBand) && (
                            <StatusPill>{c.GradesOffer || c.PointsOfferBand}</StatusPill>
                          )}
                        </li>
                      ))}
                      {courses.length > 4 && (
                        <li className="text-xs font-semibold text-brand-600">
                          + {courses.length - 4} more at this institution
                        </li>
                      )}
                    </ul>
                  </div>
                )
              })}
              {grouped.length > 25 && (
                <p className="text-center text-xs text-gray-400">Showing the 25 institutions with the most matching courses.</p>
              )}
            </div>
          </Card>
        </aside>
      </div>
    </div>
  )
}
