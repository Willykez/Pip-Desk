// This app currently runs entirely on in-memory mock data (see mockData.js
// and AppContext.jsx) so it works with zero setup. When you're ready to
// persist real data, wire up Supabase here and swap the mock calls in
// AppContext.jsx for real queries. Rough shape:
//
//   npm install @supabase/supabase-js
//
//   import { createClient } from '@supabase/supabase-js'
//   export const supabase = createClient(
//     import.meta.env.VITE_SUPABASE_URL,
//     import.meta.env.VITE_SUPABASE_ANON_KEY
//   )
//
// Suggested tables (see README.md for full schema notes):
//   users      (id, name, role)
//   posts      (id, author_id, type, pair, direction, entry, sl, tp,
//               timeframe, reasoning, title, body, media_url, status, created_at)
//   comments   (id, post_id, user_id, text, created_at)
//   reactions  (id, post_id, user_id, created_at)
//
// Auth: use Supabase Auth for login, then read the caller's role out of the
// `users` table (never trust a role sent from the client for admin actions —
// enforce it with Row Level Security policies on posts/comments too).

export const supabase = null
