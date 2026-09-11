import { useState } from 'react'
import { Link } from 'react-router-dom'
import { GraduationCap, Trash2, CalendarPlus, Send, Check, Circle, ArrowRight, Clock, ShieldCheck } from 'lucide-react'
import { Card, Button } from '../components/ui'
import UniSubNav from '../components/UniSubNav'
import { ReachPill, OfferPill, useToast } from '../components/UniBits'
import {
  loadPrefs, gradesToPoints, reachFor, courseByKey, institution,
  loadShortlist, saveShortlist, loadPlan, savePlan, loadApplications, saveApplications,
  loadSteps, saveSteps, readinessSteps,
} from '../data/universities'

export default function UniversityShortlist() {
  const prefs = loadPrefs()
  const points = gradesToPoints(prefs.grades)
  const [shortlist, setShortlist] = useState(loadShortlist)
  const [plan, setPlan] = useState(loadPlan)
  const [applications, setApplications] = useState(loadApplications)
  const [steps, setSteps] = useState(loadSteps)
  const [toast, show] = useToast()

  const items = shortlist.map((k) => ({ key: k, course: courseByKey(k) })).filter((i) => i.course)
    .map((i) => ({ ...i, inst: institution(i.course.University), reach: reachFor(points, i.course) }))

  const readiness = readinessSteps({ prefs, shortlist, plan, applications, steps })
  const done = readiness.filter((s) => s.done).length

  const remove = (k) => { const n = shortlist.filter((x) => x !== k); setShortlist(n); saveShortlist(n) }
  const openDay = (i) => {
    const n = [...plan, { title: `Open day at ${i.course.University}`, date: new Date().toISOString(), key: `openday||${i.course.University}` }]
    setPlan(n); savePlan(n); show('Open day added to your timeline')
  }
  const apply = (i) => {
    if (applications.some((a) => a.key === i.key)) return
    const n = [...applications, { key: i.key, course: i.course.CourseName, university: i.course.University, at: new Date().toISOString() }]
    setApplications(n); saveApplications(n); show('Application recorded — Navigate will pass this on')
  }
  const tick = (id) => { const n = { ...steps, [id]: !steps[id] }; setSteps(n); saveSteps(n) }

  return (
    <div className="space-y-6">
      {toast}
      <UniSubNav />
      <div className="rounded-2xl bg-purple-50 p-7">
        <p className="flex items-center gap-1.5 text-sm font-bold text-purple-700"><GraduationCap size={16} /> Universities</p>
        <h1 className="mt-2 text-3xl font-light text-gray-600 md:text-4xl">My shortlist</h1>
        <p className="mt-2 text-sm text-gray-600">The courses you're seriously considering, side by side — and what's left to do before you apply.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          {items.length === 0 ? (
            <Card className="text-center">
              <p className="text-sm text-gray-500">Nothing shortlisted yet.</p>
              <Link to="/universities/matches" className="mt-3 inline-block"><Button>See my matches</Button></Link>
            </Card>
          ) : (
            <Card className="!p-0 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-purple-50 text-left text-[11px] font-bold tracking-wide text-gray-500 uppercase">
                  <tr>
                    <th className="p-3">Course</th><th className="p-3">From college</th><th className="p-3">Offer</th><th className="p-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((i) => (
                    <tr key={i.key} className="border-t border-gray-100 align-top">
                      <td className="p-3">
                        <p className="font-bold text-gray-700">{i.course.CourseName}</p>
                        <Link to={`/universities/institution/${encodeURIComponent(i.course.University)}`} className="text-xs text-purple-700 hover:underline">{i.course.University}</Link>
                        <p className="text-xs text-gray-400">{i.course.Qualification} · {i.course.LengthOfFullTimeCourse}</p>
                      </td>
                      <td className="p-3 text-xs text-gray-600">
                        {i.inst?.miles != null ? <><strong>{i.inst.miles} mi</strong><br />{i.inst.travel}</> : '—'}
                      </td>
                      <td className="p-3"><div className="flex flex-col items-start gap-1"><OfferPill course={i.course} /><ReachPill reach={i.reach} /></div></td>
                      <td className="p-3">
                        <div className="flex flex-col gap-1.5">
                          <button onClick={() => openDay(i)} className="flex items-center gap-1 text-xs font-bold text-gray-600 hover:text-purple-700"><CalendarPlus size={13} /> Open day</button>
                          <button onClick={() => apply(i)} className="flex items-center gap-1 text-xs font-bold text-purple-700 hover:text-purple-800">
                            {applications.some((a) => a.key === i.key) ? <><Check size={13} /> Recorded</> : <><Send size={13} /> Apply</>}
                          </button>
                          <button onClick={() => remove(i.key)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500"><Trash2 size={13} /> Remove</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}

          {plan.length > 0 && (
            <Card>
              <p className="flex items-center gap-1.5 text-sm font-bold text-gray-700"><Clock size={14} className="text-brand-500" /> Sent to your timeline</p>
              <ul className="mt-2 space-y-1">
                {plan.map((p, n) => <li key={n} className="text-sm text-gray-600">{p.title}</li>)}
              </ul>
            </Card>
          )}

          {applications.length > 0 && (
            <Link to="/universities/applications" className="flex items-center justify-between rounded-2xl border border-purple-200 bg-white p-4 text-sm hover:border-purple-400">
              <span className="flex items-center gap-2 font-bold text-gray-700">
                <ShieldCheck size={15} className="text-purple-500" /> {applications.length} application{applications.length === 1 ? '' : 's'} recorded
              </span>
              <span className="flex items-center gap-1 text-xs font-bold text-purple-700">See my applications <ArrowRight size={12} /></span>
            </Link>
          )}
        </div>

        {/* University readiness: steps completed, never a prediction */}
        <aside>
          <Card className="border-2 border-purple-300">
            <p className="text-xs font-bold tracking-wide text-gray-500 uppercase">Your university readiness</p>
            <p className="mt-1 text-3xl font-light text-gray-700">{done}<span className="text-lg text-gray-400"> of {readiness.length}</span></p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
              <div className="h-full rounded-full bg-purple-500" style={{ width: `${(done / readiness.length) * 100}%` }} />
            </div>
            <ul className="mt-4 space-y-2">
              {readiness.map((s) => (
                <li key={s.id} className="flex items-start gap-2 text-sm">
                  {['statement', 'reference'].includes(s.id) ? (
                    <button onClick={() => tick(s.id)} className="mt-0.5">{s.done ? <Check size={16} className="text-purple-600" /> : <Circle size={16} className="text-gray-300" />}</button>
                  ) : (
                    s.done ? <Check size={16} className="mt-0.5 text-purple-600" /> : <Circle size={16} className="mt-0.5 text-gray-300" />
                  )}
                  <span className={s.done ? 'text-gray-700' : 'text-gray-500'}>{s.label}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-gray-400">Steps you've completed — not a prediction of how you'd do.</p>
            <Link to="/universities/matches" className="mt-3 flex items-center gap-1 text-xs font-bold text-purple-700">Back to matches <ArrowRight size={12} /></Link>
          </Card>
        </aside>
      </div>
    </div>
  )
}
