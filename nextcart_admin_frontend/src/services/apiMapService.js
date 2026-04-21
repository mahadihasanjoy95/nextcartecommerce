import apiClient from './apiClient'
import { ENDPOINTS } from '@/constants/api'

const apiMapService = {
  getAll: async () => {
    const res = await apiClient.get(ENDPOINTS.API_MAPS)
    return res.data  // ApiPermissionMapResponseDto[]
  },

  create: async (payload) => {
    const res = await apiClient.post(ENDPOINTS.API_MAPS, payload)
    return res.data
  },

  update: async (id, payload) => {
    const res = await apiClient.patch(`${ENDPOINTS.API_MAPS}/${id}`, payload)
    return res.data
  },

  delete: async (id) => {
    await apiClient.delete(`${ENDPOINTS.API_MAPS}/${id}`)
  },
}

export default apiMapService
