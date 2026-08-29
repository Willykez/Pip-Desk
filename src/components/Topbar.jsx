import { useEffect, useRef, useState } from 'react'
import { Search, Bell, ChevronDown, LogOut } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'

export default function Topbar() {
  const { currentUser, logout, posts, setView, notifications, markRead, markAllRead } = useApp()
  const [openMenu, setOpenMenu] = useState(null) // 'search' | 'notif' | 'user' | null
  const [query, setQuery] = useState('')
  const wrapRef = useRef(null)

  useEffect(() => {
    function onClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpenMenu(null)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const results =
    query.trim().length < 2
      ? []
      : posts
          .filter((p) => {
            const hay = p.type === 'signal' ? `${p.pair} ${p.reasoning}` : `${p.title} ${p.body}`
            return hay.toLowerCase().includes(query.toLowerCase())
          })
          .slice(0, 6)

  const unread = notifications.filter((n) => !n.read).length

  return (
    <header className="sticky top-0 z-10 border-b border-line bg-ink/95 backdrop-blur">
      <div ref={wrapRef} className="mx-auto flex max-w-2xl items-center gap-2 px-4 py-3">
        <div className="relative flex-1">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mute" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setOpenMenu('search')
            }}
            onFocus={() => setOpenMenu('search')}
            placeholder="Search signals, notes..."
            className="w-full rounded-md border border-line bg-panel py-2 pl-8 pr-3 text-sm placeholder:text-mute focus:border-accent"
          />
          {openMenu === 'search' && results.length > 0 && (
            <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-md border border-line bg-panel shadow-lg">
              {results.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    setView('feed')
                    setQuery('')
                    setOpenMenu(null)
                  }}
                  className="block w-full border-b border-line px-3 py-2 text-left text-xs last:border-b-0 hover:bg-ink"
                >
                  <div className="font-semibold text-paper">{r.type === 'signal' ? r.pair : r.title}</div>
                  <div className="mt-0.5 truncate text-mute">{r.type === 'signal' ? r.reasoning : r.body}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative shrink-0">
          <button
            onClick={() => setOpenMenu(openMenu === 'notif' ? null : 'notif')}
            className="relative flex h-9 w-9 items-center justify-center rounded-md border border-line bg-panel text-mute transition hover:text-paper"
          >
            <Bell size={16} />
            {unread > 0 && <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-short" />}
          </button>
          {openMenu === 'notif' && (
            <div className="absolute right-0 top-full z-20 mt-1 w-72 overflow-hidden rounded-md border border-line bg-panel shadow-lg">
              <div className="flex items-center justify-between border-b border-line px-3 py-2">
                <span className="text-xs font-semibold">Notifications</span>
                <button onClick={markAllRead} className="text-[11px] font-medium text-accent">
                  Mark all read
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 && (
                  <div className="px-3 py-6 text-center text-xs text-mute">No notifications</div>
                )}
                {notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    className="flex w-full items-start gap-2 border-b border-line px-3 py-2.5 text-left last:border-b-0 hover:bg-ink"
                  >
                    <span className="text-sm">{n.icon}</span>
                    <div className="flex-1">
                      <div className="text-xs text-paper/90">{n.text}</div>
                      <div className="mt-0.5 text-[10px] text-mute">{n.time}</div>
                    </div>
                    {!n.read && <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative shrink-0">
          <button
            onClick={() => setOpenMenu(openMenu === 'user' ? null : 'user')}
            className="flex items-center gap-1.5 rounded-md border border-line bg-panel px-2.5 py-2 text-xs font-medium text-mute transition hover:text-paper"
          >
            <span className={`h-1.5 w-1.5 rounded-full ${currentUser.role === 'admin' ? 'bg-admin' : 'bg-accent'}`} />
            <span className="hidden sm:inline">{currentUser.name}</span>
            <ChevronDown size={13} />
          </button>
          {openMenu === 'user' && (
            <div className="absolute right-0 top-full z-20 mt-1 w-44 overflow-hidden rounded-md border border-line bg-panel shadow-lg">
              <button
                onClick={logout}
                className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs font-medium text-mute hover:bg-ink hover:text-paper"
              >
                <LogOut size={13} /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
