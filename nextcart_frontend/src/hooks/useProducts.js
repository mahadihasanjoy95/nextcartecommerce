import { useQuery } from '@tanstack/react-query'
import productService from '@/services/productService'
import { DEFAULT_PAGE_SIZE } from '@/constants/api'

/**
 * useProducts — fetches and caches the paginated product list.
 *
 * Query key includes [page, size] so navigating to a different page
 * triggers an independent cached fetch automatically.
 *
 * Usage:
 *   const { products, pageInfo, isLoading, isError, error } = useProducts()
 *   const { products } = useProducts({ page: 1, size: 8 })
 */
export function useProducts(params = {}) {
  const queryParams = {
    page:         params.page ?? 0,
    size:         params.size ?? DEFAULT_PAGE_SIZE,
    q:            params.q ?? '',
    categorySlug: params.categorySlug ?? '',
    brandSlug:    params.brandSlug ?? '',
    minPrice:     params.minPrice ?? '',
    maxPrice:     params.maxPrice ?? '',
    inStock:      params.inStock,
    onSale:       params.onSale,
    featured:     params.featured,
    newArrival:   params.newArrival,
    sortBy:       params.sortBy ?? 'NEWEST',
    sortDir:      params.sortDir ?? 'DESC',
  }

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ['products', queryParams],
    queryFn:  () => productService.getProducts(queryParams),
    // Keep previous page data visible while next page loads (smooth pagination)
    placeholderData: (prev) => prev,
  })

  return {
    products:  data?.content   ?? [],
    pageInfo: {
      page:          data?.page          ?? 0,
      size:          data?.size          ?? queryParams.size,
      totalElements: data?.totalElements ?? 0,
      totalPages:    data?.totalPages    ?? 0,
      hasNext:       data?.hasNext       ?? false,
      hasPrevious:   data?.hasPrevious   ?? false,
    },
    isLoading,   // true only on first fetch (no cached data yet)
    isFetching,  // true whenever a background refetch is happening
    isError,
    error,
  }
}

/**
 * useProductBySlug — fetches a single product by slug.
 * Disabled when slug is falsy so it's safe to call unconditionally.
 *
 * Usage:
 *   const { product, isLoading } = useProductBySlug(slug)
 */
export function useProductBySlug(slug) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['product', 'slug', slug],
    queryFn:  () => productService.getProductBySlug(slug),
    enabled:  Boolean(slug),
  })

  return { product: data ?? null, isLoading, isError, error }
}
