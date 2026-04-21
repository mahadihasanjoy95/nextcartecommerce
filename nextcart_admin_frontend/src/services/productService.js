import apiClient from './apiClient'
import { ENDPOINTS } from '@/constants/api'

const productService = {
  getProducts: async (params = {}) => {
    const requestParams = Object.fromEntries(
      Object.entries({
        page: params.page ?? 0,
        size: params.size ?? 12,
        q: params.q,
        categorySlug: params.categorySlug,
        brandSlug: params.brandSlug,
        status: params.status,
        inStock: params.inStock,
        sortBy: params.sortBy,
        sortDir: params.sortDir,
      }).filter(([, value]) => value !== undefined && value !== null && value !== '')
    )

    const response = await apiClient.get(ENDPOINTS.ADMIN_PRODUCTS, { params: requestParams })
    return response.data
  },

  createProduct: async (payload) => {
    const response = await apiClient.post(ENDPOINTS.PRODUCTS, payload)
    return response.data
  },

  getProductById: async (productId) => {
    const response = await apiClient.get(`${ENDPOINTS.ADMIN_PRODUCTS}/${productId}`)
    return response.data  // uses /api/v1/products/admin/{id} — returns any status
  },

  updateProduct: async (productId, payload) => {
    const response = await apiClient.put(`${ENDPOINTS.PRODUCTS}/${productId}`, payload)
    return response.data
  },

  deleteProduct: async (productId) => {
    const response = await apiClient.delete(`${ENDPOINTS.PRODUCTS}/${productId}`)
    return response.data
  },

  deleteProductThumbnail: async (productId) => {
    const response = await apiClient.delete(`${ENDPOINTS.PRODUCTS}/${productId}/thumbnail`)
    return response.data
  },

  deleteProductImages: async (productId) => {
    const response = await apiClient.delete(`${ENDPOINTS.PRODUCTS}/${productId}/images`)
    return response.data
  },
}

export default productService
