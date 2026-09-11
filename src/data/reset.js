/* Prototype-only: wipe every choice the student has made so the demo can be
   walked through again from a clean state. Lists keys explicitly so a new
   store can't be forgotten silently. */
const KEYS = [
  'navigate-direction',   // gauge position, interests, wizard baseline
  'uni-prefs',            // university investigation answers
  'uni-shortlist',
  'uni-plan',             // activities sent to the timeline
  'uni-applications',
  'uni-steps',            // manually ticked readiness steps
  'partner-engaged',      // Ignite Talent items engaged with
  'partner-applications', // applications waiting for tutor review
]

export function resetPrototypeData() {
  try { KEYS.forEach((k) => localStorage.removeItem(k)) } catch { /* ignore */ }
  window.location.reload()
}
