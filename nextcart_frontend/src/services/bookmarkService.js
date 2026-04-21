import apiClient from './apiClient'
import { ENDPOINTS } from '@/constants/api'

const bookmarkService = {
  addBookmark: (productId) =>
    apiClient.post(`${ENDPOINTS.BOOKMARKS}/${productId}`),

  removeBookmark: (productId) =>
    apiClient.delete(`${ENDPOINTS.BOOKMARKS}/${productId}`),

  getBookmarks: ({ page = 0, size = 16 } = {}) =>
    apiClient.get(ENDPOINTS.BOOKMARKS, { params: { page, size } }),

  getBookmarkedIds: () =>
    apiClient.get(ENDPOINTS.BOOKMARK_IDS),

  getBookmarkStatus: (productId) =>
    apiClient.get(`${ENDPOINTS.BOOKMARKS}/${productId}/status`),
}

export default bookmarkService
