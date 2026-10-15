import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  Sparkles, Compass, Bookmark, CircleUser, Menu, X, Mail, Home, Clock, Puzzle,
  Building2, Lightbulb, Target, Signpost, User, FilePen, GraduationCap,
  LogOut, Accessibility, MessageCircle, RotateCcw,
} from 'lucide-react'
import { load, reset, confidence } from '../profile'

/* The wider Navigate structure is kept: a brand bar carrying the section menu
   and Message my Tutor. Refreshed rather than copied — the menu pops out of the
   hamburger instead of sliding in, so it stays clearly attached to the control
   that opened it. */
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

/* Within Universities. "Home" belonged to the wider site, so the feed is now
   For you — which is also what it is. */
const TABS = [
  { to: '/next', label: 'For you', icon: Sparkles, end: true },
  { to: '/next/explore', label: 'Explore', icon: Compass },
  { to: '/next/shortlist', label: 'Saved', icon: Bookmark },
  { to: '/next/me', label: 'Me', icon: CircleUser },
]

export default function Shell() {
  const { pathname } = useLocation()
  const [menu, setMenu] = useState(false)
  const [note, setNote] = useState(null)
  const scroller = useRef(null)
  const p = load()
  const onboarding = pathname.startsWith('/next/start')

  /* The frame scrolls, not the page, so each view has to be sent back to the
     top itself. */
  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 })
    setMenu(false)
  }, [pathname])

  const say = (text) => { setNote(text); setTimeout(() => setNote(null), 2600) }
  const pick = (s) => {
    setMenu(false)
    if (!s.to) say(`${s.label} is part of Navigate, but not rebuilt in this prototype yet.`)
  }

  return (
    <div className="min-h-dvh bg-slate-100">
      <div className="relative mx-auto flex h-dvh w-full max-w-[430px] flex-col overflow-hidden bg-white shadow-xl sm:my-4 sm:h-[calc(100dvh-2rem)] sm:rounded-[2rem]">

        {!onboarding && (
          <header className="relative z-50 flex h-14 shrink-0 items-center justify-between bg-brand-500 px-2 text-white">
            <button
              onClick={() => setMenu(!menu)}
              className="flex h-11 w-11 items-center justify-center"
              aria-label={menu ? 'Close menu' : 'Menu'}
              aria-expanded={menu}
            >
              <span className="relative block h-6 w-6">
                <Menu size={24} className={`absolute inset-0 transition-all duration-200 ${menu ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'}`} />
                <X size={24} className={`absolute inset-0 transition-all duration-200 ${menu ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'}`} />
              </span>
            </button>
            <span className="text-[19px] font-extrabold tracking-wide">NAVIGATE</span>
            <button
              onClick={() => say('Opens a message to your tutor')}
              className="flex h-11 w-11 flex-col items-center justify-center gap-0.5"
              aria-label="Message my tutor"
            >
              <Mail size={19} />
              <span className="text-[8px] leading-none font-semibold">Tutor</span>
            </button>
          </header>
        )}

        <main ref={scroller} className="flex-1 overflow-y-auto overscroll-contain">
          <Outlet />
        </main>

        {!onboarding && (
          <>
            <button
              onClick={() => say('NavBot can answer questions about using Navigate')}
              className="absolute right-4 bottom-[88px] z-30 flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-brand-500 text-white shadow-lg"
              aria-label="NavBot"
            >
              <MessageCircle size={20} />
            </button>

            {/* Locked to the foot of the frame: a flex sibling of the scroller,
                so it never moves and never overlaps the last card. */}
            <nav className="z-30 shrink-0 border-t border-slate-200 bg-white">
              <div className="grid grid-cols-4">
                {TABS.map(({ to, label, icon: Icon, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      `flex min-h-[58px] flex-col items-center justify-center gap-0.5 text-[11px] font-semibold transition-colors ${
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

        {/* Section menu: a panel hung off the hamburger */}
        {menu && (
          <>
            <button
              className="absolute inset-0 top-14 z-40 bg-slate-900/30"
              onClick={() => setMenu(false)}
              aria-label="Close menu"
              tabIndex={-1}
            />
            <div className="nx-pop absolute top-[54px] left-2 z-50 w-[272px]">
              <div className="mt-2 flex max-h-[calc(100dvh-5rem)] flex-col overflow-hidden rounded-3xl bg-gradient-to-b from-brand-500 to-brand-blue shadow-2xl ring-1 ring-black/10">
                <div className="flex items-center gap-3 px-4 pt-4 pb-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/25 text-[13px] font-bold text-white">JG</span>
                  <div className="text-white">
                    <p className="text-[14px] leading-tight font-bold">Jason Gould</p>
                    <p className="text-[11px] text-white/75">{confidence(p)}% of your profile done</p>
                  </div>
                </div>
                <nav className="overflow-y-auto px-2 pb-1">
                  {SECTIONS.map((s) => {
                    const Icon = s.icon
                    const here = s.to && pathname.startsWith('/next')
                    const inner = (
                      <>
                        <Icon size={18} className="shrink-0" />
                        <span className="flex-1">{s.label}</span>
                      </>
                    )
                    const cls = `flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3 text-left text-[14px] font-semibold ${
                      here ? 'bg-white/20 text-white' : 'text-white/85'
                    }`
                    return s.to
                      ? <NavLink key={s.label} to={s.to} onClick={() => setMenu(false)} className={cls}>{inner}</NavLink>
                      : <button key={s.label} onClick={() => pick(s)} className={cls}>{inner}</button>
                  })}
                </nav>
                <div className="mt-1 border-t border-white/20 px-2 py-1.5">
                  <button onClick={() => pick({ label: 'Accessibility' })} className="flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3 text-left text-[14px] font-semibold text-white/85">
                    <Accessibility size={18} /> Accessibility
                  </button>
                  <button onClick={() => pick({ label: 'Logout' })} className="flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3 text-left text-[14px] font-semibold text-white/85">
                    <LogOut size={18} /> Log out
                  </button>
                </div>
              </div>
              {/* points back at the hamburger that opened it */}
              <div className="absolute top-[3px] left-[21px] h-4 w-4 rotate-45 rounded-[4px] bg-brand-500" />
            </div>
          </>
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
