import { createContext, useCallback, useContext, useState } from 'react'
import { RiCheckLine, RiCloseLine, RiErrorWarningLine } from 'react-icons/ri'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const add = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3500)
  }, [])

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = {
    success: (msg) => add(msg, 'success'),
    error:   (msg) => add(msg, 'error'),
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium shadow-lg text-white pointer-events-auto
              ${t.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}
          >
            <span className="shrink-0">
              {t.type === 'success'
                ? <RiCheckLine className="h-4 w-4" />
                : <RiErrorWarningLine className="h-4 w-4" />}
            </span>
            <span className="flex-1">{t.message}</span>
            <button
              onClick={() => dismiss(t.id)}
              className="shrink-0 rounded p-0.5 hover:bg-white/20 transition-colors"
            >
              <RiCloseLine className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx
}
