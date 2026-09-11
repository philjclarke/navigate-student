import { useState } from 'react'
import { Link } from 'react-router-dom'
import { GraduationCap, ShieldCheck, Trash2, ArrowRight } from 'lucide-react'
import { Card, Button } from '../components/ui'
import UniSubNav from '../components/UniSubNav'
import { useToast } from '../components/UniBits'
import { loadApplications, saveApplications, institution } from '../data/universities'

const STEPS = [
  ['You record it here', 'That\'s the only thing Navigate does on its own.'],
  ['Your college checks it', 'A tutor reviews it and adds your reference.'],
  ['It\'s sent on', 'Your college passes it to UCAS or the university, usually in a batch with others.'],
  ['We update the status', 'You\'ll see it change here as it moves along.'],
]

export default function UniversityApplications() {
  const [applications, setApplications] = useState(loadApplications)
  const [toast, show] = useToast()

  const withdraw = (key) => {
    const next = applications.filter((a) => a.key !== key)
    setApplications(next); saveApplications(next); show('Application withdrawn')
  }

  return (
    <div className="space-y-6">
      {toast}
      <UniSubNav />
      <div className="rounded-2xl bg-purple-50 p-7">
        <p className="flex items-center gap-1.5 text-sm font-bold text-purple-700"><GraduationCap size={16} /> Universities</p>
        <h1 className="mt-2 text-3xl font-light text-gray-600 md:text-4xl">My applications</h1>
        <p className="mt-2 max-w-2xl text-sm text-gray-600">
          Every application you record is held in Navigate for your college to pass on. Nothing
          goes to UCAS or a university until they do, so recording one here is a commitment to
          you and your tutor, not a submission.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div>
          {applications.length === 0 ? (
            <Card className="text-center">
              <p className="text-sm text-gray-500">You haven't recorded any applications yet.</p>
              <p className="mt-1 text-xs text-gray-400">Shortlist a few courses first, then record the ones you want to go for.</p>
              <Link to="/universities/shortlist" className="mt-3 inline-block"><Button>Go to my shortlist</Button></Link>
            </Card>
          ) : (
            <Card className="!p-0 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-purple-50 text-left text-[11px] font-bold tracking-wide text-gray-500 uppercase">
                  <tr><th className="p-3">Course</th><th className="p-3">Recorded</th><th className="p-3">Status</th><th className="p-3"></th></tr>
                </thead>
                <tbody>
                  {applications.map((a) => {
                    const inst = institution(a.university)
                    return (
                      <tr key={a.key} className="border-t border-gray-100 align-top">
                        <td className="p-3">
                          <p className="font-bold text-gray-700">{a.course}</p>
                          <Link to={`/universities/institution/${encodeURIComponent(a.university)}`} className="text-xs text-purple-700 hover:underline">{a.university}</Link>
                          {inst?.miles != null && <p className="text-xs text-gray-400">{inst.miles} mi · {inst.travel}</p>}
                        </td>
                        <td className="p-3 text-xs text-gray-600">{new Date(a.at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                        <td className="p-3">
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-bold text-amber-700">
                            <ShieldCheck size={11} /> Recorded — with your college
                          </span>
                        </td>
                        <td className="p-3">
                          <button onClick={() => withdraw(a.key)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500"><Trash2 size={13} /> Withdraw</button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </Card>
          )}
        </div>

        <aside>
          <Card>
            <p className="text-sm font-bold text-gray-700">What happens next</p>
            <ol className="mt-3 space-y-3">
              {STEPS.map(([title, detail], i) => (
                <li key={title} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white">{i + 1}</span>
                  <div>
                    <p className="text-sm font-bold text-gray-700">{title}</p>
                    <p className="text-xs text-gray-500">{detail}</p>
                  </div>
                </li>
              ))}
            </ol>
            <Link to="/universities/matches" className="mt-4 flex items-center gap-1 text-xs font-bold text-purple-700">Find more courses <ArrowRight size={12} /></Link>
          </Card>
        </aside>
      </div>
    </div>
  )
}
