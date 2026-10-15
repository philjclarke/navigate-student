/* The learner profile for the rebuilt prototype.

   One idea drives the whole design: CONFIDENCE decides what the student sees.
   Know little about them and the app is an onboarding conversation. Know more
   and it becomes a feed of things to do. Nothing is ever gated, and every
   question teaches before it asks, per the product philosophy. */

import { allSubjects } from '../data/heap'

const KEY = 'nx-profile'

export const BLANK = {
  answers: {},          // questionId -> value
  shortlist: [],        // course keys
  done: {},             // readiness step ids ticked
  seen: [],             // course keys viewed
  dismissed: [],        // feed card ids dismissed
  startedAt: null,
}

export const load = () => {
  try { return { ...BLANK, ...JSON.parse(localStorage.getItem(KEY) || '{}') } }
  catch { return { ...BLANK } }
}
export const save = (p) => { try { localStorage.setItem(KEY, JSON.stringify(p)) } catch { /* ignore */ } }
export const reset = () => { try { localStorage.removeItem(KEY) } catch { /* ignore */ } window.location.href = '/next' }

/* ---------- questions ----------
   Every question teaches first. `weight` is how much answering it tells us.
   `core` questions run in onboarding; the rest drip into the feed. */
export const QUESTIONS = [
  {
    id: 'subjects', core: true, weight: 22, kind: 'subjects',
    eyebrow: 'What you want to study',
    teach: 'There are 138 subject areas. You do not have to be certain, and picking more than one is normal.',
    question: 'What are you drawn to?',
    help: 'Pick as many as you like. You can change this at any time.',
  },
  {
    id: 'distance', core: true, weight: 20, kind: 'choice',
    eyebrow: 'Where you would go',
    teach: 'About half of UK students stay within an hour of home. Living at home is the single biggest thing you can do to cut the cost.',
    question: 'How far from college would you go?',
    options: [
      { v: 'home', label: 'Stay close', hint: 'Within about 20 miles, you could live at home' },
      { v: 'nearby', label: 'Not too far', hint: 'Up to a couple of hours away' },
      { v: 'anywhere', label: 'Anywhere in the UK', hint: 'Distance is not a problem' },
      { v: 'unsure', label: 'I am not sure yet', hint: 'Completely fine, we will show you everything' },
    ],
  },
  {
    id: 'cost', core: true, weight: 16, kind: 'choice',
    eyebrow: 'Money',
    teach: 'Tuition is capped at £9,535 a year and a loan covers all of it, so you pay nothing up front. You only repay once you earn over a threshold, and anything left is written off. The real cost difference is rent and living.',
    question: 'Now you know that, how does the money feel?',
    options: [
      { v: 'worried', label: 'Still a worry', hint: 'We will show you what each place costs to live in' },
      { v: 'factor', label: 'A factor, not the decider', hint: '' },
      { v: 'fine', label: 'Not what I will decide on', hint: '' },
    ],
  },
  {
    id: 'grades', core: true, weight: 18, kind: 'grades',
    eyebrow: 'Where you are academically',
    teach: 'Offers are usually quoted in UCAS points. Plenty of people get in below the published offer, so this is here to help you aim, not to rule anything out.',
    question: 'What are you predicted?',
    help: 'Rough is fine. Leave it blank and we will just show you the offers.',
  },
  {
    id: 'place', weight: 10, kind: 'choice',
    eyebrow: 'The kind of place',
    teach: 'Campus universities put everything on one site, which can feel like a ready made community. City universities are spread through the streets and feel more like moving to the city itself.',
    question: 'Which sounds more like you?',
    options: [
      { v: 'campus', label: 'A campus', hint: 'Everything in one place' },
      { v: 'city', label: 'A city', hint: 'Part of a bigger place' },
      { v: 'either', label: 'Either', hint: '' },
    ],
  },
  {
    id: 'learning', weight: 12, kind: 'choice',
    eyebrow: 'How you like to learn',
    teach: 'University is mostly independent. A typical arts course has around 10 hours of teaching a week and expects you to fill the rest yourself.',
    question: 'How do you feel about that?',
    options: [
      { v: 'love', label: 'That suits me', hint: 'I work better on my own terms' },
      { v: 'ok', label: 'I could adapt', hint: '' },
      { v: 'prefer-doing', label: 'I would rather be doing', hint: 'Worth looking at apprenticeships too' },
    ],
  },
  {
    id: 'support', weight: 8, kind: 'choice',
    eyebrow: 'Who is around you',
    teach: 'Around half of students are the first in their family to go. If that is you, it means more questions, not fewer chances.',
    question: 'Has anyone close to you been to university?',
    options: [
      { v: 'yes', label: 'Yes, a few people', hint: '' },
      { v: 'one', label: 'One person', hint: '' },
      { v: 'no', label: 'No, I would be first', hint: 'We will explain more as we go' },
    ],
  },
  {
    id: 'why', weight: 14, kind: 'choice',
    eyebrow: 'What you want from it',
    teach: 'There is no right answer here, and plenty of people genuinely do not know yet.',
    question: 'What would make the next three years worth it?',
    options: [
      { v: 'career', label: 'A specific career', hint: 'I know roughly what job I want' },
      { v: 'subject', label: 'Studying something I love', hint: '' },
      { v: 'experience', label: 'The experience and independence', hint: '' },
      { v: 'unsure', label: 'I honestly do not know', hint: 'That is a real answer, not a cop out' },
    ],
  },
]

export const CORE = QUESTIONS.filter((q) => q.core)
export const questionById = (id) => QUESTIONS.find((q) => q.id === id)

export const isAnswered = (p, id) => {
  const v = p.answers[id]
  if (v === undefined || v === null) return false
  if (Array.isArray(v)) return v.length > 0
  return v !== ''
}

/* Confidence is the share of possible signal we actually hold. */
export function confidence(p) {
  const total = QUESTIONS.reduce((n, q) => n + q.weight, 0)
  const got = QUESTIONS.reduce((n, q) => n + (isAnswered(p, q.id) ? q.weight : 0), 0)
  return Math.round((got / total) * 100)
}

export const unanswered = (p) => QUESTIONS.filter((q) => !isAnswered(p, q.id))
export const coreComplete = (p) => CORE.every((q) => isAnswered(p, q.id))

/* ---------- readiness: steps completed, never a prediction ---------- */
export function readiness(p) {
  const steps = [
    { id: 'subjects', label: 'Tell us what you want to study', done: isAnswered(p, 'subjects') },
    { id: 'life', label: 'Tell us how you want to live', done: isAnswered(p, 'distance') && isAnswered(p, 'cost') },
    { id: 'grades', label: 'Add your predicted grades', done: isAnswered(p, 'grades') },
    { id: 'shortlist', label: 'Shortlist three courses', done: p.shortlist.length >= 3 },
    { id: 'research', label: 'Research one in depth', done: !!p.done.research },
    { id: 'openday', label: 'Go to an open day', done: !!p.done.openday },
    { id: 'statement', label: 'Draft your personal statement', done: !!p.done.statement },
    { id: 'reference', label: 'Ask a tutor for a reference', done: !!p.done.reference },
  ]
  return { steps, done: steps.filter((s) => s.done).length, total: steps.length }
}

/* Preferences in the shape the existing matcher understands. */
export function toPrefs(p) {
  const a = p.answers
  return {
    where: a.distance === 'unsure' ? 'anywhere' : (a.distance || 'anywhere'),
    setting: a.place === 'campus' ? 'campus' : a.place === 'city' ? 'city' : 'any',
    cost: a.cost || 'balance',
    shape: 'any',
    grades: a.grades || '',
    subjects: a.subjects && a.subjects.length ? a.subjects : ['ARCHAEOLOGY'],
  }
}

export const subjectOptions = () => allSubjects.map((s) => s.Subject)
