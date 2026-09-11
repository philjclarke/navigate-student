/* Ignite Talent partner content — the commercial tier.

   Partners (employers, training providers, universities) pay to appear. The
   rules that keep that honest:
   - An item only exists if it DEVELOPS a readiness step AND leads to a CTA.
     A pure advert has no slot to sit in.
   - Navigate decides which step an item counts towards. Partners don't
     self-declare.
   - CTAs stay inside Navigate: applying creates an Opportunity application
     that goes to the tutor for review, exactly like a placement does.
   - Partner content never appears in "Navigate suggests" or "What we
     recommend". It has its own labelled rail.
   - The CTA is soft-gated: always reachable, but only prominent once the
     student has engaged with the content that prepares them for it. */

import { COLLEGE, distanceMiles, travelLabel } from './locations'

/* Opportunities are the things a CTA leads to. They live in Navigate. */
export const PARTNER_OPPORTUNITIES = [
  { id: 'kp-pcda', kind: 'apprenticeship', route: 'apprenticeship', title: 'Police Constable Degree Apprenticeship', provider: 'Kent Police', closes: '15 Jan 2027', salary: '£29,000 while you train', location: { city: 'Maidstone', lat: 51.27, lng: 0.52 } },
  { id: 'wa-trainee', kind: 'job', route: 'work', title: 'Trainee Field Archaeologist', provider: 'Wessex Archaeology', closes: '30 Nov 2026', salary: '£23,500', location: { city: 'Rochester', lat: 51.39, lng: 0.5 } },
  { id: 'bt-arb', kind: 'apprenticeship', route: 'apprenticeship', title: 'Level 2 Arborist Apprenticeship', provider: 'Bartlett Tree Experts', closes: 'Rolling', salary: '£17,000 rising to £22,000', location: { city: 'Sevenoaks', lat: 51.27, lng: 0.19 } },
  { id: 'ekc-tlevel', kind: 'tlevel', route: 'tlevel', title: 'T-Level in Design, Surveying and Planning', provider: 'EKC Group', closes: 'Apply for September 2027', salary: null, location: { city: 'Canterbury', lat: 51.28, lng: 1.08 } },
  { id: 'kcc-admin', kind: 'apprenticeship', route: 'apprenticeship', title: 'Level 3 Business Administrator Apprenticeship', provider: 'Kent County Council', closes: '10 Dec 2026', salary: '£19,200', location: { city: 'Maidstone', lat: 51.27, lng: 0.52 } },
  { id: 'nhs-hcsw', kind: 'job', route: 'work', title: 'Healthcare Support Worker', provider: 'Medway NHS Foundation Trust', closes: 'Rolling', salary: '£24,100', location: { city: 'Gillingham', lat: 51.39, lng: 0.55 } },
  { id: 'ccc-access', kind: 'course', route: 'training', title: 'Access to HE: Humanities and Social Sciences', provider: 'Canterbury College', closes: 'Apply for January 2027', salary: null, location: { city: 'Canterbury', lat: 51.28, lng: 1.08 } },
  { id: 'kent-openday', kind: 'event', route: 'degree', title: 'Autumn Open Day', provider: 'University of Kent', closes: '17 Oct 2026', salary: null, location: { city: 'Canterbury', lat: 51.30, lng: 1.07 } },
  { id: 'cccu-openday', kind: 'event', route: 'degree', title: 'Archaeology Taster Day', provider: 'Canterbury Christ Church University', closes: '7 Nov 2026', salary: null, location: { city: 'Canterbury', lat: 51.28, lng: 1.08 } },
]

/* Content items: each develops one readiness step on one route, and leads to
   one opportunity. `step` is the index into that section's "preparing for"
   list — Navigate's choice, not the partner's. */
export const PARTNER_ITEMS = [
  { id: 'kp-assessment', provider: 'Kent Police', kind: 'video', minutes: 6, title: 'What our assessment day actually involves', blurb: 'Two recent apprentices walk through the day, the competency questions and what the assessors are looking for.', develops: { route: 'apprenticeship', step: 1 }, opportunity: 'kp-pcda' },
  { id: 'bt-taster', provider: 'Bartlett Tree Experts', kind: 'event', minutes: 180, title: 'Chainsaw and climbing taster morning', blurb: 'Spend a morning with our Sevenoaks crew. No experience needed. Counts as a placement day on your timeline.', develops: { route: 'apprenticeship', step: 2 }, opportunity: 'bt-arb' },
  { id: 'kcc-cv', provider: 'Kent County Council', kind: 'quiz', minutes: 10, title: 'Would your CV get past our first sift?', blurb: 'Ten questions based on what our recruiters actually reject. You get your answers explained at the end.', develops: { route: 'apprenticeship', step: 0 }, opportunity: 'kcc-admin' },
  { id: 'wa-hiring', provider: 'Wessex Archaeology', kind: 'article', minutes: 5, title: 'How we choose trainee site assistants', blurb: 'Written by the person who does the interviews. What matters, what doesn\'t, and the one thing every strong candidate does.', develops: { route: 'work', step: 1 }, opportunity: 'wa-trainee' },
  { id: 'nhs-shift', provider: 'Medway NHS Foundation Trust', kind: 'video', minutes: 8, title: 'A shift with a healthcare support worker', blurb: 'Aisha, 19, films a real early shift on a medical ward, including the bits nobody warns you about.', develops: { route: 'work', step: 0 }, opportunity: 'nhs-hcsw' },
  { id: 'ekc-placement', provider: 'EKC Group', kind: 'video', minutes: 7, title: 'The 45-day industry placement, explained by students', blurb: 'Three current T-Level students on where they were placed, what they did and how it was assessed.', develops: { route: 'tlevel', step: 2 }, opportunity: 'ekc-tlevel' },
  { id: 'ccc-bridge', provider: 'Canterbury College', kind: 'article', minutes: 4, title: 'Is an Access course the right bridge for you?', blurb: 'Who Access courses are for, what a year looks like, and how universities treat them at application.', develops: { route: 'training', step: 1 }, opportunity: 'ccc-access' },
  { id: 'kent-priya', provider: 'University of Kent', kind: 'video', minutes: 9, title: 'Meet Priya, first-year Archaeology', blurb: 'A week in Priya\'s life: lectures, the dig lab, halls, and what she wishes she\'d asked at the open day.', develops: { route: 'degree', step: 2 }, opportunity: 'kent-openday' },
  { id: 'cccu-statement', provider: 'Canterbury Christ Church University', kind: 'quiz', minutes: 12, title: 'Personal statement: what our admissions team scores', blurb: 'Rate three real anonymised statements against our criteria, then see how our tutors scored them.', develops: { route: 'degree', step: 0 }, opportunity: 'cccu-openday' },
]

const oppIndex = new Map(PARTNER_OPPORTUNITIES.map((o) => [o.id, o]))
export const opportunityById = (id) => oppIndex.get(id)

function withDistance(o) {
  const miles = o.location ? distanceMiles(COLLEGE, o.location) : null
  return { ...o, miles, travel: travelLabel(miles) }
}

export const itemsForRoute = (route) =>
  PARTNER_ITEMS.filter((i) => i.develops.route === route)
    .map((i) => ({ ...i, opp: withDistance(opportunityById(i.opportunity)) }))
    .sort((a, b) => (a.opp.miles ?? 999) - (b.opp.miles ?? 999))

export const itemsForStep = (route, step) => itemsForRoute(route).filter((i) => i.develops.step === step)

export const itemsForProvider = (name) =>
  PARTNER_ITEMS.filter((i) => i.provider === name).map((i) => ({ ...i, opp: withDistance(opportunityById(i.opportunity)) }))

export const opportunitiesForRoute = (route) =>
  PARTNER_OPPORTUNITIES.filter((o) => o.route === route).map(withDistance)

export const CTA_LABEL = { apprenticeship: 'Apply for this apprenticeship', job: 'Apply for this job', tlevel: 'Apply for this T-Level', course: 'Apply for this course', event: 'Book a place' }
export const ENGAGE_LABEL = { video: 'Watch', article: 'Read', quiz: 'Take the quiz', event: 'Register' }

/* ---------- state ---------- */
const read = (k, fb) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb } catch { return fb } }
const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch { /* ignore */ } }

export const loadEngaged = () => read('partner-engaged', [])
export const saveEngaged = (ids) => write('partner-engaged', ids)

/* A partner CTA creates an Opportunity application inside Navigate. It goes
   to the tutor for review first, exactly as a placement application does. */
export const loadPartnerApplications = () => read('partner-applications', [])
export const savePartnerApplications = (a) => write('partner-applications', a)
