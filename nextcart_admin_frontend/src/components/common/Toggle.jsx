/**
 * Toggle — a styled boolean switch.
 *
 * Usage:
 *   <Toggle checked={form.featured} onChange={(val) => setField('featured', val)} label="Featured" />
 */
function Toggle({ checked, onChange, label, description, disabled = false }) {
  return (
    <div className={`flex items-center justify-between gap-3 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      {(label || description) && (
        <div className="min-w-0">
          {label && <p className="text-sm font-medium text-admin-text">{label}</p>}
          {description && <p className="text-xs text-admin-textMuted mt-0.5">{description}</p>}
        </div>
      )}

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-primary focus-visible:ring-offset-2 ${
          checked ? 'bg-admin-primary' : 'bg-gray-200'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition-transform duration-200 ${
            checked ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  )
}

export default Toggle
