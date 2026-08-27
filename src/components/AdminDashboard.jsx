import { useApp } from '../context/AppContext.jsx'
import Badge from './Badge.jsx'

export default function AdminDashboard() {
  const { posts, updatePostStatus } = useApp()
  const signals = posts.filter((p) => p.type === 'signal')
  const open = signals.filter((p) => p.status === 'open')
  const past = signals.filter((p) => p.status !== 'open')

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-6">
      <section>
        <h2 className="mb-3 text-sm font-semibold text-mute">Open signals ({open.length})</h2>
        {open.length === 0 ? (
          <p className="text-sm text-mute">Nothing open right now.</p>
        ) : (
          <div className="space-y-2">
            {open.map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-lg border border-line bg-panel px-4 py-3">
                <div>
                  <div className="flex items-center gap-2 font-mono text-sm font-semibold">
                    {s.pair}
                    <span className={s.direction === 'buy' ? 'text-long' : 'text-short'}>{s.direction}</span>
                  </div>
                  <div className="mt-0.5 font-mono text-xs text-mute tabular">
                    Entry {s.entry} &middot; SL {s.sl} &middot; TP {s.tp}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => updatePostStatus(s.id, 'tp_hit')}
                    className="rounded-md border border-long/40 bg-long/10 px-2.5 py-1.5 text-xs font-semibold text-long hover:bg-long/20"
                  >
                    Mark TP hit
                  </button>
                  <button
                    onClick={() => updatePostStatus(s.id, 'sl_hit')}
                    className="rounded-md border border-short/40 bg-short/10 px-2.5 py-1.5 text-xs font-semibold text-short hover:bg-short/20"
                  >
                    Mark SL hit
                  </button>
                  <button
                    onClick={() => updatePostStatus(s.id, 'closed')}
                    className="rounded-md border border-line px-2.5 py-1.5 text-xs font-semibold text-mute hover:text-paper"
                  >
                    Close
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-mute">History ({past.length})</h2>
        {past.length === 0 ? (
          <p className="text-sm text-mute">No closed signals yet.</p>
        ) : (
          <div className="space-y-2">
            {past.map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-lg border border-line bg-panel px-4 py-2.5">
                <div className="flex items-center gap-2 font-mono text-sm">
                  {s.pair}
                  <span className={s.direction === 'buy' ? 'text-long' : 'text-short'}>{s.direction}</span>
                </div>
                <Badge status={s.status} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
