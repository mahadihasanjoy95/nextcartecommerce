import axios from 'axios'
import { API_BASE_URL, ENDPOINTS, TOKEN_KEYS } from '@/constants/api'

let refreshPromise = null

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 12_000,
  headers: {
    'Content-Type': 'application/json',
    Accept:         'application/json',
  },
})

// ── Request interceptor: attach access token ──────────────────────────────
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEYS.ACCESS)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Response interceptor: unwrap + 401 refresh handling ──────────────────
apiClient.interceptors.response.use(
  (response) => response.data,

  async (error) => {
    const original = error.config
    const status   = error.response?.status

    // Attempt silent token refresh on 401, but not if:
    // (a) this request was already retried, or
    // (b) the failing request was the refresh endpoint itself (prevent cycle)
    if (
      status === 401 &&
      !original._retry &&
      !original.url?.includes(ENDPOINTS.AUTH.REFRESH)
    ) {
      original._retry = true

      try {
        if (!refreshPromise) {
          const storedRefresh = localStorage.getItem(TOKEN_KEYS.REFRESH)

          if (!storedRefresh) {
            window.dispatchEvent(new Event('auth:logout'))
            return Promise.reject(new Error('Session expired. Please log in again.'))
          }

          // Inline the refresh call (not via authService) to avoid circular import
          refreshPromise = apiClient
            .post(ENDPOINTS.AUTH.REFRESH, { refreshToken: storedRefresh })
            .then((res) => {
              const tokens = res.data   // unwrap CommonApiResponse envelope
              localStorage.setItem(TOKEN_KEYS.ACCESS,  tokens.accessToken)
              localStorage.setItem(TOKEN_KEYS.REFRESH, tokens.refreshToken)
              return tokens.accessToken
            })
            .catch((err) => {
              localStorage.removeItem(TOKEN_KEYS.ACCESS)
              localStorage.removeItem(TOKEN_KEYS.REFRESH)
              window.dispatchEvent(new Event('auth:logout'))
              throw err
            })
            .finally(() => {
              refreshPromise = null
            })
        }

        const newAccessToken = await refreshPromise
        original.headers.Authorization = `Bearer ${newAccessToken}`
        return apiClient(original)
      } catch {
        return Promise.reject(new Error('Session expired. Please log in again.'))
      }
    }

    const message =
      error.response?.data?.error?.message ||
      error.response?.data?.message ||
      (error.code === 'ECONNABORTED' ? 'Request timed out. Please try again.' : null) ||
      error.message ||
      'Something went wrong. Please try again.'

    const appError = new Error(message)
    appError.code = error.response?.data?.error?.code || null
    return Promise.reject(appError)
  }
)

export default apiClient
