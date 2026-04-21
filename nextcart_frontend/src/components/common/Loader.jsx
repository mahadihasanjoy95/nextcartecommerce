/**
 * Loader — skeleton placeholder that mirrors the ProductCard shape.
 *
 * Rendered while the product list is fetching for the first time.
 * Skeleton loaders feel faster than spinners because the layout
 * doesn't shift once real content arrives.
 *
 * Usage:
 *   <Loader count={12} />           // renders 12 skeleton cards
 *   <Loader count={4} compact />    // smaller variant
 */
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-card animate-pulse">
      {/* Image placeholder */}
      <div className="skeleton aspect-[3/4] w-full" />

      {/* Content placeholder */}
      <div className="p-4 space-y-3">
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-3 w-2/3 rounded" />
        <div className="flex items-center gap-3 pt-1">
          <div className="skeleton h-5 w-20 rounded" />
          <div className="skeleton h-4 w-14 rounded" />
        </div>
      </div>
    </div>
  )
}

function Loader({ count = 16 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

export default Loader
