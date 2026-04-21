import apiClient from './apiClient'
import { ENDPOINTS } from '@/constants/api'

const roleService = {
  getAllRoles: async () => {
    const res = await apiClient.get(ENDPOINTS.ROLES)
    return res.data
  },

  createRole: async ({ name, description }) => {
    const res = await apiClient.post(ENDPOINTS.ROLES, { name, description })
    return res.data
  },

  deleteRole: async (roleId) => {
    const res = await apiClient.delete(`${ENDPOINTS.ROLES}/${roleId}`)
    return res.data
  },
  getRolePermissions: async (roleId) => {
    const res = await apiClient.get(`${ENDPOINTS.ROLES}/${roleId}/permissions`)
    return res.data
  },

  assignRolePermissions: async (roleId, permissionIds) => {
    const res = await apiClient.put(`${ENDPOINTS.ROLES}/${roleId}/permissions`, { permissionIds })
    return res.data
  },
}

export default roleService
