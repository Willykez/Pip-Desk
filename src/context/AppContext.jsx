import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { demoUsers, initialPosts, initialComments, initialReactions } from '../lib/mockData.js'

const AppContext = createContext(null)

let nextId = 100
let toastId = 0
let notifId = 0

export const TICKER_PAIRS = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'XAU/USD', 'USD/CAD', 'AUD/USD']

const BASE_PRICES = {
  'EUR/USD': 1.0847,
  'GBP/USD': 1.2734,
  'USD/JPY': 151.42,
  'XAU/USD': 2347.8,
  'USD/CAD': 1.3632,
  'AUD/USD': 0.6641
}

function seedLivePrices() {
  const out = {}
  TICKER_PAIRS.forEach((pair) => {
    out[pair] = { price: BASE_PRICES[pair] ?? 1, dayOpen: BASE_PRICES[pair] ?? 1 }
  })
  return out
}

export function decimalsFor(pair) {
  if (pair.includes('JPY')) return 3
  if (pair.startsWith('XAU')) return 2
  return 5
}

export function fmtPrice(pair, value) {
  const decimals = decimalsFor(pair)
  return value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [view, setView] = useState('feed')
  const [posts, setPosts] = useState(initialPosts)
  const [comments, setComments] = useState(initialComments)
  const [reactions, setReactions] = useState(initialReactions)
  const [myReactions, setMyReactions] = useState(new Set())
  const [toasts, setToasts] = useState([])
  const [notifications, setNotifications] = useState([
    { id: notifId++, icon: '\ud83d\udcc8', text: 'Welcome to Pip Desk \u2014 prices and signal outcomes update live.', time: 'just now', read: false }
  ])
  const [livePrices, setLivePrices] = useState(seedLivePrices())
  const [selectedSymbol, setSelectedSymbol] = useState('EUR/USD')

  const postsRef = useRef(posts)
  useEffect(() => {
    postsRef.current = posts
  }, [posts])

  function addToast(message, type = 'success') {
    const id = toastId++
    setToasts((t) => [...t, { id, message, type }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200)
  }

  function addNotification(icon, text) {
    setNotifications((n) => [{ id: notifId++, icon, text, time: 'just now', read: false }, ...n].slice(0, 15))
  }

  function markRead(id) {
    setNotifications((n) => n.map((x) => (x.id === id ? { ...x, read: true } : x)))
  }

  function markAllRead() {
    setNotifications((n) => n.map((x) => ({ ...x, read: true })))
  }

  function login(role) {
    setCurrentUser(demoUsers[role])
    setView('feed')
  }

  function logout() {
    setCurrentUser(null)
  }

  function addPost(post) {
    const id = `p${nextId++}`
    const full = { ...post, id, author: currentUser.name, createdAt: new Date().toISOString() }
    setPosts((prev) => [full, ...prev])
    setView('feed')
    if (post.type === 'signal') {
      addToast(`${post.pair} ${post.direction.toUpperCase()} signal posted`, 'success')
      addNotification('\ud83d\udce1', `New signal: ${post.pair} ${post.direction.toUpperCase()} @ ${post.entry}`)
    } else {
      addToast('Note published', 'success')
      addNotification('\ud83d\udcd8', `New note: ${post.title}`)
    }
  }

  function updatePostStatus(postId, status) {
    const target = postsRef.current.find((p) => p.id === postId)
    setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, status } : p)))
    if (target) {
      const label = status === 'tp_hit' ? 'TP hit' : status === 'sl_hit' ? 'SL hit' : 'closed'
      const type = status === 'tp_hit' ? 'success' : status === 'sl_hit' ? 'error' : 'info'
      addToast(`${target.pair} marked ${label}`, type)
    }
  }

  function addComment(postId, text) {
    const id = `c${nextId++}`
    setComments((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), { id, author: currentUser.name, text, createdAt: new Date().toISOString() }]
    }))
  }

  function deleteComment(postId, commentId) {
    setComments((prev) => ({
      ...prev,
      [postId]: (prev[postId] || []).filter((c) => c.id !== commentId)
    }))
  }

  function toggleReaction(postId) {
    setMyReactions((prev) => {
      const next = new Set(prev)
      const reacted = next.has(postId)
      setReactions((r) => ({ ...r, [postId]: (r[postId] || 0) + (reacted ? -1 : 1) }))
      if (reacted) next.delete(postId)
      else next.add(postId)
      return next
    })
  }

  // live price engine — ticks every pair, small random walk
  useEffect(() => {
    const t = setInterval(() => {
      setLivePrices((prev) => {
        const next = {}
        TICKER_PAIRS.forEach((pair) => {
          const cur = prev[pair]
          const vol = pair.startsWith('XAU') ? 0.0009 : 0.0005
          const r = (Math.random() + Math.random() + Math.random() - 1.5) * vol
          next[pair] = { ...cur, price: Math.max(0.00001, cur.price * (1 + r)) }
        })
        return next
      })
    }, 1400)
    return () => clearInterval(t)
  }, [])

  // auto-close open signals when live price crosses TP/SL
  useEffect(() => {
    postsRef.current.forEach((p) => {
      if (p.type !== 'signal' || p.status !== 'open') return
      const lp = livePrices[p.pair]
      if (!lp) return
      const entry = parseFloat(p.entry)
      const tp = parseFloat(p.tp)
      const sl = parseFloat(p.sl)
      if ([entry, tp, sl].some((n) => Number.isNaN(n))) return

      let hit = null
      if (p.direction === 'buy') {
        if (lp.price >= tp) hit = 'tp_hit'
        else if (lp.price <= sl) hit = 'sl_hit'
      } else {
        if (lp.price <= tp) hit = 'tp_hit'
        else if (lp.price >= sl) hit = 'sl_hit'
      }
      if (hit) {
        updatePostStatus(p.id, hit)
        addNotification(
          hit === 'tp_hit' ? '\ud83c\udfaf' : '\u26a0\ufe0f',
          `${p.pair} signal closed live: ${hit === 'tp_hit' ? 'TP hit' : 'SL hit'}`
        )
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [livePrices])

  const value = useMemo(
    () => ({
      currentUser,
      login,
      logout,
      view,
      setView,
      posts,
      addPost,
      updatePostStatus,
      comments,
      addComment,
      deleteComment,
      reactions,
      myReactions,
      toggleReaction,
      toasts,
      notifications,
      markRead,
      markAllRead,
      livePrices,
      selectedSymbol,
      setSelectedSymbol
    }),
    [currentUser, view, posts, comments, reactions, myReactions, toasts, notifications, livePrices, selectedSymbol]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
