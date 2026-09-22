import { toast } from './toast'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
const TOKEN_KEY = 'clutch_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || ''
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

function extractErrorMessage(body) {
  if (!body) return ''
  let parsed
  try {
    parsed = JSON.parse(body)
  } catch {
    return body
  }
  if (typeof parsed === 'string') return parsed
  if (parsed.message) return parsed.message
  if (parsed.error) return parsed.error
  if (parsed.detail) return parsed.detail
  // DRF-style field validation errors, e.g. { email: ["This field is required."] }
  const parts = []
  for (const [field, value] of Object.entries(parsed)) {
    const text = Array.isArray(value) ? value.join(', ') : value
    if (text) parts.push(`${field}: ${text}`)
  }
  return parts.join(' | ')
}

async function request(path, options = {}) {
  const token = getToken()
  const { headers: extraHeaders, ...rest } = options
  const isFormData = rest.body instanceof FormData
  let res
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      ...rest,
      headers: {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...(token ? { Authorization: `Token ${token}` } : {}),
        ...extraHeaders,
      },
    })
  } catch {
    const message = 'Network error — please check your connection and try again.'
    toast.error(message)
    throw new Error(message)
  }

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    const message = extractErrorMessage(body) || res.statusText || `Request failed (${res.status})`
    toast.error(message)
    const err = new Error(message)
    err.status = res.status
    throw err
  }
  return res.json()
}

export function startTask({
  taskName,
  jobTitles,
  industries,
  countries,
  cities,
  employeeCounts,
  verification = true,
}) {
  const filters = {}
  if (jobTitles?.length) filters.job_titles = jobTitles
  if (industries?.length) filters.industries = industries
  if (countries?.length || cities?.length) {
    filters.locations = {}
    if (countries?.length) filters.locations.country = countries
    if (cities?.length) filters.locations.city = cities
  }
  if (employeeCounts?.length) filters.employee_counts = employeeCounts

  const payload = { verification: Boolean(verification) }
  if (taskName?.trim()) payload.task_name = taskName.trim()
  payload.filters = filters

  return request('/api/tasks/start/', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function fetchTasks(status) {
  const query = status ? `?status=${encodeURIComponent(status)}` : ''
  return request(`/api/tasks/${query}`)
}

export function fetchCompletedTasks() {
  return request('/api/tasks/completed/')
}

export function login({ email, password }) {
  return request('/api/auth/login/', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export function fetchMe() {
  return request('/api/auth/me/')
}

export function deleteTask(taskId) {
  return request(`/api/tasks/${taskId}/`, {
    method: 'DELETE',
  })
}

export function fetchCsvTasks() {
  return request('/api/tasks/csv-tasks/')
}

export function processCsv({ file, taskName }) {
  const formData = new FormData()
  formData.append('file', file)
  if (taskName?.trim()) formData.append('task_name', taskName.trim())

  return request('/api/tasks/process-csv/', {
    method: 'POST',
    body: formData,
  })
}
