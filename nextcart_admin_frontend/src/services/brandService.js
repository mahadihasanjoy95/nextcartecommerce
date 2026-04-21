import apiClient from './apiClient'
import { ENDPOINTS } from '@/constants/api'

const brandService = {
  getBrands: async () => {
    const response = await apiClient.get(ENDPOINTS.BRANDS)
    return response.data ?? []
  },

  createBrand: async (payload) => {
    const response = await apiClient.post(ENDPOINTS.BRANDS, payload)
    return response.data
  },

  updateBrand: async (brandId, payload) => {
    const response = await apiClient.put(`${ENDPOINTS.BRANDS}/${brandId}`, payload)
    return response.data
  },

  deleteBrand: async (brandId) => {
    const response = await apiClient.delete(`${ENDPOINTS.BRANDS}/${brandId}`)
    return response.data
  },
}

export default brandService
