import { useApp } from './context/AppContext.jsx'
import LoginScreen from './components/LoginScreen.jsx'
import Sidebar from './components/Sidebar.jsx'
import Topbar from './components/Topbar.jsx'
import TickerBar from './components/TickerBar.jsx'
import ToastContainer from './components/ToastContainer.jsx'
import Feed from './components/Feed.jsx'
import MarketsView from './components/MarketsView.jsx'
import Composer from './components/Composer.jsx'
import AdminDashboard from './components/AdminDashboard.jsx'
import StatsPage from './components/StatsPage.jsx'

export default function App() {
  const { currentUser, view } = useApp()

  if (!currentUser) return <LoginScreen />

  return (
    <div className="flex min-h-screen bg-ink bg-noise">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col pb-16 md:pb-0">
        <Topbar />
        <TickerBar />
        <div className="flex-1">
          {view === 'feed' && <Feed />}
          {view === 'markets' && <MarketsView />}
          {view === 'composer' && currentUser.role === 'admin' && <Composer />}
          {view === 'dashboard' && currentUser.role === 'admin' && <AdminDashboard />}
          {view === 'stats' && <StatsPage />}
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}
