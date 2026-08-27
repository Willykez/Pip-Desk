import { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'

export default function CommentThread({ postId }) {
  const { currentUser, comments, addComment, deleteComment } = useApp()
  const [text, setText] = useState('')
  const list = comments[postId] || []

  function submit(e) {
    e.preventDefault()
    if (!text.trim()) return
    addComment(postId, text.trim())
    setText('')
  }

  return (
    <div className="border-t border-line px-4 py-3">
      {list.length > 0 && (
        <ul className="mb-3 space-y-2.5">
          {list.map((c) => (
            <li key={c.id} className="group flex items-start justify-between gap-2 text-sm">
              <div>
                <span className="font-semibold text-paper">{c.author}</span>{' '}
                <span className="text-mute">{c.text}</span>
              </div>
              {currentUser.role === 'admin' && (
                <button
                  onClick={() => deleteComment(postId, c.id)}
                  aria-label="Delete comment"
                  className="shrink-0 text-mute opacity-0 transition hover:text-short group-hover:opacity-100"
                >
                  delete
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={submit} className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment"
          className="flex-1 rounded-md border border-line bg-ink px-3 py-1.5 text-sm placeholder:text-mute focus:border-accent"
        />
        <button
          type="submit"
          className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-white transition hover:bg-accent/90"
        >
          Post
        </button>
      </form>
    </div>
  )
}
