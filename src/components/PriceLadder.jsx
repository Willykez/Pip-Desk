function seg(a, b) {
  return { left: Math.min(a, b), width: Math.abs(a - b) }
}

export default function PriceLadder({ entry, sl, tp }) {
  const e = parseFloat(entry)
  const s = parseFloat(sl)
  const t = parseFloat(tp)
  const valid = [e, s, t].every((n) => Number.isFinite(n))

  if (!valid) return null

  const min = Math.min(e, s, t)
  const max = Math.max(e, s, t)
  const range = max - min || 1
  const pct = (v) => ((v - min) / range) * 100

  const slPct = pct(s)
  const ePct = pct(e)
  const tpPct = pct(t)

  const riskPips = Math.abs(e - s)
  const rewardPips = Math.abs(t - e)
  const rr = riskPips > 0 ? (rewardPips / riskPips).toFixed(1) : '—'

  const riskSeg = seg(slPct, ePct)
  const rewardSeg = seg(ePct, tpPct)

  return (
    <div className="mt-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-wider text-mute">Risk / reward</span>
        <span className="font-mono text-[11px] font-semibold text-paper">
          1 <span className="text-mute">:</span> {rr}
        </span>
      </div>

      <div className="relative h-6">
        {/* base track */}
        <div className="absolute top-1/2 h-[3px] w-full -translate-y-1/2 rounded-full bg-line" />
        {/* risk zone */}
        <div
          className="absolute top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-short/50"
          style={{ left: `${riskSeg.left}%`, width: `${riskSeg.width}%` }}
        />
        {/* reward zone */}
        <div
          className="absolute top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-long/50"
          style={{ left: `${rewardSeg.left}%`, width: `${rewardSeg.width}%` }}
        />

        {/* SL tick */}
        <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: `${slPct}%` }}>
          <div className="h-2.5 w-2.5 rounded-full border-2 border-ink bg-short" />
        </div>
        {/* TP tick */}
        <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: `${tpPct}%` }}>
          <div className="h-2.5 w-2.5 rounded-full border-2 border-ink bg-long" />
        </div>
        {/* Entry tick — diamond, on top */}
        <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: `${ePct}%` }}>
          <div className="h-3 w-3 rotate-45 border-2 border-ink bg-paper" />
        </div>
      </div>

      <div className="relative mt-1 h-8 text-[10px] font-mono">
        <div className="absolute -translate-x-1/2 text-center" style={{ left: `${slPct}%` }}>
          <div className="text-short font-semibold">SL</div>
          <div className="tabular text-mute">{sl}</div>
        </div>
        <div className="absolute -translate-x-1/2 text-center" style={{ left: `${ePct}%` }}>
          <div className="text-paper font-semibold">Entry</div>
          <div className="tabular text-mute">{entry}</div>
        </div>
        <div className="absolute -translate-x-1/2 text-center" style={{ left: `${tpPct}%` }}>
          <div className="text-long font-semibold">TP</div>
          <div className="tabular text-mute">{tp}</div>
        </div>
      </div>
    </div>
  )
}
