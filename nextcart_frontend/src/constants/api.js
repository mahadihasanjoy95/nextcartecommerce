/**
 * API constants — single source of truth for all backend endpoints.
 *
 * BASE_URL is read from the .env file so switching between
 * local / staging / production only requires an env change.
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'

export const ENDPOINTS = {
  PRODUCTS:        '/api/v1/products',
  PRODUCT_BY_SLUG: '/api/v1/products/slug',
  AUTH: {
    REGISTER:        '/api/v1/auth/register',
    LOGIN:           '/api/v1/auth/login',
    LOGOUT:          '/api/v1/auth/logout',
    REFRESH:         '/api/v1/auth/refresh',
    ME:              '/api/v1/auth/me',
    UPDATE_PROFILE:  '/api/v1/auth/me',
    CHANGE_PASSWORD: '/api/v1/auth/me/password',
    FORGOT_PASSWORD: '/api/v1/auth/forgot-password',
    RESET_PASSWORD:  '/api/v1/auth/reset-password',
  },
}

export const TOKEN_KEYS = {
  ACCESS:  'nc_token',
  REFRESH: 'nc_refresh',
}

/** Google OAuth2 — redirects the browser to the backend which initiates the Google consent flow */
export const GOOGLE_LOGIN_URL = `${API_BASE_URL}/oauth2/authorization/google`

/** Default pagination applied to the product list API call — 4×4 grid */
export const DEFAULT_PAGE_SIZE = 16
