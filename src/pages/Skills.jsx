import { Puzzle, SquarePen } from 'lucide-react'
import { PageBanner, Card, Button } from '../components/ui'

const SKILLS = [
  ['Customer Service', 9], ['Physical Health', 4], ['Building Relationships', 31],
  ['Communication', 16], ['Enterprising', 30], ['Collaboration', 31],
]

const ASSESSMENTS = [
  { label: 'Complete by 08/03/2024', actions: ['Continue', 'Remove'] },
  { label: 'Complete by 05/09/2024', actions: ['Continue', 'Remove'] },
  { label: 'Completed on 04/11/2015', actions: ['View Results', 'Report'] },
  { label: 'Completed on 29/06/2016', actions: ['View Results', 'Report'] },
  { label: 'Completed on 08/02/2023', actions: ['View Results', 'Report'] },
]

export default function Skills() {
  return (
    <div className="space-y-6">
      <PageBanner
        icon={Puzzle}
        eyebrow="Skills"
        title="My Skills"
        action={<Button>Start new Skills Assessment</Button>}
      />

      <div className="grid gap-6 rounded-2xl bg-gradient-to-r from-brand-50 to-purple-50 p-6 lg:grid-cols-[1fr_320px]">
        <div>
          <p className="text-sm text-gray-500">Skills you are developing:</p>
          <ul className="mt-3 space-y-2 text-sm">
            {SKILLS.map(([name, count]) => (
              <li key={name} className="flex items-center gap-3">
                <Puzzle size={15} className="text-brand-500" />
                <span className="w-44 font-semibold">{name}</span>
                <span className="text-gray-500">{count} Activities added for this skill</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-brand-600">
            <SquarePen size={15} /> Edit the Skills you are developing in My Profile
          </p>
        </div>
        <Card>
          <p className="text-sm text-gray-500">Your next destination:</p>
          <p className="mt-2 text-xl font-semibold text-purple-700">University (EDU-6)</p>
          <p className="text-sm text-purple-600">Archaeology</p>
          <p className="mt-10 flex items-center gap-1.5 text-sm font-semibold text-brand-600">
            <SquarePen size={15} /> Edit your Destination in My Profile
          </p>
        </Card>
      </div>

      <div>
        <h2 className="mb-2 text-xl font-light text-gray-600">My Assessments:</h2>
        <div className="divide-y divide-gray-200 text-sm">
          {ASSESSMENTS.map((a, i) => (
            <div key={i} className="flex items-center justify-between py-3">
              <p><strong>Personal &amp; Professional Skills Assessment</strong> &nbsp;{a.label}</p>
              <div className="flex divide-x divide-gray-300">
                {a.actions.map((act) => (
                  <button key={act} className="px-4 font-semibold text-gray-700 hover:text-brand-600">{act}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
