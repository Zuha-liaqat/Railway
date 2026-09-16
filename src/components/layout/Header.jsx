import { Link } from 'react-router-dom'
import { Bell, Search, Settings } from 'lucide-react'

export default function Header({ search, onSearchChange, searchPlaceholder }) {
  const email = localStorage.getItem('clutch_user_email') || ''
  const initial = email ? email[0].toUpperCase() : '?'

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-4 md:px-8">
      <div className="relative flex-1 max-w-2xl">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search ?? ''}
          onChange={(e) => onSearchChange?.(e.target.value)}
          placeholder={searchPlaceholder || 'Search...'}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-3 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-300"
        />
      </div>

      <div className="flex items-center gap-3 shrink-0 ml-auto">
        <button className="relative flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        <Link
          to="/settings"
          className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
        >
          <Settings size={18} />
        </Link>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500 text-sm font-semibold text-white">
          {initial}
        </div>
      </div>
    </header>
  )
}
