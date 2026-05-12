import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Sidebar from './Sidebar'
import { useState } from 'react'
import { Menu } from 'lucide-react' 

export default function AppLayout() {
  const { isAuthenticated } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false) 

  if (!isAuthenticated) return <Navigate to="/login" replace />

  return (
    <div className="flex min-h-screen bg-surface">
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-full bg-surface-100 text-white shadow-lg"
        onClick={() => setIsSidebarOpen(true)}
      >
        <Menu size={24} />
      </button>

      <div className={`fixed inset-y-0 left-0 z-40 w-60 bg-surface-50/50 backdrop-blur-sm border-r border-white/5 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:flex lg:flex-col lg:shrink-0`}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}