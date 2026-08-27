# Pip Desk — Android Build Spec (Kotlin + Jetpack Compose)

Paste this entire document into a new AI coding session as the first message.
It contains everything needed to build a native Android port of the "Pip
Desk" forex signals + education app, with no prior context required.

---

## 1. What this app is

A trading signals + education app with two roles:

- **Admin** (the trader) posts trade setups ("signals": pair, direction,
  entry/SL/TP, reasoning) and educational notes (text, and later
  photo/video). Admin marks each open signal's outcome (TP hit / SL hit /
  closed) as it plays out.
- **User** (a follower) views the feed, comments, reacts, and sees an
  auto-computed win-rate track record built from the admin's marked
  outcomes.

There's a working web version (React/Vite) already built as the reference
implementation — this spec describes porting the same product to native
Android. Match its feature set and interaction model; the visual design
below is the same design language, adapted to Material 3.

No backend yet. Build entirely on an in-memory repository first (see
Section 5), matching the web version's approach, so the whole app works
standalone with zero setup. Section 9 covers wiring a real backend later.

---

## 2. Tech stack

- **Kotlin**, single-activity architecture
- **Jetpack Compose** (Material 3) for all UI — no XML layouts
- **Navigation Compose** for screen routing
- **ViewModel + StateFlow** for state management (MVVM)
- **Kotlin coroutines** for async work
- Minimum SDK 26, target/compile SDK latest stable
- No Room/Retrofit yet — a plain in-memory repository class (swappable
  later, see Section 9)

Gradle dependencies to include (versions: use whatever the latest stable
release is at build time):

```kotlin
dependencies {
    implementation("androidx.core:core-ktx")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose")
    implementation("androidx.activity:activity-compose")
    implementation(platform("androidx.compose:compose-bom:2024.09.00"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.navigation:navigation-compose")
    implementation("androidx.compose.material:material-icons-extended")
}
```

---

## 3. Design language

Dark, trading-terminal aesthetic. Translate these as a Compose `ColorScheme`
and custom typography — don't fall back to Material defaults.

**Colors**

| Token     | Hex       | Use                                  |
|-----------|-----------|---------------------------------------|
| `ink`     | `#0B0F14` | screen background                     |
| `panel`   | `#111823` | card/surface background               |
| `line`    | `#1E2733` | borders, dividers                     |
| `paper`   | `#E9EDF1` | primary text                          |
| `mute`    | `#6E7A8A` | secondary text                        |
| `long`    | `#00D48A` | buy direction, TP hit / win           |
| `short`   | `#FF5C6C` | sell direction, SL hit / loss         |
| `pending` | `#F0A93B` | open / pending status                 |
| `accent`  | `#4C8DFF` | links, primary actions, active nav    |

**Typography**

- Data/numeric text (prices, entry/SL/TP, stats figures): a **monospace**
  font (JetBrains Mono if available as a bundled font resource, otherwise
  the system monospace family). Use tabular figures.
- UI text / body / headings: a clean geometric sans (Manrope if available,
  otherwise the default Material sans).

**Signature visual detail**: open signals show a small pulsing amber dot
next to the "OPEN" status badge (looping alpha animation, respect reduced-
motion device settings). Status badges are pill-shaped, colored per status
(amber/green/red/gray), monospace uppercase text.

**Card style**: rounded corners (12dp), 1dp border in `line`, and signal/
education post cards have a 4dp colored left edge indicating status (amber
= open, green = TP hit, red = SL hit, gray = closed, blue = education
note).

---

## 4. Data models

```kotlin
enum class Role { ADMIN, USER }

data class User(
    val id: String,
    val name: String,
    val role: Role
)

enum class SignalStatus { OPEN, TP_HIT, SL_HIT, CLOSED }
enum class Direction { BUY, SELL }

sealed class Post {
    abstract val id: String
    abstract val author: String
    abstract val createdAt: Long // epoch millis

    data class Signal(
        override val id: String,
        override val author: String,
        override val createdAt: Long,
        val pair: String,
        val direction: Direction,
        val entry: String,
        val stopLoss: String,
        val takeProfit: String,
        val timeframe: String,
        val reasoning: String,
        val status: SignalStatus
    ) : Post()

    data class Education(
        override val id: String,
        override val author: String,
        override val createdAt: Long,
        val title: String,
        val body: String,
        val mediaUrl: String? = null
    ) : Post()
}

data class Comment(
    val id: String,
    val postId: String,
    val author: String,
    val text: String,
    val createdAt: Long
)
```

Reactions: track as a `Set<String>` of post IDs the current user has
reacted to, plus a `Map<String, Int>` of postId → reaction count (mirrors
the web version's simple single-reaction-type model — no need for multiple
emoji types).

---

## 5. In-memory repository

Single source of truth, exposed via `StateFlow`, injected into ViewModels.
No persistence — app state resets on process death, same as the web
version's page-refresh reset. This keeps the app runnable with zero setup;
Section 9 covers replacing this with real persistence.

```kotlin
class PipDeskRepository {
    private val _posts = MutableStateFlow<List<Post>>(seedPosts())
    val posts: StateFlow<List<Post>> = _posts.asStateFlow()

    private val _comments = MutableStateFlow<Map<String, List<Comment>>>(seedComments())
    val comments: StateFlow<Map<String, List<Comment>>> = _comments.asStateFlow()

    private val _reactionCounts = MutableStateFlow<Map<String, Int>>(seedReactions())
    val reactionCounts: StateFlow<Map<String, Int>> = _reactionCounts.asStateFlow()

    private val _myReactions = MutableStateFlow<Set<String>>(emptySet())
    val myReactions: StateFlow<Set<String>> = _myReactions.asStateFlow()

    fun addPost(post: Post) { /* prepend to _posts */ }
    fun updateSignalStatus(postId: String, status: SignalStatus) { /* update matching Signal */ }
    fun addComment(postId: String, author: String, text: String) { /* append */ }
    fun deleteComment(postId: String, commentId: String) { /* remove */ }
    fun toggleReaction(postId: String) { /* flip in _myReactions, adjust _reactionCounts */ }
}
```

Seed data: reuse the same four demo posts as the web version (one open
EUR/USD buy, one education note on order blocks, one closed-as-win
GBP/USD sell, one closed-as-loss USD/JPY buy) so behavior is directly
comparable. Two demo users: `"You (Admin)"` role `ADMIN`, `"Guest Trader"`
role `USER`.

---

## 6. Screens

Use Navigation Compose with these routes. No real auth — a role picker
screen sets the active user in a shared ViewModel, same pattern as the web
version's demo login.

### 6.1 Login / role picker
- App name + one-line tagline
- Two buttons: "Continue as Admin" / "Continue as Trader", each with a
  short subtitle describing what that role can do
- Selecting one sets the current user and navigates to Feed

### 6.2 Feed (both roles)
- Top app bar: app name/logo mark, nav to Feed/Stats/(admin: New
  post/Dashboard), current user name + log out
- Scrollable list (`LazyColumn`) of post cards, newest first
- Signal card: pair + direction + timeframe header, status badge
  top-right, 3-column entry/SL/TP readout, reasoning text, footer with
  author/time, reaction button + count, comment count (tapping expands
  inline comment thread)
- Education card: "NOTE" label, title, body, same footer pattern
- Tapping the comment count expands/collapses an inline comment thread
  under that card: existing comments (author + text), admin-only "delete"
  action per comment, and a text field + "Post" button to add a new one

### 6.3 Composer (admin only)
- Segmented toggle: "Signal" / "Note"
- Signal form: pair (text field), direction (Buy/Sell toggle), entry / SL
  / TP (three fields), timeframe, reasoning (multiline)
- Note form: title, body (multiline) — leave a `mediaUrl` field
  unimplemented for now (future photo/video attach)
- Cancel / Submit actions; submit prepends to feed and returns to Feed

### 6.4 Admin dashboard (admin only)
- "Open signals" section: each open signal with pair/direction/entry-SL-TP
  and three actions — "Mark TP hit", "Mark SL hit", "Close" — updating
  status immediately
- "History" section: past (non-open) signals with their final status
  badge

### 6.5 Stats (both roles)
- Pair filter dropdown ("All pairs" + each pair seen in signals)
- Stat cards: win rate (%, computed from decided signals only — TP_HIT or
  SL_HIT, open signals excluded), wins/losses count, open count, total
  signals posted
- Small disclaimer footer text: "Educational content only — not financial
  advice."

---

## 7. State/ViewModel shape

One shared `AppViewModel` (or a small set of screen-scoped ViewModels
reading from a shared repository — either is fine) exposing:

- `currentUser: StateFlow<User?>`
- `posts`, `comments`, `reactionCounts`, `myReactions` (from repository)
- Actions: `login(role)`, `logout()`, `addPost(...)`, `updateSignalStatus(...)`,
  `addComment(...)`, `deleteComment(...)`, `toggleReaction(...)`

Gate admin-only UI (Composer, Dashboard nav items, comment delete buttons)
on `currentUser.role == Role.ADMIN` — same rule the web version follows,
and same caveat: this is a client-side convenience gate only. Once a real
backend exists (Section 9), enforce the role server-side too — a compose
UI check is not a security boundary.

---

## 8. Build order

Work through these in order — each should be a runnable, visibly working
increment:

1. Project scaffold: empty single-activity Compose project, app icon
   placeholder, package name `com.pipdesk.app` (or ask the user what they
   prefer)
2. Theme: `Color.kt`, `Type.kt`, `Theme.kt` implementing the palette and
   typography from Section 3
3. Data models (Section 4) + `PipDeskRepository` with seed data (Section 5)
4. `AppViewModel` wrapping the repository (Section 7)
5. Navigation graph + Login screen (Section 6.1) — confirm role switching
   works before continuing
6. Feed screen + post card composables, no comments/reactions yet
7. Reactions (toggle + count) and inline expandable comment threads
8. Composer screen (admin only)
9. Admin dashboard screen
10. Stats screen
11. Polish pass: pulsing dot animation on open badges, empty states,
    keyboard handling on text inputs, dark status bar icons

At each step, confirm it compiles and behaves before moving to the next —
don't write all screens before testing any of them.

---

## 9. Wiring a real backend later

Not needed for the first build, but design with this in mind: replace
`PipDeskRepository`'s in-memory `MutableStateFlow`s with calls to whatever
backend you use (the existing web version uses Supabase — Postgres + Auth
+ Realtime — and the same backend can serve both the web and Android
clients). Suggested approach:

- Add the Supabase Kotlin client (`io.github.jan-tennert.supabase`)
- Same schema as the web version: `users`, `posts`, `comments`,
  `reactions` tables (see the web app's README for exact columns)
- Replace demo role-picker login with Supabase Auth
- Keep the repository's public interface (the `StateFlow`s and function
  signatures) the same, so the ViewModel and UI layers don't need to
  change — only the repository's internals swap from in-memory lists to
  network calls + a local cache

---

## 10. What "done" looks like for v1

- Both roles can log in and see the feed
- Admin can post a signal and a note, and see them appear in the feed
  immediately
- Admin can mark an open signal's outcome from the dashboard and see its
  badge/edge color update in the feed
- Either role can comment and react; admin can delete any comment
- Stats screen shows a correct win rate that updates as outcomes are
  marked, filterable by pair
- App state persists across screen navigation but resets on process death
  (expected — no backend yet)
