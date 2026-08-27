import { useApp } from '../context/AppContext.jsx'
import PostCard from './PostCard.jsx'

export default function Feed() {
  const { posts } = useApp()

  if (posts.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center text-mute">
        No posts yet. Once setups or notes go up, they&rsquo;ll show here.
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-3 px-4 py-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
