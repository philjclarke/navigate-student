/* Shared UI primitives for the Navigate student shell */

export function PageBanner({ icon: Icon, eyebrow, title, action, children }) {
  return (
    <div className="rounded-2xl bg-brand-100 px-7 py-6 md:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-1.5 text-sm font-bold text-brand-600">
            {Icon && <Icon size={16} />} {eyebrow}
          </p>
          <h1 className="mt-2 text-3xl font-light text-gray-600 md:text-4xl">{title}</h1>
        </div>
        {action}
      </div>
      {children}
    </div>
  )
}

export function Card({ className = '', children }) {
  return <div className={`rounded-2xl bg-white p-5 shadow-sm ${className}`}>{children}</div>
}

/* Outlined card used for the dashboard summary panels (My Skills / My Placements / My Targets) */
export function PanelCard({ icon: Icon, title, actionLabel = 'See all', className = '', children }) {
  return (
    <div className={`rounded-2xl border border-brand-300 bg-white p-5 ${className}`}>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-2xl font-light text-gray-600">
          {Icon && <Icon size={22} className="text-brand-500" />} {title}
        </h2>
        <Button small>{actionLabel}</Button>
      </div>
      {children}
    </div>
  )
}

export function Button({ children, variant = 'primary', small = false, className = '', ...props }) {
  const variants = {
    primary: 'bg-brand-500 text-white hover:bg-brand-600',
    secondary: 'border border-brand-500 bg-white text-brand-600 hover:bg-brand-50',
    dark: 'bg-navy-800 text-white hover:bg-navy-900',
  }
  return (
    <button
      className={`rounded-lg font-bold ${small ? 'px-4 py-1.5 text-xs' : 'px-4 py-2.5 text-sm'} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function StatusPill({ children }) {
  return (
    <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
      {children}
    </span>
  )
}

export function ProgressRing({ value, label = 'Hours Completed', size = 96 }) {
  const stroke = 12
  const r = (size - stroke) / 2
  return (
    <svg width={size} height={size} role="img" aria-label={`${value} ${label}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={stroke} />
      <text x="50%" y="46%" textAnchor="middle" className="fill-gray-700 text-xl font-extrabold">
        {value}
      </text>
      <text x="50%" y="62%" textAnchor="middle" className="fill-gray-500 text-[7px] font-bold uppercase">
        {label}
      </text>
    </svg>
  )
}

export function HoursCard({ title, value }) {
  return (
    <Card className="flex flex-col gap-3">
      <h3 className="border-b border-gray-100 pb-2 text-center text-sm font-bold text-gray-700">{title}</h3>
      <div className="flex items-center justify-around">
        <ProgressRing value={value} />
        <div className="text-center">
          <p className="text-[11px] font-bold tracking-wide text-gray-500 uppercase">Hours Recorded</p>
          <p className="text-3xl font-extrabold text-gray-700">{value}</p>
        </div>
      </div>
    </Card>
  )
}

/* Simple grey gradient block standing in for photography */
export function ImagePlaceholder({ className = '' }) {
  return (
    <div
      className={`rounded-lg bg-gradient-to-br from-brand-200 via-gray-200 to-brand-blue/30 ${className}`}
      aria-hidden="true"
    />
  )
}

export function FauxSelect({ value = 'Please select', className = '' }) {
  return (
    <button
      className={`flex items-center justify-between gap-6 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-600 ${className}`}
    >
      {value}
      <span className="text-gray-400">⇕</span>
    </button>
  )
}

export function Field({ label, required = false, type = 'text', defaultValue = '', readOnly = false }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-semibold text-gray-600">
        {required && <span className="text-red-500">* </span>}
        {label}
      </label>
      <input
        type={type}
        defaultValue={defaultValue}
        readOnly={readOnly}
        className={`w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500 ${
          readOnly ? 'bg-gray-100 text-gray-500' : ''
        }`}
      />
    </div>
  )
}
