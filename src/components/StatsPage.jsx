import { useState } from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts'
import { useApp } from '../context/AppContext.jsx'

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const p = payload[0].payload
  return (
    <div className="rounded-md border border-line bg-panel px-3 py-2 text-xs shadow-lg">
      <div className="font-mono font-semibold text-paper">
        Net {p.value > 0 ? '+' : ''}
        {p.value}
      </div>
      {p.pair && <div className="mt-0.5 text-mute">{p.pair}</div>}
    </div>
  )
}

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

  const chronological = [...decided].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  let cum = 0
  const curve = [{ index: 0, value: 0 }, ...chronological.map((s, i) => {
    cum += s.status === 'tp_hit' ? 1 : -1
    return { index: i + 1, value: cum, pair: s.pair }
  })]
  const trendPositive = curve[curve.length - 1]?.value >= 0

  const stat = 'rounded-xl border border-line bg-panel px-4 py-4'

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

      {curve.length > 1 && (
        <div className={`${stat} mb-3`}>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs text-mute">Equity curve (wins &minus; losses)</span>
            <span className={`font-mono text-sm font-semibold ${trendPositive ? 'text-long' : 'text-short'}`}>
              {curve[curve.length - 1].value > 0 ? '+' : ''}
              {curve[curve.length - 1].value}
            </span>
          </div>
          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={curve} margin={{ top: 8, right: 4, bottom: 0, left: 4 }}>
                <defs>
                  <linearGradient id="curveFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={trendPositive ? '#17D897' : '#FF5470'} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={trendPositive ? '#17D897' : '#FF5470'} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#1C242F" strokeDasharray="3 4" />
                <XAxis dataKey="index" hide />
                <YAxis hide domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={trendPositive ? '#17D897' : '#FF5470'}
                  strokeWidth={2}
                  fill="url(#curveFill)"
                  isAnimationActive={true}
                  animationDuration={600}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

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
