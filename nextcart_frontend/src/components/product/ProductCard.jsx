import { Link } from 'react-router-dom'
import { RiHeart3Line, RiEyeLine } from 'react-icons/ri'
import Badge from '@/components/common/Badge'
import { formatPrice, discountPercent, truncate, productPath } from '@/utils/formatters'

/**
 * ProductCard — single product tile rendered in the product grid.
 *
 * Visual structure:
 *  ┌──────────────────────────┐
 *  │  [badge]      [wishlist] │  ← absolute overlay
 *  │                          │
 *  │      product image       │  ← 3:4 aspect ratio, zoom on hover
 *  │                          │
 *  │  [View Details] overlay  │  ← appears on hover
 *  ├──────────────────────────┤
 *  │  Product Name            │
 *  │  Short description       │
 *  │  ৳ 2,999  ~~৳ 3,500~~  -14% │
 *  └──────────────────────────┘
 *
 * Props:
 *  product — ProductResponseDto from the backend
 */
function ProductCard({ product }) {
  if (!product) return null

  const {
    name,
    shortDescription,
    basePrice,
    salePrice,
    thumbnailUrl,
    featured,
    newArrival,
    currency,
  } = product

  const discount  = discountPercent(basePrice, salePrice)
  const hasDiscount = discount > 0
  const detailPath  = productPath(product)

  return (
    <article className="product-card group cursor-pointer">
      <Link to={detailPath} tabIndex={-1} aria-hidden="true">

        {/* ── Image wrapper ─────────────────────────────────────────────── */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">

          {/* Thumbnail */}
          <img
            src={thumbnailUrl || 'https://picsum.photos/seed/placeholder/400/530'}
            alt={name}
            loading="lazy"
            className="w-full h-full object-cover img-zoom"
          />

          {/* Gradient overlay — always present but invisible until hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* "View Details" hover button */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <span className="inline-flex items-center gap-1.5 bg-white text-gray-800 text-xs font-semibold font-body px-4 py-2 rounded-full shadow-md hover:bg-brand-pink-500 hover:text-white transition-colors duration-200 whitespace-nowrap">
              <RiEyeLine className="w-3.5 h-3.5" />
              View Details
            </span>
          </div>

          {/* ── Badges — top left ────────────────────────────────────────── */}
          {(featured || newArrival || hasDiscount) && (
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {featured   && <Badge variant="featured" />}
              {newArrival && <Badge variant="new" />}
              {hasDiscount && <Badge variant="sale" label={`-${discount}%`} />}
            </div>
          )}

          {/* ── Wishlist — top right ─────────────────────────────────────── */}
          <button
            aria-label={`Add ${name} to wishlist`}
            onClick={(e) => e.preventDefault()} // prevent link navigation on click
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-400 hover:text-brand-pink-500 hover:bg-white transition-all duration-200 shadow-sm opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0"
          >
            <RiHeart3Line className="w-4 h-4" />
          </button>

        </div>
      </Link>

      {/* ── Card content ─────────────────────────────────────────────────── */}
      <div className="p-4 flex flex-col gap-1.5">

        {/* Product name */}
        <Link to={detailPath} className="group/name">
          <h3 className="font-body font-semibold text-gray-900 text-sm leading-snug group-hover/name:text-brand-pink-500 transition-colors duration-200 line-clamp-1">
            {name}
          </h3>
        </Link>

        {/* Short description */}
        {shortDescription && (
          <p className="font-body text-gray-400 text-xs leading-relaxed line-clamp-2">
            {truncate(shortDescription, 70)}
          </p>
        )}

        {/* Price row */}
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          {/* Active price */}
          <span className="font-body font-bold text-brand-pink-500 text-sm">
            {formatPrice(salePrice ?? basePrice, currency)}
          </span>

          {/* Strikethrough base price — only if sale price exists */}
          {hasDiscount && (
            <span className="font-body text-gray-400 text-xs line-through">
              {formatPrice(basePrice, currency)}
            </span>
          )}
        </div>

      </div>
    </article>
  )
}

export default ProductCard
