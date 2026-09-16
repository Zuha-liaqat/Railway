import { toast } from './toast'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

async function request(path, options) {
  let res
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })
  } catch {
    const message = 'Network error — please check your connection and try again.'
    toast.error(message)
    throw new Error(message)
  }

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    let message = ''
    if (body) {
      try {
        const parsed = JSON.parse(body)
        message = parsed.message || parsed.error || parsed.detail || ''
      } catch {
        message = body
      }
    }
    if (!message) message = res.statusText || `Request failed (${res.status})`
    toast.error(message)
    const err = new Error(message)
    err.status = res.status
    throw err
  }
  return res.json()
}

export function startTask({ jobTitles, industries, countries, cities, employeeCounts }) {
  const filters = {}
  if (jobTitles?.length) filters.job_titles = jobTitles
  if (industries?.length) filters.industries = industries
  if (countries?.length || cities?.length) {
    filters.locations = {}
    if (countries?.length) filters.locations.country = countries
    if (cities?.length) filters.locations.city = cities
  }
  if (employeeCounts?.length) filters.employee_counts = employeeCounts

  return request('/api/tasks/start/', {
    method: 'POST',
    body: JSON.stringify({ filters }),
  })
}

export function fetchTasks(status) {
  const query = status ? `?status=${encodeURIComponent(status)}` : ''
  return request(`/api/tasks/${query}`)
}

export function fetchCompletedTasks() {
  return request('/api/tasks/completed/')
}
