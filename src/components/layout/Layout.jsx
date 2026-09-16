import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

export default function Layout() {
  const [search, setSearch] = useState('')

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="md:pl-64 flex flex-col min-h-screen">
        <Header
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search sessions by title, industry, or location..."
        />
        <main className="flex-1 px-4 md:px-8 py-6">
          <Outlet context={{ search }} />
        </main>
      </div>
    </div>
  )
}
