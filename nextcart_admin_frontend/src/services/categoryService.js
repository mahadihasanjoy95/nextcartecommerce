import apiClient from './apiClient'
import { ENDPOINTS } from '@/constants/api'

const categoryService = {
  getCategories: async () => {
    const response = await apiClient.get(ENDPOINTS.CATEGORIES)
    return response.data ?? []
  },

  createCategory: async (payload) => {
    const response = await apiClient.post(ENDPOINTS.CATEGORIES, payload)
    return response.data
  },

  updateCategory: async (categoryId, payload) => {
    const response = await apiClient.put(`${ENDPOINTS.CATEGORIES}/${categoryId}`, payload)
    return response.data
  },

  deleteCategory: async (categoryId) => {
    const response = await apiClient.delete(`${ENDPOINTS.CATEGORIES}/${categoryId}`)
    return response.data
  },
}

export default categoryService
