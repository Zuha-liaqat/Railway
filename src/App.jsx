import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import NewTask from './pages/NewTask'
import Organic from './pages/Organic'
import Settings from './pages/Settings'
import Toaster from './components/ui/Toaster'
import { getToken } from './lib/api'

function RequireAuth({ children }) {
  const isAuthed = Boolean(getToken())
  return isAuthed ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<RequireAuth><Layout /></RequireAuth>}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/tasks/new" element={<NewTask />} />
          <Route path="/organic" element={<Organic />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </>
  )
}
