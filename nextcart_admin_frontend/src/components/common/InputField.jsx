function InputField({ label, hint, error, className = '', ...props }) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <span className="text-sm font-medium text-admin-text">{label}</span>
      )}
      <input
        className={`rounded-lg border bg-white px-3.5 py-2.5 text-sm text-admin-text outline-none transition-colors duration-150
          placeholder:text-admin-textMuted
          focus:border-admin-primary focus:ring-2 focus:ring-admin-primary/15
          ${error ? 'border-admin-danger' : 'border-admin-inputBorder hover:border-gray-400'}`}
        {...props}
      />
      {hint  && !error && <span className="text-xs text-admin-textMuted">{hint}</span>}
      {error && <span className="text-xs text-admin-danger">{error}</span>}
    </label>
  )
}

export default InputField
