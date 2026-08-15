/* Routes to a destination.
   A destination is a career. A route is one way of reaching it — a sequence of
   stages with real durations, and a set of human trade-offs (where you live,
   whether you earn, where the effort goes, what's competitive).

   Navigate is a world-of-work-first platform, so routes are always presented
   apprenticeship first, then straight into work, then university. The
   direction dial does not reorder them — it only marks which route sits
   closest to what the student has said they want. */

/* The four next destinations. `lean` is where each sits on the gauge, from
   straight into work through to university. `order` is Navigate's editorial
   preference when the gauge gives us no steer — technical and vocational
   routes lead, but the gauge always wins when the student has expressed one. */
export const ROUTE_TYPES = {
  apprenticeship: { label: 'Earn while you learn', short: 'Apprenticeship', lean: 37, accent: 'amber', order: 0 },
  tlevel: { label: 'Technical study', short: 'T-Level or training', lean: 63, accent: 'sky', order: 1 },
  work: { label: 'Straight into work', short: 'Job', lean: 10, accent: 'teal', order: 2 },
  degree: { label: 'University degree', short: 'University', lean: 90, accent: 'purple', order: 3 },
}

/* The four Explore sections, in Navigate's default order. */
export const EXPLORE_SECTIONS = [
  { key: 'apprenticeships', type: 'apprenticeship', title: 'Explore Apprenticeships', blurb: 'Earn a wage while you gain a qualification.' },
  { key: 'training', type: 'tlevel', title: 'Explore T-Levels and Training', blurb: 'Technical qualifications built with employers.' },
  { key: 'jobs', type: 'work', title: 'Explore Jobs', blurb: 'Careers you could go into, and how to get there.' },
  { key: 'university', type: 'degree', title: 'Explore University', blurb: 'Courses, entry requirements and what student life is like.' },
]

export const sectionByKey = (key) => EXPLORE_SECTIONS.find((s) => s.key === key)

/* Standard factor set so routes can be compared like with like. */
const F = (home, money, effort, competition) => ({ home, money, effort, competition })

const P = {
  'field-archaeologist': [
    {
      type: 'apprenticeship', name: 'Historic environment apprenticeship', subject: 'ARCHAEOLOGY',
      arrival: 'Qualified field archaeologist',
      steps: [
        { label: 'Level 3', detail: 'A-levels or BTEC, volunteering on local digs', years: 2, kind: 'college' },
        { label: 'Apprentice archaeologist', detail: 'Paid work with a commercial unit, degree studied part-time', years: 4, kind: 'apprenticeship' },
      ],
      factors: F('Usually stay local', 'Salaried throughout, no tuition fees', 'Effort goes into work and assessment, not exams', 'Few employers take apprentices each year'),
    },
    {
      type: 'work', name: 'Straight onto site',
      arrival: 'Field archaeologist',
      steps: [
        { label: 'Field school', detail: 'A short excavation course or community dig', years: 0.5, kind: 'college' },
        { label: 'Site assistant', detail: 'Entry-level digging role, learning from the team', years: 1.5, kind: 'job' },
      ],
      factors: F('Travel to wherever the dig is', 'Earning immediately, lower starting pay', 'Effort goes into finding work and proving yourself', 'Contracts are short — you reapply often'),
    },
    {
      type: 'degree', name: 'Archaeology degree', subject: 'ARCHAEOLOGY',
      arrival: 'Site assistant with a degree',
      steps: [
        { label: 'Level 3', detail: 'History, geography or a science preferred', years: 2, kind: 'college' },
        { label: 'Archaeology degree', detail: 'BA or BSc with fieldwork and summer digs built in', years: 3, kind: 'university' },
      ],
      factors: F('Most students move away', 'Student finance, repaid once you earn', 'Effort goes into essays, exams and fieldwork', 'Course places are competitive at top universities'),
    },
  ],

  'arborist-tree-surgeon': [
    {
      type: 'apprenticeship', name: 'Arboriculture apprenticeship',
      arrival: 'Qualified climbing arborist',
      steps: [
        { label: 'Level 2 apprenticeship', detail: 'Paid tree work with college day-release', years: 2, kind: 'apprenticeship' },
        { label: 'Level 3 advanced', detail: 'Climbing, felling and crew responsibility', years: 1, kind: 'apprenticeship' },
      ],
      factors: F('Stay local — employers are everywhere', 'Salaried, tickets paid for', 'Effort is physical and practical', 'You need an employer to take you on'),
    },
    {
      type: 'work', name: 'Learn on the tools',
      arrival: 'Climbing arborist',
      steps: [
        { label: 'Groundsperson', detail: 'Paid work supporting climbers and chipping brash', years: 1, kind: 'job' },
        { label: 'NPTC tickets', detail: 'Chainsaw and aerial rescue certificates, usually employer-funded', years: 0.5, kind: 'professional' },
      ],
      factors: F('Stay local', 'Earning from week one', 'Effort is physical from day one', 'Easiest route to get started on'),
    },
    {
      type: 'degree', name: 'Arboriculture degree', subject: 'Forestry and Arboriculture',
      arrival: 'Consultant or contracts manager',
      steps: [
        { label: 'Level 3', detail: 'A-levels or a land-based diploma', years: 2, kind: 'college' },
        { label: 'Forestry degree', detail: 'Arboriculture, forestry or countryside management', years: 3, kind: 'university' },
      ],
      factors: F('Land-based universities are often rural', 'Student finance, repaid once you earn', 'Effort goes into science and coursework', 'Specialist courses, fewer places'),
    },
  ],

  'museum-curator': [
    {
      type: 'apprenticeship', name: 'Cultural heritage apprenticeship',
      arrival: 'Collections assistant',
      steps: [
        { label: 'Level 3', detail: 'A-levels or BTEC in a humanities subject', years: 2, kind: 'college' },
        { label: 'Heritage apprentice', detail: 'Paid collections work with part-time study', years: 2, kind: 'apprenticeship' },
      ],
      factors: F('Depends where the museum is', 'Salaried, no tuition fees', 'Effort goes into cataloguing and practical care', 'Very few heritage apprenticeships advertised'),
    },
    {
      type: 'work', name: 'In through the front door',
      arrival: 'Collections assistant',
      steps: [
        { label: 'Visitor assistant', detail: 'Front-of-house work at a museum or gallery', years: 1, kind: 'job' },
        { label: 'Move into collections', detail: 'Sideways step into documentation and stores', years: 2, kind: 'job' },
      ],
      factors: F('Stay local if you have a museum nearby', 'Earning immediately, modest pay', 'Effort goes into networking and internal moves', 'Curatorial roles usually still expect a degree'),
    },
    {
      type: 'degree', name: 'Degree then museum studies', subject: 'HISTORY',
      arrival: 'Assistant curator',
      steps: [
        { label: 'Level 3', detail: 'A-levels including an essay subject such as history', years: 2, kind: 'college' },
        { label: 'Humanities degree', detail: 'History, archaeology or history of art, volunteering alongside', years: 3, kind: 'university' },
        { label: 'MA Museum Studies', detail: 'The usual step into curatorial roles', years: 1, kind: 'university' },
      ],
      factors: F('Likely to move away, twice', 'Student finance for both courses', 'Effort goes into essays and research', 'Entry-level curator posts attract many applicants'),
    },
  ],

  cartoonist: [
    {
      type: 'apprenticeship', name: 'Creative apprenticeship',
      arrival: 'In-house illustrator',
      steps: [
        { label: 'Level 3 art', detail: 'Creative A-levels or BTEC, building a portfolio', years: 2, kind: 'college' },
        { label: 'Junior creative apprentice', detail: 'Paid studio work with structured training', years: 1.5, kind: 'apprenticeship' },
      ],
      factors: F('Studios cluster in cities', 'Salaried while you build a portfolio', 'Effort goes into client work and deadlines', 'Studio apprenticeships are scarce'),
    },
    {
      type: 'work', name: 'Portfolio first',
      arrival: 'Freelance cartoonist',
      steps: [
        { label: 'Build a body of work', detail: 'Publish something small every week', years: 1, kind: 'work' },
        { label: 'First commissions', detail: 'Local press, zines and small brands', years: 1, kind: 'job' },
      ],
      factors: F('Work from anywhere', 'Irregular income at first', 'Effort goes into self-promotion and pitching', 'No gatekeeper — but no safety net either'),
    },
    {
      type: 'degree', name: 'Illustration degree', subject: 'ART and DESIGN (GRAPHIC DESIGN)',
      arrival: 'Freelance or studio illustrator',
      steps: [
        { label: 'Level 3 art', detail: 'A-levels or a creative BTEC', years: 2, kind: 'college' },
        { label: 'Art foundation', detail: 'A year to find your direction and build a portfolio', years: 1, kind: 'college' },
        { label: 'Illustration degree', detail: 'Portfolio and interview matter more than grades', years: 3, kind: 'university' },
      ],
      factors: F('Art schools are mostly in big cities', 'Student finance, plus materials costs', 'Effort goes into critique and self-directed projects', 'Portfolio-based selection, not grades'),
    },
  ],

  'location-manager': [
    {
      type: 'apprenticeship', name: 'Production trainee scheme',
      arrival: 'Location assistant',
      steps: [
        { label: 'Level 3', detail: 'Any subjects — short films of your own help', years: 2, kind: 'college' },
        { label: 'ScreenSkills trainee', detail: 'Paid placements across productions', years: 1, kind: 'apprenticeship' },
      ],
      factors: F('Follow productions around the country', 'Paid placements, fees covered', 'Effort goes into learning on set', 'Schemes take small cohorts each year'),
    },
    {
      type: 'work', name: 'Up through the crew',
      arrival: 'Location manager',
      steps: [
        { label: 'Runner', detail: 'The industry standard way in. A driving licence is essential', years: 1, kind: 'job' },
        { label: 'Location assistant', detail: 'Unit bases, parking and permissions', years: 3, kind: 'job' },
      ],
      factors: F('Away from home for weeks at a time', 'Paid from day one, freelance contracts', 'Effort goes into contacts and reliability', 'Credits matter more than qualifications'),
    },
    {
      type: 'degree', name: 'Film and TV production degree', subject: 'FILM, RADIO and TV STUDIES',
      arrival: 'Runner, then assistant',
      steps: [
        { label: 'Level 3', detail: 'A-levels or a creative BTEC', years: 2, kind: 'college' },
        { label: 'Production degree', detail: 'Learn the whole process and crew up on student shoots', years: 3, kind: 'university' },
      ],
      factors: F('Likely to move away', 'Student finance, repaid once you earn', 'Effort goes into projects and productions', 'You still start as a runner afterwards'),
    },
  ],

  'pension-scheme-manager': [
    {
      type: 'apprenticeship', name: 'Financial services degree apprenticeship',
      arrival: 'Scheme administrator with a degree',
      steps: [
        { label: 'Level 3', detail: 'A-levels including maths', years: 2, kind: 'college' },
        { label: 'Degree apprentice', detail: 'Paid work in a pensions team, degree studied part-time', years: 4, kind: 'apprenticeship' },
      ],
      factors: F('Firms cluster in cities — commuting is common', 'Salaried with fees paid — a degree and no debt', 'Effort splits between work and part-time study', 'Places are as competitive as top universities'),
    },
    {
      type: 'work', name: 'School-leaver programme',
      arrival: 'PMI-qualified administrator',
      steps: [
        { label: 'Level 3', detail: 'A-levels or a business BTEC', years: 2, kind: 'college' },
        { label: 'Pensions administrator', detail: 'Entry role with employer-funded professional exams', years: 2, kind: 'job' },
      ],
      factors: F('Stay local if there is a firm nearby', 'Earning immediately, exams funded', 'Effort goes into professional exams alongside work', 'Fewer firms run school-leaver routes'),
    },
    {
      type: 'degree', name: 'Finance degree', subject: 'FINANCE',
      arrival: 'Graduate scheme',
      steps: [
        { label: 'Level 3', detail: 'Strong maths at A-level is expected', years: 2, kind: 'college' },
        { label: 'Finance degree', detail: 'Finance, economics or actuarial science', years: 3, kind: 'university' },
        { label: 'Graduate scheme', detail: 'Consultancy, insurer or in-house pensions team', years: 2, kind: 'job' },
      ],
      factors: F('Most students move away', 'Student finance, repaid once you earn', 'Effort goes into exams, then more exams at work', 'Graduate schemes are heavily oversubscribed'),
    },
  ],

  'fish-farmer': [
    {
      type: 'apprenticeship', name: 'Aquaculture apprenticeship',
      arrival: 'Qualified site technician',
      steps: [
        { label: 'Modern Apprenticeship', detail: 'Paid work on a farm with structured assessment', years: 2, kind: 'apprenticeship' },
        { label: 'Technician', detail: 'Running daily operations and stock health', years: 1, kind: 'job' },
      ],
      factors: F('Farms are coastal and often remote', 'Salaried, training paid for', 'Effort is practical and outdoors', 'Limited to areas with fish farms'),
    },
    {
      type: 'work', name: 'Straight onto the farm',
      arrival: 'Site technician',
      steps: [
        { label: 'Farm hand', detail: 'Feeding, grading and net maintenance', years: 1, kind: 'job' },
        { label: 'Husbandry tickets', detail: 'Boat handling and fish health certificates', years: 0.5, kind: 'professional' },
      ],
      factors: F('Often means relocating, sometimes staff housing', 'Earning immediately', 'Effort is physical, in all weathers', 'Employers usually need people'),
    },
    {
      type: 'degree', name: 'Marine science degree', subject: 'MARINE/MARITIME STUDIES',
      arrival: 'Hatchery or fish health role',
      steps: [
        { label: 'Level 3', detail: 'A-levels including biology', years: 2, kind: 'college' },
        { label: 'Marine or aquaculture degree', detail: 'Fish biology, health and farm systems', years: 3, kind: 'university' },
      ],
      factors: F('Coastal universities — likely to move', 'Student finance, repaid once you earn', 'Effort goes into lab and field science', 'Opens technical roles others cannot reach'),
    },
  ],

  'farm-manager': [
    {
      type: 'apprenticeship', name: 'Agriculture apprenticeship',
      arrival: 'Assistant farm manager',
      steps: [
        { label: 'Level 3 apprenticeship', detail: 'Paid farm work with college day-release', years: 2, kind: 'apprenticeship' },
        { label: 'Farm business management', detail: 'Higher or degree apprenticeship, studied part-time', years: 3, kind: 'apprenticeship' },
      ],
      factors: F('Live on or near the farm', 'Salaried, fees paid', 'Effort splits between seasons and study', 'Depends on finding a farm that trains'),
    },
    {
      type: 'work', name: 'Work your way up',
      arrival: 'Assistant manager',
      steps: [
        { label: 'Seasonal farm work', detail: 'Harvest and lambing jobs to build experience', years: 1, kind: 'work' },
        { label: 'Stockperson or driver', detail: 'Full-time role with real responsibility', years: 3, kind: 'job' },
      ],
      factors: F('Farm accommodation is common', 'Earning throughout', 'Effort is practical and seasonal', 'Progression depends on who you work for'),
    },
    {
      type: 'degree', name: 'Agriculture degree', subject: 'AGRICULTURAL SCIENCES/AGRICULTURE',
      arrival: 'Graduate management scheme',
      steps: [
        { label: 'Level 3', detail: 'A-levels or a land-based diploma plus farm experience', years: 2, kind: 'college' },
        { label: 'Agriculture degree', detail: 'Farm business management with a paid placement year', years: 4, kind: 'university' },
      ],
      factors: F('Land-based universities, usually residential', 'Student finance, placement year is paid', 'Effort goes into business and science modules', 'Estate schemes prefer graduates'),
    },
  ],

  'estates-officer': [
    {
      type: 'apprenticeship', name: 'Chartered Surveyor degree apprenticeship',
      arrival: 'Chartered Surveyor (MRICS)',
      steps: [
        { label: 'Level 3', detail: 'A-levels or equivalent', years: 2, kind: 'college' },
        { label: 'Degree apprentice', detail: 'Paid surveying work with a part-time accredited degree', years: 5, kind: 'apprenticeship' },
      ],
      factors: F('Work where the employer is — often local', 'Salaried the whole way, degree fees paid', 'Effort splits between work, study and the APC', 'Highly competitive — apply in Year 13'),
    },
    {
      type: 'work', name: 'Technical route',
      arrival: 'AssocRICS surveyor',
      steps: [
        { label: 'Estates assistant', detail: 'Administration and inspections for a council or landlord', years: 2, kind: 'job' },
        { label: 'Part-time study', detail: 'Accredited degree or diploma, often employer-funded', years: 4, kind: 'university' },
      ],
      factors: F('Stay local', 'Earning from the start', 'Effort goes into studying around a full-time job', 'Chartership takes longer from here'),
    },
    {
      type: 'degree', name: 'RICS-accredited degree', subject: 'SURVEYING and REAL ESTATE MANAGEMENT',
      arrival: 'Chartered Surveyor (MRICS)',
      steps: [
        { label: 'Level 3', detail: 'A-levels or a BTEC in business or construction', years: 2, kind: 'college' },
        { label: 'Surveying degree', detail: 'Must be RICS-accredited to count towards chartership', years: 3, kind: 'university' },
        { label: 'APC', detail: 'Structured experience in a firm, then final assessment', years: 2, kind: 'professional' },
      ],
      factors: F('Likely to move away for the degree', 'Student finance, then a graduate salary', 'Effort goes into exams, then the APC', 'Accredited courses fill quickly'),
    },
  ],
}

export const pathwaysForCareer = (slug) => P[slug] || []

/* Total years from now until you arrive. */
export const routeYears = (route) => route.steps.reduce((n, s) => n + s.years, 0)

/* Ordering is by how close each route sits to where the student has set their
   gauge, with Navigate's editorial preference breaking ties. That way the
   platform can lead with technical routes without the order looking like a
   ranking of life choices — and we can always say why the order is what it is. */
export function orderForGauge(routes, lean) {
  return [...routes].sort((a, b) => {
    const da = Math.abs(ROUTE_TYPES[a.type].lean - lean)
    const db = Math.abs(ROUTE_TYPES[b.type].lean - lean)
    if (Math.abs(da - db) > 12) return da - db
    return ROUTE_TYPES[a.type].order - ROUTE_TYPES[b.type].order
  })
}

/* Which route sits closest to what the student has told us they want.
   Used only to mark a route, never to reorder them. */
export function closestToLean(routes, lean) {
  if (!routes.length) return null
  return [...routes].sort(
    (a, b) => Math.abs(ROUTE_TYPES[a.type].lean - lean) - Math.abs(ROUTE_TYPES[b.type].lean - lean),
  )[0]
}
