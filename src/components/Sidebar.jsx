import { Rss, LineChart, BarChart3, PenSquare, ShieldCheck } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'

const USER_ITEMS = [
  { key: 'feed', label: 'Feed', Icon: Rss },
  { key: 'markets', label: 'Markets', Icon: LineChart },
  { key: 'stats', label: 'Stats', Icon: BarChart3 }
]
const ADMIN_EXTRA = [
  { key: 'composer', label: 'New post', Icon: PenSquare },
  { key: 'dashboard', label: 'Manage', Icon: ShieldCheck }
]

export default function Sidebar() {
  const { currentUser, view, setView } = useApp()
  const isAdmin = currentUser.role === 'admin'
  const items = isAdmin ? [...USER_ITEMS, ...ADMIN_EXTRA] : USER_ITEMS
  const roleText = isAdmin ? 'text-admin' : 'text-accent'
  const roleBorder = isAdmin ? 'border-l-admin' : 'border-l-accent'
  const roleDot = isAdmin ? 'bg-admin' : 'bg-accent'

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-56 md:shrink-0 md:flex-col md:border-r md:border-line md:bg-surface">
        <div className="flex items-center gap-2.5 border-b border-line px-5 py-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-panel font-mono text-sm font-bold text-accent">
            &gt;_
          </span>
          <div>
            <div className="font-display text-sm font-bold leading-tight">Pip Desk</div>
            <div className={`font-mono text-[10px] uppercase tracking-wider ${roleText}`}>
              {isAdmin ? 'Admin' : 'Trader'}
            </div>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {items.map(({ key, label, Icon }) => {
            const active = view === key
            return (
              <button
                key={key}
                onClick={() => setView(key)}
                className={`flex w-full items-center gap-3 rounded-lg border-l-2 px-3 py-2.5 text-sm font-medium transition ${
                  active ? `${roleBorder} bg-panel ${roleText}` : 'border-l-transparent text-mute hover:bg-panel/60 hover:text-paper'
                }`}
              >
                <Icon size={17} strokeWidth={2} />
                {label}
              </button>
            )
          })}
        </nav>
      </aside>

      {/* Mobile bottom bar */}
      <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-line bg-ink/95 backdrop-blur md:hidden">
        {items.map(({ key, label, Icon }) => {
          const active = view === key
          return (
            <button
              key={key}
              onClick={() => setView(key)}
              className={`flex flex-1 flex-col items-center gap-1 border-t-2 py-2 text-[10px] font-medium ${
                active ? `${roleBorder} ${roleText}` : 'border-t-transparent text-mute'
              }`}
            >
              <Icon size={18} strokeWidth={2} />
              {label}
              {active && <span className={`h-1 w-1 rounded-full ${roleDot}`} />}
            </button>
          )
        })}
      </nav>
    </>
  )
}
