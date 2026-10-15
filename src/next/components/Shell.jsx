import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Home, Compass, Bookmark, CircleUser, RotateCcw } from 'lucide-react'
import { load, reset, confidence } from '../profile'

const TABS = [
  { to: '/next', label: 'Home', icon: Home, end: true },
  { to: '/next/explore', label: 'Explore', icon: Compass },
  { to: '/next/shortlist', label: 'Saved', icon: Bookmark },
  { to: '/next/me', label: 'Me', icon: CircleUser },
]

/* Mobile first. The app is built at phone width and simply centres on a
   larger screen, so what you see on a laptop is what a student sees. */
export default function Shell() {
  const { pathname } = useLocation()
  const p = load()
  const onboarding = pathname.startsWith('/next/start')

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="relative mx-auto min-h-screen w-full max-w-[430px] bg-white shadow-xl sm:min-h-[calc(100vh-2rem)] sm:my-4 sm:rounded-[2rem] sm:overflow-hidden">
        <div className={onboarding ? '' : 'pb-24'}>
          <Outlet />
        </div>

        {!onboarding && (
          <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-[430px] -translate-x-1/2 border-t border-slate-200 bg-white/95 backdrop-blur sm:absolute sm:bottom-0">
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
        )}
      </div>

      {/* Prototype control, deliberately outside the phone */}
      <button
        onClick={() => { if (window.confirm('Clear everything and start over?')) reset() }}
        className="fixed right-4 bottom-4 hidden items-center gap-1.5 rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-400 shadow-sm hover:text-rose-600 sm:flex"
      >
        <RotateCcw size={13} /> Reset ({confidence(p)}% known)
      </button>
    </div>
  )
}
