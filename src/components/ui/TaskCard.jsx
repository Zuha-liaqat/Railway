import { Loader2, Trash2 } from 'lucide-react'
import StatusBadge from './StatusBadge'
import FilterChips from './FilterChips'

const RUNNING_STATUSES = ['pending', 'running', 'starting', 'in_progress', 'queued']

export default function TaskCard({ task, onDelete, deleting }) {
  const status = String(task.status || '').toLowerCase()
  const isRunning = RUNNING_STATUSES.includes(status)

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <StatusBadge status={task.status} />
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <h3 className="text-lg font-bold text-gray-900">{task.task_name || `Task #${task.id}`}</h3>
            <span className="text-xs font-semibold text-gray-400">#{task.id}</span>
            <span className="text-sm text-gray-400">{task.account_email}</span>
          </div>
        </div>
        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(task.id)}
            disabled={deleting}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
            aria-label="Delete task"
          >
            {deleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
          </button>
        )}
      </div>

      <div className="mt-4">
        <FilterChips filters={task.filters} />
      </div>

      {isRunning && (
        <div className="mt-4">
          <div className="flex items-center gap-2.5">
            <div className="h-1.5 flex-1 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-500"
                style={{ width: `${Math.max(0, Math.min(100, Number(task.progress) || 0))}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-gray-700">
              {Math.round(Math.max(0, Math.min(100, Number(task.progress) || 0)))}%
            </span>
          </div>
          {task.message && <p className="mt-2 text-xs text-gray-500">{task.message}</p>}
        </div>
      )}
    </div>
  )
}
