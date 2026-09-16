import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Mail } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    localStorage.setItem('clutch_auth', '1')
    if (email) localStorage.setItem('clutch_user_email', email)
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-200 bg-white p-8 space-y-4">
          <div className="flex flex-col items-center mb-2">
            <img src="/Techfy.png" alt="Techfy" className="h-12 w-12 rounded-2xl shadow-lg shadow-indigo-200" />
            <h1 className="mt-3 text-xl font-bold text-gray-900">Techfy</h1>
            <p className="text-sm text-gray-500">Sign in to manage your scraping tasks</p>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600">Email</label>
            <div className="relative mt-1.5">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full rounded-lg border border-gray-200 pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600">Password</label>
            <div className="relative mt-1.5">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-200 pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-linear-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 hover:shadow-lg hover:from-indigo-500 hover:to-violet-500 transition-all"
          >
            Log in
          </button>
        </form>
      </div>
    </div>
  )
}
