import { Sidebar } from './Sidebar'
import Header from './Header'
import { Outlet, useLocation } from 'react-router-dom'

export function Layout() {
  const location = useLocation()
  const isLoginPage = location.pathname === '/auth/login'

  if (isLoginPage) {
    return <div className="min-h-screen bg-background"><Outlet /></div>
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 ml-64">
        <Header /> {/* Affiché horizontalement en haut */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
