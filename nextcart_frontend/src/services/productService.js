import apiClient from './apiClient'
import { ENDPOINTS, DEFAULT_PAGE_SIZE } from '@/constants/api'

/**
 * productService — all product-related API calls.
 *
 * Backend response shape (CommonApiResponse + PageResponse):
 * {
 *   success: true,
 *   data: {
 *     content:       Product[],
 *     page:          number,
 *     size:          number,
 *     totalElements: number,
 *     totalPages:    number,
 *     first:         boolean,
 *     last:          boolean,
 *     hasNext:       boolean,
 *     hasPrevious:   boolean,
 *   }
 * }
 *
 * Single product response shape:
 * { success: true, data: Product }
 */
const productService = {
  /**
   * Fetch paginated list of ACTIVE products with search, filters, and sorting.
   * Only non-empty params are sent to the backend.
   *
   * @param {object} params
   * @returns {Promise<PageResponse>} the `data` field of the backend response
   */
  getProducts: async (params = {}) => {
    const requestParams = Object.fromEntries(
      Object.entries({
        page: params.page ?? 0,
        size: params.size ?? DEFAULT_PAGE_SIZE,
        q: params.q,
        categorySlug: params.categorySlug,
        brandSlug: params.brandSlug,
        minPrice: params.minPrice,
        maxPrice: params.maxPrice,
        inStock: params.inStock,
        onSale: params.onSale,
        featured: params.featured,
        newArrival: params.newArrival,
        sortBy: params.sortBy,
        sortDir: params.sortDir,
      }).filter(([, value]) => value !== undefined && value !== null && value !== '')
    )

    const response = await apiClient.get(ENDPOINTS.PRODUCTS, {
      params: requestParams,
    })
    return response.data // PageResponse<Product>
  },

  /**
   * Fetch a single ACTIVE product by its numeric ID.
   * @param {number|string} id
   * @returns {Promise<Product>}
   */
  getProductById: async (id) => {
    const response = await apiClient.get(`${ENDPOINTS.PRODUCTS}/${id}`)
    return response.data // Product
  },

  /**
   * Fetch a single ACTIVE product by its URL slug.
   * @param {string} slug
   * @returns {Promise<Product>}
   */
  getProductBySlug: async (slug) => {
    const response = await apiClient.get(`${ENDPOINTS.PRODUCT_BY_SLUG}/${slug}`)
    return response.data // Product
  },
}

export default productService
