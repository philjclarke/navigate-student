import { ChevronRight } from 'lucide-react'

/* Screen header. Big, confident type; shrinks to a title row on scroll pages. */
export function Header({ eyebrow, title, right, children }) {
  return (
    <header className="px-5 pt-8 pb-4">
      {eyebrow && <p className="text-xs font-bold tracking-wide text-violet-600 uppercase">{eyebrow}</p>}
      <div className="flex items-start justify-between gap-3">
        <h1 className="mt-1 text-[28px] leading-[1.15] font-bold tracking-tight text-slate-900">{title}</h1>
        {right}
      </div>
      {children}
    </header>
  )
}

export function Card({ className = '', children, ...props }) {
  return (
    <div className={`rounded-3xl border border-slate-200 bg-white p-5 ${className}`} {...props}>
      {children}
    </div>
  )
}

/* 48px minimum height everywhere: these are thumb targets, not mouse targets. */
export function Button({ children, variant = 'primary', className = '', ...props }) {
  const v = {
    primary: 'bg-violet-600 text-white active:bg-violet-700',
    secondary: 'bg-white text-slate-700 border border-slate-300 active:bg-slate-50',
    quiet: 'bg-slate-100 text-slate-600 active:bg-slate-200',
    dark: 'bg-slate-900 text-white active:bg-slate-800',
  }[variant]
  return (
    <button className={`flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl px-5 text-[15px] font-bold transition-colors ${v} ${className}`} {...props}>
      {children}
    </button>
  )
}

export function Pill({ children, tone = 'slate' }) {
  const t = {
    slate: 'bg-slate-100 text-slate-600',
    violet: 'bg-violet-100 text-violet-700',
    green: 'bg-emerald-100 text-emerald-700',
    amber: 'bg-amber-100 text-amber-700',
    sky: 'bg-sky-100 text-sky-700',
  }[tone]
  return <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold whitespace-nowrap ${t}`}>{children}</span>
}

/* Progress ring. Readiness is steps completed, so it always reads "n of m". */
export function Ring({ done, total, size = 56, stroke = 6, tone = '#7c3aed' }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const pct = total ? done / total : 0
  return (
    <svg width={size} height={size} className="-rotate-90" role="img" aria-label={`${done} of ${total} steps`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#ede9fe" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none" stroke={tone} strokeWidth={stroke}
        strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct)}
      />
    </svg>
  )
}

export function Bar({ pct, tone = 'bg-violet-500' }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
      <div className={`h-full rounded-full transition-all ${tone}`} style={{ width: `${pct}%` }} />
    </div>
  )
}

/* Horizontal rail: how every app this age group uses presents a set. */
export function Rail({ children }) {
  return (
    <div className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {children}
    </div>
  )
}

export function RowLink({ title, sub, onClick }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 py-3 text-left active:bg-slate-50">
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-bold text-slate-900">{title}</p>
        {sub && <p className="truncate text-[13px] text-slate-500">{sub}</p>}
      </div>
      <ChevronRight size={18} className="shrink-0 text-slate-300" />
    </button>
  )
}

export function Toast({ msg }) {
  if (!msg) return null
  return (
    <div className="fixed bottom-28 left-1/2 z-50 w-[85%] max-w-[380px] -translate-x-1/2 rounded-2xl bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white shadow-lg">
      {msg}
    </div>
  )
}
