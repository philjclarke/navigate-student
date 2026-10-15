import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  Home, Compass, Bookmark, CircleUser, Menu, X, Mail, Clock, Puzzle,
  Building2, Lightbulb, Target, Signpost, User, FilePen, GraduationCap,
  LogOut, Accessibility, MessageCircle, RotateCcw,
} from 'lucide-react'
import { load, reset, confidence } from '../profile'

/* The wider Navigate structure is kept: a brand bar with the menu and Message
   my Tutor, and a drawer holding every section. Refreshed rather than copied. */
const SECTIONS = [
  { label: 'Home', icon: Home, to: null },
  { label: 'Timeline', icon: Clock, to: null },
  { label: 'Skills', icon: Puzzle, to: null },
  { label: 'Placements', icon: Building2, to: null },
  { label: 'Opportunities', icon: Lightbulb, to: null },
  { label: 'Targets', icon: Target, to: null },
  { label: 'My Future', icon: Signpost, to: null },
  { label: 'Universities', icon: GraduationCap, to: '/next' },
  { label: 'Profile', icon: User, to: null },
  { label: 'Digital CV', icon: FilePen, to: null },
]

/* Within Universities, four views. Bottom placement keeps them in thumb reach. */
const TABS = [
  { to: '/next', label: 'Home', icon: Home, end: true },
  { to: '/next/explore', label: 'Explore', icon: Compass },
  { to: '/next/shortlist', label: 'Saved', icon: Bookmark },
  { to: '/next/me', label: 'Me', icon: CircleUser },
]

export default function Shell() {
  const { pathname } = useLocation()
  const [menu, setMenu] = useState(false)
  const [note, setNote] = useState(null)
  const p = load()
  const onboarding = pathname.startsWith('/next/start')

  const pick = (s) => {
    setMenu(false)
    if (!s.to) { setNote(`${s.label} is part of Navigate, but not rebuilt in this prototype yet.`); setTimeout(() => setNote(null), 2600) }
  }

  return (
    <div className="min-h-dvh bg-slate-100">
      <div className="relative mx-auto flex min-h-dvh w-full max-w-[430px] flex-col overflow-hidden bg-white shadow-xl sm:my-4 sm:min-h-[calc(100dvh-2rem)] sm:rounded-[2rem]">

        {!onboarding && (
          <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between bg-brand-500 px-2 text-white">
            <button onClick={() => setMenu(true)} className="flex h-11 w-11 items-center justify-center" aria-label="Menu">
              <Menu size={24} />
            </button>
            <span className="text-[19px] font-extrabold tracking-wide">NAVIGATE</span>
            <button
              onClick={() => { setNote('Opens a message to your tutor'); setTimeout(() => setNote(null), 2200) }}
              className="flex h-11 w-11 flex-col items-center justify-center gap-0.5"
              aria-label="Message my tutor"
            >
              <Mail size={19} />
              <span className="text-[8px] leading-none font-semibold">Tutor</span>
            </button>
          </header>
        )}

        <div className={`flex-1 ${onboarding ? '' : 'pb-24'}`}>
          <Outlet />
        </div>

        {!onboarding && (
          <>
            <button
              onClick={() => { setNote('NavBot can answer questions about using Navigate'); setTimeout(() => setNote(null), 2400) }}
              className="absolute right-4 bottom-[88px] z-30 flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-brand-500 text-white shadow-lg"
              aria-label="NavBot"
            >
              <MessageCircle size={20} />
            </button>

            <nav className="sticky bottom-0 z-30 shrink-0 border-t border-slate-200 bg-white/95 backdrop-blur">
              <div className="grid grid-cols-4">
                {TABS.map(({ to, label, icon: Icon, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      `flex min-h-[60px] flex-col items-center justify-center gap-1 text-[11px] font-semibold transition-colors ${
                        isActive ? 'text-violet-700' : 'text-slate-400'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span className={`flex h-7 w-12 items-center justify-center rounded-full transition-colors ${isActive ? 'bg-violet-100' : ''}`}>
                          <Icon size={19} strokeWidth={isActive ? 2.4 : 2} />
                        </span>
                        {label}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
              <div className="h-[env(safe-area-inset-bottom)]" />
            </nav>
          </>
        )}

        {/* Drawer: same sections as today, on the brand gradient */}
        {menu && (
          <div className="absolute inset-0 z-50">
            <div className="absolute inset-0 bg-slate-900/50" onClick={() => setMenu(false)} />
            <div className="absolute inset-y-0 left-0 flex w-[82%] max-w-[320px] flex-col bg-gradient-to-b from-brand-500 to-brand-blue">
              <div className="flex h-14 items-center justify-between px-5 text-white">
                <span className="text-[19px] font-extrabold tracking-wide">NAVIGATE</span>
                <button onClick={() => setMenu(false)} className="flex h-11 w-11 items-center justify-center -mr-3" aria-label="Close menu">
                  <X size={22} />
                </button>
              </div>
              <div className="flex items-center gap-3 px-5 pb-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/25 text-[14px] font-bold text-white">JG</span>
                <div className="text-white">
                  <p className="text-[15px] font-bold">Jason Gould</p>
                  <p className="text-[12px] text-white/75">{confidence(p)}% of your profile done</p>
                </div>
              </div>
              <nav className="flex-1 overflow-y-auto px-3 pb-4">
                {SECTIONS.map((s) => {
                  const Icon = s.icon
                  const here = s.to && pathname.startsWith('/next')
                  const inner = (
                    <>
                      <Icon size={20} className="shrink-0" />
                      <span className="flex-1">{s.label}</span>
                      {!s.to && <span className="text-[10px] font-semibold text-white/50">soon</span>}
                    </>
                  )
                  const cls = `flex min-h-[52px] w-full items-center gap-3.5 rounded-xl px-3.5 text-left text-[15px] font-semibold ${
                    here ? 'bg-white/20 text-white' : 'text-white/85'
                  }`
                  return s.to
                    ? <NavLink key={s.label} to={s.to} onClick={() => setMenu(false)} className={cls}>{inner}</NavLink>
                    : <button key={s.label} onClick={() => pick(s)} className={cls}>{inner}</button>
                })}
              </nav>
              <div className="border-t border-white/20 px-3 py-2">
                <button onClick={() => pick({ label: 'Accessibility' })} className="flex min-h-[52px] w-full items-center gap-3.5 rounded-xl px-3.5 text-left text-[15px] font-semibold text-white/85">
                  <Accessibility size={20} /> Accessibility
                </button>
                <button onClick={() => pick({ label: 'Logout' })} className="flex min-h-[52px] w-full items-center gap-3.5 rounded-xl px-3.5 text-left text-[15px] font-semibold text-white/85">
                  <LogOut size={20} /> Log out
                </button>
              </div>
            </div>
          </div>
        )}

        {note && (
          <div className="absolute bottom-28 left-1/2 z-50 w-[85%] -translate-x-1/2 rounded-2xl bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white shadow-lg">
            {note}
          </div>
        )}
      </div>

      <button
        onClick={() => { if (window.confirm('Clear everything and start over?')) reset() }}
        className="fixed right-4 bottom-4 hidden items-center gap-1.5 rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-400 shadow-sm hover:text-rose-600 sm:flex"
      >
        <RotateCcw size={13} /> Reset ({confidence(p)}% known)
      </button>
    </div>
  )
}
