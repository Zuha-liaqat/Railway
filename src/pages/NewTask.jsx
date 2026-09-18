import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, ArrowLeft, Eye, EyeOff, Filter, KeyRound, MapPin } from 'lucide-react'
import { startTask, fetchTasks } from '../lib/api'
import MultiSelect from '../components/ui/MultiSelect'
import TagInput from '../components/ui/TagInput'

const EMPLOYEE_COUNT_OPTIONS = [
  '0 - 25', '25 - 100', '100 - 250', '250 - 1000', '1K - 10K', '10K - 50K', '50K - 100K', '> 100K',
]

export default function NewTask() {
  const navigate = useNavigate()
  const [taskName, setTaskName] = useState('')
  const [jobTitles, setJobTitles] = useState([])
  const [industries, setIndustries] = useState([])
  const [countries, setCountries] = useState([])
  const [cities, setCities] = useState([])
  const [employeeCounts, setEmployeeCounts] = useState([])
  const [showCredentials, setShowCredentials] = useState(false)
  const [accountEmail, setAccountEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchTasks()
      .then((data) => setAccountEmail(data.tasks?.[0]?.account_email || ''))
      .catch(() => {})
  }, [])

  const hasAnyFilter = [jobTitles, industries, countries, cities, employeeCounts].some(
    (l) => l.length > 0
  )

  async function handleSubmit(e) {
    e.preventDefault()
    if (!hasAnyFilter || submitting) return
    setSubmitting(true)
    try {
      await startTask({ taskName, jobTitles, industries, countries, cities, employeeCounts })
      navigate('/tasks')
    } catch {
      // Error toast is shown by the API layer.
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-blue-700 hover:text-blue-800"
      >
        <ArrowLeft size={14} /> Back
      </button>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create Scraping Task</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Define your target parameters to start a B2B lead scraping and email verification task.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <KeyRound size={16} className="text-blue-600" />
              <span className="text-sm font-bold text-gray-900">Adapt.io Credentials</span>
            </div>
            <button
              type="button"
              onClick={() => setShowCredentials((v) => !v)}
              className="inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:text-blue-800"
            >
              {showCredentials ? <EyeOff size={14} /> : <Eye size={14} />}
              {showCredentials ? 'Hide' : 'Show'}
            </button>
          </div>
          {showCredentials && (
            <p className="mt-3 text-sm text-gray-500">
              {accountEmail ? (
                <>
                  Tasks run under{' '}
                  <span className="font-semibold text-gray-700">{accountEmail}</span>, configured via
                  server environment variables.
                </>
              ) : (
                'Credentials are managed via server environment variables (ADAPT_EMAIL, ADAPT_PASSWORD) and are not exposed to the frontend.'
              )}
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 space-y-5">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Task name
            </label>
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="e.g. Tech Executives US & UK"
              className="mt-1.5 w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-300"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
            <div className="sm:col-span-2 flex items-center gap-1.5">
              <Filter size={13} className="text-gray-400" />
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Search Filters
              </span>
            </div>

            <TagInput
              label="Job title"
              value={jobTitles}
              onChange={setJobTitles}
              placeholder="e.g. CEO, Founder, Director"
            />
            <TagInput
              label="Industry"
              value={industries}
              onChange={setIndustries}
              placeholder="e.g. Real Estate, E-Commerce"
            />

            <div className="sm:col-span-2">
              <MultiSelect
                label="Employee count"
                options={EMPLOYEE_COUNT_OPTIONS}
                value={employeeCounts}
                onChange={setEmployeeCounts}
                placeholder="Select employee count ranges..."
              />
            </div>

            <div className="sm:col-span-2 mt-1 flex items-center gap-1.5">
              <MapPin size={13} className="text-gray-400" />
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Location
              </span>
            </div>

            <TagInput
              label="Country"
              value={countries}
              onChange={setCountries}
              placeholder="e.g. USA, India"
            />
            <TagInput
              label="City"
              value={cities}
              onChange={setCities}
              placeholder="e.g. Dubai, Riyadh"
            />
          </div>
        </div>

        <div className="flex items-center gap-2.5 rounded-lg bg-blue-50 px-4 py-3.5 text-sm text-blue-800">
          <AlertCircle size={16} className="shrink-0" />
          Starting a new task will scrape Adapt.io leads, generate email permutations, and verify them
          with MailTester.
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!hasAnyFilter || submitting}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
          >
            {submitting ? 'Starting...' : 'Start Scraping'}
          </button>
        </div>
      </form>
    </div>
  )
}
