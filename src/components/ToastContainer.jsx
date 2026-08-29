import { useApp } from '../context/AppContext.jsx'

const STYLES = {
  success: 'border-l-long',
  error: 'border-l-short',
  info: 'border-l-accent'
}

export default function ToastContainer() {
  const { toasts } = useApp()
  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-20 z-50 flex flex-col gap-2 sm:inset-x-auto sm:right-4 sm:w-80 md:bottom-4">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto rounded-lg border border-line border-l-4 bg-panel px-4 py-3 text-sm font-medium text-paper shadow-lg ${
            STYLES[t.type] || STYLES.info
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  )
}
