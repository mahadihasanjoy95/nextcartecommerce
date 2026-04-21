import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  RiArrowLeftLine,
  RiHeart3Line,
  RiHeartFill,
  RiShoppingBag3Line,
  RiCheckLine,
  RiTruckLine,
  RiRefreshLine,
  RiShieldCheckLine,
  RiHome4Line,
  RiArrowRightSLine,
  RiImageLine,
  RiArrowLeftSLine,
  RiArrowRightSLine as RiArrowRightSLineAlt,
} from 'react-icons/ri'
import Badge from '@/components/common/Badge'
import Button from '@/components/common/Button'
import { useProductBySlug } from '@/hooks/useProducts'
import { formatPrice, discountPercent } from '@/utils/formatters'

// ─── Loading skeleton ────────────────────────────────────────────────────────

function SkeletonPage() {
  return (
    <div className="page-container py-10">
      {/* breadcrumb skeleton */}
      <div className="flex items-center gap-2 mb-8">
        <div className="skeleton h-3 w-12 rounded" />
        <div className="skeleton h-3 w-3 rounded-full" />
        <div className="skeleton h-3 w-24 rounded" />
        <div className="skeleton h-3 w-3 rounded-full" />
        <div className="skeleton h-3 w-36 rounded" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 animate-pulse">
        {/* Left: image skeleton */}
        <div className="space-y-4">
          <div className="skeleton rounded-2xl aspect-[3/4] w-full" />
          <div className="flex gap-3">
            {[0,1,2].map(i => <div key={i} className="skeleton w-20 h-24 rounded-xl flex-shrink-0" />)}
          </div>
        </div>

        {/* Right: info skeleton */}
        <div className="space-y-5 pt-2">
          <div className="flex gap-2">
            <div className="skeleton h-6 w-20 rounded-full" />
            <div className="skeleton h-6 w-16 rounded-full" />
          </div>
          <div className="skeleton h-10 w-4/5 rounded" />
          <div className="skeleton h-4 w-40 rounded" />
          <div className="space-y-2">
            <div className="skeleton h-3 w-full rounded" />
            <div className="skeleton h-3 w-5/6 rounded" />
            <div className="skeleton h-3 w-3/4 rounded" />
          </div>
          <div className="skeleton h-px w-full" />
          <div className="flex items-end gap-4">
            <div className="skeleton h-10 w-32 rounded" />
            <div className="skeleton h-6 w-24 rounded" />
          </div>
          <div className="skeleton h-px w-full" />
          <div className="space-y-2">
            {[0,1,2,3].map(i => <div key={i} className="skeleton h-3 w-full rounded" />)}
          </div>
          <div className="skeleton h-px w-full" />
          <div className="skeleton h-12 w-full rounded-full" />
          <div className="skeleton h-12 w-full rounded-full" />
        </div>
      </div>
    </div>
  )
}

// ─── Error / not-found page ──────────────────────────────────────────────────

function ErrorPage({ message }) {
  const navigate = useNavigate()
  return (
    <div className="flex-1 flex items-center justify-center py-24">
      <div className="flex flex-col items-center gap-5 text-center px-4">
        <div className="w-20 h-20 rounded-full bg-brand-pink-50 flex items-center justify-center">
          <RiImageLine className="w-10 h-10 text-brand-pink-300" />
        </div>
        <div className="space-y-2">
          <h2 className="font-heading text-2xl font-semibold text-gray-800">Product not found</h2>
          <p className="text-gray-400 font-body text-sm max-w-xs">
            {message || 'This product may have been removed or the link is incorrect.'}
          </p>
        </div>
        <Button onClick={() => navigate('/')}>
          <RiArrowLeftLine className="w-4 h-4" />
          Back to Shop
        </Button>
      </div>
    </div>
  )
}

// ─── Image Gallery ───────────────────────────────────────────────────────────

function ImageGallery({ images, productName }) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    setSelectedIndex(0)
  }, [images, productName])

  const prev = () => setSelectedIndex(i => (i - 1 + images.length) % images.length)
  const next = () => setSelectedIndex(i => (i + 1) % images.length)

  const current = images[selectedIndex] || 'https://picsum.photos/seed/placeholder/600/700'

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Main image */}
      <div className="relative group rounded-2xl overflow-hidden bg-gray-50 shadow-card aspect-[4/5] sm:aspect-[3/4]">
        <img
          key={current}
          src={current}
          alt={productName}
          className="w-full h-full object-cover transition-opacity duration-300 animate-fade-in"
          loading="eager"
        />

        {/* Prev / Next arrows — appear on hover when multiple images */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2
                         w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-sm
                         flex items-center justify-center text-gray-600
                         opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-200
                         hover:bg-white hover:text-brand-pink-500"
            >
              <RiArrowLeftSLine className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2
                         w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-sm
                         flex items-center justify-center text-gray-600
                         opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-200
                         hover:bg-white hover:text-brand-pink-500"
            >
              <RiArrowRightSLineAlt className="w-5 h-5" />
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedIndex(i)}
                  aria-label={`Image ${i + 1}`}
                  className={`rounded-full transition-all duration-200 ${
                    i === selectedIndex
                      ? 'w-5 h-1.5 bg-white'
                      : 'w-1.5 h-1.5 bg-white/60 hover:bg-white/90'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1 snap-x snap-mandatory scrollbar-hide">
          {images.map((url, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              aria-label={`View image ${i + 1}`}
              className={`relative flex-shrink-0 snap-start w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                i === selectedIndex
                  ? 'border-brand-pink-400 shadow-sm'
                  : 'border-transparent opacity-60 hover:opacity-100 hover:border-brand-pink-200'
              }`}
            >
              <img src={url} alt={`${productName} view ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Product Info panel ──────────────────────────────────────────────────────

function ProductInfo({ product }) {
  const [isWishlisted, setIsWishlisted] = useState(false)

  const discount   = discountPercent(product.basePrice, product.salePrice)
  const hasDiscount = discount > 0
  const activePrice = product.salePrice ?? product.basePrice

  const details = [
    product.brandName    && { label: 'Brand',    value: product.brandName },
    product.categoryName && { label: 'Category', value: product.categoryName },
    { label: 'Type',  value: product.productType === 'VARIABLE' ? 'Variable' : 'Simple' },
    {
      label: 'Stock',
      value: product.inStock ? 'In Stock' : 'Out of Stock',
      highlight: product.inStock,
    },
  ].filter(Boolean)

  return (
    <div className="flex flex-col gap-6">

      {/* Badges */}
      {(product.featured || product.newArrival || hasDiscount) && (
        <div className="flex flex-wrap gap-2">
          {product.featured   && <Badge variant="featured" />}
          {product.newArrival && <Badge variant="new" />}
          {hasDiscount        && <Badge variant="sale" label={`-${discount}% Off`} />}
        </div>
      )}

      {/* Product name */}
      <h1 className="font-heading text-[1.85rem] sm:text-4xl font-semibold text-gray-900 leading-tight">
        {product.name}
      </h1>

      {/* Brand + Category line */}
      {(product.brandName || product.categoryName) && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-body text-gray-500">
          {product.brandName && (
            <span>
              By <span className="font-semibold text-gray-700">{product.brandName}</span>
            </span>
          )}
          {product.brandName && product.categoryName && (
            <span className="w-1 h-1 rounded-full bg-gray-300 inline-block" />
          )}
          {product.categoryName && <span>{product.categoryName}</span>}
        </div>
      )}

      {/* Short description */}
      {product.shortDescription && (
        <p className="font-body text-gray-500 text-base leading-relaxed">
          {product.shortDescription}
        </p>
      )}

      <hr className="border-gray-100" />

      {/* Price block */}
      <div className="flex flex-wrap items-end gap-3 sm:gap-4">
        <span className="font-heading text-3xl sm:text-4xl font-semibold text-brand-pink-500">
          {formatPrice(activePrice, product.currency)}
        </span>
        {hasDiscount && (
          <>
            <span className="font-body text-lg sm:text-xl text-gray-400 line-through mb-0.5">
              {formatPrice(product.basePrice, product.currency)}
            </span>
            <span className="mb-1 bg-brand-yellow-100 text-amber-700 text-sm font-semibold font-body px-3 py-1 rounded-full">
              Save {discount}%
            </span>
          </>
        )}
      </div>

      <hr className="border-gray-100" />

      {/* Full description */}
      {product.description && (
        <div className="font-body text-gray-600 text-sm leading-relaxed space-y-2">
          <h3 className="font-semibold text-gray-800 text-base">About this product</h3>
          <p>{product.description}</p>
        </div>
      )}

      {/* Quick details grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {details.map(({ label, value, highlight }) => (
          <div key={label} className="bg-gray-50 rounded-xl px-4 py-3">
            <p className="font-body text-xs text-gray-400 uppercase tracking-wider mb-1">{label}</p>
            <p className={`font-body font-semibold text-sm ${highlight ? 'text-emerald-600' : 'text-gray-800'}`}>
              {highlight !== undefined && highlight && (
                <RiCheckLine className="w-3.5 h-3.5 inline mr-1" />
              )}
              {value}
            </p>
          </div>
        ))}
      </div>

      <hr className="border-gray-100" />

      {/* Action buttons */}
      <div className="flex flex-col gap-3">
        {/* Add to Cart — disabled until cart is built */}
        <div className="group relative">
          <button
            disabled
            className="w-full inline-flex items-center justify-center gap-2
                       bg-brand-pink-500 text-white font-body font-semibold
                       px-6 py-4 rounded-full shadow-md text-base
                       opacity-60 cursor-not-allowed"
          >
            <RiShoppingBag3Line className="w-5 h-5" />
            Add to Cart
          </button>
          {/* Tooltip */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs font-body
                          px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100
                          transition-opacity duration-200 pointer-events-none">
            Cart coming soon ✨
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
          </div>
        </div>

        {/* Wishlist toggle */}
        <button
          onClick={() => setIsWishlisted(prev => !prev)}
          className={`w-full inline-flex items-center justify-center gap-2
                     border-2 font-body font-semibold px-6 py-4 rounded-full text-base
                     transition-all duration-200
                     ${isWishlisted
                       ? 'border-brand-pink-400 bg-brand-pink-50 text-brand-pink-500'
                       : 'border-gray-200 text-gray-600 hover:border-brand-pink-300 hover:text-brand-pink-500 hover:bg-brand-pink-50'
                     }`}
        >
          {isWishlisted
            ? <RiHeartFill className="w-5 h-5 text-brand-pink-500" />
            : <RiHeart3Line className="w-5 h-5" />
          }
          {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
        </button>
      </div>

      <hr className="border-gray-100" />

      {/* Trust strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { Icon: RiTruckLine,       label: 'Free Shipping', sub: 'Orders over ৳999' },
          { Icon: RiRefreshLine,     label: 'Easy Returns',  sub: '7-day policy' },
          { Icon: RiShieldCheckLine, label: 'Secure Pay',    sub: '100% protected' },
        ].map(({ Icon, label, sub }) => (
          <div key={label} className="flex items-center sm:flex-col gap-3 sm:gap-1.5 text-left sm:text-center bg-gray-50 sm:bg-transparent rounded-2xl px-4 py-3 sm:p-0">
            <div className="w-10 h-10 rounded-xl bg-brand-pink-50 flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4 text-brand-pink-500" />
            </div>
            <div>
              <p className="font-body text-xs font-semibold text-gray-700">{label}</p>
              <p className="font-body text-[10px] text-gray-400">{sub}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

// ─── Main page ───────────────────────────────────────────────────────────────

function ProductDetailsPage() {
  const { slug } = useParams()
  const { product, isLoading, isError, error } = useProductBySlug(slug)

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [slug])

  if (isLoading) return <SkeletonPage />
  if (isError)   return <ErrorPage message={error?.message} />
  if (!product)  return <ErrorPage message="Product not found." />

  // Build image list: prefer imageUrls array, fall back to thumbnailUrl
  const images =
    product.imageUrls?.length > 0
      ? product.imageUrls
      : product.thumbnailUrl
        ? [product.thumbnailUrl]
        : ['https://picsum.photos/seed/placeholder/600/700']

  return (
    <div className="page-container py-4 sm:py-6 md:py-10">

          {/* ── Breadcrumb ─────────────────────────────────────────────── */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] sm:text-xs font-body text-gray-400 mb-4 sm:mb-6 flex-wrap">
            <Link to="/" className="flex items-center gap-1 hover:text-brand-pink-500 transition-colors duration-150">
              <RiHome4Line className="w-3.5 h-3.5" />
              Home
            </Link>
            <RiArrowRightSLine className="w-3.5 h-3.5 flex-shrink-0" />
            {product.categoryName && (
              <>
                <Link
                  to={`/?filter=all`}
                  className="hover:text-brand-pink-500 transition-colors duration-150 truncate max-w-[120px]"
                >
                  {product.categoryName}
                </Link>
                <RiArrowRightSLine className="w-3.5 h-3.5 flex-shrink-0" />
              </>
            )}
            <span className="text-gray-700 font-medium truncate max-w-[200px]">{product.name}</span>
          </nav>

          {/* ── Back link ──────────────────────────────────────────────── */}
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-body font-medium text-gray-500
                       hover:text-brand-pink-500 transition-colors duration-150 mb-5 sm:mb-8 group"
          >
            <RiArrowLeftLine className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
            Back to Collection
          </Link>

          {/* ── Two-column layout ──────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] gap-6 sm:gap-8 lg:gap-10 xl:gap-16 animate-fade-in">
            <ImageGallery images={images} productName={product.name} />
            <ProductInfo  product={product} />
          </div>

    </div>
  )
}

export default ProductDetailsPage
