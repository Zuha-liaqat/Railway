import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, Plus } from 'lucide-react'
import { fetchTasks, fetchCompletedTasks, deleteTask, retryTask } from '../lib/api'
import { toast } from '../lib/toast'
import TaskCard from '../components/ui/TaskCard'
import CompletedTasksTable from '../components/ui/CompletedTasksTable'
import Pagination from '../components/ui/Pagination'
import ConfirmModal from '../components/ui/ConfirmModal'

const COMPLETED_PAGE_SIZE = 6

export default function Tasks() {
  const navigate = useNavigate()
  const [runningTasks, setRunningTasks] = useState([])
  const [completedTasks, setCompletedTasks] = useState([])
  const [completedPage, setCompletedPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)
  const [pendingDeleteId, setPendingDeleteId] = useState(null)
  const [retryingId, setRetryingId] = useState(null)

  const loadRunning = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    try {
      const data = await fetchTasks()
      setRunningTasks(data.tasks || [])
    } catch {
      // Error toast is shown by the API layer.
    } finally {
      if (!silent) setLoading(false)
    }
  }, [])

  const loadCompleted = useCallback(async () => {
    try {
      const data = await fetchCompletedTasks()
      setCompletedTasks(data.tasks || [])
    } catch {
      // Completed tasks are secondary; ignore errors here so the running view still works.
    }
  }, [])

  useEffect(() => {
    loadRunning()
    loadCompleted()
  }, [loadRunning, loadCompleted])

  const isActive = runningTasks.length > 0

  useEffect(() => {
    if (!isActive) return
    const id = setInterval(() => loadRunning(true), 3000)
    return () => clearInterval(id)
  }, [isActive, loadRunning])

  const prevActiveRef = useRef(isActive)
  useEffect(() => {
    if (prevActiveRef.current && !isActive) loadCompleted()
    prevActiveRef.current = isActive
  }, [isActive, loadCompleted])

  async function confirmDelete() {
    const taskId = pendingDeleteId
    if (!taskId) return
    setDeletingId(taskId)
    try {
      await deleteTask(taskId)
      toast.success('Task deleted.')
      setRunningTasks((prev) => prev.filter((t) => t.id !== taskId))
      setCompletedTasks((prev) => prev.filter((t) => t.task_id !== taskId))
      setPendingDeleteId(null)
    } catch {
      // Error toast is shown by the API layer.
    } finally {
      setDeletingId(null)
    }
  }

  async function handleRetry(taskId) {
    setRetryingId(taskId)
    try {
      await retryTask(taskId)
      toast.success('Task retry started.')
      loadRunning(true)
    } catch {
      // Error toast is shown by the API layer.
    } finally {
      setRetryingId(null)
    }
  }

  const completedTotalPages = Math.max(1, Math.ceil(completedTasks.length / COMPLETED_PAGE_SIZE))
  const currentCompletedPage = Math.min(completedPage, completedTotalPages)
  const pagedCompletedTasks = completedTasks.slice(
    (currentCompletedPage - 1) * COMPLETED_PAGE_SIZE,
    currentCompletedPage * COMPLETED_PAGE_SIZE
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => navigate('/tasks/new')}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 whitespace-nowrap"
        >
          <Plus size={16} /> New Task
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-24 text-sm text-gray-500">
          <Loader2 size={16} className="animate-spin" /> Loading tasks...
        </div>
      ) : (
        <>
          {runningTasks.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-gray-900">
                Running Tasks <span className="text-gray-400 font-normal">({runningTasks.length})</span>
              </h2>
              <div
                className={`grid grid-cols-1 lg:grid-cols-2 gap-4 ${
                  runningTasks.length > 4 ? 'max-h-[720px] overflow-y-auto pr-1' : ''
                }`}
              >
                {runningTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onRetry={handleRetry}
                    retrying={retryingId === task.id}
                  />
                ))}
              </div>
            </div>
          )}

          {completedTasks.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-gray-900">Completed Tasks</h2>
              <CompletedTasksTable
                tasks={pagedCompletedTasks}
                onDelete={setPendingDeleteId}
                deletingId={deletingId}
              />
              {completedTotalPages > 1 && (
                <div className="flex justify-center pt-1">
                  <Pagination
                    page={currentCompletedPage}
                    totalPages={completedTotalPages}
                    onChange={setCompletedPage}
                  />
                </div>
              )}
            </div>
          )}

          {runningTasks.length === 0 && completedTasks.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">
              <p className="text-sm text-gray-500">No scraping tasks yet. Create one to get started.</p>
            </div>
          )}
        </>
      )}

      <ConfirmModal
        open={pendingDeleteId !== null}
        title="Delete this task?"
        message="This will permanently delete the task and its data. This action cannot be undone."
        loading={deletingId === pendingDeleteId}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDeleteId(null)}
      />
    </div>
  )
}
