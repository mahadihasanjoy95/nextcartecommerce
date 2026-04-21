function SelectField({ label, options, hint, className = '', ...props }) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <span className="text-sm font-medium text-admin-text">{label}</span>
      )}
      <select
        className="rounded-lg border border-admin-inputBorder bg-white px-3.5 py-2.5 text-sm text-admin-text outline-none transition-colors duration-150
          hover:border-gray-400 focus:border-admin-primary focus:ring-2 focus:ring-admin-primary/15 appearance-none cursor-pointer"
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {hint && <span className="text-xs text-admin-textMuted">{hint}</span>}
    </label>
  )
}

export default SelectField
