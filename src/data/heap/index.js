/* Uses the full HEAP extract when present (src/data/heap/full/ — local only,
   gitignored) and falls back to the committed public-safe sample otherwise
   (e.g. on Vercel). Regenerate the sample with scripts/make-heap-sample.cjs. */
import sampleSubjects from './sample/subjects.json'
import sampleCourses from './sample/courses.json'
import sampleUniversities from './sample/universities.json'

const full = import.meta.glob('./full/*.json', { eager: true })
const pick = (name, fallback) => full[`./full/${name}.json`]?.default ?? fallback

const subjects = pick('subjects', sampleSubjects)
const courses = pick('courses', sampleCourses)
const universities = pick('universities', sampleUniversities)

export const allSubjects = subjects
export const allUniversities = universities

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

/* Group a subject's courses by university, sorted by number of matching courses */
export function coursesGroupedByUni(name) {
  const groups = new Map()
  for (const c of coursesForSubject(name)) {
    if (!groups.has(c.University)) groups.set(c.University, [])
    groups.get(c.University).push(c)
  }
  return [...groups.entries()].sort((a, b) => b[1].length - a[1].length)
}
