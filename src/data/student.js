/* Fabricated student signal model for the prototype.
   In production this would be derived from journals, assessments,
   favourited careers, viewed content and the declared destination. */

export const student = {
  name: 'Jason',
  destination: { pathway: 'University (EDU-6)', focus: 'Archaeology' },
  skillsFocus: ['Building Relationships', 'Collaboration', 'Communication', 'Customer Service', 'Enterprising', 'Physical Health'],
  favouritedCareers: ['Arborist/Tree Surgeon', 'Cartoonist'],
}

/* Signals that feed the direction suggestion — each nudges the lean
   towards work (negative) or university (positive). */
export const signals = [
  { label: 'Your declared destination is University (EDU-6) — Archaeology', weight: +30, source: 'Profile' },
  { label: '31 activities logged for Building Relationships suggests you thrive working with people', weight: -5, source: 'Timeline' },
  { label: 'Your placement journals mention enjoying hands-on, practical work', weight: -15, source: 'Placement journal' },
  { label: 'Strong Communication results in your latest skills assessment', weight: +10, source: 'Skills assessment' },
  { label: 'You favourited Arborist/Tree Surgeon — a career with vocational entry routes', weight: -10, source: 'My Future' },
  { label: 'You viewed 4 university-level careers in the Careers Bank this term', weight: +8, source: 'Careers Bank' },
]

/* 0 = straight into work, 100 = university. */
export function suggestedLean() {
  const base = 50
  const total = signals.reduce((acc, s) => acc + s.weight, 0)
  return Math.max(5, Math.min(95, base + total))
}

/* Subject interests seeded from the destination + related HEAP subjects. */
export const seededInterests = ['ARCHAEOLOGY', 'HISTORY (ANCIENT)', 'ANTHROPOLOGY']

const STORAGE_KEY = 'navigate-direction'

export function loadDirection() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return { lean: null, interests: seededInterests, baselined: false }
}

export function saveDirection(dir) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dir))
}
