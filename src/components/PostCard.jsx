import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../context/AppContext.jsx'
import Badge from './Badge.jsx'
import CommentThread from './CommentThread.jsx'
import PriceLadder from './PriceLadder.jsx'

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

function Footer({ post, commentCount, reacted, count, onReact, onToggleComments }) {
  return (
    <div className="mt-3 flex items-center justify-between pb-3 text-xs text-mute">
      <span>{post.author} &middot; {timeAgo(post.createdAt)}</span>
      <div className="flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={onReact}
          className={`flex items-center gap-1 transition hover:text-paper ${reacted ? 'text-accent' : ''}`}
        >
          <motion.span
            animate={reacted ? { y: [0, -3, 0] } : {}}
            transition={{ duration: 0.3 }}
          >
            &#9650;
          </motion.span>{' '}
          {count}
        </motion.button>
        <button onClick={onToggleComments} className="hover:text-paper">
          {commentCount} comment{commentCount === 1 ? '' : 's'}
        </button>
      </div>
    </div>
  )
}

export default function PostCard({ post }) {
  const { comments, reactions, myReactions, toggleReaction } = useApp()
  const [open, setOpen] = useState(false)
  const commentCount = (comments[post.id] || []).length
  const reacted = myReactions.has(post.id)

  const commentPanel = (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden"
        >
          <CommentThread postId={post.id} />
        </motion.div>
      )}
    </AnimatePresence>
  )

  if (post.type === 'signal') {
    return (
      <motion.article
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.3 }}
        className={`rounded-xl border border-line border-l-4 ${EDGE[post.status]} bg-panel transition-shadow hover:border-line/80`}
      >
        <div className="px-4 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-display text-sm font-bold">{post.pair}</span>
              <span
                className={`flex items-center gap-1 font-mono text-xs font-semibold uppercase ${
                  post.direction === 'buy' ? 'text-long' : 'text-short'
                }`}
              >
                {post.direction === 'buy' ? '\u25B2' : '\u25BC'} {post.direction}
              </span>
              <span className="rounded border border-line px-1.5 py-0.5 text-[10px] font-mono text-mute">
                {post.timeframe}
              </span>
            </div>
            <Badge status={post.status} />
          </div>

          <PriceLadder entry={post.entry} sl={post.sl} tp={post.tp} />

          <p className="mt-3 text-sm leading-relaxed text-paper/90">{post.reasoning}</p>

          <Footer
            post={post}
            commentCount={commentCount}
            reacted={reacted}
            count={reactions[post.id] || 0}
            onReact={() => toggleReaction(post.id)}
            onToggleComments={() => setOpen((o) => !o)}
          />
        </div>
        {commentPanel}
      </motion.article>
    )
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl border border-line border-l-4 border-l-accent bg-panel"
    >
      <div className="px-4 pt-4">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-wide text-accent">Note</span>
        <h3 className="mt-2 font-display text-base font-bold">{post.title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-paper/90">{post.body}</p>

        <Footer
          post={post}
          commentCount={commentCount}
          reacted={reacted}
          count={reactions[post.id] || 0}
          onReact={() => toggleReaction(post.id)}
          onToggleComments={() => setOpen((o) => !o)}
        />
      </div>
      {commentPanel}
    </motion.article>
  )
}
