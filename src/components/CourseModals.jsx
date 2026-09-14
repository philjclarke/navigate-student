import { X, Search, Send, Check, CalendarPlus, ExternalLink, MessageSquare, FileText, CalendarDays, Info } from 'lucide-react'
import { Button } from './ui'

function Modal({ open, onClose, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" aria-label="Close">
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  )
}

function Point({ icon: Icon, title, children }) {
  return (
    <li className="flex gap-3">
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600">
        <Icon size={14} />
      </span>
      <div>
        <p className="text-sm font-bold text-gray-700">{title}</p>
        <p className="text-xs leading-snug text-gray-500">{children}</p>
      </div>
    </li>
  )
}

/* Researching a course is a real activity, so we say what gets recorded and
   give the student something concrete to actually go and do. */
export function ResearchModal({ open, onClose, course, onConfirm }) {
  if (!course) return null
  return (
    <Modal open={open} onClose={onClose}>
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-100 text-purple-600">
        <Search size={20} />
      </span>
      <h2 className="mt-3 text-xl font-bold text-gray-700">Research this course</h2>
      <p className="mt-1 text-sm text-gray-600">
        {course.CourseName} at {course.University}
      </p>

      <div className="mt-4 rounded-xl bg-brand-50 p-3">
        <p className="flex items-center gap-2 text-sm font-bold text-gray-700">
          <CalendarPlus size={15} className="text-brand-600" /> We'll add this to your timeline
        </p>
        <p className="mt-1 text-xs text-gray-600">
          It goes in as an activity you can write up afterwards, like any other. What you find
          counts as evidence for your tutor and gives you something real to talk about at
          interview.
        </p>
      </div>

      <p className="mt-4 text-sm font-bold text-gray-700">What's worth looking at</p>
      <ul className="mt-2 space-y-3">
        <Point icon={FileText} title="The modules, year by year">
          What you'd actually study, and how much choice you get after first year. If the modules
          don't excite you, the course probably won't either.
        </Point>
        <Point icon={Info} title="How you're assessed">
          Exams, coursework, practicals or a dissertation? A course that's 80% exams suits a very
          different person to one that's mostly project work.
        </Point>
        <Point icon={CalendarDays} title="Contact hours and placements">
          How much teaching you get a week, and whether there's a placement, field trip or year
          abroad. Ask what the fieldwork actually involves.
        </Point>
        <Point icon={MessageSquare} title="What graduates go on to do">
          Most course pages publish this. Look for the jobs, not just the percentages.
        </Point>
        <Point icon={ExternalLink} title="The place itself">
          Halls, travel, what a week costs. Student reviews and virtual tours are more honest
          than the prospectus.
        </Point>
      </ul>

      <div className="mt-5 flex flex-wrap gap-2">
        <Button onClick={onConfirm} className="!bg-purple-600 hover:!bg-purple-700">
          <span className="flex items-center gap-1.5"><CalendarPlus size={15} /> Add to my timeline</span>
        </Button>
        <Button variant="secondary" onClick={onClose}>Not now</Button>
      </div>
    </Modal>
  )
}

/* "I'm applying" is an intention, not a submission. The modal exists mainly to
   make that distinction impossible to miss. */
export function ApplyModal({ open, onClose, course, onConfirm }) {
  if (!course) return null
  return (
    <Modal open={open} onClose={onClose}>
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-100 text-purple-600">
        <Send size={20} />
      </span>
      <h2 className="mt-3 text-xl font-bold text-gray-700">Telling us you're applying</h2>
      <p className="mt-1 text-sm text-gray-600">
        {course.CourseName} at {course.University}
      </p>

      <div className="mt-4 rounded-xl border border-amber-300 bg-amber-500/10 p-3">
        <p className="text-sm font-bold text-gray-700">This isn't your application</p>
        <p className="mt-1 text-xs text-gray-600">
          Nothing gets sent to {course.University} or UCAS from here. You're telling Navigate and
          your tutor that this is one you're going for, so they can help you with it.
        </p>
      </div>

      <p className="mt-4 text-sm font-bold text-gray-700">What happens next</p>
      <ol className="mt-2 space-y-3">
        <Point icon={Check} title="It appears on your shortlist and in Opportunities">
          Marked as one you're applying for, so you and your tutor can both see where you're up to.
        </Point>
        <Point icon={MessageSquare} title="Your tutor picks it up">
          Expect a conversation about whether the offer is realistic, and what else to put on your
          five UCAS choices.
        </Point>
        <Point icon={FileText} title="You write your personal statement">
          One statement covers all your choices, so it needs to work for every course on your list.
          Your tutor will help, and they'll write your reference.
        </Point>
        <Point icon={ExternalLink} title="The real application goes through UCAS">
          Your college submits it. The main deadline is late January, but earlier is better, and
          some courses close sooner.
        </Point>
      </ol>

      <div className="mt-5 flex flex-wrap gap-2">
        <Button onClick={onConfirm} className="!bg-purple-600 hover:!bg-purple-700">
          <span className="flex items-center gap-1.5"><Send size={15} /> Yes, I'm applying</span>
        </Button>
        <Button variant="secondary" onClick={onClose}>Not yet</Button>
      </div>
    </Modal>
  )
}
