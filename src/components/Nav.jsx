import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext.jsx'

const TABS_USER = [
  { key: 'feed', label: 'Feed' },
  { key: 'stats', label: 'Stats' }
]
const TABS_ADMIN = [
  ...TABS_USER,
  { key: 'composer', label: 'New post' },
  { key: 'dashboard', label: 'Dashboard' }
]

export default function Nav() {
  const { currentUser, logout, view, setView } = useApp()
  const isAdmin = currentUser.role === 'admin'
  const roleColor = isAdmin ? 'bg-admin' : 'bg-accent'
  const tabs = isAdmin ? TABS_ADMIN : TABS_USER

  return (
    <header className="sticky top-0 z-10 bg-ink/95 backdrop-blur">
      <div className={`h-[2px] w-full ${roleColor}`} />
      <div className="border-b border-line">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md border border-line bg-panel font-mono text-xs font-bold text-accent">
              &gt;_
            </span>
            <span className="font-display text-sm font-bold tracking-tight">Pip Desk</span>
          </div>

          <nav className="relative flex items-center gap-1">
            {tabs.map((t) => {
              const active = view === t.key
              return (
                <button
                  key={t.key}
                  onClick={() => setView(t.key)}
                  className={`relative whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition ${
                    active ? 'text-paper' : 'text-mute hover:text-paper'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-md bg-panel"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <span className="relative">{t.label}</span>
                </button>
              )
            })}
          </nav>

          <button onClick={logout} className="shrink-0 text-xs text-mute hover:text-paper">
            <span className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${roleColor}`} />
            {currentUser.name}
          </button>
        </div>
      </div>
    </header>
  )
}
