import { Link } from 'react-router-dom'
import { Clock, Lightbulb, Puzzle, Building2, Target, Compass, MapPin } from 'lucide-react'
import { Card, PanelCard, Button, HoursCard, ImagePlaceholder } from '../components/ui'

const OPPORTUNITIES = [
  { name: 'Marketing Assistant Placement Opportunity', by: 'The Education Company', status: 'Rejected', deadline: '07/12/2025' },
]

const TIMELINE = [
  {
    title: 'Enrichment - Testing since TLS update',
    date: '13/01/2026',
    body: 'I learned about testing, it was a productive day where we all had a chance to be very involved with E2E process - overall I felt like everyone had equal opportunity to contribute.',
  },
]

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 rounded-2xl bg-brand-100 p-6 lg:grid-cols-2">
        <div className="flex flex-col gap-5">
          <div>
            <h1 className="text-3xl font-light text-gray-600 md:text-4xl">Welcome back Jason</h1>
            <p className="mt-1 text-sm text-gray-500">Last login 30/07/2026</p>
            <p className="mt-4 flex items-center gap-2 text-sm">
              <Compass size={16} className="text-gray-500" />
              Your next destination: <strong>Archaeology &gt; University (EDU-6)</strong>
            </p>
            <div className="mt-3 flex gap-2 text-sm">
              <MapPin size={16} className="mt-0.5 shrink-0 text-gray-500" />
              <div>
                <p className="font-bold">Communication Top Tip - Think before you speak!</p>
                <p className="mt-1 text-gray-500">
                  Think carefully about what you want to say and how the person you are communicating
                  with will feel about it. This helps you to be considerate of other people's feelings
                  and build strong relationships.
                </p>
              </div>
            </div>
          </div>
          <Card className="mt-auto flex items-center gap-4">
            <div className="flex-1">
              <h2 className="text-2xl font-light text-gray-600">New - Opportunities!</h2>
              <p className="mt-2 text-sm text-gray-500">
                We've created a new area that offers you a wealth of Opportunities - from Placements to
                Enrichment activities such as careers fairs, and much more.
              </p>
              <Link to="/opportunities"><Button className="mt-3">Let's go!</Button></Link>
            </div>
            <ImagePlaceholder className="hidden h-32 w-32 shrink-0 sm:block" />
          </Card>
        </div>
        <div>
          <h2 className="mb-3 text-2xl font-light text-gray-600">My Activity Hours</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <HoursCard title="Employer Engagement Hours" value={0} />
            <HoursCard title="Enrichment Hours" value={5} />
            <HoursCard title="Employer Confirmed Placement Hours" value={0} />
            <HoursCard title="Student Confirmed Placement Hours" value={0} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <PanelCard icon={Lightbulb} title="My Opportunities">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-brand-50 text-left">
                <th className="p-2 font-bold">Name</th>
                <th className="p-2 font-bold">Offered by</th>
                <th className="p-2 font-bold">Status</th>
                <th className="p-2 font-bold">Application Deadline</th>
                <th className="p-2" />
              </tr>
            </thead>
            <tbody>
              {OPPORTUNITIES.map((o) => (
                <tr key={o.name} className="border-t border-dashed border-gray-300 align-top">
                  <td className="p-2 font-bold">{o.name}</td>
                  <td className="p-2">{o.by}</td>
                  <td className="p-2">{o.status}</td>
                  <td className="p-2">{o.deadline}</td>
                  <td className="p-2 text-right font-bold">View</td>
                </tr>
              ))}
            </tbody>
          </table>
        </PanelCard>

        <PanelCard icon={Clock} title="My Timeline" actionLabel="View Timeline">
          <p className="mb-2 text-sm font-bold">Latest activity</p>
          {TIMELINE.map((t) => (
            <div key={t.title} className="flex gap-4 bg-brand-50 p-3">
              <div className="flex-1">
                <div className="flex justify-between gap-4">
                  <p className="text-sm font-bold">{t.title}</p>
                  <p className="text-sm">{t.date}</p>
                </div>
                <p className="mt-2 text-sm text-gray-500">{t.body}</p>
              </div>
              <ImagePlaceholder className="hidden h-24 w-32 shrink-0 sm:block" />
            </div>
          ))}
        </PanelCard>

        <PanelCard icon={Puzzle} title="My Skills">
          <p className="mb-1 text-sm">Assessment</p>
          <div className="flex justify-between border-t border-dashed border-gray-300 py-2 text-sm">
            <p><strong>Personal &amp; Professional Skills Assessment</strong> Complete by 08/03/2024</p>
            <p className="font-bold">Continue</p>
          </div>
          <div className="mt-2 rounded-lg bg-brand-50 p-3 text-sm">
            <div className="flex justify-between">
              <p className="text-gray-500">Skills you are developing:</p>
              <p className="font-semibold text-brand-600">Edit your Skills</p>
            </div>
            <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
              {['Building Relationships', 'Collaboration', 'Communication', 'Customer Service', 'Enterprising', 'Physical Health'].map((s) => (
                <li key={s} className="flex items-center gap-2">
                  <Puzzle size={14} className="text-brand-500" /> {s}
                </li>
              ))}
            </ul>
          </div>
        </PanelCard>

        <PanelCard icon={Building2} title="My Placements">
          {[
            { org: 'The Education Company', dates: '31/10/2025 - 31/10/2025' },
            { org: 'New Employer 101', dates: '23/06/2025 - 30/06/2025' },
          ].map((p) => (
            <div key={p.org} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-t border-dashed border-gray-300 py-2.5 text-sm first:border-t-0">
              <p className="font-bold">{p.org}</p>
              <p>Placement request awaiting approval<br />{p.dates}</p>
              <p className="font-bold">View</p>
            </div>
          ))}
        </PanelCard>

        <PanelCard icon={Target} title="My Targets">
          {['This is a new target', 'A new target'].map((t) => (
            <div key={t} className="flex items-center justify-between border-t border-dashed border-gray-300 py-2.5 text-sm first:border-t-0">
              <p className="font-bold">{t}</p>
              <p>Complete by 05/05/2023</p>
              <p className="font-bold">View</p>
            </div>
          ))}
        </PanelCard>
      </div>
    </div>
  )
}
