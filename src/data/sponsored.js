/* Sponsored resources — the model from the supplied flow diagram.

   Campaign Type (banner ad) → Campaign → Content Template Type → Content Slots,
   with a Campaign Audience of explicit student IDs and every engagement written
   to a single log. Status belongs to the campaign (active/paused), not to the
   student: a student's relationship to a campaign exists only as log entries.

   The sponsor here is invented. Nothing in this folder comes from, or claims to
   come from, a real organisation. */

export const STUDENT = { id: 'S-10482', name: 'Jason Gould' }

const SPONSOR = {
  name: 'Thameside Bank',
  logo: '/sponsored/sponsor-logo.svg',
  logoWhite: '/sponsored/sponsor-logo-white.svg',
  /* The sponsor's own colours. Sponsored content is skinned to the partner
     rather than to Navigate: it has to be recognisable as somebody else's
     voice the moment it appears, which is both a design and a disclosure
     requirement. */
  ink: '#0b1f3f',
  accent: '#49b6e0',
  /* The wording Phil settled on: partnership, not advertising. Shown as text on
     the banner and with the logo on the content page. */
  label: 'In partnership with Thameside Bank',
}

/* One template per content type, as briefed. Slots are typed and their order is
   fixed by the template — the page renders whatever the template declares, so a
   future "video plus takeaway PDF" is a new template rather than a rewrite. */
export const TEMPLATES = {
  video: { id: 'video', name: 'Video', slots: ['logo', 'text', 'video'] },
  download: { id: 'download', name: 'Download', slots: ['logo', 'text', 'file'] },
  article: { id: 'article', name: 'Article', slots: ['logo', 'text', 'body'] },
}

export const CAMPAIGNS = [
  {
    id: 'cmp-001',
    type: 'banner',
    sponsor: SPONSOR,
    status: 'active',                 // active | paused
    start: '2026-09-01',
    end: '2026-12-19',
    audience: ['S-10482', 'S-10499', 'S-10512'],
    host: 'opportunities',            // which home panel it takes over
    template: 'video',
    banner: {
      image: '/sponsored/campaign-money.svg',
      heading: 'Money, explained',
      blurb: 'Four short films about the money side of leaving college — pay, tax, rent and what a credit score actually is.',
      cta: 'Watch the first film',
    },
    slots: [
      { type: 'logo', src: SPONSOR.logo, alt: SPONSOR.name },
      {
        type: 'text',
        heading: 'Money, explained',
        standfirst: 'Nobody really teaches this bit. Four short films on what happens to your money once you start earning.',
      },
      {
        type: 'video',
        src: '/sponsored/money-basics.mp4',
        poster: '/sponsored/campaign-money.svg',
        title: 'Money, explained — part one',
        length: '20 seconds',
      },
    ],
  },
  {
    id: 'cmp-002',
    type: 'banner',
    sponsor: SPONSOR,
    status: 'active',
    start: '2026-09-01',
    end: '2026-12-19',
    audience: ['S-10482', 'S-10499'],
    host: 'opportunities',
    template: 'download',
    banner: {
      image: '/sponsored/campaign-payslip.svg',
      heading: 'Reading your first payslip',
      blurb: 'A one page guide to gross, net, tax and the bits that are easy to miss.',
      cta: 'Get the guide',
    },
    slots: [
      { type: 'logo', src: SPONSOR.logo, alt: SPONSOR.name },
      {
        type: 'text',
        heading: 'Reading your first payslip',
        standfirst: 'The five numbers that matter, and the three things worth checking every month.',
      },
      {
        type: 'file',
        src: '/sponsored/reading-your-payslip.pdf',
        filename: 'reading-your-payslip.pdf',
        format: 'PDF',
        size: '52 KB',
        title: 'Reading your first payslip',
      },
    ],
  },
  {
    id: 'cmp-003',
    type: 'banner',
    sponsor: SPONSOR,
    status: 'active',
    start: '2026-09-01',
    end: '2026-12-19',
    audience: ['S-10482'],
    host: 'opportunities',
    template: 'article',
    banner: {
      image: '/sponsored/campaign-rent.svg',
      heading: 'What renting really costs',
      blurb: 'Deposits, bills and the costs nobody mentions until the week you move.',
      cta: 'Have a read',
    },
    slots: [
      { type: 'logo', src: SPONSOR.logo, alt: SPONSOR.name },
      {
        type: 'text',
        heading: 'What renting really costs',
        standfirst: 'The rent is the number everyone quotes. It is rarely the number you end up paying.',
      },
      {
        type: 'body',
        paragraphs: [
          'Most adverts quote rent per month and stop there. Before you move in you will usually need a deposit of up to five weeks rent, plus your first month up front — so a £600 a month room can need around £1,300 before you have slept there once.',
          'Then there are bills. Some rooms include them and some do not, and "bills included" does not always include broadband or a TV licence. It is worth asking which of the five — gas, electricity, water, broadband, council tax — are actually covered.',
          'Students in full time higher education are usually exempt from council tax, but that exemption depends on everyone in the house being a student. One working housemate and the bill arrives.',
        ],
      },
    ],
  },
]

/* ---------- eligibility, rotation, minimise ---------- */

const today = () => new Date().toISOString().slice(0, 10)

export function eligibleCampaigns(studentId = STUDENT.id, host = null) {
  const d = today()
  const gone = dismissed()
  return CAMPAIGNS.filter((c) =>
    c.status === 'active' &&
    c.start <= d && d <= c.end &&
    c.audience.includes(studentId) &&
    !gone.includes(c.id) &&
    (host ? c.host === host : true),
  )
}

export const campaignById = (id) => CAMPAIGNS.find((c) => c.id === id) || null

const ses = {
  get: (k, f) => { try { const v = sessionStorage.getItem(k); return v ? JSON.parse(v) : f } catch { return f } },
  set: (k, v) => { try { sessionStorage.setItem(k, JSON.stringify(v)) } catch { /* ignore */ } },
}

/* "Never show more than one advert. If more than one exists show a different ad
   each time the page is loaded" — round robin, so rotation is even rather than
   random.

   Choosing and advancing are separate on purpose. Choosing happens during
   render and must be free of side effects, or React's double invocation in
   development quietly skips a campaign every load. The pointer moves once the
   advert has actually been shown. */
export function pickCampaign(host = null) {
  const list = eligibleCampaigns(STUDENT.id, host)
  if (!list.length) return null
  return list[ses.get('spon-rotation', 0) % list.length]
}

export function advanceRotation() {
  ses.set('spon-rotation', ses.get('spon-rotation', 0) + 1)
}

/* Two different refusals, and the difference is how long they last.

   Minimise is "not now": session only, collapses to a static image, and the
   banner is back next session. Dismiss is "not for me": it persists, and the
   campaign drops out of rotation for this student entirely. Both are offered
   so they can be tested against each other. */
export const minimised = () => ses.get('spon-minimised', [])
export const isMinimised = (id) => minimised().includes(id)
export function setMinimised(id, on) {
  const now = minimised().filter((x) => x !== id)
  ses.set('spon-minimised', on ? [...now, id] : now)
}

const loc = {
  get: (k, f) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : f } catch { return f } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch { /* ignore */ } },
}

export const dismissed = () => loc.get('spon-dismissed', [])
export const isDismissed = (id) => dismissed().includes(id)
export function setDismissed(id, on) {
  const now = dismissed().filter((x) => x !== id)
  loc.set('spon-dismissed', on ? [...now, id] : now)
}

/* Which refusal the student is offered. A prototype control: Navigate has
   confirmed both exist, but not yet whether a student gets one or the choice. */
export const CONTROLS = {
  both: 'Minimise and dismiss',
  minimise: 'Minimise only',
  dismiss: 'Dismiss only',
}
export const controls = () => { try { return localStorage.getItem('spon-controls') || 'both' } catch { return 'both' } }
export const setControls = (v) => { try { localStorage.setItem('spon-controls', v) } catch { /* ignore */ } }

/* Placement is a prototype control, not part of the model: it exists so the
   three options can be shown side by side before one is chosen. */
export const PLACEMENTS = {
  takeover: 'Takes over the Opportunities panel',
  beside: 'Sits alongside, as its own panel',
  welcome: 'Sits in the welcome banner',
  strip: 'Announcement strip at the top',
}
export const placement = () => {
  try { return localStorage.getItem('spon-placement') || 'takeover' } catch { return 'takeover' }
}
export const setPlacement = (v) => { try { localStorage.setItem('spon-placement', v) } catch { /* ignore */ } }

/* ---------- engagement log ---------- */

/* Four event types come from the diagram. The refusals do not — they were
   agreed after it was drawn, so they are logged and flagged, because whoever
   builds the real thing needs them added to the model rather than discovered. */
export const EVENT = {
  shown: { label: 'Advert shown', inFlow: true },
  'advert-clicked': { label: 'Advert clicked', inFlow: true },
  'content-viewed': { label: 'Content page viewed', inFlow: true },
  interaction: { label: 'Interaction', inFlow: true },
  minimised: { label: 'Advert minimised', inFlow: false },
  restored: { label: 'Advert restored', inFlow: false },
  dismissed: { label: 'Advert dismissed', inFlow: false },
}

const LOG = 'spon-log'
const readRaw = () => { try { return JSON.parse(localStorage.getItem(LOG) || '[]') } catch { return [] } }

export const readLog = () => readRaw()
export const clearLog = () => { try { localStorage.removeItem(LOG) } catch { /* ignore */ } }

export function logEvent(campaignId, type, detail = {}) {
  const entries = readRaw()
  /* The diagram logs a view on every home page load. Phil's instinct is one per
     student per campaign. Rather than choose, every entry carries whether it was
     the first of its kind, so both numbers can be read off the same log. */
  const first = !entries.some((e) => e.campaignId === campaignId && e.type === type && e.detail?.action === detail.action)
  const entry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    ts: new Date().toISOString(),
    studentId: STUDENT.id,
    campaignId,
    type,
    detail: { ...detail, first },
  }
  try { localStorage.setItem(LOG, JSON.stringify([...entries, entry])) } catch { /* ignore */ }
  return entry
}

/* What a sponsor would actually receive: counts, never a student. */
export function aggregate() {
  const entries = readRaw()
  return CAMPAIGNS.map((c) => {
    const mine = entries.filter((e) => e.campaignId === c.id)
    const count = (type, extra = () => true) => mine.filter((e) => e.type === type && extra(e)).length
    return {
      campaign: c,
      views: count('shown', (e) => e.detail?.form !== 'minimised'),
      uniqueViews: count('shown', (e) => e.detail?.first && e.detail?.form !== 'minimised'),
      clicks: count('advert-clicked'),
      contentViews: count('content-viewed'),
      interactions: count('interaction'),
      completions: mine.filter((e) => e.type === 'interaction' && e.detail?.action === 'video-complete').length,
      downloads: mine.filter((e) => e.type === 'interaction' && e.detail?.action === 'download').length,
      minimises: count('minimised'),
      dismisses: count('dismissed'),
    }
  })
}
