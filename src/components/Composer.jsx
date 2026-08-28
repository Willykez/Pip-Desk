import { useState } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext.jsx'

const field =
  'w-full rounded-md border border-line bg-ink px-3 py-2 text-sm placeholder:text-mute focus:border-accent'
const label = 'mb-1.5 block text-xs font-medium text-mute'

export default function Composer() {
  const { addPost, setView, posts } = useApp()
  const [type, setType] = useState('signal')
  const ticketNo = String(posts.length + 1).padStart(4, '0')

  const [pair, setPair] = useState('EUR/USD')
  const [direction, setDirection] = useState('buy')
  const [entry, setEntry] = useState('')
  const [sl, setSl] = useState('')
  const [tp, setTp] = useState('')
  const [timeframe, setTimeframe] = useState('1H')
  const [reasoning, setReasoning] = useState('')

  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  function submit(e) {
    e.preventDefault()
    if (type === 'signal') {
      if (!entry || !sl || !tp) return
      addPost({ type, pair, direction, entry, sl, tp, timeframe, reasoning, status: 'open' })
    } else {
      if (!title.trim() || !body.trim()) return
      addPost({ type, title, body, status: null })
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="mb-4 flex rounded-lg border border-line bg-panel p-1">
        <button
          onClick={() => setType('signal')}
          className={`flex-1 rounded-md py-2 text-sm font-medium transition ${type === 'signal' ? 'bg-ink text-paper' : 'text-mute'}`}
        >
          Signal
        </button>
        <button
          onClick={() => setType('education')}
          className={`flex-1 rounded-md py-2 text-sm font-medium transition ${type === 'education' ? 'bg-ink text-paper' : 'text-mute'}`}
        >
          Note
        </button>
      </div>

      <motion.form
        layout
        onSubmit={submit}
        className="relative overflow-hidden rounded-xl border border-line bg-panel"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, transparent, transparent 6px, #1C242F 6px, #1C242F 9px)',
          backgroundSize: '100% 2px',
          backgroundPosition: 'top 52px left 0',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <span className="font-mono text-[11px] uppercase tracking-wider text-admin">
            {type === 'signal' ? 'Order ticket' : 'Field note'}
          </span>
          <span className="font-mono text-[11px] text-mute">#{ticketNo}</span>
        </div>

        <div className="space-y-4 p-4 pt-6">
          {type === 'signal' ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={label}>Pair</label>
                  <input className={`${field} font-mono`} value={pair} onChange={(e) => setPair(e.target.value)} placeholder="EUR/USD" />
                </div>
                <div>
                  <label className={label}>Direction</label>
                  <div className="flex rounded-md border border-line bg-ink p-1">
                    <button
                      type="button"
                      onClick={() => setDirection('buy')}
                      className={`flex-1 rounded py-1.5 text-sm font-semibold transition ${direction === 'buy' ? 'bg-long/15 text-long' : 'text-mute'}`}
                    >
                      Buy
                    </button>
                    <button
                      type="button"
                      onClick={() => setDirection('sell')}
                      className={`flex-1 rounded py-1.5 text-sm font-semibold transition ${direction === 'sell' ? 'bg-short/15 text-short' : 'text-mute'}`}
                    >
                      Sell
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={label}>Entry</label>
                  <input className={`${field} font-mono`} value={entry} onChange={(e) => setEntry(e.target.value)} placeholder="1.0850" />
                </div>
                <div>
                  <label className={label}>Stop loss</label>
                  <input className={`${field} font-mono`} value={sl} onChange={(e) => setSl(e.target.value)} placeholder="1.0800" />
                </div>
                <div>
                  <label className={label}>Take profit</label>
                  <input className={`${field} font-mono`} value={tp} onChange={(e) => setTp(e.target.value)} placeholder="1.0950" />
                </div>
              </div>

              <div>
                <label className={label}>Timeframe</label>
                <input className={`${field} font-mono`} value={timeframe} onChange={(e) => setTimeframe(e.target.value)} placeholder="4H" />
              </div>

              <div>
                <label className={label}>Reasoning</label>
                <textarea
                  className={`${field} min-h-[100px] resize-y`}
                  value={reasoning}
                  onChange={(e) => setReasoning(e.target.value)}
                  placeholder="Why this setup, what invalidates it..."
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className={label}>Title</label>
                <input className={field} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Reading order blocks without overcomplicating it" />
              </div>
              <div>
                <label className={label}>Body</label>
                <textarea
                  className={`${field} min-h-[160px] resize-y`}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Write the note. Photos/video embeds can be added as a media_url field once a backend is connected."
                />
              </div>
            </>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setView('feed')}
              className="rounded-md px-4 py-2 text-sm font-medium text-mute hover:text-paper"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-admin px-4 py-2 text-sm font-semibold text-white transition hover:bg-admin/90"
            >
              {type === 'signal' ? 'Post signal' : 'Publish note'}
            </button>
          </div>
        </div>
      </motion.form>
    </div>
  )
}
