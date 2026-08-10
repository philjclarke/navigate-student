/* Build a small public-safe HEAP sample from the full local extract.
   Full data (src/data/heap/full/) is gitignored; only this sample is committed.
   Run: node scripts/make-heap-sample.js */
const fs = require('fs')
const path = require('path')

const HEAP = path.join(__dirname, '..', 'src', 'data', 'heap')
const FULL = path.join(HEAP, 'full')
const OUT = path.join(HEAP, 'sample')

const SEEDS = ['ARCHAEOLOGY', 'HISTORY (ANCIENT)', 'ANTHROPOLOGY']
const MAX_SUBJECTS = 12

const subjects = JSON.parse(fs.readFileSync(path.join(FULL, 'subjects.json')))
const courses = JSON.parse(fs.readFileSync(path.join(FULL, 'courses.json')))
const unis = JSON.parse(fs.readFileSync(path.join(FULL, 'universities.json')))

const byName = new Map(subjects.map((s) => [s.Subject, s]))
const picked = new Set(SEEDS)
for (const seed of SEEDS) {
  for (const rel of (byName.get(seed)?.RelatedSubjects || '').split('|')) {
    const name = rel.trim()
    if (name && byName.has(name) && picked.size < MAX_SUBJECTS) picked.add(name)
  }
}

const sampleSubjects = subjects.filter((s) => picked.has(s.Subject))
const sampleCourses = courses.filter((c) =>
  (c.RelatedSubjectAreas || '').split('|').some((a) => picked.has(a)),
)
const usedUnis = new Set(sampleCourses.map((c) => c.University))
const sampleUnis = unis.filter((u) => usedUnis.has(u.University))

fs.mkdirSync(OUT, { recursive: true })
fs.writeFileSync(path.join(OUT, 'subjects.json'), JSON.stringify(sampleSubjects))
fs.writeFileSync(path.join(OUT, 'courses.json'), JSON.stringify(sampleCourses))
fs.writeFileSync(path.join(OUT, 'universities.json'), JSON.stringify(sampleUnis))
console.log(
  `sample: ${sampleSubjects.length} subjects, ${sampleCourses.length} courses, ${sampleUnis.length} universities`,
)
