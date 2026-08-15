/* Fabricated student model for the prototype.
   In production this would be derived from journals, assessments, favourited
   careers, viewed content and the declared destination.

   Three separate numbers, deliberately kept distinct:

   - CONFIDENCE  how well Navigate knows the student, per route. Raised by
                 surveys and assessments. Low confidence is a prompt, not a
                 silence — it's the main defence against us only ever learning
                 about routes the student already favours.
   - GAUGE       which direction the student is leaning. Ours to suggest,
                 theirs to set. We only ever move our own marker.
   - READINESS   how prepared they are for a route, expressed as steps
                 completed — never a prediction of success. Raised by the
                 "preparing for…" activities. */

export const student = {
  name: 'Jason',
  stage: 'post-18', // post-16 | post-18 — decides which routes are even relevant
  destination: { pathway: 'University (EDU-6)', focus: 'Archaeology' },
  skillsFocus: ['Building Relationships', 'Collaboration', 'Communication', 'Customer Service', 'Enterprising', 'Physical Health'],
  favouritedCareers: ['Arborist/Tree Surgeon', 'Cartoonist'],
}

/* Per-route confidence (0–100) and readiness (steps completed of total). */
export const routeState = {
  apprenticeship: {
    confidence: 24,
    readiness: { done: 1, total: 7 },
    gap: 'We know least about how you\'d feel about earning while you learn',
  },
  tlevel: {
    confidence: 31,
    readiness: { done: 2, total: 6 },
    gap: 'You haven\'t told us much about technical study yet',
  },
  work: {
    confidence: 58,
    readiness: { done: 3, total: 5 },
    gap: null,
  },
  degree: {
    confidence: 79,
    readiness: { done: 4, total: 8 },
    gap: null,
  },
}

/* Overall confidence is the weakest link, not the average — we're only as
   sure about a recommendation as we are about the option we know least well. */
export function overallConfidence() {
  const vals = Object.values(routeState).map((r) => r.confidence)
  return Math.round((Math.min(...vals) + vals.reduce((a, b) => a + b, 0) / vals.length) / 2)
}

export function leastKnownRoute() {
  return Object.entries(routeState).sort((a, b) => a[1].confidence - b[1].confidence)[0][0]
}

/* Surveys and assessments that would raise confidence. */
export const surveys = [
  { title: 'Personal & Professional Skills Assessment', progress: 60, raises: 'all routes', cta: 'Continue' },
  { title: 'What matters to you about work?', progress: 0, raises: 'apprenticeships and jobs', cta: 'Start — 3 mins' },
  { title: 'How do you feel about studying?', progress: 0, raises: 'university and technical study', cta: 'Start — 2 mins' },
  { title: 'Where could you see yourself living?', progress: 100, raises: 'all routes', cta: 'Review answers' },
]

/* Signals behind the gauge suggestion. */
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
