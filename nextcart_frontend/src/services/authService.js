import apiClient from './apiClient'
import { ENDPOINTS } from '@/constants/api'

const authService = {
  register: async (firstName, lastName, email, password) => {
    const res = await apiClient.post(ENDPOINTS.AUTH.REGISTER, { firstName, lastName, email, password })
    return res.data
  },

  login: async (email, password) => {
    const res = await apiClient.post(ENDPOINTS.AUTH.LOGIN, { email, password })
    return res.data
  },

  logout: (refreshToken) =>
    apiClient.post(ENDPOINTS.AUTH.LOGOUT, { refreshToken }),

  refreshTokens: async (refreshToken) => {
    const res = await apiClient.post(ENDPOINTS.AUTH.REFRESH, { refreshToken })
    return res.data
  },

  getMe: async () => {
    const res = await apiClient.get(ENDPOINTS.AUTH.ME)
    return res.data
  },

  updateProfile: async ({ firstName, lastName, phone }) => {
    const res = await apiClient.patch(ENDPOINTS.AUTH.UPDATE_PROFILE, { firstName, lastName, phone })
    return res.data
  },

  changePassword: (currentPassword, newPassword) =>
    apiClient.patch(ENDPOINTS.AUTH.CHANGE_PASSWORD, { currentPassword, newPassword }),

  /** @returns {Promise<{type: string, message: string}>} type is "EMAIL_SENT" or "SOCIAL_ACCOUNT" */
  forgotPassword: async (email) => {
    const res = await apiClient.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email })
    return res.data
  },

  resetPassword: async (token, newPassword) => {
    const res = await apiClient.post(ENDPOINTS.AUTH.RESET_PASSWORD, { token, newPassword })
    return res.data
  },
}

export default authService
