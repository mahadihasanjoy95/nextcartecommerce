import apiClient from './apiClient'
import { ENDPOINTS } from '@/constants/api'

/**
 * Auth service — all HTTP calls unwrap the inner `data` field from
 * CommonApiResponse so callers receive the payload directly.
 *
 * apiClient interceptor returns:  { success, data, error, meta }
 * authService returns:            data  (the actual payload)
 */
const authService = {
  /** @returns {Promise<{accessToken, refreshToken, expiresIn, tokenType}>} */
  login: async (email, password) => {
    const res = await apiClient.post(ENDPOINTS.AUTH.LOGIN, { email, password })
    return res.data
  },

  /** @returns {Promise<void>} */
  logout: (refreshToken) =>
    apiClient.post(ENDPOINTS.AUTH.LOGOUT, { refreshToken }),

  /** @returns {Promise<{accessToken, refreshToken, expiresIn, tokenType}>} */
  refreshTokens: async (refreshToken) => {
    const res = await apiClient.post(ENDPOINTS.AUTH.REFRESH, { refreshToken })
    return res.data
  },

  /** @returns {Promise<UserProfile>} */
  getMe: async () => {
    const res = await apiClient.get(ENDPOINTS.AUTH.ME)
    return res.data
  },

  /** @returns {Promise<UserProfile>} */
  updateProfile: async ({ firstName, lastName, phone }) => {
    const res = await apiClient.patch(ENDPOINTS.AUTH.UPDATE_PROFILE, { firstName, lastName, phone })
    return res.data
  },

  /** @returns {Promise<void>} */
  changePassword: (currentPassword, newPassword) =>
    apiClient.patch(ENDPOINTS.AUTH.CHANGE_PASSWORD, { currentPassword, newPassword }),

  /** @returns {Promise<{type: string, message: string}>} type is "EMAIL_SENT" or "SOCIAL_ACCOUNT" */
  forgotPassword: async (email) => {
    const res = await apiClient.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email })
    return res.data
  },

  /** @returns {Promise<void>} */
  resetPassword: async (token, newPassword) => {
    const res = await apiClient.post(ENDPOINTS.AUTH.RESET_PASSWORD, { token, newPassword })
    return res.data
  },
}

export default authService
