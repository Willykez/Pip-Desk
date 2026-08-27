import { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import Badge from './Badge.jsx'
import CommentThread from './CommentThread.jsx'

const EDGE = {
  open: 'border-l-pending',
  tp_hit: 'border-l-long',
  sl_hit: 'border-l-short',
  closed: 'border-l-line'
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const hrs = Math.floor(diff / 3600000)
  if (hrs < 1) return 'just now'
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function PostCard({ post }) {
  const { comments, reactions, myReactions, toggleReaction } = useApp()
  const [open, setOpen] = useState(false)
  const commentCount = (comments[post.id] || []).length
  const reacted = myReactions.has(post.id)

  if (post.type === 'signal') {
    return (
      <article className={`rounded-lg border border-line border-l-4 ${EDGE[post.status]} bg-panel`}>
        <div className="px-4 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold">{post.pair}</span>
              <span className={`font-mono text-xs font-semibold uppercase ${post.direction === 'buy' ? 'text-long' : 'text-short'}`}>
                {post.direction}
              </span>
              <span className="text-xs text-mute">{post.timeframe}</span>
            </div>
            <Badge status={post.status} />
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2 font-mono text-xs">
            <div className="rounded-md bg-ink px-2.5 py-2">
              <div className="text-mute">Entry</div>
              <div className="tabular mt-0.5 font-semibold">{post.entry}</div>
            </div>
            <div className="rounded-md bg-ink px-2.5 py-2">
              <div className="text-mute">Stop</div>
              <div className="tabular mt-0.5 font-semibold text-short">{post.sl}</div>
            </div>
            <div className="rounded-md bg-ink px-2.5 py-2">
              <div className="text-mute">Target</div>
              <div className="tabular mt-0.5 font-semibold text-long">{post.tp}</div>
            </div>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-paper/90">{post.reasoning}</p>

          <div className="mt-3 flex items-center justify-between pb-3 text-xs text-mute">
            <span>{post.author} &middot; {timeAgo(post.createdAt)}</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleReaction(post.id)}
                className={`flex items-center gap-1 transition hover:text-paper ${reacted ? 'text-accent' : ''}`}
              >
                &#9650; {reactions[post.id] || 0}
              </button>
              <button onClick={() => setOpen((o) => !o)} className="hover:text-paper">
                {commentCount} comment{commentCount === 1 ? '' : 's'}
              </button>
            </div>
          </div>
        </div>
        {open && <CommentThread postId={post.id} />}
      </article>
    )
  }

  // education post
  return (
    <article className="rounded-lg border border-line border-l-4 border-l-accent bg-panel">
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-wide text-accent">Note</span>
        </div>
        <h3 className="mt-2 text-base font-bold">{post.title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-paper/90">{post.body}</p>

        <div className="mt-3 flex items-center justify-between pb-3 text-xs text-mute">
          <span>{post.author} &middot; {timeAgo(post.createdAt)}</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleReaction(post.id)}
              className={`flex items-center gap-1 transition hover:text-paper ${reacted ? 'text-accent' : ''}`}
            >
              &#9650; {reactions[post.id] || 0}
            </button>
            <button onClick={() => setOpen((o) => !o)} className="hover:text-paper">
              {commentCount} comment{commentCount === 1 ? '' : 's'}
            </button>
          </div>
        </div>
      </div>
      {open && <CommentThread postId={post.id} />}
    </article>
  )
}
