import { FilePen, CircleX, CircleCheck, Hourglass } from 'lucide-react'
import { Card, Button, ImagePlaceholder } from '../components/ui'

const CHECKLIST = [
  { label: 'Introduction', status: 'progress', text: 'In Progress' },
  { label: 'My Skills (0 of 3)', status: 'notstarted', text: 'Not Started' },
  { label: 'Work Experience (0 of 1)', status: 'notstarted', text: 'Not Started' },
  { label: 'Tell your story (0 of 5)', status: 'notstarted', text: 'Not Started' },
  { label: 'Share your Digital CV', status: 'complete', text: 'Complete' },
]

const STEPS = [
  { n: 1, title: 'Make a great first impression', blurb: 'Start here - add your bio, qualifications, and the things that make you, you.', status: 'progress', cta: 'In Progress - Continue' },
  { n: 2, title: 'My Skills', blurb: "Review and rate the skills you've built through your course and placements.", status: 'notstarted', cta: 'Not Started - Add now' },
  { n: 3, title: 'Work Experience', blurb: "Feature your placements and show employers what you've done in the workplace.", status: 'notstarted', cta: 'Not Started - Add now' },
  { n: 4, title: 'Tell your story', blurb: "Pick your best activities and share the experiences you're most proud of.", status: 'notstarted', cta: 'Not Started - Add now' },
  { n: 5, title: 'Share your Digital CV', blurb: 'Decide who can view your Digital CV and share with employers.', status: 'complete', cta: 'Complete! - Edit' },
]

const STATUS_STYLES = {
  progress: 'bg-amber-500 text-white',
  notstarted: 'bg-navy-800 text-white',
  complete: 'bg-brand-500 text-white',
}

const STATUS_ICONS = {
  progress: Hourglass,
  notstarted: CircleX,
  complete: CircleCheck,
}

function StatusBar({ status, children }) {
  const Icon = STATUS_ICONS[status]
  return (
    <div className={`flex items-center justify-between rounded-md px-3 py-2 text-sm font-semibold ${STATUS_STYLES[status]}`}>
      {children}
      <Icon size={15} />
    </div>
  )
}

export default function DigitalCv() {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 rounded-2xl bg-brand-100 p-7 lg:grid-cols-2">
        <div>
          <p className="flex items-center gap-1.5 text-sm font-bold text-brand-600">
            <FilePen size={16} /> Digital CV
          </p>
          <h1 className="mt-2 text-3xl font-light text-gray-600 md:text-5xl">My Digital CV Dashboard</h1>
          <p className="mt-4 text-sm text-gray-600">
            Welcome to your Digital CV - a personalised profile that showcases your skills,
            experiences and achievements from your time at college.
          </p>
          <p className="mt-3 text-sm text-gray-600">
            Pick your best work, tell your story, and share it with employers when you're ready. Your
            Healthcheck below shows how you're progressing - use it to see what's done and what still
            needs your attention.
          </p>
          <Card className="mt-5 border border-brand-300">
            <p className="font-bold">Your Digital CV is 20% Complete</p>
            <div className="mt-3 space-y-1">
              {CHECKLIST.map((c) => (
                <StatusBar key={c.label} status={c.status}>
                  <span>{c.label}</span>
                  <span className="ml-auto mr-2">{c.text}</span>
                </StatusBar>
              ))}
            </div>
          </Card>
          <Button className="mt-5">Preview your Digital CV</Button>
        </div>
        <ImagePlaceholder className="hidden lg:block" />
      </div>

      <section>
        <h2 className="text-xl font-bold text-gray-700">Make the most of your Digital CV</h2>
        <p className="mt-1 text-sm text-gray-500">
          Make sure you add as much rich information as you can to enhance your Digital CV. Use the
          tools below to make sure you've covered everything.
        </p>
        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {STEPS.map((s) => (
            <Card key={s.n} className={`flex flex-col gap-3 ${s.status === 'progress' ? 'ring-2 ring-amber-500' : ''} ${s.status === 'complete' ? 'ring-1 ring-brand-300' : ''}`}>
              <ImagePlaceholder className="h-28" />
              <h3 className="text-lg font-bold text-gray-700">{s.n}. {s.title}</h3>
              <p className="text-sm text-gray-500">{s.blurb}</p>
              <div className="mt-auto">
                <StatusBar status={s.status}><span>{s.cta}</span></StatusBar>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
