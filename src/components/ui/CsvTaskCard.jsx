import { Download, FileText } from 'lucide-react'
import StatusBadge from './StatusBadge'
import { formatDate } from '../../lib/format'

export default function CsvTaskCard({ task }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <span className="block truncate font-bold text-gray-900">
            {task.task_name || task.file_name || `CSV Task #${task.task_id}`}
          </span>
          <span className="mt-0.5 flex items-center gap-1 text-xs text-gray-400">
            <FileText size={12} className="shrink-0" />
            <span className="truncate">{task.file_name}</span>
          </span>
        </div>
        {task.download_url && (
          <a
            href={task.download_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-blue-700 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-800"
          >
            <Download size={12} /> CSV
          </a>
        )}
      </div>

      <div className="mt-3">
        <StatusBadge status={task.status} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-gray-100 pt-3">
        <Stat label="Total rows" value={task.total_rows} />
        <Stat label="Valid emails" value={task.valid_emails_count} />
        <Stat label="Personal removed" value={task.personal_emails_removed_count} />
        <Stat label="Missing emails" value={task.missing_emails_count} />
        <Stat label="Combinations" value={task.combinations_generated_count} />
        <Stat label="Duplicates removed" value={task.duplicates_removed_count} />
      </div>

      <p className="mt-3 text-xs text-gray-400">
        Started {formatDate(task.started_at)} · Completed {formatDate(task.completed_at)}
      </p>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm font-semibold text-gray-900">{value ?? '—'}</p>
    </div>
  )
}
