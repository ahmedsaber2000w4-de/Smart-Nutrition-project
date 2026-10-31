import { Outlet } from 'react-router-dom'
import TopNavbar from '../components/TopNavbar'

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <TopNavbar />
      <main className="pt-20 px-4 max-w-md mx-auto">
        <Outlet />
      </main>
    </div>
  )
}