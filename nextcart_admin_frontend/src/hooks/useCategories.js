import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import categoryService from '@/services/categoryService'

export function useCategories() {
  return useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: categoryService.getCategories,
    select: (data) => [...(data ?? [])].sort((a, b) => b.id - a.id),
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: categoryService.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] })
    },
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ categoryId, payload }) => categoryService.updateCategory(categoryId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] })
    },
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: categoryService.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] })
    },
  })
}
