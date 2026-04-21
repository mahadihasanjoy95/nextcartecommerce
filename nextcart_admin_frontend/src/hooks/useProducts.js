import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import productService from '@/services/productService'

export function useProducts(params = {}) {
  return useQuery({
    queryKey: ['admin', 'products', params],
    queryFn: () => productService.getProducts(params),
    placeholderData: (prev) => prev,
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: productService.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ productId, payload }) => productService.updateProduct(productId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
      // Remove from cache entirely so the edit page always fetches fresh data on next visit
      queryClient.removeQueries({ queryKey: ['admin', 'product', String(variables.productId)] })
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: productService.deleteProduct,
    onSuccess: (_, productId) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
      queryClient.removeQueries({ queryKey: ['admin', 'product', String(productId)] })
    },
  })
}
