import { useState } from 'react'
import { useApp, TICKER_PAIRS, fmtPrice } from '../context/AppContext.jsx'
import CandlestickChart from './CandlestickChart.jsx'

const TIMEFRAMES = ['1M', '5M', '15M', '1H', '4H']

export default function MarketsView() {
  const { livePrices, posts, selectedSymbol, setSelectedSymbol } = useApp()
  const [timeframe, setTimeframe] = useState('1H')

  const openSignal = [...posts].find(
    (p) => p.type === 'signal' && p.pair === selectedSymbol && p.status === 'open'
  )
  const anySignal = [...posts].find((p) => p.type === 'signal' && p.pair === selectedSymbol)
  const signal = openSignal || anySignal

  const lp = livePrices[selectedSymbol]
  const price = lp?.price ?? 1
  const dayOpen = lp?.dayOpen ?? price
  const changePct = (price / dayOpen - 1) * 100

  let rr = null
  if (signal) {
    const e = parseFloat(signal.entry)
    const t = parseFloat(signal.tp)
    const s = parseFloat(signal.sl)
    const risk = Math.abs(e - s)
    const reward = Math.abs(t - e)
    rr = risk ? (reward / risk).toFixed(1) : '\u2014'
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <select
          value={selectedSymbol}
          onChange={(e) => setSelectedSymbol(e.target.value)}
          className="rounded-md border border-line bg-panel px-3 py-2 font-mono text-sm font-semibold"
        >
          {TICKER_PAIRS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <div className="flex gap-1 rounded-md border border-line bg-panel p-1">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`rounded px-2.5 py-1 text-xs font-semibold transition ${
                timeframe === tf ? 'bg-ink text-paper' : 'text-mute'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-line bg-panel p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold tabular">{fmtPrice(selectedSymbol, price)}</span>
            <span className={`font-mono text-sm font-semibold ${changePct >= 0 ? 'text-long' : 'text-short'}`}>
              {changePct >= 0 ? '\u25B2' : '\u25BC'} {Math.abs(changePct).toFixed(2)}%
            </span>
          </div>
          <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-long">
            <span className="h-1.5 w-1.5 rounded-full bg-long pulse" /> Live
          </span>
        </div>

        <CandlestickChart pair={selectedSymbol} timeframe={timeframe} price={price} signal={signal} />
      </div>

      {signal ? (
        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="rounded-lg border border-line bg-panel px-3 py-3 text-center">
            <div className="text-[10px] uppercase text-mute">Risk/Reward</div>
            <div className="mt-1 font-mono text-lg font-bold">1:{rr}</div>
          </div>
          <div className="rounded-lg border border-line bg-panel px-3 py-3 text-center">
            <div className="text-[10px] uppercase text-mute">Direction</div>
            <div className={`mt-1 font-mono text-lg font-bold uppercase ${signal.direction === 'buy' ? 'text-long' : 'text-short'}`}>
              {signal.direction}
            </div>
          </div>
          <div className="rounded-lg border border-line bg-panel px-3 py-3 text-center">
            <div className="text-[10px] uppercase text-mute">Status</div>
            <div className="mt-1 font-mono text-lg font-bold capitalize">{signal.status.replace('_', ' ')}</div>
          </div>
        </div>
      ) : (
        <p className="mt-3 text-center text-xs text-mute">
          No signal posted for {selectedSymbol} yet — chart reflects live simulated price only.
        </p>
      )}
    </div>
  )
}
