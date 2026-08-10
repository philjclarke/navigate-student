/* Study routes — the step-by-step ways into a career.
   Distinct from a HEAP subject area (a field of study): a route is a path with
   an entry point, stages, a duration and a cost, and it sits somewhere on the
   same work <-> university spectrum as the direction dial.

   `subject` links a route to a real HEAP subject area so the degree stage can
   quote live course counts and typical offers. */

export const ROUTE_TYPES = {
  work: { label: 'Straight into work', lean: 12, accent: 'teal' },
  apprenticeship: { label: 'Earn while you learn', lean: 45, accent: 'amber' },
  degree: { label: 'University degree', lean: 88, accent: 'purple' },
}

const P = {
  'field-archaeologist': [
    {
      type: 'degree', name: 'Archaeology degree', subject: 'ARCHAEOLOGY',
      duration: '5 years from now', earn: 'Student finance — no salary while you study',
      steps: [
        { label: 'Level 3', detail: 'A-levels or BTEC. History, geography or a science preferred', duration: '2 years', kind: 'college' },
        { label: 'Archaeology degree', detail: 'BA or BSc, often with fieldwork built in', duration: '3 years', kind: 'university' },
        { label: 'Training digs', detail: 'Summer excavations alongside your course', duration: 'Each summer', kind: 'work' },
        { label: 'Site assistant', detail: 'First paid role with a commercial unit', kind: 'job' },
      ],
    },
    {
      type: 'apprenticeship', name: 'Historic environment apprenticeship', subject: 'ARCHAEOLOGY',
      duration: '6 years from now', earn: 'Salaried throughout, tuition paid by your employer',
      steps: [
        { label: 'Level 3', detail: 'A-levels or BTEC alongside volunteering on local digs', duration: '2 years', kind: 'college' },
        { label: 'Apprentice archaeologist', detail: 'Paid work with a commercial unit, degree studied part-time', duration: '4 years', kind: 'apprenticeship' },
        { label: 'Qualified field archaeologist', detail: 'Degree and experience, no student debt', kind: 'job' },
      ],
    },
    {
      type: 'work', name: 'Straight onto site',
      duration: '2–3 years from now', earn: 'Earning from the start, lower starting pay',
      steps: [
        { label: 'Field school', detail: 'A short excavation course or community dig', duration: 'Weeks', kind: 'college' },
        { label: 'Site assistant', detail: 'Entry-level digging role with a commercial unit', kind: 'job' },
        { label: 'CIfA qualifications', detail: 'Professional accreditation gained on the job', duration: 'Ongoing', kind: 'professional' },
      ],
    },
  ],

  'arborist-tree-surgeon': [
    {
      type: 'work', name: 'Learn on the tools',
      duration: '1–2 years from now', earn: 'Earning immediately',
      steps: [
        { label: 'GCSEs', detail: 'No formal entry requirements beyond fitness and enthusiasm', kind: 'college' },
        { label: 'Groundsperson', detail: 'Paid work supporting climbers and processing timber', kind: 'job' },
        { label: 'NPTC tickets', detail: 'Chainsaw and aerial rescue certificates, usually employer-funded', duration: 'Short courses', kind: 'professional' },
        { label: 'Climbing arborist', detail: 'Fully qualified, working at height', kind: 'job' },
      ],
    },
    {
      type: 'apprenticeship', name: 'Arboriculture apprenticeship',
      duration: '2–3 years from now', earn: 'Salaried, training paid for',
      steps: [
        { label: 'Level 2 apprenticeship', detail: 'Paid work with day-release college study', duration: '2 years', kind: 'apprenticeship' },
        { label: 'Level 3 arborist', detail: 'Advanced apprenticeship in tree work', duration: '1 year', kind: 'apprenticeship' },
        { label: 'Team leader', detail: 'Running crews and quoting jobs', kind: 'job' },
      ],
    },
    {
      type: 'degree', name: 'Arboriculture degree', subject: 'Forestry and Arboriculture',
      duration: '5 years from now', earn: 'Student finance; opens consultancy roles',
      steps: [
        { label: 'Level 3', detail: 'A-levels or a land-based diploma', duration: '2 years', kind: 'college' },
        { label: 'Forestry degree', detail: 'Arboriculture, forestry or countryside management', duration: '3 years', kind: 'university' },
        { label: 'Consultant or manager', detail: 'Tree surveys, planning advice and estate management', kind: 'job' },
      ],
    },
  ],

  'museum-curator': [
    {
      type: 'degree', name: 'Degree then museum studies', subject: 'HISTORY',
      duration: '6 years from now', earn: 'Student finance across both courses',
      steps: [
        { label: 'Level 3', detail: 'A-levels including an essay subject such as history', duration: '2 years', kind: 'college' },
        { label: 'Humanities degree', detail: 'History, archaeology or history of art', duration: '3 years', kind: 'university' },
        { label: 'Volunteering', detail: 'Collections or front-of-house work alongside study', duration: 'Ongoing', kind: 'work' },
        { label: 'MA Museum Studies', detail: 'The usual step into curatorial roles', duration: '1 year', kind: 'university' },
      ],
    },
    {
      type: 'apprenticeship', name: 'Cultural heritage apprenticeship',
      duration: '4 years from now', earn: 'Salaried, no tuition fees',
      steps: [
        { label: 'Level 3', detail: 'A-levels or BTEC in a humanities subject', duration: '2 years', kind: 'college' },
        { label: 'Heritage apprentice', detail: 'Paid collections work with part-time study', duration: '2 years', kind: 'apprenticeship' },
        { label: 'Collections assistant', detail: 'Cataloguing and care, progressing towards curation', kind: 'job' },
      ],
    },
    {
      type: 'work', name: 'In through the front door',
      duration: '3–5 years from now', earn: 'Earning from the start, slower route up',
      steps: [
        { label: 'Visitor assistant', detail: 'Front-of-house work at a museum or gallery', kind: 'job' },
        { label: 'Collections assistant', detail: 'Move across into documentation and stores', kind: 'job' },
        { label: 'Part-time degree', detail: 'Study alongside work, often employer-supported', duration: '4–6 years', kind: 'university' },
      ],
    },
  ],

  cartoonist: [
    {
      type: 'work', name: 'Portfolio first',
      duration: 'Start today', earn: 'Freelance income, irregular at first',
      steps: [
        { label: 'Build a body of work', detail: 'Publish something small every week', duration: 'Ongoing', kind: 'work' },
        { label: 'First commissions', detail: 'Local press, zines, small brands', kind: 'job' },
        { label: 'Agent or syndication', detail: 'Representation once your style is recognisable', kind: 'professional' },
      ],
    },
    {
      type: 'degree', name: 'Illustration degree', subject: 'ART and DESIGN (GRAPHIC DESIGN)',
      duration: '6 years from now', earn: 'Student finance; studio contacts and critique',
      steps: [
        { label: 'Level 3 art', detail: 'A-levels or a creative BTEC', duration: '2 years', kind: 'college' },
        { label: 'Art foundation', detail: 'A year to find your direction and build a portfolio', duration: '1 year', kind: 'college' },
        { label: 'Illustration degree', detail: 'Portfolio and interview matter more than grades', duration: '3 years', kind: 'university' },
        { label: 'Freelance or studio', detail: 'Commissions, animation or in-house design', kind: 'job' },
      ],
    },
    {
      type: 'apprenticeship', name: 'Creative apprenticeship',
      duration: '3 years from now', earn: 'Salaried in a studio team',
      steps: [
        { label: 'Level 3 art', detail: 'Creative A-levels or BTEC with a portfolio', duration: '2 years', kind: 'college' },
        { label: 'Junior creative apprentice', detail: 'Paid studio work with structured training', duration: '18 months', kind: 'apprenticeship' },
        { label: 'In-house illustrator', detail: 'Agency or brand team, freelancing on the side', kind: 'job' },
      ],
    },
  ],

  'location-manager': [
    {
      type: 'work', name: 'Up through the crew',
      duration: '3–5 years from now', earn: 'Paid from day one, freelance contracts',
      steps: [
        { label: 'Runner', detail: 'The industry standard way in. A driving licence is essential', kind: 'job' },
        { label: 'Location assistant', detail: 'Unit bases, parking, permissions', duration: '2–3 years', kind: 'job' },
        { label: 'Location manager', detail: 'Credits, not certificates, get you here', kind: 'job' },
      ],
    },
    {
      type: 'apprenticeship', name: 'Production trainee scheme',
      duration: '3 years from now', earn: 'Salaried trainee placements',
      steps: [
        { label: 'Level 3', detail: 'Any subjects — a portfolio of short films helps', duration: '2 years', kind: 'college' },
        { label: 'ScreenSkills trainee', detail: 'Paid placements across productions', duration: '12 months', kind: 'apprenticeship' },
        { label: 'Location assistant', detail: 'Into the department with contacts already made', kind: 'job' },
      ],
    },
    {
      type: 'degree', name: 'Film and TV production degree', subject: 'FILM, RADIO and TV STUDIES',
      duration: '5 years from now', earn: 'Student finance; still expect to start as a runner',
      steps: [
        { label: 'Level 3', detail: 'A-levels or a creative BTEC', duration: '2 years', kind: 'college' },
        { label: 'Production degree', detail: 'Learn the whole production process and crew up on student shoots', duration: '3 years', kind: 'university' },
        { label: 'Runner', detail: 'Everyone starts here — but you arrive knowing the language', kind: 'job' },
      ],
    },
  ],

  'pension-scheme-manager': [
    {
      type: 'degree', name: 'Finance degree', subject: 'FINANCE',
      duration: '5 years from now', earn: 'Student finance, then graduate salary',
      steps: [
        { label: 'Level 3', detail: 'Strong maths at A-level is expected', duration: '2 years', kind: 'college' },
        { label: 'Finance degree', detail: 'Finance, economics or actuarial science', duration: '3 years', kind: 'university' },
        { label: 'Graduate scheme', detail: 'Consultancy, insurer or in-house pensions team', kind: 'job' },
        { label: 'PMI exams', detail: 'Professional qualifications taken alongside work', duration: '3–4 years', kind: 'professional' },
      ],
    },
    {
      type: 'apprenticeship', name: 'Financial services degree apprenticeship',
      duration: '6 years from now', earn: 'Salaried with fees paid — a degree and no debt',
      steps: [
        { label: 'Level 3', detail: 'A-levels including maths', duration: '2 years', kind: 'college' },
        { label: 'Degree apprentice', detail: 'Paid work in a pensions team with part-time degree study', duration: '4 years', kind: 'apprenticeship' },
        { label: 'Scheme administrator', detail: 'Qualified, with four years of experience already', kind: 'job' },
      ],
    },
    {
      type: 'work', name: 'School-leaver programme',
      duration: '4–6 years from now', earn: 'Earning immediately, exams funded',
      steps: [
        { label: 'Level 3', detail: 'A-levels or a business BTEC', duration: '2 years', kind: 'college' },
        { label: 'Pensions administrator', detail: 'Entry role on a school-leaver programme', kind: 'job' },
        { label: 'PMI exams', detail: 'Studied part-time and paid for by your employer', duration: '3–4 years', kind: 'professional' },
      ],
    },
  ],

  'fish-farmer': [
    {
      type: 'work', name: 'Straight onto the farm',
      duration: 'Start after GCSEs', earn: 'Earning immediately',
      steps: [
        { label: 'GCSEs', detail: 'Science is helpful but not always required', kind: 'college' },
        { label: 'Farm hand', detail: 'Feeding, grading and net maintenance', kind: 'job' },
        { label: 'Husbandry tickets', detail: 'Boat handling and fish health certificates', duration: 'Short courses', kind: 'professional' },
        { label: 'Site technician', detail: 'Responsible for stock health and water quality', kind: 'job' },
      ],
    },
    {
      type: 'apprenticeship', name: 'Aquaculture apprenticeship',
      duration: '2 years from now', earn: 'Salaried with training built in',
      steps: [
        { label: 'Modern Apprenticeship', detail: 'Paid work on a farm with structured assessment', duration: '2 years', kind: 'apprenticeship' },
        { label: 'Technician', detail: 'Qualified, running daily operations', kind: 'job' },
        { label: 'Site manager', detail: 'With a few seasons behind you', kind: 'job' },
      ],
    },
    {
      type: 'degree', name: 'Marine science degree', subject: 'MARINE/MARITIME STUDIES',
      duration: '5 years from now', earn: 'Student finance; opens hatchery and technical roles',
      steps: [
        { label: 'Level 3', detail: 'A-levels including biology', duration: '2 years', kind: 'college' },
        { label: 'Marine or aquaculture degree', detail: 'Fish biology, health and farm systems', duration: '3 years', kind: 'university' },
        { label: 'Hatchery or fish health role', detail: 'Technical and management routes', kind: 'job' },
      ],
    },
  ],

  'farm-manager': [
    {
      type: 'work', name: 'Work your way up',
      duration: '5–8 years from now', earn: 'Earning throughout',
      steps: [
        { label: 'Harvest work', detail: 'Seasonal jobs on arable or dairy farms', kind: 'work' },
        { label: 'Stockperson or driver', detail: 'Full-time farm role with real responsibility', kind: 'job' },
        { label: 'Assistant manager', detail: 'Experience-led progression, often on the same farm', kind: 'job' },
      ],
    },
    {
      type: 'apprenticeship', name: 'Agriculture apprenticeship',
      duration: '5 years from now', earn: 'Salaried, fees paid',
      steps: [
        { label: 'Level 3 apprenticeship', detail: 'Paid farm work with college day-release', duration: '2 years', kind: 'apprenticeship' },
        { label: 'Level 4 or degree apprenticeship', detail: 'Farm business management, studied part-time', duration: '2–3 years', kind: 'apprenticeship' },
        { label: 'Assistant manager', detail: 'Qualified with a full CV of practical seasons', kind: 'job' },
      ],
    },
    {
      type: 'degree', name: 'Agriculture degree', subject: 'AGRICULTURAL SCIENCES/AGRICULTURE',
      duration: '6 years from now', earn: 'Student finance; placement year is usually paid',
      steps: [
        { label: 'Level 3', detail: 'A-levels or a land-based diploma plus farm experience', duration: '2 years', kind: 'college' },
        { label: 'Agriculture degree', detail: 'Farm business management with a placement year', duration: '4 years', kind: 'university' },
        { label: 'Graduate management', detail: 'Estate and corporate farming schemes', kind: 'job' },
      ],
    },
  ],

  'estates-officer': [
    {
      type: 'degree', name: 'RICS-accredited degree', subject: 'SURVEYING and REAL ESTATE MANAGEMENT',
      duration: '7 years from now', earn: 'Student finance, then graduate salary during the APC',
      steps: [
        { label: 'Level 3', detail: 'A-levels or a BTEC in business or construction', duration: '2 years', kind: 'college' },
        { label: 'Surveying degree', detail: 'Must be RICS-accredited to count towards chartership', duration: '3 years', kind: 'university' },
        { label: 'APC', detail: 'Structured experience and a final assessment', duration: '2 years', kind: 'professional' },
        { label: 'Chartered Surveyor', detail: 'MRICS after your name', kind: 'job' },
      ],
    },
    {
      type: 'apprenticeship', name: 'Chartered Surveyor degree apprenticeship',
      duration: '7 years from now', earn: 'Salaried the whole way — degree fees paid by your employer',
      steps: [
        { label: 'Level 3', detail: 'A-levels or equivalent', duration: '2 years', kind: 'college' },
        { label: 'Degree apprentice', detail: 'Paid surveying work with part-time accredited degree', duration: '5 years', kind: 'apprenticeship' },
        { label: 'Chartered Surveyor', detail: 'APC completed within the apprenticeship', kind: 'job' },
      ],
    },
    {
      type: 'work', name: 'Technical route',
      duration: '4–6 years from now', earn: 'Earning from the start',
      steps: [
        { label: 'Estates assistant', detail: 'Administration and inspections for a council or landlord', kind: 'job' },
        { label: 'Part-time study', detail: 'Accredited degree or diploma, often employer-funded', duration: '4 years', kind: 'university' },
        { label: 'AssocRICS', detail: 'Associate membership, with chartership available later', kind: 'professional' },
      ],
    },
  ],
}

export const pathwaysForCareer = (slug) => P[slug] || []

/* Generic routes into a subject area, built from the HEAP record itself.
   Used on subject pages, where we know the field of study but not the job. */
const trim = (text, max = 110) => {
  if (!text) return ''
  const clean = text.trim()
  if (clean.length <= max) return clean
  const cut = clean.slice(0, max)
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,.;:]$/, '')}…`
}

export function routesForSubject(name, subj, offer) {
  if (!subj) return []
  const routes = [
    {
      type: 'degree', name: `Degree in ${name.toLowerCase()}`, subject: name,
      duration: '5 years from now', earn: 'Student finance — no salary while you study',
      steps: [
        { label: 'Level 3', detail: trim(subj.SubjectRequirementsPreferences) || 'A-levels or an equivalent Level 3 qualification', duration: '2 years', kind: 'college' },
        { label: 'Undergraduate degree', detail: offer ? `Typical offer around ${offer}` : 'Entry requirements vary by institution', duration: '3–4 years', kind: 'university' },
        { label: 'Graduate roles', detail: trim(subj.CareerNote) || 'A range of graduate destinations', kind: 'job' },
      ],
    },
  ]
  if (subj.DegreeApprenticeships) {
    routes.push({
      type: 'apprenticeship', name: 'Degree apprenticeship',
      duration: '6 years from now', earn: 'Salaried throughout, tuition paid by your employer',
      steps: [
        { label: 'Level 3', detail: 'A-levels or an equivalent qualification', duration: '2 years', kind: 'college' },
        { label: 'Degree apprentice', detail: trim(subj.DegreeApprenticeships, 120), duration: '4–5 years', kind: 'apprenticeship' },
        { label: 'Qualified professional', detail: 'A degree, paid experience and no student debt', kind: 'job' },
      ],
    })
  }
  return routes
}

/* Order routes so the one closest to the student's direction comes first. */
export function orderByLean(routes, lean) {
  return [...routes].sort(
    (a, b) => Math.abs(ROUTE_TYPES[a.type].lean - lean) - Math.abs(ROUTE_TYPES[b.type].lean - lean),
  )
}

export function bestMatch(routes, lean) {
  return orderByLean(routes, lean)[0]
}
