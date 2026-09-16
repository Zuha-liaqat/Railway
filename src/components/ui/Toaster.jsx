import { useEffect, useState } from 'react'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'
import { subscribeToasts, toast } from '../../lib/toast'

const VARIANTS = {
  error: { icon: AlertCircle, className: 'bg-red-600' },
  success: { icon: CheckCircle2, className: 'bg-emerald-600' },
  info: { icon: Info, className: 'bg-gray-800' },
}

export default function Toaster() {
  const [toasts, setToasts] = useState([])

  useEffect(() => subscribeToasts(setToasts), [])

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-[9999] flex w-full max-w-sm flex-col gap-2 pointer-events-none">
      {toasts.map((t) => {
        const { icon: Icon, className } = VARIANTS[t.type] || VARIANTS.info
        return (
          <div
            key={t.id}
            role="alert"
            className={`toast-enter pointer-events-auto flex items-start gap-2.5 rounded-lg ${className} px-4 py-3 text-sm text-white shadow-lg`}
          >
            <Icon size={16} className="mt-0.5 shrink-0" />
            <p className="flex-1 break-words">{t.message}</p>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="shrink-0 text-white/80 hover:text-white"
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
