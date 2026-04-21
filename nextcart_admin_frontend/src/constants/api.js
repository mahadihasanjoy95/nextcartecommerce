export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'

export const ENDPOINTS = {
  CATEGORIES: '/api/v1/categories',
  BRANDS:     '/api/v1/brands',
  PRODUCTS:       '/api/v1/products',
  ADMIN_PRODUCTS: '/api/v1/products/admin',
  AUTH: {
    LOGIN:           '/api/v1/auth/login',
    LOGOUT:          '/api/v1/auth/logout',
    ME:              '/api/v1/auth/me',
    REFRESH:         '/api/v1/auth/refresh',
    UPDATE_PROFILE:  '/api/v1/auth/me',
    CHANGE_PASSWORD: '/api/v1/auth/me/password',
    FORGOT_PASSWORD: '/api/v1/auth/forgot-password',
    RESET_PASSWORD:  '/api/v1/auth/reset-password',
  },
  USERS:       '/api/v1/users',
  ADMIN_USERS: '/api/v1/users/admins',
  CUSTOMERS:   '/api/v1/users/customers',
  ROLES:       '/api/v1/roles',
  PERMISSIONS: '/api/v1/permissions',
  API_MAPS:    '/api/v1/api-permission-maps',
  UPLOAD: {
    PROFILE_PICTURE:          '/api/v1/upload/profile-picture',
    // Generic — upload only, returns { key, url }. Use before product creation.
    PRODUCT_THUMBNAIL_GENERIC: '/api/v1/upload/product-thumbnail',
    PRODUCT_IMAGES_GENERIC:    '/api/v1/upload/product-images',
    // Product-scoped — upload + link to existing product. Use on edit page.
    PRODUCT_THUMBNAIL: (id) => `/api/v1/products/${id}/thumbnail`,
    PRODUCT_IMAGES:    (id) => `/api/v1/products/${id}/images`,
  },
}

export const TOKEN_KEYS = {
  ACCESS:  'nc_admin_token',
  REFRESH: 'nc_admin_refresh',
}

// Any role except CUSTOMER can access the admin panel
export const BLOCKED_ROLES = ['CUSTOMER']
