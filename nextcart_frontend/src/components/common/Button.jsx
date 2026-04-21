/**
 * Button — branded reusable button.
 *
 * Variants:
 *   primary  → filled pink
 *   outline  → bordered pink
 *   ghost    → text-only pink
 *
 * Sizes:
 *   sm | md (default) | lg
 *
 * Usage:
 *   <Button onClick={...}>Shop Now</Button>
 *   <Button variant="outline" size="lg">View All</Button>
 *   <Button as="a" href="...">Link button</Button>
 */
function Button({
  children,
  variant  = 'primary',
  size     = 'md',
  as: Tag  = 'button',
  className = '',
  disabled  = false,
  ...props
}) {
  const base = 'inline-flex items-center justify-center gap-2 font-body font-semibold rounded-full transition-all duration-300 focus-visible:ring-2 focus-visible:ring-brand-pink-400 focus-visible:ring-offset-2 outline-none'

  const variants = {
    primary: 'bg-brand-pink-500 text-white shadow-md hover:bg-brand-pink-600 hover:-translate-y-0.5 hover:shadow-glow active:translate-y-0',
    outline: 'border-2 border-brand-pink-400 text-brand-pink-500 hover:bg-brand-pink-50 hover:-translate-y-0.5 active:translate-y-0',
    ghost:   'text-brand-pink-500 hover:bg-brand-pink-50',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  }

  const disabledClass = disabled
    ? 'opacity-50 cursor-not-allowed pointer-events-none'
    : ''

  return (
    <Tag
      className={`${base} ${variants[variant] ?? variants.primary} ${sizes[size] ?? sizes.md} ${disabledClass} ${className}`}
      disabled={Tag === 'button' ? disabled : undefined}
      {...props}
    >
      {children}
    </Tag>
  )
}

export default Button
