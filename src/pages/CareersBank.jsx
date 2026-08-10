import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Signpost, Search, BriefcaseBusiness, Award, PoundSterling, Users } from 'lucide-react'
import { PageBanner, Card, Button, ImagePlaceholder } from '../components/ui'

const CAREERS = [
  { title: 'Location Manager', qual: 'An undergraduate degree', salary: '£10k - £20k', competition: 'Medium competition', demand: 'High demand' },
  { title: 'Pension Scheme Manager', qual: 'An undergraduate degree', salary: '£25k - £40k', competition: 'High competition', demand: 'Medium demand' },
  { title: 'Fish Farmer', qual: '5 GCSEs', salary: '£15k - £20k', competition: 'Medium competition', demand: 'Medium demand' },
  { title: 'Arborist/Tree Surgeon', qual: 'A certificate of further education', salary: '£20k - £25k', competition: 'Medium competition', demand: 'High demand' },
  { title: 'Farm Manager', qual: 'An undergraduate degree', salary: '£25k - £50k', competition: 'Competitive', demand: 'Medium demand' },
  { title: 'Estates Officer', qual: 'An undergraduate degree', salary: '£25k - £45k', competition: 'There is some competition for this role', demand: 'There is average demand' },
]

export default function CareersBank() {
  const [query, setQuery] = useState('')
  const results = CAREERS.filter((c) => c.title.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="space-y-6">
      <PageBanner icon={Signpost} eyebrow="Future" title="Careers Bank" />

      <p className="text-sm text-gray-600">Explore the careers below - click on one to find out more.</p>

      <div className="flex flex-wrap items-center gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a career"
          className="w-full max-w-xl rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-500"
        />
        <Button><span className="flex items-center gap-2"><Search size={15} /> Search</span></Button>
        <Link to="/future" className="ml-auto">
          <Button variant="secondary">Go to My Future Dashboard</Button>
        </Link>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {results.map((c) => (
          <Card key={c.title} className="flex gap-4">
            <ImagePlaceholder className="h-44 w-36 shrink-0" />
            <div className="space-y-2 text-sm">
              <h3 className="text-lg leading-snug font-bold text-gray-700">{c.title}</h3>
              <Button small><span className="flex items-center gap-1.5"><BriefcaseBusiness size={13} /> Careers</span></Button>
              <p className="flex items-start gap-1.5"><Award size={14} className="mt-0.5 shrink-0 text-brand-500" /> {c.qual}</p>
              <p className="flex items-start gap-1.5"><PoundSterling size={14} className="mt-0.5 shrink-0 text-brand-500" /> {c.salary}</p>
              <p className="flex items-start gap-1.5"><Users size={14} className="mt-0.5 shrink-0 text-brand-500" /> {c.competition}</p>
              <p className="flex items-start gap-1.5"><Users size={14} className="mt-0.5 shrink-0 text-brand-500" /> {c.demand}</p>
            </div>
          </Card>
        ))}
        {results.length === 0 && (
          <p className="text-sm text-gray-500">No careers match "{query}".</p>
        )}
      </div>
    </div>
  )
}
