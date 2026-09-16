import { ExternalLink } from 'lucide-react'

const FULL_COLUMNS = [
  { key: 'name', label: 'Name' },
  { key: 'job_title', label: 'Title' },
  { key: 'company_name', label: 'Company' },
  { key: 'company_domain', label: 'Domain' },
  { key: 'employee_count', label: 'Employees' },
  { key: 'location', label: 'Location' },
  { key: 'email', label: 'Email' },
  { key: 'linkedin_profile_url', label: 'LinkedIn' },
]

const COMPACT_KEYS = ['name', 'job_title', 'company_name', 'email', 'location']

function renderCell(lead, key) {
  switch (key) {
    case 'name':
      return [lead.first_name, lead.last_name].filter(Boolean).join(' ') || '—'
    case 'email':
      return lead.email ? (
        <a href={`mailto:${lead.email}`} className="text-blue-700 hover:underline">
          {lead.email}
        </a>
      ) : (
        '—'
      )
    case 'linkedin_profile_url':
      return lead.linkedin_profile_url ? (
        <a
          href={lead.linkedin_profile_url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-blue-700 hover:underline"
        >
          Profile <ExternalLink size={12} />
        </a>
      ) : (
        '—'
      )
    default:
      return lead[key] || '—'
  }
}

export default function LeadsTable({ leads, compact = false }) {
  const columns = compact ? FULL_COLUMNS.filter((c) => COMPACT_KEYS.includes(c.key)) : FULL_COLUMNS

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100">
      <table className="min-w-full divide-y divide-gray-100 text-sm">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 whitespace-nowrap"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {leads.map((lead, i) => (
            <tr key={i} className="hover:bg-gray-50">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-gray-700 whitespace-nowrap">
                  {renderCell(lead, col.key)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
