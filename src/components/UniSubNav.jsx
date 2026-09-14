import { NavLink } from 'react-router-dom'
import { House, Sparkles, Bookmark, Send, RotateCcw } from 'lucide-react'
import { loadShortlist, loadApplications } from '../data/universities'
import { resetPrototypeData } from '../data/reset'

/* Module sub-navigation: the four places a student moves between while
   using the university finder. Counts read live so shortlisting on one page
   shows up in the bar immediately. */
const TABS = [
  { to: '/universities', label: 'Uni home', icon: House, end: true },
  { to: '/universities/matches', label: 'My matches', icon: Sparkles },
  { to: '/universities/shortlist', label: 'My shortlist', icon: Bookmark, count: () => loadShortlist().length },
  { to: '/universities/applications', label: 'My applications', icon: Send, count: () => loadApplications().length },
]

export default function UniSubNav() {
  return (
    <nav aria-label="Universities" className="flex flex-wrap items-center gap-1 rounded-xl bg-white p-1 shadow-sm">
      {TABS.map(({ to, label, icon: Icon, end, count }) => {
        const n = count ? count() : 0
        return (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-bold transition-colors ${
                isActive ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={15} /> {label}
                {n > 0 && (
                  <span className={`rounded-full px-1.5 py-0.5 text-[10px] leading-none font-bold ${
                    isActive ? 'bg-white/25 text-white' : 'bg-purple-100 text-purple-700'
                  }`}>
                    {n}
                  </span>
                )}
              </>
            )}
          </NavLink>
        )
      })}
      {/* Prototype-only: clear every stored choice and start again */}
      <button
        onClick={() => { if (window.confirm('Clear every choice you\'ve made in the prototype and start again?')) resetPrototypeData() }}
        className="ml-auto flex items-center gap-1.5 px-3 py-2 text-xs text-gray-400 hover:text-red-500"
      >
        <RotateCcw size={12} /> Reset my choices
      </button>
    </nav>
  )
}
