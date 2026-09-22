import { Download, FileSpreadsheet, Layers, Loader2, ShieldCheck, Trash2, Users } from 'lucide-react'
import FilterChips from './FilterChips'
import { formatDate } from '../../lib/format'

export default function CompletedTasksTable({ tasks, onDelete, deletingId }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map((task) => (
        <div key={task.task_id} className="rounded-2xl border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <span className="block truncate font-bold text-gray-900">
                {task.task_name || `Task #${task.task_id}`}
              </span>
              <span className="text-xs text-gray-400">#{task.task_id}</span>
            </div>
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(task.task_id)}
                disabled={deletingId === task.task_id}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                aria-label="Delete task"
              >
                {deletingId === task.task_id ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Trash2 size={13} />
                )}
              </button>
            )}
          </div>

          <div className="mt-3">
            <FilterChips filters={task.filters} />
          </div>

          <div className="mt-4 flex items-center gap-4 border-t border-gray-100 pt-3">
            <Stat icon={Users} color="text-blue-600" label="Scraped" value={task.total_leads_scraped ?? 0} />
            {Boolean(task.total_verified_emails) && (
              <Stat
                icon={ShieldCheck}
                color="text-emerald-600"
                label="Verified"
                value={task.total_verified_emails}
              />
            )}
          </div>

          {(task.url_of_file || task.url_of_combinations_file) && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              {task.url_of_file && (
                <a
                  href={task.url_of_file}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center justify-between gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-xs font-semibold text-gray-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                >
                  <span className="flex items-center gap-1.5">
                    <FileSpreadsheet size={13} /> Leads
                  </span>
                  <Download size={12} className="text-gray-400 group-hover:text-blue-500" />
                </a>
              )}
              {task.url_of_combinations_file && (
                <a
                  href={task.url_of_combinations_file}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center justify-between gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-xs font-semibold text-gray-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                >
                  <span className="flex items-center gap-1.5">
                    <Layers size={13} /> Combinations
                  </span>
                  <Download size={12} className="text-gray-400 group-hover:text-blue-500" />
                </a>
              )}
            </div>
          )}

          <p className="mt-3 text-xs text-gray-400">Completed {formatDate(task.task_completed_at)}</p>
        </div>
      ))}
    </div>
  )
}

function Stat({ icon: Icon, color, label, value }) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon size={14} className={color} />
      <span className="text-sm font-semibold text-gray-900">{value}</span>
      <span className="text-xs text-gray-400">{label}</span>
    </div>
  )
}
