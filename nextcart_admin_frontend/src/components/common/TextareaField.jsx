function TextareaField({ label, hint, rows = 4, className = '', ...props }) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <span className="text-sm font-medium text-admin-text">{label}</span>
      )}
      <textarea
        rows={rows}
        className="rounded-lg border border-admin-inputBorder bg-white px-3.5 py-2.5 text-sm text-admin-text outline-none transition-colors duration-150 resize-y
          placeholder:text-admin-textMuted hover:border-gray-400
          focus:border-admin-primary focus:ring-2 focus:ring-admin-primary/15"
        {...props}
      />
      {hint && <span className="text-xs text-admin-textMuted">{hint}</span>}
    </label>
  )
}

export default TextareaField
