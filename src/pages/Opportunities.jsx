import { Lightbulb } from 'lucide-react'
import { PageBanner, Card, Button, ImagePlaceholder } from '../components/ui'

const TILES = [
  ['Started, not submitted', 0],
  ['Waiting for tutor review', 0],
  ['Successful Applications', 0],
]

export default function Opportunities() {
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
                {TILES.map(([label, n]) => (
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

      <div className="rounded-2xl bg-brand-100 py-6 text-center text-sm font-semibold text-gray-600">
        Currently there are no Opportunities waiting
      </div>
    </div>
  )
}
