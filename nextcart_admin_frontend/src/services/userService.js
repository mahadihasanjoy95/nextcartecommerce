import apiClient from './apiClient'
import { ENDPOINTS } from '@/constants/api'

const userService = {
  getAdminUsers: async ({ page = 0, size = 20 } = {}) => {
    const res = await apiClient.get(ENDPOINTS.ADMIN_USERS, { params: { page, size } })
    return res.data
  },

  getCustomers: async ({ page = 0, size = 20 } = {}) => {
    const res = await apiClient.get(ENDPOINTS.CUSTOMERS, { params: { page, size } })
    return res.data
  },

  getUserById: async (id) => {
    const res = await apiClient.get(`${ENDPOINTS.USERS}/${id}`)
    return res.data
  },

  createAdmin: async ({ firstName, lastName, email, role }) => {
    const res = await apiClient.post(ENDPOINTS.USERS, { firstName, lastName, email, role })
    return res.data
  },

  assignRole: async (id, role) => {
    const res = await apiClient.put(`${ENDPOINTS.USERS}/${id}/role`, { role })
    return res.data
  },

  enableUser: async (id) => {
    const res = await apiClient.patch(`${ENDPOINTS.USERS}/${id}/enable`)
    return res.data
  },

  disableUser: async (id) => {
    const res = await apiClient.patch(`${ENDPOINTS.USERS}/${id}/disable`)
    return res.data
  },

  deleteUser: async (id) => {
    const res = await apiClient.delete(`${ENDPOINTS.USERS}/${id}`)
    return res.data
  },
}

export default userService
