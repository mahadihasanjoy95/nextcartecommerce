import { RiShoppingBag3Line } from 'react-icons/ri'
import Button from './Button'

/**
 * EmptyState — shown when a product list returns zero results.
 *
 * Usage:
 *   <EmptyState message="No products found for this filter." />
 *   <EmptyState onReset={() => setFilter('all')} />
 */
function EmptyState({
  title    = 'Nothing here yet',
  message  = 'We couldn\'t find any products matching your selection.',
  onReset,
  resetLabel = 'View All Products',
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-5 text-center animate-fade-in">
      {/* Decorative icon */}
      <div className="w-20 h-20 rounded-full bg-brand-pink-50 flex items-center justify-center">
        <RiShoppingBag3Line className="w-10 h-10 text-brand-pink-300" />
      </div>

      <div className="space-y-2">
        <h3 className="font-heading text-xl font-semibold text-gray-800">{title}</h3>
        <p className="text-gray-400 font-body text-sm max-w-xs">{message}</p>
      </div>

      {onReset && (
        <Button variant="outline" size="sm" onClick={onReset}>
          {resetLabel}
        </Button>
      )}
    </div>
  )
}

export default EmptyState
