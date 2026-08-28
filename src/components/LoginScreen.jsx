import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext.jsx'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
}
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
}

export default function LoginScreen() {
  const { login } = useApp()

  return (
    <div className="relative min-h-screen overflow-hidden bg-ink bg-noise">
      <div className="pointer-events-none absolute inset-0 bg-grid bg-grid opacity-60 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_20%,black,transparent)]" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative flex min-h-screen flex-col items-center justify-center px-6 py-16"
      >
        <motion.div variants={item} className="mb-6 flex items-center gap-2 rounded-full border border-line bg-panel/80 px-3 py-1.5 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-long pulse" />
          <span className="font-mono text-[11px] uppercase tracking-wider text-mute">Live desk &middot; demo mode</span>
        </motion.div>

        <motion.h1
          variants={item}
          className="max-w-sm text-center font-display text-[2.75rem] font-bold leading-[1.05] tracking-tight text-paper"
        >
          Pip Desk
        </motion.h1>

        <motion.p variants={item} className="mt-4 max-w-xs text-center text-sm leading-relaxed text-mute">
          Setups, notes, and a track record built automatically from what actually happened &mdash; not what got remembered.
        </motion.p>

        <motion.div variants={item} className="mt-10 w-full max-w-sm space-y-3">
          <button
            onClick={() => login('admin')}
            className="group relative w-full overflow-hidden rounded-xl border border-line bg-panel px-5 py-4 text-left transition hover:border-admin/50 hover:shadow-glow-admin"
          >
            <div className="absolute inset-y-0 left-0 w-1 bg-admin" />
            <div className="flex items-center justify-between pl-2">
              <div>
                <div className="font-semibold text-paper">Continue as Admin</div>
                <div className="mt-0.5 text-xs text-mute">Post setups, publish notes, manage outcomes</div>
              </div>
              <span className="font-mono text-admin opacity-0 transition group-hover:opacity-100">&rarr;</span>
            </div>
          </button>

          <button
            onClick={() => login('user')}
            className="group relative w-full overflow-hidden rounded-xl border border-line bg-panel px-5 py-4 text-left transition hover:border-accent/50 hover:shadow-glow"
          >
            <div className="absolute inset-y-0 left-0 w-1 bg-accent" />
            <div className="flex items-center justify-between pl-2">
              <div>
                <div className="font-semibold text-paper">Continue as Trader</div>
                <div className="mt-0.5 text-xs text-mute">Follow setups, read notes, join the discussion</div>
              </div>
              <span className="font-mono text-accent opacity-0 transition group-hover:opacity-100">&rarr;</span>
            </div>
          </button>
        </motion.div>

        <motion.p variants={item} className="mt-8 text-center text-xs text-mute">
          Demo auth &mdash; swap for real sign-in when you connect a backend.
        </motion.p>
      </motion.div>
    </div>
  )
}
