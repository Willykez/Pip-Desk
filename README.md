# Pip Desk

A weekend-scope signals + education app: admin posts trade setups and notes,
traders follow the feed, comment, react, and see an auto-computed win-rate
track record.

Runs entirely on **in-memory mock data** out of the box — no backend, no
signup, no API keys. Everything resets on refresh. That's intentional: get
the whole flow working and feeling right first, then wire up persistence.

## Run it

```bash
npm install
npm run dev
```

Open the printed localhost URL. Log in as either demo role from the landing
screen — no real auth yet, it's just a role switch for trying both sides.

## What's here

```
src/
  context/AppContext.jsx   all app state: posts, comments, reactions, role
  lib/mockData.js          seed data — edit this to change the demo content
  lib/supabaseClient.js    placeholder + notes for wiring a real backend
  components/
    LoginScreen.jsx        role picker (swap for real auth later)
    Nav.jsx                top bar + view switching
    Feed.jsx                the main feed
    PostCard.jsx           signal card + education card
    Composer.jsx           admin: post a signal or a note
    AdminDashboard.jsx     admin: mark open signals as TP/SL/closed
    StatsPage.jsx          win rate, wins/losses, filter by pair
    CommentThread.jsx      comments, admin-only delete
    Badge.jsx              status pill (open / TP hit / SL hit / closed)
```

## Wiring a real backend

Recommended: **Supabase** (Postgres + Auth + Realtime + Storage, generous
free tier) with the frontend deployed on **Vercel**.

1. `npm install @supabase/supabase-js`, fill in `src/lib/supabaseClient.js`
   with your project URL + anon key (use a `.env` file, see below).
2. Create these tables:

   ```sql
   users     (id, name, role)                 -- role: 'admin' | 'user'
   posts     (id, author_id, type,             -- type: 'signal' | 'education'
              pair, direction, entry, sl, tp, timeframe, reasoning,
              title, body, media_url,
              status,                          -- 'open' | 'tp_hit' | 'sl_hit' | 'closed'
              created_at)
   comments  (id, post_id, user_id, text, created_at)
   reactions (id, post_id, user_id, created_at)
   ```

3. Use Supabase Auth for login. **Don't trust a role sent from the client**
   — read the caller's role from the `users` table server-side, and enforce
   it with Row Level Security policies (e.g. only rows where
   `users.role = 'admin'` can insert into `posts` or update `status`;
   comment delete restricted to the comment's own author or an admin).
4. Swap the functions in `AppContext.jsx` (`addPost`, `updatePostStatus`,
   `addComment`, `deleteComment`, `toggleReaction`) for real Supabase
   queries. Turn on Supabase Realtime on `comments` and `reactions` if you
   want live updates without a page refresh.
5. For chart screenshots or video, use Supabase Storage for images and an
   external embed (YouTube/Vimeo link, or Cloudflare Stream/Mux) for video
   rather than self-hosting large files.

`.env` (create this file, don't commit it):

```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Deploying

- Frontend: `npm run build`, deploy the `dist/` folder to Vercel, Netlify,
  or Cloudflare Pages (all have workable free tiers for this).
- Backend: Supabase free tier covers this comfortably for a solo project —
  500MB DB, 50k monthly active users, built-in auth and realtime. Free
  projects pause after 7 days with zero API requests; a scheduled GitHub
  Action pinging the project weekly avoids that if you go quiet.

## Notes

- Signal outcomes are marked manually by the admin (Dashboard →
  "Mark TP hit" / "Mark SL hit"). Auto price-checking against a live feed
  is a natural v2 — poll a forex price API on a schedule (e.g. a Supabase
  Edge Function on a cron trigger) and auto-close signals when price
  crosses SL/TP.
- The stats page filters to *decided* signals only (TP or SL hit) for win
  rate — open signals don't count toward it yet, which is the honest way
  to represent an in-progress track record.
