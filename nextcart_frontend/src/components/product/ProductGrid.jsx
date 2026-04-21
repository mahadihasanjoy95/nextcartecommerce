import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiEqualizerLine,
  RiFilter3Line,
  RiSearchLine,
  RiCloseLine,
} from 'react-icons/ri'
import ProductCard from './ProductCard'
import Loader from '@/components/common/Loader'
import EmptyState from '@/components/common/EmptyState'
import ErrorDisplay from '@/components/common/ErrorDisplay'
import SectionTitle from '@/components/common/SectionTitle'
import { PRODUCT_FILTERS } from '@/constants/app'
import { DEFAULT_PAGE_SIZE } from '@/constants/api'
import { useProducts } from '@/hooks/useProducts'

const VALID_FILTERS = ['all', 'featured', 'new', 'sale']
const SORT_OPTIONS = [
  { value: 'NEWEST_DESC', label: 'Newest First', sortBy: 'NEWEST', sortDir: 'DESC' },
  { value: 'PRICE_ASC', label: 'Price: Low to High', sortBy: 'PRICE', sortDir: 'ASC' },
  { value: 'PRICE_DESC', label: 'Price: High to Low', sortBy: 'PRICE', sortDir: 'DESC' },
  { value: 'NAME_ASC', label: 'Name: A to Z', sortBy: 'NAME', sortDir: 'ASC' },
]

function buildPageItems(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const items = []
  const showLeft = current > 3
  const showRight = current < total - 2
  items.push(1)
  if (showLeft) items.push('...')
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  for (let p = start; p <= end; p++) items.push(p)
  if (showRight) items.push('...')
  items.push(total)
  return items
}

function Pagination({ current, total, onPageChange }) {
  if (total <= 1) return null

  const items = buildPageItems(current, total)

  return (
    <nav aria-label="Product pagination" className="flex items-center justify-center gap-1.5 mt-10 flex-wrap">
      <button
        onClick={() => onPageChange(current - 1)}
        disabled={current === 1}
        aria-label="Previous page"
        className="flex items-center gap-1 px-3 py-2 rounded-full text-sm font-body font-medium
                   text-gray-500 hover:text-brand-pink-500 hover:bg-brand-pink-50
                   disabled:opacity-30 disabled:pointer-events-none transition-all duration-200"
      >
        <RiArrowLeftSLine className="w-4 h-4" />
        <span className="hidden sm:inline">Prev</span>
      </button>

      {items.map((item, idx) =>
        item === '...' ? (
          <span key={`ellipsis-${idx}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm select-none">
            ...
          </span>
        ) : (
          <button
            key={item}
            onClick={() => onPageChange(item)}
            aria-label={`Page ${item}`}
            aria-current={item === current ? 'page' : undefined}
            className={`w-9 h-9 rounded-full text-sm font-body font-semibold transition-all duration-200 ${
              item === current
                ? 'bg-brand-pink-500 text-white shadow-sm shadow-brand-pink-200'
                : 'text-gray-600 hover:text-brand-pink-500 hover:bg-brand-pink-50'
            }`}
          >
            {item}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(current + 1)}
        disabled={current === total}
        aria-label="Next page"
        className="flex items-center gap-1 px-3 py-2 rounded-full text-sm font-body font-medium
                   text-gray-500 hover:text-brand-pink-500 hover:bg-brand-pink-50
                   disabled:opacity-30 disabled:pointer-events-none transition-all duration-200"
      >
        <span className="hidden sm:inline">Next</span>
        <RiArrowRightSLine className="w-4 h-4" />
      </button>
    </nav>
  )
}

function parseBoolean(value) {
  if (value === 'true') return true
  if (value === 'false') return false
  return undefined
}

function sortValueFromParams(sortBy, sortDir) {
  return SORT_OPTIONS.find((option) => option.sortBy === sortBy && option.sortDir === sortDir)?.value || 'NEWEST_DESC'
}

function ProductGrid() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  const pageFromUrl = Math.max(1, Number(searchParams.get('page') || '1'))
  const activeFilter = VALID_FILTERS.includes(searchParams.get('filter')) ? searchParams.get('filter') : 'all'
  const keyword = searchParams.get('q') || ''
  const categorySlug = searchParams.get('category') || ''
  const brandSlug = searchParams.get('brand') || ''
  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''
  const inStock = parseBoolean(searchParams.get('inStock'))
  const sortBy = searchParams.get('sortBy') || 'NEWEST'
  const sortDir = searchParams.get('sortDir') || 'DESC'
  const selectedSort = sortValueFromParams(sortBy, sortDir)

  const [searchInput, setSearchInput] = useState(keyword)
  const [filterDraft, setFilterDraft] = useState({
    categorySlug,
    brandSlug,
    minPrice,
    maxPrice,
    inStock: inStock === undefined ? 'all' : String(inStock),
    sort: selectedSort,
  })

  useEffect(() => {
    setSearchInput(keyword)
  }, [keyword])

  useEffect(() => {
    setFilterDraft({
      categorySlug,
      brandSlug,
      minPrice,
      maxPrice,
      inStock: inStock === undefined ? 'all' : String(inStock),
      sort: selectedSort,
    })
  }, [categorySlug, brandSlug, minPrice, maxPrice, inStock, selectedSort])

  const apiParams = useMemo(() => {
    const quickFilters = {
      featured: activeFilter === 'featured' ? true : undefined,
      newArrival: activeFilter === 'new' ? true : undefined,
      onSale: activeFilter === 'sale' ? true : undefined,
    }

    return {
      page: pageFromUrl - 1,
      size: DEFAULT_PAGE_SIZE,
      q: keyword || undefined,
      categorySlug: categorySlug || undefined,
      brandSlug: brandSlug || undefined,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
      inStock,
      sortBy,
      sortDir,
      ...quickFilters,
    }
  }, [activeFilter, pageFromUrl, keyword, categorySlug, brandSlug, minPrice, maxPrice, inStock, sortBy, sortDir])

  const { products, pageInfo, isLoading, isError, error, isFetching } = useProducts(apiParams)

  useEffect(() => {
    const hasSearchContext =
      keyword || activeFilter !== 'all' || categorySlug || brandSlug || minPrice || maxPrice || pageFromUrl > 1

    if (!hasSearchContext) return

    const timer = setTimeout(() => {
      document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 120)

    return () => clearTimeout(timer)
  }, [keyword, activeFilter, categorySlug, brandSlug, minPrice, maxPrice, pageFromUrl])

  const updateSearchParams = (updates, { resetPage = false } = {}) => {
    const next = new URLSearchParams(searchParams)

    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '' || value === 'all') {
        next.delete(key)
      } else {
        next.set(key, String(value))
      }
    })

    if (resetPage) {
      next.delete('page')
    }

    setSearchParams(next)
  }

  const handleSearchSubmit = (event) => {
    event.preventDefault()
    updateSearchParams({ q: searchInput.trim() }, { resetPage: true })
  }

  const handleQuickFilterChange = (filterKey) => {
    updateSearchParams({ filter: filterKey === 'all' ? '' : filterKey }, { resetPage: true })
  }

  const handleApplyFilters = (event) => {
    event.preventDefault()

    const selectedSortOption = SORT_OPTIONS.find((option) => option.value === filterDraft.sort) || SORT_OPTIONS[0]

    updateSearchParams({
      category: filterDraft.categorySlug.trim(),
      brand: filterDraft.brandSlug.trim(),
      minPrice: filterDraft.minPrice,
      maxPrice: filterDraft.maxPrice,
      inStock: filterDraft.inStock,
      sortBy: selectedSortOption.sortBy,
      sortDir: selectedSortOption.sortDir,
    }, { resetPage: true })
  }

  const handleResetFilters = () => {
    setSearchInput('')
    setFilterDraft({
      categorySlug: '',
      brandSlug: '',
      minPrice: '',
      maxPrice: '',
      inStock: 'all',
      sort: 'NEWEST_DESC',
    })
    setSearchParams(new URLSearchParams())
  }

  const activeFilterCount = [
    keyword,
    activeFilter !== 'all' ? activeFilter : '',
    categorySlug,
    brandSlug,
    minPrice,
    maxPrice,
    inStock !== undefined ? String(inStock) : '',
    selectedSort !== 'NEWEST_DESC' ? selectedSort : '',
  ].filter(Boolean).length

  return (
    <section id="products" className="section-gap bg-surface scroll-mt-24">
      <div className="page-container">
        <div className="flex flex-col items-center gap-8 mb-10">
          <SectionTitle
            eyebrow="Handpicked For You"
            title="Explore Our Collection"
            subtitle="Search, sort, and refine the catalog with live backend-powered results."
          />

          <div className="w-full max-w-5xl space-y-4">
            <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
              <label className="flex-1">
                <span className="sr-only">Search products</span>
                <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm focus-within:border-brand-pink-300 focus-within:ring-2 focus-within:ring-brand-pink-100 transition-all duration-200">
                  <RiSearchLine className="w-5 h-5 text-gray-400" />
                  <input
                    type="search"
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    placeholder="Search by product, brand, category, or keyword"
                    className="w-full bg-transparent font-body text-sm text-gray-700 placeholder:text-gray-400 outline-none"
                  />
                  {searchInput && (
                    <button
                      type="button"
                      onClick={() => setSearchInput('')}
                      className="text-gray-400 hover:text-gray-600 transition-colors duration-150"
                      aria-label="Clear search"
                    >
                      <RiCloseLine className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </label>

              <div className="flex gap-3">
                <button type="submit" className="btn-primary px-5 py-3 text-sm shrink-0">
                  <RiSearchLine className="w-4 h-4" />
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => setIsFiltersOpen((prev) => !prev)}
                  className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-body font-semibold transition-all duration-200 ${
                    isFiltersOpen || activeFilterCount > 0
                      ? 'border-brand-pink-300 bg-brand-pink-50 text-brand-pink-600'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-brand-pink-200 hover:text-brand-pink-500'
                  }`}
                >
                  <RiFilter3Line className="w-4 h-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="inline-flex min-w-5 h-5 items-center justify-center rounded-full bg-brand-pink-500 px-1.5 text-[11px] text-white">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>
            </form>

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-2 bg-white p-1.5 rounded-full shadow-sm border border-gray-100 flex-wrap justify-center">
                {PRODUCT_FILTERS.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => handleQuickFilterChange(key)}
                    className={`font-body text-sm font-medium px-5 py-2 rounded-full transition-all duration-200 ${
                      activeFilter === key
                        ? 'bg-brand-pink-500 text-white shadow-sm'
                        : 'text-gray-500 hover:text-brand-pink-500 hover:bg-brand-pink-50'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 text-sm font-body text-gray-500">
                <RiEqualizerLine className="w-4 h-4 text-brand-pink-400" />
                <span>
                  {isFetching ? 'Refreshing results...' : `${pageInfo.totalElements} products found`}
                </span>
              </div>
            </div>

            {isFiltersOpen && (
              <form onSubmit={handleApplyFilters} className="rounded-3xl border border-gray-200 bg-white p-4 sm:p-5 shadow-card animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-body font-semibold uppercase tracking-[0.18em] text-gray-400">
                      Category
                    </span>
                    <input
                      type="text"
                      value={filterDraft.categorySlug}
                      onChange={(event) => setFilterDraft((prev) => ({ ...prev, categorySlug: event.target.value }))}
                      placeholder="e.g. dresses"
                      className="rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none transition-all duration-200 focus:border-brand-pink-300 focus:ring-2 focus:ring-brand-pink-100"
                    />
                  </label>

                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-body font-semibold uppercase tracking-[0.18em] text-gray-400">
                      Brand
                    </span>
                    <input
                      type="text"
                      value={filterDraft.brandSlug}
                      onChange={(event) => setFilterDraft((prev) => ({ ...prev, brandSlug: event.target.value }))}
                      placeholder="e.g. zara"
                      className="rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none transition-all duration-200 focus:border-brand-pink-300 focus:ring-2 focus:ring-brand-pink-100"
                    />
                  </label>

                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-body font-semibold uppercase tracking-[0.18em] text-gray-400">
                      Min Price
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={filterDraft.minPrice}
                      onChange={(event) => setFilterDraft((prev) => ({ ...prev, minPrice: event.target.value }))}
                      placeholder="0"
                      className="rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none transition-all duration-200 focus:border-brand-pink-300 focus:ring-2 focus:ring-brand-pink-100"
                    />
                  </label>

                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-body font-semibold uppercase tracking-[0.18em] text-gray-400">
                      Max Price
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={filterDraft.maxPrice}
                      onChange={(event) => setFilterDraft((prev) => ({ ...prev, maxPrice: event.target.value }))}
                      placeholder="5000"
                      className="rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none transition-all duration-200 focus:border-brand-pink-300 focus:ring-2 focus:ring-brand-pink-100"
                    />
                  </label>

                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-body font-semibold uppercase tracking-[0.18em] text-gray-400">
                      Availability
                    </span>
                    <select
                      value={filterDraft.inStock}
                      onChange={(event) => setFilterDraft((prev) => ({ ...prev, inStock: event.target.value }))}
                      className="rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none transition-all duration-200 focus:border-brand-pink-300 focus:ring-2 focus:ring-brand-pink-100"
                    >
                      <option value="all">All stock states</option>
                      <option value="true">In stock only</option>
                      <option value="false">Out of stock</option>
                    </select>
                  </label>
                </div>

                <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <label className="flex flex-col gap-1.5 md:min-w-[260px]">
                    <span className="text-xs font-body font-semibold uppercase tracking-[0.18em] text-gray-400">
                      Sort By
                    </span>
                    <select
                      value={filterDraft.sort}
                      onChange={(event) => setFilterDraft((prev) => ({ ...prev, sort: event.target.value }))}
                      className="rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none transition-all duration-200 focus:border-brand-pink-300 focus:ring-2 focus:ring-brand-pink-100"
                    >
                      {SORT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="btn-outline px-5 py-3 text-sm"
                    >
                      Reset All
                    </button>
                    <button type="submit" className="btn-primary px-5 py-3 text-sm">
                      Apply Filters
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>

        {isLoading ? (
          <Loader count={DEFAULT_PAGE_SIZE} />
        ) : isError ? (
          <ErrorDisplay error={error} onRetry={() => window.location.reload()} />
        ) : products.length === 0 ? (
          <EmptyState
            title="No matching products found"
            message="Try a broader keyword, remove a few filters, or reset the search to explore everything."
            onReset={handleResetFilters}
          />
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6 animate-fade-in">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <Pagination
              current={pageFromUrl}
              total={Math.max(pageInfo.totalPages, 1)}
              onPageChange={(page) => updateSearchParams({ page }, { resetPage: false })}
            />

            <p className="text-center text-xs text-gray-400 font-body mt-4">
              Page {pageFromUrl} of {Math.max(pageInfo.totalPages, 1)} - {pageInfo.totalElements} products total
            </p>
          </>
        )}
      </div>
    </section>
  )
}

export default ProductGrid
