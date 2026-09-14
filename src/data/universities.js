/* The university finder's engine: matches HEAP courses against how a student
   wants to live and study, tags entry offers against their predicted grades,
   and keeps the shortlist, plan and application intents in local storage. */
import { allUniversities, allCourses, coursesForSubject, subjectByName, titleCase } from './heap'
import { COLLEGE, locateInstitution, distanceMiles, travelLabel, SETTING_LABEL } from './locations'

/* ---------- entry offers vs predicted grades ---------- */

export const GRADE_POINTS = { 'A*': 56, A: 48, B: 40, C: 32, D: 24, E: 16 }

export function gradesToPoints(grades) {
  if (!grades) return null
  const s = grades.toUpperCase().replace(/\s/g, '')
  let total = 0
  let any = false
  for (let i = 0; i < s.length; i++) {
    const two = s.slice(i, i + 2)
    if (two === 'A*') { total += 56; any = true; i++; continue }
    const p = GRADE_POINTS[s[i]]
    if (p) { total += p; any = true }
  }
  return any ? total : null
}

export function offerPoints(course) {
  const m = (course.PointsOfferBand || '').match(/(\d{2,3})/)
  if (m) return Number(m[1])
  const bare = (course.GradesOffer || '').trim().replace(/\.$/, '')
  return /^[A-E*]{2,4}$/i.test(bare) ? gradesToPoints(bare) : null
}

/* HEAP has no placement-year flag. Only claim one when the course says so. */
export const hasPlacementYear = (course) =>
  /sandwich|placement|industr|professional practice|year in industry/i.test(
    `${course.CourseName || ''} ${course.LengthOfFullTimeCourse || ''}`,
  )

/* safe / reach / stretch, or null when either side is unknown. */
export function reachFor(studentPoints, course) {
  const offer = offerPoints(course)
  if (!studentPoints || !offer) return null
  const diff = studentPoints - offer
  if (diff >= 16) return 'safe'
  if (diff >= -8) return 'reach'
  return 'stretch'
}

export const REACH_LABEL = {
  safe: 'Comfortably within reach',
  reach: 'Within reach',
  stretch: 'A stretch — worth aiming for',
}

/* ---------- institutions ---------- */

const uniIndex = new Map(allUniversities.map((u) => [u.University, u]))
const locCache = new Map()

export function institution(name) {
  const u = uniIndex.get(name)
  if (!u) return null
  if (!locCache.has(name)) locCache.set(name, locateInstitution(name))
  const location = locCache.get(name)
  const miles = location ? distanceMiles(COLLEGE, location) : null
  return { ...u, location, miles, travel: travelLabel(miles), courses: coursesAt(name) }
}

export function coursesAt(name) {
  return allCourses.filter((c) => c.University === name)
}

/* ---------- preferences ---------- */

export const DEFAULT_PREFS = {
  where: 'nearby',        // home | nearby | anywhere
  setting: 'any',         // city | campus | town | coastal | any
  cost: 'balance',        // low | balance | not-deciding
  shape: 'any',           // three | placement | any
  grades: '',             // e.g. "BBC" — optional
  subjects: ['ARCHAEOLOGY', 'HISTORY (ANCIENT)', 'ANTHROPOLOGY'],
}

const WHERE_MILES = { home: 20, nearby: 90, anywhere: Infinity }

/* What we already know — pre-fills the investigation. In production these
   come from placements, assessments and the declared destination. */
export const KNOWN = [
  { label: 'Your placement journals talk about liking practical, hands-on work', implies: 'Courses with fieldwork or a placement year score higher' },
  { label: 'Both your placements were within 10 miles of college', implies: 'We\'ve started you on "nearby", not "anywhere"' },
  { label: 'Your declared destination is Archaeology at university', implies: 'Archaeology and its related subjects are pre-selected' },
  { label: 'Strong Communication in your last skills assessment', implies: 'Nothing to change — but it\'ll matter for interviews' },
]

export const courseKey = (c) => `${c.University}||${c.CourseName}`

/* ---------- matching ---------- */

export function findCourses(prefs) {
  const studentPoints = gradesToPoints(prefs.grades)
  const maxMiles = WHERE_MILES[prefs.where] ?? Infinity
  const seen = new Set()
  const out = []

  for (const subj of prefs.subjects) {
    for (const c of coursesForSubject(subj)) {
      const key = courseKey(c)
      if (seen.has(key)) continue
      seen.add(key)

      const inst = institution(c.University)
      const miles = inst?.miles ?? null
      if (prefs.where !== 'anywhere' && (miles == null || miles > maxMiles)) continue

      let score = 0
      const reasons = []

      reasons.push(`${titleCase(subj)} — one of your subjects`)
      if (miles != null) {
        if (miles <= 20) { score += 30; reasons.push('Close enough to commute from home') }
        else if (miles <= 50) { score += 22; reasons.push('About an hour from college') }
        else if (miles <= 120) { score += 10 }
      }
      /* A preference, not a filter: a coastal campus two hours away shouldn't
         outrank a good local course, but it should climb the list. */
      if (prefs.setting !== 'any' && inst?.location?.setting === prefs.setting) {
        score += 15; reasons.push(`${SETTING_LABEL[prefs.setting]} setting, like you asked for`)
      }
      const len = c.LengthOfFullTimeCourse || ''
      if (prefs.shape === 'three' && /^3/.test(len)) { score += 8; reasons.push('Three-year course') }
      if (prefs.shape === 'placement' && hasPlacementYear(c)) {
        score += 12; reasons.push('Includes a placement year')
      }
      /* HEAP's Fees field holds INTERNATIONAL fees (median ~£18k), and it has no
         home-fee or living-cost data. Home fees are flat across the UK, so cost
         can't yet differentiate courses — the preference is recorded, not scored. */

      const reach = reachFor(studentPoints, c)
      if (reach === 'safe') score += 6
      if (reach === 'reach') score += 10
      if (reach === 'stretch') score += 2

      out.push({ ...c, key, subject: subj, inst, miles, reach, reasons, score })
    }
  }
  return out.sort((a, b) => b.score - a.score)
}

/* ---------- persisted state ---------- */

const read = (k, fallback) => {
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback } catch { return fallback }
}
const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch { /* ignore */ } }

export const loadPrefs = () => ({ ...DEFAULT_PREFS, ...read('uni-prefs', {}) })
export const savePrefs = (p) => write('uni-prefs', p)

export const loadShortlist = () => read('uni-shortlist', [])
export const saveShortlist = (s) => write('uni-shortlist', s)

export const loadPlan = () => read('uni-plan', [])        // activities pushed to the Timeline
export const savePlan = (p) => write('uni-plan', p)

export const loadApplications = () => read('uni-applications', [])
export const saveApplications = (a) => write('uni-applications', a)

export const loadSteps = () => read('uni-steps', {})      // manually ticked readiness steps
export const saveSteps = (s) => write('uni-steps', s)

/* University readiness — steps completed, never a prediction. Some steps are
   derived from what the student has actually done; the rest they tick. */
export function readinessSteps({ prefs, shortlist, plan, applications, steps }) {
  return [
    { id: 'investigate', label: 'Tell us how you want to live and study', done: !!read('uni-prefs', null) },
    { id: 'grades', label: 'Add your predicted grades', done: !!prefs.grades },
    { id: 'shortlist', label: 'Shortlist three courses', done: shortlist.length >= 3 },
    { id: 'requirements', label: 'Check entry requirements against your grades', done: !!prefs.grades && shortlist.length > 0 },
    { id: 'research', label: 'Research a course in depth', done: plan.some((p) => /^research /i.test(p.title)) },
    { id: 'openday', label: 'Go to an open day', done: plan.some((p) => /open day/i.test(p.title)) },
    { id: 'statement', label: 'Draft your personal statement', done: !!steps.statement },
    { id: 'reference', label: 'Ask a tutor for a reference', done: !!steps.reference },
    { id: 'apply', label: 'Tell us which courses you\'re applying for', done: applications.length > 0 },
  ]
}

export function courseByKey(key) {
  const [u, n] = key.split('||')
  return allCourses.find((c) => c.University === u && c.CourseName === n) || null
}

export { COLLEGE, travelLabel, subjectByName }
