import { useState } from 'react'
import { Lightbulb, ShieldCheck, Trash2 } from 'lucide-react'
import { PageBanner, Card, Button, ImagePlaceholder } from '../components/ui'
import { PartnerBadge } from '../components/PartnerCard'
import { loadPartnerApplications, savePartnerApplications, opportunityById } from '../data/partners'

export default function Opportunities() {
  const [apps, setApps] = useState(loadPartnerApplications)
  const withdraw = (id) => { const n = apps.filter((a) => a.opportunity !== id); setApps(n); savePartnerApplications(n) }

  /* Partner applications join the existing status summary. They always start
     at "waiting for tutor review" — nothing goes to an employer unseen. */
  const tiles = [
    ['Started, not submitted', 0],
    ['Waiting for tutor review', apps.length],
    ['Successful Applications', 0],
  ]

  return (
    <div className="space-y-6">
      <PageBanner icon={Lightbulb} eyebrow="Opportunities" title="All Opportunities">
        <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_340px]">
          <div>
            <p className="max-w-3xl text-sm text-gray-600">
              Welcome to the new Opportunities area. Here you will find opportunities you can apply
              for, from Work Experience Placements through to enrichment activities such as interview
              practice, career fairs, support videos and much more.
            </p>
            <Card className="mt-4 max-w-xl">
              <p className="text-sm font-bold">Here's the status summary of your opportunity applications:</p>
              <div className="mt-3 grid grid-cols-3 gap-3">
                {tiles.map(([label, n]) => (
                  <div key={label} className="rounded-lg bg-brand-500 p-3 text-center text-white">
                    <p className="text-sm font-bold">{label}</p>
                    <p className="mt-1 text-xl font-extrabold">{n}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 rounded-lg bg-brand-500 p-3 text-center text-white">
                <p className="text-sm font-bold">Unsuccessful Applications</p>
                <p className="mt-1 text-xl font-extrabold">1</p>
              </div>
              <Button small className="mt-4">See all my Applications</Button>
            </Card>
          </div>
          <ImagePlaceholder className="hidden h-64 lg:block" />
        </div>
      </PageBanner>

      {apps.length === 0 ? (
        <div className="rounded-2xl bg-brand-100 py-6 text-center text-sm font-semibold text-gray-600">
          Currently there are no Opportunities waiting
        </div>
      ) : (
        <Card>
          <p className="flex items-center gap-2 text-sm font-bold text-gray-700">
            <ShieldCheck size={15} className="text-brand-500" /> Waiting for tutor review
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Applications you made through partner content in My Future. Your tutor checks each one before it reaches the employer, college or university.
          </p>
          <div className="mt-3 divide-y divide-gray-100">
            {apps.map((a) => {
              const opp = opportunityById(a.opportunity)
              return (
                <div key={a.opportunity} className="flex flex-wrap items-center gap-3 py-3">
                  <div className="flex-1">
                    <p className="flex flex-wrap items-center gap-2 text-sm font-bold text-gray-700">{a.title} <PartnerBadge /></p>
                    <p className="text-xs text-gray-500">{a.provider}{opp?.location ? ` · ${opp.location.city}` : ''} · applied {new Date(a.at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                  </div>
                  <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-bold text-amber-700">{a.status}</span>
                  <button onClick={() => withdraw(a.opportunity)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500"><Trash2 size={13} /> Withdraw</button>
                </div>
              )
            })}
          </div>
        </Card>
      )}
    </div>
  )
}
