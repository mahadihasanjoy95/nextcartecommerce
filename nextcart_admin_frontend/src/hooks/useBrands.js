import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import brandService from '@/services/brandService'

export function useBrands() {
  return useQuery({
    queryKey: ['admin', 'brands'],
    queryFn: brandService.getBrands,
    select: (data) => [...(data ?? [])].sort((a, b) => b.id - a.id),
  })
}

export function useCreateBrand() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: brandService.createBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'brands'] })
    },
  })
}

export function useUpdateBrand() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ brandId, payload }) => brandService.updateBrand(brandId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'brands'] })
    },
  })
}

export function useDeleteBrand() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: brandService.deleteBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'brands'] })
    },
  })
}
