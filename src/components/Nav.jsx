import { useApp } from '../context/AppContext.jsx'

const linkBase =
  'px-3 py-1.5 rounded-md text-sm font-medium transition whitespace-nowrap'

export default function Nav() {
  const { currentUser, logout, view, setView } = useApp()
  const isAdmin = currentUser.role === 'admin'

  return (
    <header className="sticky top-0 z-10 border-b border-line bg-ink/95 backdrop-blur">
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md border border-line bg-panel font-mono text-xs font-bold text-accent">
            &gt;_
          </span>
          <span className="font-mono text-sm font-bold tracking-tight">Pip Desk</span>
        </div>

        <nav className="flex items-center gap-1">
          <button
            onClick={() => setView('feed')}
            className={`${linkBase} ${view === 'feed' ? 'bg-panel text-paper' : 'text-mute hover:text-paper'}`}
          >
            Feed
          </button>
          <button
            onClick={() => setView('stats')}
            className={`${linkBase} ${view === 'stats' ? 'bg-panel text-paper' : 'text-mute hover:text-paper'}`}
          >
            Stats
          </button>
          {isAdmin && (
            <>
              <button
                onClick={() => setView('composer')}
                className={`${linkBase} ${view === 'composer' ? 'bg-panel text-paper' : 'text-mute hover:text-paper'}`}
              >
                New post
              </button>
              <button
                onClick={() => setView('dashboard')}
                className={`${linkBase} ${view === 'dashboard' ? 'bg-panel text-paper' : 'text-mute hover:text-paper'}`}
              >
                Dashboard
              </button>
            </>
          )}
        </nav>

        <button onClick={logout} className="text-xs text-mute hover:text-paper">
          {currentUser.name} &middot; Log out
        </button>
      </div>
    </header>
  )
}
