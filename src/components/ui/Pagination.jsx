import { ChevronLeft, ChevronRight } from 'lucide-react'

function getPageNumbers(page, totalPages) {
  const delta = 1
  const pages = []

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
      pages.push(i)
    }
  }

  const withDots = []
  let last = 0
  for (const i of pages) {
    if (last) {
      if (i - last === 2) withDots.push(last + 1)
      else if (i - last > 2) withDots.push('...')
    }
    withDots.push(i)
    last = i
  }
  return withDots
}

export default function Pagination({ page, totalPages, onChange }) {
  const pages = getPageNumbers(page, totalPages)

  return (
    <div className="inline-flex items-center gap-1.5">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-400"
        aria-label="Previous page"
      >
        <ChevronLeft size={15} />
      </button>

      {pages.map((p, idx) =>
        p === '...' ? (
          <span
            key={`dots-${idx}`}
            className="flex h-8 w-8 shrink-0 items-center justify-center text-sm text-gray-400"
          >
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            aria-current={p === page ? 'page' : undefined}
            className={`flex h-8 min-w-8 shrink-0 items-center justify-center rounded-md px-2.5 text-sm font-semibold transition-colors ${
              p === page
                ? 'bg-blue-700 text-white'
                : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-400"
        aria-label="Next page"
      >
        <ChevronRight size={15} />
      </button>
    </div>
  )
}
