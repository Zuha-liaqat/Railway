import { useCallback, useEffect, useState } from 'react'
import { Loader2, UploadCloud } from 'lucide-react'
import { fetchCsvTasks, processCsv } from '../lib/api'
import { toast } from '../lib/toast'
import CsvTaskCard from '../components/ui/CsvTaskCard'
import CsvUploadModal from '../components/ui/CsvUploadModal'

export default function Organic() {
  const [csvTasks, setCsvTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [uploading, setUploading] = useState(false)

  const loadCsvTasks = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchCsvTasks()
      setCsvTasks(data.tasks || [])
    } catch {
      // Error toast is shown by the API layer.
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCsvTasks()
  }, [loadCsvTasks])

  async function handleUpload({ file, taskName }) {
    setUploading(true)
    try {
      await processCsv({ file, taskName })
      toast.success('CSV uploaded successfully.')
      setModalOpen(false)
      loadCsvTasks()
    } catch {
      // Error toast is shown by the API layer.
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 whitespace-nowrap"
        >
          <UploadCloud size={16} /> Upload CSV
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-24 text-sm text-gray-500">
          <Loader2 size={16} className="animate-spin" /> Loading CSV tasks...
        </div>
      ) : csvTasks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">
          <p className="text-sm text-gray-500">No CSV tasks yet. Upload one to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {csvTasks.map((task) => (
            <CsvTaskCard key={task.task_id} task={task} />
          ))}
        </div>
      )}

      <CsvUploadModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleUpload}
        loading={uploading}
      />
    </div>
  )
}
