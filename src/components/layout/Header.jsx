import { Link, useLocation } from 'react-router-dom'
import { Bell, Settings } from 'lucide-react'

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/tasks': 'Tasks',
  '/tasks/new': 'New Task',
  '/organic': 'Organic Me',
  '/settings': 'Settings',
}

export default function Header() {
  const location = useLocation()
  const email = localStorage.getItem('clutch_user_email') || ''
  const initial = email ? email[0].toUpperCase() : '?'
  const title = PAGE_TITLES[location.pathname] || 'Techfy'

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-4 md:px-8">
      <div className="flex-1 min-w-0">
        <h1 className="text-lg font-bold leading-tight text-gray-900 truncate">{title}</h1>
        {email && <p className="text-xs leading-tight text-gray-500 truncate">Logged in as {email}</p>}
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
