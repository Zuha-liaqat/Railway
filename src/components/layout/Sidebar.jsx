import { NavLink, useNavigate } from 'react-router-dom'
import { Briefcase, LayoutGrid, LogOut } from 'lucide-react'
import { clearToken } from '../../lib/api'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { to: '/tasks', label: 'Tasks', icon: Briefcase },
]

export default function Sidebar() {
  const navigate = useNavigate()

  function handleLogout() {
    clearToken()
    localStorage.removeItem('clutch_user_email')
    navigate('/login')
  }

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r border-gray-200 bg-white">
      <div className="flex items-center gap-2 h-16 px-6 border-b border-gray-100">
        <img src="/Techfy.png" alt="Techfy" className="h-8 w-8 rounded-lg" />
        <span className="text-xl font-bold tracking-tight text-gray-900">
          Techfy
        </span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              [
                'relative flex items-center gap-3 rounded-l-full rounded-r-lg pl-4 pr-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900',
              ].join(' ')
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} />
                {label}
                {isActive && (
                  <span className="absolute right-0 top-0 h-full w-1 rounded-l-full bg-blue-600" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pb-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  )
}
