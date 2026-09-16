const LABELS = {
  job_titles: 'Job Titles',
  industries: 'Industries',
  employee_counts: 'Employee Count',
  'locations city': 'City',
  'locations country': 'Country',
}

function labelFor(key) {
  return LABELS[key] || key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function flattenEntries(filters) {
  const entries = []
  for (const [key, value] of Object.entries(filters || {})) {
    if (isPlainObject(value)) {
      for (const [subKey, subValue] of Object.entries(value)) {
        if (Array.isArray(subValue) ? subValue.length : subValue) {
          entries.push([`${key} ${subKey}`, subValue])
        }
      }
    } else if (Array.isArray(value) ? value.length : value) {
      entries.push([key, value])
    }
  }
  return entries
}

export default function FilterChips({ filters }) {
  const entries = flattenEntries(filters)
  if (entries.length === 0) return null

  return (
    <div className="space-y-2">
      {entries.map(([key, value]) => {
        const items = Array.isArray(value) ? value : [value]
        return (
          <div key={key} className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
              {labelFor(key)}
            </span>
            {items.map((item) => (
              <span
                key={item}
                className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700"
              >
                {item}
              </span>
            ))}
          </div>
        )
      })}
    </div>
  )
}
