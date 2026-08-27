import React, { createContext, useContext, useMemo, useState } from 'react'
import { demoUsers, initialPosts, initialComments, initialReactions } from '../lib/mockData.js'

const AppContext = createContext(null)

let nextId = 100

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [view, setView] = useState('feed') // feed | composer | dashboard | stats
  const [posts, setPosts] = useState(initialPosts)
  const [comments, setComments] = useState(initialComments)
  const [reactions, setReactions] = useState(initialReactions)
  const [myReactions, setMyReactions] = useState(new Set())

  function login(role) {
    setCurrentUser(demoUsers[role])
    setView('feed')
  }

  function logout() {
    setCurrentUser(null)
  }

  function addPost(post) {
    const id = `p${nextId++}`
    setPosts((prev) => [
      { ...post, id, author: currentUser.name, createdAt: new Date().toISOString() },
      ...prev
    ])
    setView('feed')
  }

  function updatePostStatus(postId, status) {
    setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, status } : p)))
  }

  function addComment(postId, text) {
    const id = `c${nextId++}`
    setComments((prev) => ({
      ...prev,
      [postId]: [
        ...(prev[postId] || []),
        { id, author: currentUser.name, text, createdAt: new Date().toISOString() }
      ]
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
      toggleReaction
    }),
    [currentUser, view, posts, comments, reactions, myReactions]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
