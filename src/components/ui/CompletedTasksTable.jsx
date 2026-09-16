import { Download, ShieldCheck, Users } from 'lucide-react'
import FilterChips from './FilterChips'
import { formatDate } from '../../lib/format'

export default function CompletedTasksTable({ tasks }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map((task) => (
        <div key={task.task_id} className="rounded-2xl border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="font-bold text-gray-900">Task #{task.task_id}</span>
            <a
              href={task.url_of_file}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-800"
            >
              <Download size={12} /> CSV
            </a>
          </div>

          <div className="mt-3">
            <FilterChips filters={task.filters} />
          </div>

          <div className="mt-4 flex items-center gap-4 border-t border-gray-100 pt-3">
            <Stat icon={Users} color="text-blue-600" label="Scraped" value={task.total_leads_scraped ?? 0} />
            <Stat
              icon={ShieldCheck}
              color="text-emerald-600"
              label="Verified"
              value={task.total_verified_emails ?? 0}
            />
          </div>

          <p className="mt-2 text-xs text-gray-400">Completed {formatDate(task.task_completed_at)}</p>
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
