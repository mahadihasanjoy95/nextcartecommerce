function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-primary/40'

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-sm',
  }

  const variants = {
    primary:   'bg-admin-primary text-white hover:bg-admin-priHover shadow-sm',
    secondary: 'border border-admin-border bg-white text-admin-text hover:bg-gray-50 shadow-sm',
    ghost:     'text-admin-textSub hover:bg-gray-100 hover:text-admin-text',
    danger:    'bg-admin-danger text-white hover:bg-red-700 shadow-sm',
  }

  return (
    <button
      type={type}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`.trim()}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
