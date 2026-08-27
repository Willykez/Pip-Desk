import { useApp } from '../context/AppContext.jsx'

export default function LoginScreen() {
  const { login } = useApp()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-lg border border-line bg-panel font-mono text-lg font-bold text-accent">
            &gt;_
          </div>
          <h1 className="font-mono text-2xl font-bold tracking-tight">Pip Desk</h1>
          <p className="mt-2 text-sm text-mute">Setups, notes, and a track record you don&rsquo;t have to keep by hand.</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => login('admin')}
            className="w-full rounded-lg border border-line bg-panel px-4 py-3.5 text-left transition hover:border-accent/50"
          >
            <div className="font-semibold">Continue as Admin</div>
            <div className="mt-0.5 text-xs text-mute">Post setups, publish notes, manage outcomes</div>
          </button>
          <button
            onClick={() => login('user')}
            className="w-full rounded-lg border border-line bg-panel px-4 py-3.5 text-left transition hover:border-accent/50"
          >
            <div className="font-semibold">Continue as Trader</div>
            <div className="mt-0.5 text-xs text-mute">Follow setups, read notes, join the discussion</div>
          </button>
        </div>

        <p className="mt-8 text-center text-xs text-mute">
          Demo auth &mdash; swap for real sign-in when you connect a backend.
        </p>
      </div>
    </div>
  )
}
