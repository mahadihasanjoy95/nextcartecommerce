/**
 * SectionTitle — consistent heading block for every homepage section.
 *
 * Usage:
 *   <SectionTitle
 *     eyebrow="This Season"
 *     title="Our Collection"
 *     subtitle="Handpicked pieces curated just for you"
 *   />
 */
function SectionTitle({ eyebrow, title, subtitle, align = 'center', className = '' }) {
  const alignClass = {
    center: 'text-center items-center',
    left:   'text-left items-start',
  }[align] ?? 'text-center items-center'

  return (
    <div className={`flex flex-col gap-2 ${alignClass} ${className}`}>
      {/* Small eyebrow label above the main title */}
      {eyebrow && (
        <span className="inline-block text-brand-pink-500 font-body font-semibold text-sm uppercase tracking-widest">
          {eyebrow}
        </span>
      )}

      {/* Main heading */}
      <h2 className="font-heading text-3xl md:text-4xl font-semibold text-gray-900 leading-tight">
        {title}
      </h2>

      {/* Decorative underline */}
      <div className="flex gap-1.5 mt-1">
        <span className="block h-1 w-8 rounded-full bg-brand-pink-400" />
        <span className="block h-1 w-3 rounded-full bg-brand-yellow-400" />
        <span className="block h-1 w-1.5 rounded-full bg-brand-pink-200" />
      </div>

      {/* Optional subtitle */}
      {subtitle && (
        <p className="mt-3 text-gray-500 font-body text-base max-w-xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  )
}

export default SectionTitle
