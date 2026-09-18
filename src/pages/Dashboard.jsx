import { useCallback, useEffect, useRef, useState } from 'react'
import {
  AlertCircle,
  CheckCircle2,
  Download,
  Loader2,
  ShieldCheck,
  TrendingUp,
  Users,
  XCircle,
} from 'lucide-react'
import { fetchTasks, fetchCompletedTasks } from '../lib/api'
import { formatDate, statusLabel } from '../lib/format'
import FilterChips from '../components/ui/FilterChips'
import LeadsTable from '../components/ui/LeadsTable'
import Pagination from '../components/ui/Pagination'

const RUNNING_STATUSES = ['pending', 'running', 'starting', 'in_progress']
const COMPLETED_STATUSES = ['completed', 'success', 'done', 'finished']
const FAILED_STATUSES = ['failed', 'error']
const POLL_INTERVAL = 5000
const PAGE_SIZE = 100

export default function Dashboard() {
  const [task, setTask] = useState(null)
  const [completedTasks, setCompletedTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const pollRef = useRef(null)

  const loadCurrent = useCallback(async ({ silent } = {}) => {
    if (!silent) setLoading(true)
    try {
      const data = await fetchTasks('all')
      const tasks = data.tasks || []
      const current =
        [...tasks].sort(
          (a, b) => new Date(b.started_at || b.created_at || 0) - new Date(a.started_at || a.created_at || 0)
        )[0] || null
      setTask(current)
      const status = String(current?.status || '').toLowerCase()

      if (current && RUNNING_STATUSES.includes(status)) {
        if (!pollRef.current) {
          pollRef.current = setInterval(() => loadCurrent({ silent: true }), POLL_INTERVAL)
        }
      } else {
        clearInterval(pollRef.current)
        pollRef.current = null
      }
    } catch {
      // Error toast is shown by the API layer.
    } finally {
      if (!silent) setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCurrent()
    fetchCompletedTasks()
      .then((data) => setCompletedTasks(data.tasks || []))
      .catch(() => {})
    return () => clearInterval(pollRef.current)
  }, [loadCurrent])

  useEffect(() => {
    setPage(1)
  }, [task?.id])

  function handleDownload() {
    const matched = completedTasks.find((t) => t.task_id === task?.id)
    const url = task?.download_url || task?.result_url || matched?.url_of_file
    if (url) window.open(url, '_blank')
  }

  const status = String(task?.status || '').toLowerCase()
  const isFailed = FAILED_STATUSES.includes(status)
  const isCompleted = COMPLETED_STATUSES.includes(status)

  const allLeads = task?.verified_leads || []
  const totalPages = Math.max(1, Math.ceil(allLeads.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageLeads = allLeads.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex items-center justify-center gap-2 py-24 text-sm text-gray-500">
          <Loader2 size={16} className="animate-spin" /> Loading dashboard...
        </div>
      ) : !task ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">
          <p className="text-sm text-gray-500">
            No tasks yet. Start a scraping task to pull and verify leads.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={Users}
              color="text-blue-600"
              bg="bg-blue-50"
              label="Scraped leads"
              value={task.total_scraped_leads ?? 0}
              subtext={String(task.status || '').toUpperCase()}
            />
            <StatCard
              icon={TrendingUp}
              color="text-amber-600"
              bg="bg-amber-50"
              label="Candidates generated"
              value={task.total_candidates_generated ?? 0}
              subtext="Email permutations"
            />
            <StatCard
              icon={ShieldCheck}
              color="text-emerald-600"
              bg="bg-emerald-50"
              label="Verified emails"
              value={task.total_verified_emails ?? 0}
              subtext={successRate(task)}
              subtextIcon={CheckCircle2}
              subtextColor="text-emerald-600"
            />
            <StatCard
              icon={isFailed ? XCircle : isCompleted ? CheckCircle2 : Loader2}
              color={isFailed ? 'text-red-600' : isCompleted ? 'text-emerald-600' : 'text-blue-600'}
              bg={isFailed ? 'bg-red-50' : isCompleted ? 'bg-emerald-50' : 'bg-blue-50'}
              iconClassName={!isFailed && !isCompleted ? 'animate-spin' : ''}
              label="Status"
              value={statusLabel(task.status)}
              subtext={`Progress: ${Math.round(task.progress ?? 0)}%`}
            />
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  {task.task_name || 'Current Task'}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">Task #{task.id}</p>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleDownload}
                  disabled={!isCompleted}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-40 disabled:hover:bg-blue-700"
                >
                  <Download size={14} /> Download CSV
                </button>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Field label="Account" value={task.account_email || '—'} />
              <Field label="Started" value={formatDate(task.started_at)} />
              <Field label="Step" value={task.current_step || statusLabel(task.status)} />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Progress</p>
                <div className="mt-1.5 flex items-center gap-2.5">
                  <div className="h-1.5 flex-1 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all duration-500"
                      style={{ width: `${Math.max(0, Math.min(100, Number(task.progress) || 0))}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {Math.round(task.progress ?? 0)}%
                  </span>
                </div>
              </div>
            </div>

            {task.message && (
              <div className="mt-4 rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-600">{task.message}</div>
            )}

            {isFailed && (
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle size={15} /> This task failed. Try starting a new scraping task, or check the
                details below for more information.
              </div>
            )}

            <div className="mt-4">
              <FilterChips filters={task.filters} />
            </div>

            {task.error && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Error details</p>
                <p className="mt-1 text-sm text-red-600 font-mono wrap-break-word">{task.error}</p>
              </div>
            )}
          </div>

          {isCompleted && (
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="text-base font-bold text-gray-900">Verified Leads</h2>

              <div className="mt-4">
                {allLeads.length === 0 ? (
                  <p className="py-10 text-center text-sm text-gray-500">
                    No verified leads found for this task.
                  </p>
                ) : (
                  <LeadsTable leads={pageLeads} compact />
                )}
              </div>

              {allLeads.length > 0 && (
                <div className="mt-5 pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <p className="text-sm text-gray-500">
                    Showing{' '}
                    <span className="font-semibold text-blue-700">
                      {(currentPage - 1) * PAGE_SIZE + 1}-{Math.min(currentPage * PAGE_SIZE, allLeads.length)}
                    </span>{' '}
                    of <span className="font-semibold text-blue-700">{allLeads.length}</span> leads
                  </p>
                  {totalPages > 1 && (
                    <Pagination page={currentPage} totalPages={totalPages} onChange={setPage} />
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function StatCard({ icon: Icon, color, bg, label, value, subtext, subtextIcon: SubIcon, subtextColor, iconClassName }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${bg} ${color}`}>
          <Icon size={16} className={iconClassName} />
        </span>
      </div>
      <p className="mt-3 text-2xl font-bold text-gray-900">{value}</p>
      {subtext && (
        <p className={`mt-1 flex items-center gap-1 text-xs font-medium ${subtextColor || 'text-gray-400'}`}>
          {SubIcon && <SubIcon size={12} />} {subtext}
        </p>
      )}
    </div>
  )
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-gray-900 truncate">{value}</p>
    </div>
  )
}

function successRate(task) {
  const scraped = Number(task.total_scraped_leads) || 0
  const verified = Number(task.total_verified_emails) || 0
  if (!scraped) return null
  return `${Math.round((verified / scraped) * 100)}% Success Rate`
}
