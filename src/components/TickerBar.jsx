import { useApp, TICKER_PAIRS, fmtPrice } from '../context/AppContext.jsx'

export default function TickerBar() {
  const { livePrices, setSelectedSymbol, setView } = useApp()

  return (
    <div className="border-b border-line bg-surface">
      <div className="mx-auto flex max-w-2xl gap-2 overflow-x-auto px-4 py-3">
        {TICKER_PAIRS.map((pair) => {
          const lp = livePrices[pair]
          if (!lp) return null
          const changePct = (lp.price / lp.dayOpen - 1) * 100
          const up = changePct >= 0
          return (
            <button
              key={pair}
              onClick={() => {
                setSelectedSymbol(pair)
                setView('markets')
              }}
              className="shrink-0 rounded-lg border border-line bg-panel px-3 py-2 text-left transition hover:border-accent/40"
            >
              <div className="font-mono text-[10px] font-semibold text-mute">{pair}</div>
              <div className="font-mono text-sm font-bold tabular">{fmtPrice(pair, lp.price)}</div>
              <div className={`font-mono text-[10px] font-semibold ${up ? 'text-long' : 'text-short'}`}>
                {up ? '\u25B2' : '\u25BC'} {Math.abs(changePct).toFixed(2)}%
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
