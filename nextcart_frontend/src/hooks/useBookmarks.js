import { useQuery } from '@tanstack/react-query'
import bookmarkService from '@/services/bookmarkService'
import { DEFAULT_PAGE_SIZE } from '@/constants/api'

export function useBookmarks(params = {}) {
  const queryParams = {
    page: params.page ?? 0,
    size: params.size ?? DEFAULT_PAGE_SIZE,
  }

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ['bookmarks', queryParams],
    queryFn:  () => bookmarkService.getBookmarks(queryParams),
    placeholderData: (prev) => prev,
  })

  return {
    bookmarks:  data?.content   ?? [],
    pageInfo: {
      page:          data?.page          ?? 0,
      size:          data?.size          ?? queryParams.size,
      totalElements: data?.totalElements ?? 0,
      totalPages:    data?.totalPages    ?? 0,
      hasNext:       data?.hasNext       ?? false,
      hasPrevious:   data?.hasPrevious   ?? false,
    },
    isLoading,
    isFetching,
    isError,
    error,
  }
}
