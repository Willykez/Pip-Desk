import { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext.jsx'

export default function StatsPage() {
  const { posts } = useApp()
  const [pairFilter, setPairFilter] = useState('all')

  const signals = posts.filter((p) => p.type === 'signal')
  const pairs = ['all', ...new Set(signals.map((s) => s.pair))]

  const filtered = pairFilter === 'all' ? signals : signals.filter((s) => s.pair === pairFilter)
  const decided = filtered.filter((s) => s.status === 'tp_hit' || s.status === 'sl_hit')
  const wins = decided.filter((s) => s.status === 'tp_hit').length
  const losses = decided.filter((s) => s.status === 'sl_hit').length
  const winRate = decided.length ? Math.round((wins / decided.length) * 100) : 0
  const openCount = filtered.filter((s) => s.status === 'open').length

  const stat = 'rounded-lg border border-line bg-panel px-4 py-4'

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-mute">Track record</h2>
        <select
          value={pairFilter}
          onChange={(e) => setPairFilter(e.target.value)}
          className="rounded-md border border-line bg-panel px-2.5 py-1.5 text-xs"
        >
          {pairs.map((p) => (
            <option key={p} value={p}>
              {p === 'all' ? 'All pairs' : p}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className={stat}>
          <div className="text-xs text-mute">Win rate</div>
          <div className="mt-1 font-mono text-3xl font-bold text-long tabular">{winRate}%</div>
          <div className="mt-1 text-xs text-mute">{decided.length} decided signal{decided.length === 1 ? '' : 's'}</div>
        </div>
        <div className={stat}>
          <div className="text-xs text-mute">Wins / losses</div>
          <div className="mt-1 font-mono text-3xl font-bold tabular">
            <span className="text-long">{wins}</span>
            <span className="text-mute"> / </span>
            <span className="text-short">{losses}</span>
          </div>
          <div className="mt-1 text-xs text-mute">{openCount} still open</div>
        </div>
        <div className={`${stat} col-span-2`}>
          <div className="text-xs text-mute">Total signals posted</div>
          <div className="mt-1 font-mono text-3xl font-bold tabular">{filtered.length}</div>
        </div>
      </div>

      <p className="mt-6 text-xs leading-relaxed text-mute">
        Calculated from marked outcomes on posted signals. Educational content only &mdash;
        not financial advice, and past results don&rsquo;t guarantee future ones.
      </p>
    </div>
  )
}
