import { useState, useEffect } from 'react'
import { RiAlertLine, RiCloseLine } from 'react-icons/ri'
import Button from './Button'

function DangerConfirmModal({
  title,
  message,
  confirmText,
  confirmationHint,
  confirmLabel = 'Confirm',
  isPending = false,
  error = null,
  onClose,
  onConfirm,
}) {
  const [input, setInput] = useState('')

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  const isMatch = input === confirmText

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl border border-admin-border bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-admin-border px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100">
              <RiAlertLine className="h-5 w-5 text-red-600" />
            </div>
            <h2 className="text-sm font-semibold text-admin-text">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-admin-textMuted hover:bg-admin-bg hover:text-admin-text transition-colors"
            aria-label="Close"
          >
            <RiCloseLine className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <p className="text-sm text-admin-textMuted">{message}</p>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-admin-textMuted">
              {confirmationHint}
            </label>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoFocus
              className="w-full rounded-lg border border-admin-inputBorder bg-white px-3.5 py-2.5 text-sm text-admin-text outline-none transition-colors placeholder:text-admin-textMuted hover:border-gray-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/15"
              placeholder={confirmText}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-admin-border px-6 py-4">
          <Button variant="ghost" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            disabled={!isMatch || isPending}
          >
            {isPending ? 'Deleting…' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DangerConfirmModal
