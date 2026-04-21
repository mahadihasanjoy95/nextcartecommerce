import { useState } from 'react'
import { Link } from 'react-router-dom'
import { RiHeart3Fill, RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri'
import { useBookmarks } from '@/hooks/useBookmarks'
import { useBookmarkContext } from '@/context/BookmarkContext'
import SectionTitle from '@/components/common/SectionTitle'
import Loader from '@/components/common/Loader'
import EmptyState from '@/components/common/EmptyState'
import { formatPrice, discountPercent, productPath } from '@/utils/formatters'

const PAGE_SIZE = 16

function FavouritesPage() {
  const [page, setPage] = useState(0)
  const { bookmarks, pageInfo, isLoading, isError } = useBookmarks({ page, size: PAGE_SIZE })
  const { toggleBookmark } = useBookmarkContext()

  if (isLoading) return <Loader />

  if (isError) {
    return (
      <section className="section-gap bg-surface">
        <div className="page-container">
          <p className="text-center font-body text-gray-400 py-24">Failed to load favourites. Please try again.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="section-gap bg-surface">
      <div className="page-container">
        <div className="flex flex-col items-center gap-8 mb-10">
          <SectionTitle
            eyebrow="Your Wishlist"
            title="My Favourites"
            subtitle="Products you've saved — all in one place."
          />
        </div>

        {bookmarks.length === 0 ? (
          <EmptyState
            title="No favourites yet"
            message="Tap the heart on any product to save it here."
            onReset={undefined}
          >
            <Link
              to="/"
              className="mt-2 inline-flex items-center gap-1.5 font-body text-sm font-medium text-brand-pink-500 hover:text-brand-pink-600 transition-colors duration-150"
            >
              Browse Products
            </Link>
          </EmptyState>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {bookmarks.map(({ bookmarkId, product }) => {
                const discount    = discountPercent(product.basePrice, product.salePrice)
                const hasDiscount = discount > 0
                const detailPath  = productPath(product)

                return (
                  <article key={bookmarkId} className="product-card group cursor-pointer">
                    <Link to={detailPath} tabIndex={-1} aria-hidden="true">
                      <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
                        <img
                          src={product.thumbnailUrl || 'https://picsum.photos/seed/placeholder/400/530'}
                          alt={product.name}
                          loading="lazy"
                          className="w-full h-full object-cover img-zoom"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Always-visible filled heart to remove bookmark */}
                        <button
                          aria-label={`Remove ${product.name} from favourites`}
                          onClick={(e) => { e.preventDefault(); toggleBookmark(product.id) }}
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-brand-pink-500 hover:bg-white transition-all duration-200 shadow-sm"
                        >
                          <RiHeart3Fill className="w-4 h-4" />
                        </button>
                      </div>
                    </Link>

                    <div className="p-4 flex flex-col gap-1.5">
                      <Link to={detailPath} className="group/name">
                        <h3 className="font-body font-semibold text-gray-900 text-sm leading-snug group-hover/name:text-brand-pink-500 transition-colors duration-200 line-clamp-1">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="font-body font-bold text-brand-pink-500 text-sm">
                          {formatPrice(product.salePrice ?? product.basePrice, product.currency)}
                        </span>
                        {hasDiscount && (
                          <span className="font-body text-gray-400 text-xs line-through">
                            {formatPrice(product.basePrice, product.currency)}
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>

            {/* Pagination */}
            {pageInfo.totalPages > 1 && (
              <nav className="flex items-center justify-center gap-3 mt-10">
                <button
                  onClick={() => setPage((p) => p - 1)}
                  disabled={!pageInfo.hasPrevious}
                  className="flex items-center gap-1 px-3 py-2 rounded-full text-sm font-body font-medium text-gray-500 hover:text-brand-pink-500 hover:bg-brand-pink-50 disabled:opacity-30 disabled:pointer-events-none transition-all duration-200"
                >
                  <RiArrowLeftSLine className="w-4 h-4" />
                  Prev
                </button>
                <span className="font-body text-sm text-gray-500">
                  Page {pageInfo.page + 1} of {pageInfo.totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!pageInfo.hasNext}
                  className="flex items-center gap-1 px-3 py-2 rounded-full text-sm font-body font-medium text-gray-500 hover:text-brand-pink-500 hover:bg-brand-pink-50 disabled:opacity-30 disabled:pointer-events-none transition-all duration-200"
                >
                  Next
                  <RiArrowRightSLine className="w-4 h-4" />
                </button>
              </nav>
            )}
          </>
        )}
      </div>
    </section>
  )
}

export default FavouritesPage
