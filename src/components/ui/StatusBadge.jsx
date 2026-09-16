import { statusLabel } from '../../lib/format'

const STYLES = {
  completed: 'bg-emerald-50 text-emerald-700',
  success: 'bg-emerald-50 text-emerald-700',
  done: 'bg-emerald-50 text-emerald-700',
  finished: 'bg-emerald-50 text-emerald-700',
  running: 'bg-blue-50 text-blue-700',
  pending: 'bg-blue-50 text-blue-700',
  starting: 'bg-blue-50 text-blue-700',
  in_progress: 'bg-blue-50 text-blue-700',
  failed: 'bg-red-50 text-red-700',
  error: 'bg-red-50 text-red-700',
}

export default function StatusBadge({ status }) {
  const key = String(status || '').toLowerCase()
  const style = STYLES[key] || 'bg-gray-100 text-gray-600'
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${style}`}>
      {statusLabel(status)}
    </span>
  )
}
