import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Trash2, Send, Search } from 'lucide-react'
import { Header, Card, Pill, Button, Toast } from '../components/kit'
import { load, save } from '../profile'
import { courseByKey, institution, reachFor, gradesToPoints } from '../../data/universities'

export default function Saved() {
  const [p, setP] = useState(load)
  const [toast, setToast] = useState(null)
  const say = (m) => { setToast(m); setTimeout(() => setToast(null), 2200) }
  const points = gradesToPoints(p.answers.grades)

  const items = p.shortlist.map((k) => ({ k, c: courseByKey(k) })).filter((i) => i.c)
  const update = (n) => { setP(n); save(n) }

  return (
    <div>
      <Toast msg={toast} />
      <Header eyebrow="Saved" title={items.length ? `${items.length} saved` : 'Nothing saved yet'}>
        <p className="mt-2 text-[14px] leading-snug text-slate-500">
          Most people apply to five. Save anything you're curious about, including the ambitious ones.
        </p>
      </Header>

      <div className="space-y-3 px-5">
        {items.length === 0 && (
          <Card className="text-center">
            <p className="text-[15px] text-slate-600">Anything you save will show up here.</p>
            <Link to="/next/explore" className="mt-4 block"><Button><Search size={16} /> Find courses</Button></Link>
          </Card>
        )}

        {items.map(({ k, c }) => {
          const inst = institution(c.University)
          const reach = reachFor(points, c)
          return (
            <Card key={k} className="!p-4">
              <Link to={`/next/course/${encodeURIComponent(k)}`} className="block">
                <p className="text-[12px] font-bold text-violet-700">{c.University}</p>
                <p className="mt-0.5 text-[17px] leading-snug font-bold text-slate-900">{c.CourseName}</p>
              </Link>
              <p className="mt-1.5 flex items-center gap-1 text-[13px] text-slate-500">
                <MapPin size={12} /> {inst?.location?.city || 'UK'}{inst?.miles != null && ` · ${inst.miles} mi`}
              </p>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                <Pill>{c.GradesOffer?.replace(/\.$/, '') || c.PointsOfferBand}</Pill>
                {reach === 'reach' && <Pill tone="violet">Within reach</Pill>}
                {reach === 'safe' && <Pill tone="green">Comfortable</Pill>}
                {reach === 'stretch' && <Pill tone="amber">A stretch</Pill>}
              </div>
              <div className="mt-3.5 flex gap-2">
                <button
                  onClick={() => { update({ ...p, done: { ...p.done, research: true } }); say('Added to your timeline') }}
                  className="flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-2xl bg-slate-100 text-[14px] font-bold text-slate-700"
                >
                  <Search size={15} /> Research
                </button>
                <button
                  onClick={() => say('Nothing is sent yet. Your tutor picks this up first.')}
                  className="flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-2xl bg-violet-600 text-[14px] font-bold text-white"
                >
                  <Send size={15} /> Applying
                </button>
                <button
                  onClick={() => update({ ...p, shortlist: p.shortlist.filter((x) => x !== k) })}
                  className="flex min-h-[44px] w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400"
                  aria-label="Remove"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
