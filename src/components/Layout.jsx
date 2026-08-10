import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import {
  Home, Clock, Puzzle, Building2, Lightbulb, Target, Signpost, User, FilePen,
  Mail, ChevronLeft, ChevronRight, Plus, Menu, X, Mic, SendHorizonal,
} from 'lucide-react'
import Flyout from './Flyout'

const NAV = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/timeline', label: 'Timeline', icon: Clock },
  { to: '/skills', label: 'Skills', icon: Puzzle },
  { to: '/placements', label: 'Placements', icon: Building2 },
  { to: '/opportunities', label: 'Opportunities', icon: Lightbulb },
  { to: '/targets', label: 'Targets', icon: Target },
  { to: '/future', label: 'My Future', icon: Signpost },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/digital-cv', label: 'Digital CV', icon: FilePen },
]

function NavItems({ expanded, onNavigate }) {
  return (
    <nav className="flex flex-col gap-1 px-3">
      {NAV.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
              isActive ? 'bg-white/20 text-white' : 'text-white/85 hover:bg-white/10 hover:text-white'
            }`
          }
          title={label}
        >
          <Icon size={20} className="shrink-0" />
          {expanded && <span>{label}</span>}
        </NavLink>
      ))}
    </nav>
  )
}

function NavBot() {
  const [open, setOpen] = useState(false)
  return (
    <>
      {open && (
        <div className="fixed right-5 bottom-24 z-40 flex h-96 w-80 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
          <div className="bg-brand-500 px-4 py-3 text-white">
            <p className="font-bold leading-tight">NavBot</p>
            <p className="text-xs text-white/85">Ask a question about using Navigate</p>
          </div>
          <div className="flex-1 space-y-2 overflow-y-auto p-4 text-sm">
            <div className="max-w-[85%] rounded-xl rounded-tl-sm bg-brand-100 px-3 py-2">
              Hi Jason! How can I help you today?
            </div>
          </div>
          <div className="flex items-center gap-2 border-t border-gray-200 p-3">
            <input
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
              placeholder="Type a question…"
            />
            <button className="text-gray-400 hover:text-brand-600" aria-label="Voice input"><Mic size={18} /></button>
            <button className="text-brand-600 hover:text-brand-700" aria-label="Send"><SendHorizonal size={18} /></button>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Open NavBot"
        className="fixed right-5 bottom-5 z-40 flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-brand-500 text-white shadow-lg hover:bg-brand-600"
      >
        <span className="text-lg font-extrabold">N</span>
      </button>
    </>
  )
}

export default function Layout() {
  const [expanded, setExpanded] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [tutorOpen, setTutorOpen] = useState(false)

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <header className="fixed inset-x-0 top-0 z-30 flex h-16 items-center bg-brand-500 pr-4 text-white">
        <button
          className="ml-4 md:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation"
        >
          <Menu size={26} />
        </button>
        <div className={`hidden items-center md:flex ${expanded ? 'w-52' : 'w-16'} shrink-0 justify-center transition-all`}>
          <span className="text-2xl font-extrabold tracking-wide">{expanded ? 'NAVIGATE' : 'N'}</span>
        </div>
        <span className="mx-auto text-2xl font-extrabold tracking-wide md:hidden">NAVIGATE</span>
        <div className="hidden items-center gap-3 border-l border-white/25 pl-4 md:flex">
          {/* Partner logo placeholder */}
          <div className="flex h-9 w-9 items-center justify-center rounded bg-white text-[9px] font-bold text-brand-600">EDU</div>
          <div className="text-xs leading-tight">
            <p className="font-bold">The Education</p>
            <p className="text-white/80">Company</p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <div className="hidden items-center gap-2.5 md:flex">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-400 text-sm font-bold">JG</div>
            <div className="text-xs leading-tight">
              <p className="font-bold">Jason Gould</p>
              <button className="text-white/80 hover:text-white">Logout</button>
            </div>
          </div>
          <button
            onClick={() => setTutorOpen(true)}
            className="flex flex-col items-center gap-0.5 border-l border-white/25 pl-4 text-[10px] leading-tight text-white/90 hover:text-white"
          >
            <Mail size={20} />
            <span>Message<br />my Tutor</span>
          </button>
        </div>
      </header>

      {/* Desktop sidebar */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-30 hidden flex-col bg-gradient-to-b from-brand-500 to-brand-blue pt-6 pb-5 md:flex ${
          expanded ? 'w-52' : 'w-16'
        } transition-all`}
      >
        <NavItems expanded={expanded} />
        <button
          onClick={() => setExpanded(!expanded)}
          aria-label="Toggle sidebar"
          className="mt-4 self-center text-white/80 hover:text-white"
        >
          {expanded ? <ChevronLeft size={22} /> : <ChevronRight size={22} />}
        </button>
        <button
          aria-label="Accessibility options"
          title="Accessibility widget (placeholder)"
          className="mt-auto ml-4 flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/60 text-white/90 hover:bg-white/10"
        >
          <Plus size={22} />
        </button>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-64 flex-col bg-gradient-to-b from-brand-500 to-brand-blue pt-5 pb-5">
            <div className="mb-4 flex items-center justify-between px-4 text-white">
              <span className="text-xl font-extrabold tracking-wide">NAVIGATE</span>
              <button onClick={() => setMobileOpen(false)} aria-label="Close navigation"><X size={24} /></button>
            </div>
            <NavItems expanded onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <main className={`pt-16 ${expanded ? 'md:pl-52' : 'md:pl-16'} transition-all`}>
        <div className="mx-auto max-w-[1400px] px-4 py-6 md:px-8">
          <Outlet />
          <footer className="mt-10 border-t border-gray-300 pt-4 pb-8 text-xs text-gray-400">
            © 2014 - 2026 Navigation Learning
          </footer>
        </div>
      </main>

      <NavBot />

      {/* Message my Tutor flyout */}
      <Flyout open={tutorOpen} onClose={() => setTutorOpen(false)} icon={Mail} title="Message my Tutor">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-600">Subject:</label>
            <input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-600">Your message:</label>
            <textarea rows={8} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500" />
          </div>
          <button className="rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-600">
            Send this message
          </button>
        </div>
      </Flyout>
    </div>
  )
}
