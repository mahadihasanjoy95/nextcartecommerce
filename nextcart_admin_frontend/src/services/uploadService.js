import apiClient from './apiClient'
import { ENDPOINTS } from '@/constants/api'

const uploadService = {
  uploadProfilePicture: async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    const res = await apiClient.post(ENDPOINTS.UPLOAD.PROFILE_PICTURE, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },

  // Generic uploads — no product ID, just returns S3 URL.
  // Use these BEFORE creating a product (upload-first pattern).
  uploadThumbnailGeneric: async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    const res = await apiClient.post(ENDPOINTS.UPLOAD.PRODUCT_THUMBNAIL_GENERIC, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60_000,
    })
    return res.data // { data: { key, url } }
  },

  uploadImagesGeneric: async (files) => {
    const formData = new FormData()
    files.forEach((file) => formData.append('files', file))
    const res = await apiClient.post(ENDPOINTS.UPLOAD.PRODUCT_IMAGES_GENERIC, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60_000,
    })
    return res.data // { data: [{ key, url }, ...] }
  },

  // Product-scoped uploads — links file to an existing product.
  // Use these on the EDIT page after the product already exists.
  uploadProductThumbnail: async (productId, file) => {
    const formData = new FormData()
    formData.append('file', file)
    const res = await apiClient.patch(ENDPOINTS.UPLOAD.PRODUCT_THUMBNAIL(productId), formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60_000,
    })
    return res.data
  },

  uploadProductImages: async (productId, files) => {
    const formData = new FormData()
    files.forEach((file) => formData.append('files', file))
    const res = await apiClient.post(ENDPOINTS.UPLOAD.PRODUCT_IMAGES(productId), formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60_000,
    })
    return res.data
  },
}

export default uploadService
