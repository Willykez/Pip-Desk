import { useApp } from './context/AppContext.jsx'
import LoginScreen from './components/LoginScreen.jsx'
import Nav from './components/Nav.jsx'
import Feed from './components/Feed.jsx'
import Composer from './components/Composer.jsx'
import AdminDashboard from './components/AdminDashboard.jsx'
import StatsPage from './components/StatsPage.jsx'

export default function App() {
  const { currentUser, view } = useApp()

  if (!currentUser) return <LoginScreen />

  return (
    <div className="min-h-screen">
      <Nav />
      {view === 'feed' && <Feed />}
      {view === 'composer' && currentUser.role === 'admin' && <Composer />}
      {view === 'dashboard' && currentUser.role === 'admin' && <AdminDashboard />}
      {view === 'stats' && <StatsPage />}
    </div>
  )
}
