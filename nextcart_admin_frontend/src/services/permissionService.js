import apiClient from './apiClient'
import { ENDPOINTS } from '@/constants/api'

const permissionService = {
  getAllPermissions: async () => {
    const res = await apiClient.get(ENDPOINTS.PERMISSIONS)
    return res.data
  },

  createPermission: async ({ code, description, module }) => {
    const res = await apiClient.post(ENDPOINTS.PERMISSIONS, { code, description, module })
    return res.data
  },
}

export default permissionService
