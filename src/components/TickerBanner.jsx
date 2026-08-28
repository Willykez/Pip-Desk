import { useApp } from '../context/AppContext.jsx'

const DOT = {
  open: 'bg-pending',
  tp_hit: 'bg-long',
  sl_hit: 'bg-short',
  closed: 'bg-mute'
}

const LABEL = {
  open: 'OPEN',
  tp_hit: 'TP HIT',
  sl_hit: 'SL HIT',
  closed: 'CLOSED'
}

export default function TickerBanner() {
  const { posts } = useApp()
  const signals = posts.filter((p) => p.type === 'signal')

  if (signals.length === 0) return null

  const items = signals.map((s) => (
    <span key={s.id} className="flex items-center gap-2 px-4 font-mono text-xs whitespace-nowrap">
      <span className={`h-1.5 w-1.5 rounded-full ${DOT[s.status]}`} />
      <span className="font-semibold text-paper">{s.pair}</span>
      <span className={s.direction === 'buy' ? 'text-long' : 'text-short'}>
        {s.direction === 'buy' ? '\u25B2' : '\u25BC'}
      </span>
      <span className="text-mute">{LABEL[s.status]}</span>
    </span>
  ))

  return (
    <div className="overflow-hidden border-b border-line bg-surface">
      <div className="flex animate-ticker">
        <div className="flex shrink-0">{items}</div>
        <div className="flex shrink-0" aria-hidden="true">
          {items}
        </div>
      </div>
    </div>
  )
}
