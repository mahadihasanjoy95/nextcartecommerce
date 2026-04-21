import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import bookmarkService from '@/services/bookmarkService'
import { useAuth } from '@/hooks/useAuth'

const BookmarkContext = createContext(null)

export function BookmarkProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const queryClient = useQueryClient()
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set())
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      setBookmarkedIds(new Set())
      return
    }

    setIsLoading(true)
    bookmarkService.getBookmarkedIds()
      .then((ids) => setBookmarkedIds(new Set(ids)))
      .catch(() => setBookmarkedIds(new Set()))
      .finally(() => setIsLoading(false))
  }, [isAuthenticated])

  const isBookmarked = useCallback(
    (productId) => bookmarkedIds.has(Number(productId)),
    [bookmarkedIds]
  )

  const toggleBookmark = useCallback(async (productId) => {
    const id = Number(productId)
    const wasBookmarked = bookmarkedIds.has(id)

    // Optimistic update
    setBookmarkedIds((prev) => {
      const next = new Set(prev)
      if (wasBookmarked) next.delete(id)
      else next.add(id)
      return next
    })

    try {
      if (wasBookmarked) {
        await bookmarkService.removeBookmark(id)
      } else {
        await bookmarkService.addBookmark(id)
      }
      // Invalidate favourites page cache so it re-fetches
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] })
    } catch {
      // Roll back optimistic update on error
      setBookmarkedIds((prev) => {
        const next = new Set(prev)
        if (wasBookmarked) next.add(id)
        else next.delete(id)
        return next
      })
    }
  }, [bookmarkedIds, queryClient])

  const value = {
    bookmarkedIds,
    bookmarkedCount: bookmarkedIds.size,
    isLoading,
    isBookmarked,
    toggleBookmark,
  }

  return (
    <BookmarkContext.Provider value={value}>
      {children}
    </BookmarkContext.Provider>
  )
}

export function useBookmarkContext() {
  const ctx = useContext(BookmarkContext)
  if (!ctx) throw new Error('useBookmarkContext must be used inside BookmarkProvider')
  return ctx
}
