import { useState } from 'react'
import { FileUp, UploadCloud } from 'lucide-react'

export default function CsvUploadModal({ open, onClose, onSubmit, loading }) {
  const [file, setFile] = useState(null)
  const [taskName, setTaskName] = useState('')

  if (!open) return null

  function handleClose() {
    if (loading) return
    setFile(null)
    setTaskName('')
    onClose()
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!file || loading) return
    await onSubmit({ file, taskName })
    setFile(null)
    setTaskName('')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={handleClose}>
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <UploadCloud size={20} />
        </div>
        <h2 className="mt-4 text-center text-base font-bold text-gray-900">Upload CSV</h2>
        <p className="mt-1.5 text-center text-sm text-gray-500">
          Upload a leads CSV to clean, verify, and generate email permutations.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Task name
            </label>
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Optional"
              className="mt-1.5 w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-300"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              CSV file
            </label>
            <label className="mt-1.5 flex cursor-pointer items-center gap-2.5 rounded-lg border border-dashed border-gray-300 px-3.5 py-3 text-sm text-gray-600 hover:border-blue-300 hover:bg-blue-50/40">
              <FileUp size={16} className="shrink-0 text-gray-400" />
              <span className="flex-1 truncate">{file ? file.name : 'Choose a .csv file'}</span>
              <input
                type="file"
                accept=".csv,text/csv"
                required
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!file || loading}
              className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
            >
              {loading ? 'Uploading...' : 'Upload & Process'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
