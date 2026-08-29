# Pip Desk

A trading-desk app: admin posts trade setups and notes, traders follow the
feed, comment, react, and watch prices and outcomes update live. Styled
like a real trading platform — sidebar + topbar shell, a live market
ticker, a canvas candlestick chart with TP/SL/entry overlays, toast
notifications, a notification bell, global search, and role-accented UI
(violet chrome in admin mode, blue in trader mode).

Runs entirely on **in-memory mock data and a simulated price feed** — no
backend, no signup, no API keys. Prices tick on a client-side random walk
(not real market data), and open signals **auto-close** the moment the
simulated price crosses their TP or SL, firing a toast + notification —
same as a real signal service would, just without a live data provider
wired in yet. Everything resets on refresh; that's intentional until a
backend is connected (see below).

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
  context/AppContext.jsx   all app state: posts, comments, reactions, role,
                           toasts, notifications, live prices, and the
                           auto TP/SL-close engine
  lib/mockData.js          seed data — edit this to change the demo content
  lib/chart.js             synthetic candle generation for the chart
  lib/supabaseClient.js    placeholder + notes for wiring a real backend
  components/
    LoginScreen.jsx        hero role picker, staggered entrance motion
    Sidebar.jsx            desktop nav rail / mobile bottom bar
    Topbar.jsx              search, notifications dropdown, user menu
    TickerBar.jsx           live price tiles, click through to Markets
    MarketsView.jsx         symbol + timeframe picker, chart, signal summary
    CandlestickChart.jsx    canvas candlestick chart w/ TP/SL/entry lines
                           and hover OHLC readout
    ToastContainer.jsx      toast stack (bottom-right / above mobile nav)
    Feed.jsx                the main feed
    PostCard.jsx            signal card (with PriceLadder) + education card
    PriceLadder.jsx         proportional SL/Entry/TP ruler + R:R ratio
    Composer.jsx            admin: post a signal or a note, ticket-styled
    AdminDashboard.jsx      admin: mark open signals as TP/SL/closed
    StatsPage.jsx           win rate, equity curve chart, filter by pair
    CommentThread.jsx       comments, admin-only delete
    Badge.jsx               status pill (open / TP hit / SL hit / closed)
```

## How the live engine works

`AppContext.jsx` seeds a `livePrices` map for six pairs and ticks every
price on a `setInterval` (small random walk, no real data source). A
second effect watches that map: any post that's an **open signal** gets
checked against its `tp`/`sl` on every tick, and the moment price crosses
either, the signal auto-closes — updating its badge, firing a toast, and
adding a bell notification. This is the same mechanic a real signals
platform would run, just swap the random walk for a real price feed (see
below) and it works unchanged.

## Wiring a real backend + real prices

Recommended: **Supabase** (Postgres + Auth + Realtime + Storage, generous
free tier) with the frontend deployed on **Vercel**, plus a real forex
price API for the live engine.

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
   queries. Turn on Supabase Realtime on `comments`/`reactions` for live
   updates without a page refresh.
5. Replace the `setInterval` random walk in the live-price effect with a
   real feed — a WebSocket from a forex data provider, or a polled REST
   endpoint on a short interval. The TP/SL auto-close effect doesn't need
   to change; it just reacts to whatever `livePrices` contains.
6. For chart screenshots or video, use Supabase Storage for images and an
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

- The stats page filters to *decided* signals only (TP or SL hit) for win
  rate — open signals don't count toward it yet, which is the honest way
  to represent an in-progress track record.
- The candlestick chart is synthetic (a random walk seeded from the live
  price), not real historical data — it's there to make the TP/SL/entry
  visualization feel like a real terminal. Swap in a real OHLC data source
  once you're past the prototype stage.
- Not included yet, on purpose (kept out to stay in scope for a first
  build, easy to add later): polls, a Q&A hub, and a general media
  library. If you want any of those, ask and they can be added following
  the same patterns already in the codebase.
