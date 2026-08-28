const STYLES = {
  open: 'text-pending border-pending/40 bg-pending/10 shadow-glow',
  tp_hit: 'text-long border-long/40 bg-long/10',
  sl_hit: 'text-short border-short/40 bg-short/10',
  closed: 'text-mute border-line bg-panel'
}

const LABELS = {
  open: 'OPEN',
  tp_hit: 'TP HIT',
  sl_hit: 'SL HIT',
  closed: 'CLOSED'
}

export default function Badge({ status, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-mono font-semibold tracking-wide ${STYLES[status] || ''} ${className}`}
    >
      {status === 'open' && <span className="h-1.5 w-1.5 rounded-full bg-pending pulse" />}
      {LABELS[status] || status}
    </span>
  )
}
