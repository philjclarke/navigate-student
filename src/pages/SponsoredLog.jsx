import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Trash2, RotateCcw, AlertTriangle } from 'lucide-react'
import { Card, Button } from '../components/ui'
import {
  readLog, clearLog, aggregate, EVENT, PLACEMENTS, placement, setPlacement,
  CONTROLS, controls, setControls, CAMPAIGNS, dismissed, setDismissed, minimised,
} from '../data/sponsored'

/* A prototype-only screen. It exists so the team can check behaviour against
   the supplied flow diagram rather than take the prototype's word for it, and
   so the gap between "views" and "unique views" is visible before a sponsor
   sees a report built on one of them. */

function Choice({ label, options, value, onChange }) {
  return (
    <div>
      <p className="text-sm font-bold text-gray-700">{label}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {Object.entries(options).map(([k, text]) => (
          <button
            key={k}
            onClick={() => onChange(k)}
            className={`rounded-lg border px-3 py-2 text-sm font-semibold ${
              value === k ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function SponsoredLog() {
  const [, bump] = useState(0)
  const refresh = () => bump((n) => n + 1)
  const log = [...readLog()].reverse()
  const rows = aggregate()
  const gone = dismissed()

  return (
    <div className="space-y-6">
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-brand-600 hover:text-brand-700">
        <ArrowLeft size={15} /> Back to home
      </Link>

      <div>
        <h1 className="text-3xl font-light text-gray-600">Sponsored resources — behaviour check</h1>
        <p className="mt-2 max-w-3xl text-sm text-gray-500">
          Everything the prototype records, and the controls for the options still being decided.
          Reload the home page to watch the rotation move through the eligible campaigns.
        </p>
      </div>

      <Card className="space-y-5 border border-brand-300">
        <Choice label="Where the advert appears" options={PLACEMENTS} value={placement()}
          onChange={(v) => { setPlacement(v); refresh() }} />
        <Choice label="What the student can do with it" options={CONTROLS} value={controls()}
          onChange={(v) => { setControls(v); refresh() }} />
        <div className="flex flex-wrap gap-2 border-t border-gray-200 pt-4">
          <Button variant="secondary" onClick={() => { sessionStorage.removeItem('spon-minimised'); refresh() }}>
            <span className="flex items-center gap-2"><RotateCcw size={14} /> Start a new session</span>
          </Button>
          <Button variant="secondary" onClick={() => { CAMPAIGNS.forEach((c) => setDismissed(c.id, false)); refresh() }}>
            <span className="flex items-center gap-2"><RotateCcw size={14} /> Undo dismissals ({gone.length})</span>
          </Button>
          <Button variant="secondary" onClick={() => { clearLog(); refresh() }}>
            <span className="flex items-center gap-2"><Trash2 size={14} /> Clear the log</span>
          </Button>
        </div>
        <p className="text-xs text-gray-500">
          Minimised this session: {minimised().length ? minimised().join(', ') : 'none'}.
          Dismissed: {gone.length ? gone.join(', ') : 'none'}.
        </p>
      </Card>

      {/* What the sponsor would receive — counts only, never a student. */}
      <div>
        <h2 className="text-2xl font-light text-gray-600">What the sponsor would be sent</h2>
        <p className="mb-3 text-sm text-gray-500">Aggregate only. No student appears in this table.</p>
        <Card className="overflow-x-auto border border-gray-300">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="bg-brand-50 text-left">
                {['Campaign', 'Views', 'Unique views', 'Clicks', 'Content views', 'Interactions', 'Completed', 'Downloads', 'Minimised', 'Dismissed'].map((h) => (
                  <th key={h} className="p-2 font-bold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.campaign.id} className="border-t border-dashed border-gray-300">
                  <td className="p-2">
                    <p className="font-bold">{r.campaign.banner.heading}</p>
                    <p className="text-xs text-gray-400">{r.campaign.id} · {r.campaign.template} · {r.campaign.status}</p>
                  </td>
                  <td className="p-2">{r.views}</td>
                  <td className="p-2 font-bold text-brand-700">{r.uniqueViews}</td>
                  <td className="p-2">{r.clicks}</td>
                  <td className="p-2">{r.contentViews}</td>
                  <td className="p-2">{r.interactions}</td>
                  <td className="p-2">{r.completions}</td>
                  <td className="p-2">{r.downloads}</td>
                  <td className="p-2">{r.minimises}</td>
                  <td className="p-2">{r.dismisses}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <div className="mt-3 flex gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
          <AlertTriangle size={17} className="mt-0.5 shrink-0" />
          <p>
            <strong>Views and unique views come apart quickly.</strong> The supplied diagram logs a view
            on every home page load, so a student who refreshes three times counts three times. Both
            numbers are kept here so the difference can be seen before anyone reports one of them.
          </p>
        </div>
      </div>

      {/* What Navigate stores — per student, and that is the point of the split. */}
      <div>
        <h2 className="text-2xl font-light text-gray-600">What Navigate records</h2>
        <p className="mb-3 text-sm text-gray-500">
          {log.length} event{log.length === 1 ? '' : 's'}, newest first. Events marked{' '}
          <span className="font-bold text-amber-700">new</span> are not in the supplied flow diagram yet.
        </p>
        <Card className="border border-gray-300">
          {log.length === 0 && <p className="text-sm text-gray-500">Nothing recorded yet. Load the home page.</p>}
          {log.map((e) => {
            const meta = EVENT[e.type] || { label: e.type, inFlow: true }
            return (
              <div key={e.id} className="grid grid-cols-[150px_1fr] gap-3 border-t border-dashed border-gray-300 py-2 text-sm first:border-t-0">
                <p className="text-gray-400">{new Date(e.ts).toLocaleTimeString()}</p>
                <div>
                  <p className="font-bold text-gray-700">
                    {meta.label}
                    {!meta.inFlow && <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 uppercase">new</span>}
                    {e.detail?.first && <span className="ml-2 rounded bg-brand-100 px-1.5 py-0.5 text-[10px] font-bold text-brand-700 uppercase">first</span>}
                  </p>
                  <p className="text-xs text-gray-500">
                    {e.campaignId} · student {e.studentId}
                    {e.detail?.action && ` · ${e.detail.action}`}
                    {e.detail?.form && ` · ${e.detail.form}`}
                    {e.detail?.host && ` · ${e.detail.host} panel`}
                  </p>
                </div>
              </div>
            )
          })}
        </Card>
      </div>
    </div>
  )
}
