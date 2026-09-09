/* Uses the full HEAP extract when present (src/data/heap/full/ — local only,
   gitignored) and falls back to the committed public-safe sample otherwise
   (e.g. on Vercel). Regenerate the sample with scripts/make-heap-sample.cjs. */
import sampleSubjects from './sample/subjects.json'
import sampleCourses from './sample/courses.json'
import sampleUniversities from './sample/universities.json'

const full = import.meta.glob('./full/*.json', { eager: true })
const pick = (name, fallback) => full[`./full/${name}.json`]?.default ?? fallback

/* HEAP lives in varchar columns with a Latin-1 collation, so UTF-8 characters
   such as £ and – arrive double-encoded ("Â£", "â€"). Undo that once at load;
   anything that isn't pure Latin-1 or fails to decode is left untouched. */
/* The collation is Windows-1252, so bytes 0x80–0x9F surfaced as €, “, – etc.
   Map those back before treating the string as raw UTF-8 bytes. */
const CP1252 = { '€': 0x80, '‚': 0x82, 'ƒ': 0x83, '„': 0x84, '…': 0x85, '†': 0x86, '‡': 0x87, 'ˆ': 0x88,
  '‰': 0x89, 'Š': 0x8a, '‹': 0x8b, 'Œ': 0x8c, 'Ž': 0x8e, '‘': 0x91, '’': 0x92, '“': 0x93, '”': 0x94,
  '•': 0x95, '–': 0x96, '—': 0x97, '˜': 0x98, '™': 0x99, 'š': 0x9a, '›': 0x9b, 'œ': 0x9c, 'ž': 0x9e, 'Ÿ': 0x9f }
function fixText(s) {
  if (typeof s !== 'string' || !/[Ââ]/.test(s)) return s
  const bytes = new Uint8Array(s.length)
  for (let i = 0; i < s.length; i++) {
    const code = s.charCodeAt(i)
    if (code < 256) bytes[i] = code
    else if (CP1252[s[i]] != null) bytes[i] = CP1252[s[i]]
    else return s
  }
  try { return new TextDecoder('utf-8', { fatal: true }).decode(bytes) } catch { return s }
}
const repair = (rows) => rows.map((r) => {
  const o = {}
  for (const k in r) o[k] = fixText(r[k])
  return o
})

const subjects = repair(pick('subjects', sampleSubjects))
const courses = repair(pick('courses', sampleCourses))
const universities = repair(pick('universities', sampleUniversities))

export const allSubjects = subjects
export const allUniversities = universities
export const allCourses = courses

const uniIndex = new Map(universities.map((u) => [u.University, u]))

export function titleCase(s) {
  if (!s) return ''
  return s
    .toLowerCase()
    .replace(/\b[a-z]/g, (c) => c.toUpperCase())
    .replace(/\bAnd\b/g, 'and')
    .replace(/\bOf\b/g, 'of')
}

export const subjectSlug = (name) => encodeURIComponent(name)

export function subjectByName(name) {
  return subjects.find((s) => s.Subject === name)
}

export function coursesForSubject(name) {
  return courses.filter((c) =>
    (c.RelatedSubjectAreas || '').split('|').includes(name),
  )
}

export function universityInfo(name) {
  return uniIndex.get(name)
}

export function splitList(pipeString) {
  return (pipeString || '').split('|').map((s) => s.trim()).filter(Boolean)
}

/* Most commonly quoted grades offer across a subject's courses — used to
   ground pathway steps in real entry requirements rather than invented ones. */
export function typicalOfferForSubject(name) {
  const tally = new Map()
  for (const c of coursesForSubject(name)) {
    const offer = (c.GradesOffer || '').trim().replace(/\.$/, '')
    if (!/^[A-E*]{2,4}$/.test(offer)) continue
    tally.set(offer, (tally.get(offer) || 0) + 1)
  }
  if (!tally.size) return null
  return [...tally.entries()].sort((a, b) => b[1] - a[1])[0][0]
}

export function subjectReach(name) {
  const courses = coursesForSubject(name)
  return { courses: courses.length, institutions: new Set(courses.map((c) => c.University)).size }
}

/* Group a subject's courses by university, sorted by number of matching courses */
export function coursesGroupedByUni(name) {
  const groups = new Map()
  for (const c of coursesForSubject(name)) {
    if (!groups.has(c.University)) groups.set(c.University, [])
    groups.get(c.University).push(c)
  }
  return [...groups.entries()].sort((a, b) => b[1].length - a[1].length)
}
