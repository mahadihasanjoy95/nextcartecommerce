/**
 * Badge — small status pill.
 *
 * variant: 'success' | 'warning' | 'danger' | 'info' | 'default' | 'primary'
 */
function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    success: 'bg-admin-successBg text-admin-success',
    warning: 'bg-admin-warningBg text-admin-warning',
    danger:  'bg-admin-dangerBg  text-admin-danger',
    info:    'bg-admin-infoBg    text-admin-info',
    primary: 'bg-admin-priLight  text-admin-primary',
    default: 'bg-gray-100        text-gray-600',
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${variants[variant] ?? variants.default} ${className}`}
    >
      {children}
    </span>
  )
}

export default Badge
