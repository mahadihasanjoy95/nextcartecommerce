import apiClient from './apiClient'
import { ENDPOINTS } from '@/constants/api'

const bookmarkService = {
  addBookmark: async (productId) => {
    await apiClient.post(`${ENDPOINTS.BOOKMARKS}/${productId}`)
  },

  removeBookmark: async (productId) => {
    await apiClient.delete(`${ENDPOINTS.BOOKMARKS}/${productId}`)
  },

  // Returns PageResponse<BookmarkedProductResponseDto>
  getBookmarks: async ({ page = 0, size = 16 } = {}) => {
    const response = await apiClient.get(ENDPOINTS.BOOKMARKS, { params: { page, size } })
    return response.data
  },

  // Returns Long[] — the bookmarked product IDs for the current user
  getBookmarkedIds: async () => {
    const response = await apiClient.get(ENDPOINTS.BOOKMARK_IDS)
    return response.data
  },

  // Returns BookmarkStatusResponseDto
  getBookmarkStatus: async (productId) => {
    const response = await apiClient.get(`${ENDPOINTS.BOOKMARKS}/${productId}/status`)
    return response.data
  },
}

export default bookmarkService
