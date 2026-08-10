import { X } from 'lucide-react'

export default function Flyout({ open, onClose, icon: Icon, title, wide = false, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        className={`absolute inset-y-0 right-0 flex w-full flex-col bg-white shadow-2xl ${
          wide ? 'max-w-2xl' : 'max-w-md'
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            {Icon && (
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-white">
                <Icon size={18} />
              </span>
            )}
            <h2 className="text-lg font-bold text-gray-700">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-lg bg-gray-700 px-3 py-1.5 text-sm font-semibold text-white hover:bg-gray-800"
          >
            <X size={15} /> Close
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  )
}
