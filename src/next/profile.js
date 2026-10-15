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
    teach: "There are 138 subject areas to choose from. You don't need to be certain, and picking a few is completely normal.",
    question: 'What are you drawn to?',
    help: 'Pick as many as you like. You can change this later.',
  },
  {
    id: 'distance', core: true, weight: 20, kind: 'choice',
    eyebrow: 'Where you would go',
    teach: 'About half of students stay within an hour of home. Staying local is the biggest single thing that brings the cost down, if that matters to you.',
    question: 'How far from college would you go?',
    options: [
      { v: 'home', label: 'Stay close to home', hint: 'Within about 20 miles, so you could live at home' },
      { v: 'nearby', label: 'Not too far', hint: 'Up to a couple of hours away' },
      { v: 'anywhere', label: 'Anywhere in the UK', hint: "Distance isn't an issue for me" },
      { v: 'unsure', label: "I'm not sure yet", hint: "That's fine, we'll show you everything" },
    ],
  },
  {
    id: 'cost', core: true, weight: 16, kind: 'choice',
    eyebrow: 'Money',
    teach: "Tuition is capped at £9,535 a year and a loan covers all of it, so you pay nothing up front. You only start repaying once you're earning over a certain amount, and anything left is written off. What really varies is rent and living costs.",
    question: 'With that in mind, how do you feel about the money?',
    options: [
      { v: 'worried', label: 'It still worries me', hint: "We'll show you what each place costs to live in" },
      { v: 'factor', label: 'A factor, not the decider', hint: '' },
      { v: 'fine', label: "It won't be what decides it", hint: '' },
    ],
  },
  {
    id: 'grades', core: true, weight: 18, kind: 'grades',
    eyebrow: 'Where you are academically',
    teach: 'Offers are usually given in UCAS points. Plenty of people get in below the published offer, so this is just to help you aim.',
    question: 'What are you predicted?',
    help: "A rough idea is fine, and you can skip it if you'd rather.",
  },
  {
    id: 'place', weight: 10, kind: 'choice',
    eyebrow: 'The kind of place',
    teach: 'Campus universities put everything on one site, which can feel like a ready made community. City universities are spread through the streets, so it feels more like moving to the city itself.',
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
    teach: 'University is mostly independent study. A typical arts course has around 10 hours of teaching a week, and the rest is up to you.',
    question: 'How do you feel about that?',
    options: [
      { v: 'love', label: 'That suits me', hint: 'I work better on my own terms' },
      { v: 'ok', label: 'I could adapt', hint: '' },
      { v: 'prefer-doing', label: "I'd rather be doing", hint: 'Worth a look at apprenticeships too' },
    ],
  },
  {
    id: 'support', weight: 8, kind: 'choice',
    eyebrow: 'Who is around you',
    teach: "Around half of students are the first in their family to go. If that's you, it just means you'll have more questions, and that's fine.",
    question: 'Has anyone close to you been to university?',
    options: [
      { v: 'yes', label: 'Yes, a few people', hint: '' },
      { v: 'one', label: 'One person', hint: '' },
      { v: 'no', label: "No, I'd be the first", hint: "We'll explain more as we go" },
    ],
  },
  {
    id: 'why', weight: 14, kind: 'choice',
    eyebrow: 'What you want from it',
    teach: "There's no right answer here, and plenty of people genuinely don't know yet.",
    question: 'What would make the next few years worth it?',
    options: [
      { v: 'career', label: 'A specific career', hint: 'I know roughly what job I want' },
      { v: 'subject', label: 'Studying something I love', hint: '' },
      { v: 'experience', label: 'The experience and independence', hint: '' },
      { v: 'unsure', label: "I honestly don't know", hint: 'That is a completely normal answer' },
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
