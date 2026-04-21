/**
 * Badge — small pill label for product status indicators.
 *
 * Variants:
 *   featured  → solid pink
 *   new       → solid amber/yellow
 *   sale      → solid emerald
 *
 * Usage:
 *   <Badge variant="featured" />
 *   <Badge variant="new" />
 *   <Badge variant="sale" label="-15%" />
 */
function Badge({ variant = 'featured', label }) {
  const config = {
    featured: { className: 'badge-featured', defaultLabel: 'Featured' },
    new:      { className: 'badge-new',      defaultLabel: 'New' },
    sale:     { className: 'badge-sale',     defaultLabel: 'Sale' },
  }

  const { className, defaultLabel } = config[variant] ?? config.featured

  return (
    <span className={className}>
      {label ?? defaultLabel}
    </span>
  )
}

export default Badge
