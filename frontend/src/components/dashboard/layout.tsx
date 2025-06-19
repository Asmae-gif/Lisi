import { Sidebar } from './Sidebar'
import Header from './Header'
import { useLocation, Outlet } from 'react-router-dom'
import '../../dashboard.css'

export function Layout() {
  const location = useLocation()
  const isLoginPage = location.pathname === '/auth/login'

  if (isLoginPage) {
    return <div className="min-h-screen bg-background"><Outlet /></div>
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header />
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
