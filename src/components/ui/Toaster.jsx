import { useEffect, useState } from 'react'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'
import { subscribeToasts, toast } from '../../lib/toast'

const VARIANTS = {
  error: { icon: AlertCircle, iconBg: 'bg-red-50', iconColor: 'text-red-600' },
  success: { icon: CheckCircle2, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
  info: { icon: Info, iconBg: 'bg-gray-100', iconColor: 'text-gray-600' },
}

export default function Toaster() {
  const [toasts, setToasts] = useState([])

  useEffect(() => subscribeToasts(setToasts), [])

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 left-4 right-4 z-9999 flex flex-col items-end gap-2 pointer-events-none sm:left-auto">
      {toasts.map((t) => {
        const { icon: Icon, iconBg, iconColor } = VARIANTS[t.type] || VARIANTS.info
        return (
          <div
            key={t.id}
            role="alert"
            className="toast-enter pointer-events-auto flex w-full items-start gap-3 rounded-2xl border border-gray-200 bg-white p-4 text-sm shadow-lg sm:w-96"
          >
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${iconBg} ${iconColor}`}
            >
              <Icon size={16} />
            </span>
            <p className="flex-1 pt-1 text-gray-900 wrap-break-word">{t.message}</p>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="mt-1.5 shrink-0 text-gray-400 hover:text-gray-600"
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
