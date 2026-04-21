import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  RiArrowLeftLine,
  RiSaveLine,
  RiUploadCloud2Line,
  RiImageLine,
  RiCloseLine,
  RiAddLine,
  RiInformationLine,
} from 'react-icons/ri'
import PageHeader    from '@/components/common/PageHeader'
import InputField    from '@/components/common/InputField'
import SelectField   from '@/components/common/SelectField'
import TextareaField from '@/components/common/TextareaField'
import Button        from '@/components/common/Button'
import Toggle        from '@/components/common/Toggle'
import ErrorState    from '@/components/common/ErrorState'
import { useCategories }                   from '@/hooks/useCategories'
import { useBrands }                       from '@/hooks/useBrands'
import { useCreateProduct, useUpdateProduct } from '@/hooks/useProducts'
import productService  from '@/services/productService'
import uploadService   from '@/services/uploadService'
import { resizeImage } from '@/utils/imageResize'
import { useToast }    from '@/context/ToastContext'

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────
const ALLOWED_TYPES   = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE_BYTES  = 10 * 1024 * 1024 // 10 MB
const MAX_GALLERY     = 10

function validateImageFile(file) {
  if (!ALLOWED_TYPES.includes(file.type)) return 'Only JPEG, PNG, and WebP images are allowed.'
  if (file.size > MAX_SIZE_BYTES)         return 'Image must be under 10 MB.'
  return null
}

// ─────────────────────────────────────────────────────────────────────────────
// Section card wrapper
// ─────────────────────────────────────────────────────────────────────────────
function Card({ title, description, children }) {
  return (
    <div className="rounded-xl border border-admin-border bg-white shadow-card">
      {(title || description) && (
        <div className="px-5 py-4 border-b border-admin-border">
          {title       && <h3 className="text-sm font-semibold text-admin-text">{title}</h3>}
          {description && <p className="mt-0.5 text-xs text-admin-textSub">{description}</p>}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Thumbnail upload zone
// ─────────────────────────────────────────────────────────────────────────────
function ThumbnailZone({ currentUrl, file, preview, onSelect, onClear, error }) {
  const inputRef = useRef(null)
  const displayUrl = preview || currentUrl // local preview wins

  const handleChange = (e) => {
    const f = e.target.files?.[0]
    if (f) onSelect(f)
    e.target.value = ''
  }

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-admin-text">Thumbnail</label>

      {displayUrl ? (
        <div className="relative overflow-hidden rounded-lg border border-admin-border bg-gray-50 aspect-video">
          <img src={displayUrl} alt="Thumbnail preview" className="h-full w-full object-cover" />

          {/* Action chips */}
          <div className="absolute top-2 right-2 flex gap-1.5">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-md bg-white/90 px-2.5 py-1 text-xs font-medium text-admin-text shadow-sm backdrop-blur hover:bg-white transition-colors"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={onClear}
              className="rounded-md bg-white/90 px-2.5 py-1 text-xs font-medium text-admin-danger shadow-sm backdrop-blur hover:bg-white transition-colors"
            >
              Remove
            </button>
          </div>

          {/* File name badge (only for newly selected files) */}
          {file && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 px-3 py-2">
              <p className="truncate text-xs text-white">{file.name}</p>
            </div>
          )}

          {/* "Current" badge for existing saved image */}
          {!file && currentUrl && (
            <span className="absolute bottom-2 left-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] text-white/80 backdrop-blur">
              Current
            </span>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center gap-2 rounded-lg border-2 border-dashed border-admin-border bg-admin-surface p-8 text-center transition-colors hover:border-admin-primary hover:bg-admin-priLight/20"
        >
          <RiUploadCloud2Line className="h-8 w-8 text-admin-textMuted" />
          <span className="text-sm font-medium text-admin-textSub">Click to upload thumbnail</span>
          <span className="text-xs text-admin-textMuted">JPEG, PNG, WebP · max 10 MB</span>
        </button>
      )}

      {error && <p className="text-xs text-admin-danger">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Gallery multi-upload zone
// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function GalleryZone({
  currentUrls = [],
  files,
  previews,
  onAdd,
  onRemove,
  onClearNew,
  onRemoveSaved,  // (url: string) => void — removes a single saved image
  error,
}) {
  const inputRef = useRef(null)

  const hasNewFiles = files.length > 0
  const displayItems = [
    ...currentUrls.map((url) => ({ url, isNew: false, savedUrl: url })),
    ...previews.map((url, i) => ({ url, isNew: true, index: i })),
  ]
  const canAddMore = displayItems.length < MAX_GALLERY

  const handleChange = (e) => {
    const selected = Array.from(e.target.files)
    if (selected.length) onAdd(selected)
    e.target.value = ''
  }

  return (
    <div className="space-y-2">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-admin-text">Gallery Images</label>
        <span className="text-xs text-admin-textMuted">{displayItems.length}/{MAX_GALLERY}</span>
      </div>

      {/* Grid of images */}
      {displayItems.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {displayItems.map((item, i) => (
            <div key={`${item.url}-${i}`} className="relative aspect-square overflow-hidden rounded-lg border border-admin-border bg-gray-50">
              <img src={item.url} alt={`Gallery ${i + 1}`} className="h-full w-full object-cover" />
              {item.isNew ? (
                <button
                  type="button"
                  onClick={() => onRemove(item.index)}
                  className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                >
                  <RiCloseLine className="h-3 w-3" />
                </button>
              ) : (
                onRemoveSaved && (
                  <button
                    type="button"
                    onClick={() => onRemoveSaved(item.savedUrl)}
                    title="Remove this image"
                    className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white hover:bg-red-600/90 transition-colors"
                  >
                    <RiCloseLine className="h-3 w-3" />
                  </button>
                )
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {displayItems.length === 0 && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center gap-2 rounded-lg border-2 border-dashed border-admin-border bg-admin-surface p-6 text-center transition-colors hover:border-admin-primary hover:bg-admin-priLight/20"
        >
          <RiImageLine className="h-7 w-7 text-admin-textMuted" />
          <span className="text-sm font-medium text-admin-textSub">Add gallery images</span>
          <span className="text-xs text-admin-textMuted">JPEG, PNG, WebP · max 10 MB each · up to 10 images</span>
        </button>
      )}

      {/* Action row */}
      {displayItems.length > 0 && (
        <div className="flex gap-2">
          {canAddMore && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-admin-border bg-admin-surface px-3 py-2 text-xs font-medium text-admin-textSub transition-colors hover:border-admin-primary hover:text-admin-primary"
            >
              <RiAddLine className="h-3.5 w-3.5" />
              Add more
            </button>
          )}
          {hasNewFiles && (
            <button
              type="button"
              onClick={onClearNew}
              className="rounded-lg border border-admin-border px-3 py-2 text-xs font-medium text-admin-danger transition-colors hover:bg-red-50"
            >
              Clear new
            </button>
          )}
        </div>
      )}

      {/* Replace warning */}
      {hasNewFiles && currentUrls.length > 0 && (
        <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
          <RiInformationLine className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
          <p className="text-xs text-amber-700">
            New uploads will be added alongside the gallery images you keep when you save.
          </p>
        </div>
      )}

      {error && <p className="text-xs text-admin-danger">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={handleChange}
      />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────────────────────
function ProductCreatePage() {
  const navigate    = useNavigate()
  const queryClient = useQueryClient()
  const { productId } = useParams()
  const isEditMode  = Boolean(productId)

  const { data: categories = [] } = useCategories()
  const { data: brands      = [] } = useBrands()
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()
  const toast = useToast()

  // ── Text form fields ──────────────────────────────────────────────────
  const [form, setForm] = useState({
    name:             '',
    slug:             '',
    shortDescription: '',
    description:      '',
    productType:      'SIMPLE',
    status:           'DRAFT',
    categoryId:       '',
    brandId:          '',
    featured:         false,
    newArrival:       false,
    trackInventory:   true,
    inStock:          true,
    basePrice:        '',
    salePrice:        '',
    currency:         'BDT',
    metaTitle:        '',
    metaDescription:  '',
    publishedAt:      '',
  })
  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  // ── Thumbnail file state ──────────────────────────────────────────────
  const [thumbnailFile,    setThumbnailFile]    = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState(null)
  const [thumbnailError,   setThumbnailError]   = useState('')
  const [thumbnailRemoved, setThumbnailRemoved] = useState(false)

  // ── Gallery files state ───────────────────────────────────────────────
  const [galleryFiles,    setGalleryFiles]    = useState([])
  const [galleryPreviews, setGalleryPreviews] = useState([])
  const [galleryError,    setGalleryError]    = useState('')
  // null = untouched; array = user-modified subset of saved gallery
  const [keptGalleryUrls, setKeptGalleryUrls] = useState(null)

  // ── Upload/submit state ───────────────────────────────────────────────
  const [isUploading,  setIsUploading]  = useState(false)
  const [uploadError,  setUploadError]  = useState('')

  // ── Load existing product in edit mode ────────────────────────────────
  const { data: product, isLoading: loadingProduct } = useQuery({
    queryKey: ['admin', 'product', productId],
    queryFn:  () => productService.getProductById(productId),
    enabled:  isEditMode,
    staleTime: 0,
    refetchOnMount: 'always',
  })

  useEffect(() => {
    if (!product) return

    if (thumbnailPreview) {
      URL.revokeObjectURL(thumbnailPreview)
    }

    galleryPreviews.forEach((url) => URL.revokeObjectURL(url))

    setForm({
      name:             product.name             ?? '',
      slug:             product.slug             ?? '',
      shortDescription: product.shortDescription ?? '',
      description:      product.description      ?? '',
      productType:      product.productType      ?? 'SIMPLE',
      status:           product.status           ?? 'DRAFT',
      categoryId:       product.categoryId ? String(product.categoryId) : '',
      brandId:          product.brandId    ? String(product.brandId)    : '',
      featured:         Boolean(product.featured),
      newArrival:       Boolean(product.newArrival),
      trackInventory:   Boolean(product.trackInventory),
      inStock:          Boolean(product.inStock),
      basePrice:        product.basePrice    ?? '',
      salePrice:        product.salePrice    ?? '',
      currency:         product.currency     ?? 'BDT',
      metaTitle:        product.metaTitle    ?? '',
      metaDescription:  product.metaDescription ?? '',
      publishedAt:      product.publishedAt ? product.publishedAt.slice(0, 16) : '',
    })
    setThumbnailFile(null)
    setThumbnailPreview(null)
    setThumbnailError('')
    setThumbnailRemoved(false)
    setGalleryFiles([])
    setGalleryPreviews([])
    setGalleryError('')
    setKeptGalleryUrls(null)
    setUploadError('')
  }, [product])

  useEffect(() => () => {
    if (thumbnailPreview) {
      URL.revokeObjectURL(thumbnailPreview)
    }
    galleryPreviews.forEach((url) => URL.revokeObjectURL(url))
  }, [thumbnailPreview, galleryPreviews])

  // ── Thumbnail handlers ────────────────────────────────────────────────
  const handleThumbnailSelect = async (file) => {
    const err = validateImageFile(file)
    if (err) { setThumbnailError(err); return }

    if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview)

    // Resize to max 700×700 at 82% JPEG quality before upload
    let resized = file
    try { resized = await resizeImage(file, 700, 700, 0.82) } catch { /* use original */ }

    setThumbnailFile(resized)
    setThumbnailPreview(URL.createObjectURL(resized))
    setThumbnailError('')
    setThumbnailRemoved(false)
  }

  const handleThumbnailClear = () => {
    if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview)
    setThumbnailFile(null)
    setThumbnailPreview(null)
    // If there was a saved thumbnail (not just a new file), mark it for deletion
    if (product?.thumbnailUrl && !thumbnailFile) {
      setThumbnailRemoved(true)
    }
  }

  // ── Gallery handlers ──────────────────────────────────────────────────
  const handleGalleryAdd = (newFiles) => {
    const savedCount = (keptGalleryUrls ?? (product?.imageUrls ?? [])).length
    const remaining = MAX_GALLERY - (savedCount + galleryFiles.length)
    const toAdd = newFiles.slice(0, remaining)

    const errors = toAdd.map(validateImageFile).filter(Boolean)
    if (errors.length) { setGalleryError(errors[0]); return }

    const newPreviews = toAdd.map((f) => URL.createObjectURL(f))
    setGalleryFiles((prev) => [...prev, ...toAdd])
    setGalleryPreviews((prev) => [...prev, ...newPreviews])
    setGalleryError('')
  }

  const handleGalleryRemove = (index) => {
    URL.revokeObjectURL(galleryPreviews[index])
    setGalleryFiles((prev)    => prev.filter((_, i) => i !== index))
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleGalleryClearNew = () => {
    galleryPreviews.forEach((url) => URL.revokeObjectURL(url))
    setGalleryFiles([])
    setGalleryPreviews([])
  }

  // Remove a single saved image from the displayed list
  const handleGalleryRemoveSaved = (removedUrl) => {
    const current = keptGalleryUrls ?? (product?.imageUrls ?? [])
    setKeptGalleryUrls(current.filter((u) => u !== removedUrl))
  }

  const refreshProductCaches = () => {
    queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
    queryClient.removeQueries({ queryKey: ['admin', 'product', String(productId)] })
  }

  // ── Submit ────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    setUploadError('')

    const basePayload = {
      name:             form.name.trim(),
      slug:             form.slug.trim()             || undefined,
      shortDescription: form.shortDescription.trim() || undefined,
      description:      form.description.trim()      || undefined,
      productType:      form.productType,
      status:           form.status,
      categoryId:       form.categoryId ? Number(form.categoryId) : null,
      brandId:          form.brandId    ? Number(form.brandId)    : null,
      featured:         form.featured,
      newArrival:       form.newArrival,
      trackInventory:   form.trackInventory,
      inStock:          form.inStock,
      basePrice:        form.basePrice !== '' ? Number(form.basePrice) : null,
      salePrice:        form.salePrice !== '' ? Number(form.salePrice) : null,
      currency:         form.currency.trim(),
      metaTitle:        form.metaTitle.trim()       || undefined,
      metaDescription:  form.metaDescription.trim() || undefined,
      publishedAt:      form.publishedAt            || undefined,
    }

    if (!isEditMode) {
      // ── CREATE: upload first, then create product with URLs in payload ──
      // If uploads fail, no product is created — nothing to roll back.
      let thumbnailUrl
      let imageUrls

      const hasImages = thumbnailFile || galleryFiles.length > 0
      if (hasImages) {
        setIsUploading(true)
        try {
          if (thumbnailFile) {
            const res = await uploadService.uploadThumbnailGeneric(thumbnailFile)
            thumbnailUrl = res?.url
          }
          if (galleryFiles.length > 0) {
            const res = await uploadService.uploadImagesGeneric(galleryFiles)
            imageUrls = res?.map((item) => item.url)
          }
        } catch (err) {
          setUploadError(err.message || 'Image upload failed. Please try again.')
          setIsUploading(false)
          return
        }
        setIsUploading(false)
      }

      try {
        await createProduct.mutateAsync({
          ...basePayload,
          ...(thumbnailUrl && { thumbnailUrl }),
          ...(imageUrls?.length  && { imageUrls }),
        })
        toast.success('Product created successfully')
      } catch {
        return
      }
    } else {
      // ── EDIT: build update payload (may include gallery changes) ──
      const editPayload = { ...basePayload }
      const keptUrls = keptGalleryUrls ?? (product?.imageUrls ?? [])

      if (galleryFiles.length > 0) {
        setIsUploading(true)
        try {
          const res = await uploadService.uploadImagesGeneric(galleryFiles)
          const uploadedUrls = res?.map((item) => item.url) ?? []
          editPayload.imageUrls = [...keptUrls, ...uploadedUrls]
        } catch (err) {
          setUploadError(err.message || 'Gallery upload failed. Please try again.')
          setIsUploading(false)
          return
        }
        setIsUploading(false)
      } else if (keptGalleryUrls !== null) {
        editPayload.imageUrls = keptUrls
      }

      try {
        await updateProduct.mutateAsync({ productId, payload: editPayload })
      } catch {
        return
      }

      const hasImageWork = thumbnailFile || galleryFiles.length > 0 || thumbnailRemoved
      if (hasImageWork) {
        setIsUploading(true)
        try {
          if (thumbnailRemoved) {
            await productService.deleteProductThumbnail(productId)
          }
          if (thumbnailFile) {
            await uploadService.uploadProductThumbnail(productId, thumbnailFile)
          }
        } catch (err) {
          setUploadError(
            (err.message || 'Image operation failed.') +
            ' Product details were saved. You can retry from the edit page.'
          )
          setIsUploading(false)
          return
        }
        setIsUploading(false)
      }

      refreshProductCaches()
      toast.success('Product updated successfully')
    }

    navigate('/products')
  }

  const isBusy = createProduct.isPending || updateProduct.isPending || isUploading

  const submitLabel = () => {
    if (isUploading && !isEditMode) return 'Uploading images…'
    if (isUploading)                return 'Uploading images…'
    if (createProduct.isPending)    return 'Creating product…'
    if (updateProduct.isPending)    return 'Saving…'
    return isEditMode ? 'Save Product' : 'Create Product'
  }

  // ─────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <PageHeader
        title={isEditMode ? 'Edit Product' : 'Add Product'}
        description={
          isEditMode
            ? 'Update product details, pricing, inventory, media, and storefront visibility.'
            : 'Create a new product record. Fill in the required fields then publish when ready.'
        }
        action={
          <Button variant="secondary" onClick={() => navigate('/products')}>
            <RiArrowLeftLine className="h-4 w-4" />
            Back
          </Button>
        }
      />

      {loadingProduct ? (
        <div className="rounded-xl border border-admin-border bg-white p-8 text-sm text-admin-textMuted shadow-card">
          Loading product…
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">

            {/* ── Left column — main fields ── */}
            <div className="space-y-5">

              {/* Basic Info */}
              <Card title="Basic Info">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <InputField
                    label="Product Name *"
                    placeholder="e.g. Floral Summer Dress"
                    value={form.name}
                    onChange={(e) => setField('name', e.target.value)}
                    required
                  />
                  <InputField
                    label="Slug"
                    placeholder="auto-generated if empty"
                    hint="Lowercase, hyphens only."
                    value={form.slug}
                    onChange={(e) => setField('slug', e.target.value)}
                  />
                </div>
              </Card>

              {/* Organization */}
              <Card title="Organization">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <SelectField
                    label="Product Type"
                    value={form.productType}
                    onChange={(e) => setField('productType', e.target.value)}
                    options={[
                      { value: 'SIMPLE',   label: 'Simple'   },
                      { value: 'VARIABLE', label: 'Variable' },
                    ]}
                  />
                  <SelectField
                    label="Status"
                    value={form.status}
                    onChange={(e) => setField('status', e.target.value)}
                    options={[
                      { value: 'DRAFT',    label: 'Draft'    },
                      { value: 'ACTIVE',   label: 'Active'   },
                      { value: 'INACTIVE', label: 'Inactive' },
                      { value: 'ARCHIVED', label: 'Archived' },
                    ]}
                  />
                  <SelectField
                    label="Category"
                    value={form.categoryId}
                    onChange={(e) => setField('categoryId', e.target.value)}
                    options={[
                      { value: '', label: 'No category' },
                      ...categories.map((c) => ({ value: String(c.id), label: c.name })),
                    ]}
                  />
                  <SelectField
                    label="Brand"
                    value={form.brandId}
                    onChange={(e) => setField('brandId', e.target.value)}
                    options={[
                      { value: '', label: 'No brand' },
                      ...brands.map((b) => ({ value: String(b.id), label: b.name })),
                    ]}
                  />
                </div>
              </Card>

              {/* Pricing */}
              <Card title="Pricing">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <InputField
                    label="Base Price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={form.basePrice}
                    onChange={(e) => setField('basePrice', e.target.value)}
                  />
                  <InputField
                    label="Sale Price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Optional"
                    value={form.salePrice}
                    onChange={(e) => setField('salePrice', e.target.value)}
                  />
                  <InputField
                    label="Currency"
                    value={form.currency}
                    onChange={(e) => setField('currency', e.target.value)}
                  />
                  <InputField
                    label="Publish At"
                    type="datetime-local"
                    value={form.publishedAt}
                    onChange={(e) => setField('publishedAt', e.target.value)}
                  />
                </div>
              </Card>

              {/* Description */}
              <Card title="Description">
                <div className="space-y-4">
                  <TextareaField
                    label="Short Description"
                    rows={3}
                    placeholder="Brief product summary shown in listings…"
                    value={form.shortDescription}
                    onChange={(e) => setField('shortDescription', e.target.value)}
                  />
                  <TextareaField
                    label="Full Description"
                    rows={6}
                    placeholder="Detailed product description, care instructions, etc."
                    value={form.description}
                    onChange={(e) => setField('description', e.target.value)}
                  />
                </div>
              </Card>

              {/* SEO */}
              <Card title="SEO" description="Optional — improves search engine visibility.">
                <div className="space-y-4">
                  <InputField
                    label="Meta Title"
                    placeholder="Defaults to product name"
                    value={form.metaTitle}
                    onChange={(e) => setField('metaTitle', e.target.value)}
                  />
                  <TextareaField
                    label="Meta Description"
                    rows={3}
                    placeholder="150–160 characters recommended"
                    value={form.metaDescription}
                    onChange={(e) => setField('metaDescription', e.target.value)}
                  />
                </div>
              </Card>
            </div>

            {/* ── Right column — settings + media ── */}
            <div className="space-y-5">

              {/* Publish action */}
              <Card>
                {(createProduct.isError || updateProduct.isError) && (
                  <div className="mb-4">
                    <ErrorState message={createProduct.error?.message || updateProduct.error?.message} />
                  </div>
                )}
                {uploadError && (
                  <div className="mb-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5">
                    <RiInformationLine className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                    <p className="text-xs text-amber-700">{uploadError}</p>
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={isBusy}>
                  <RiSaveLine className="h-4 w-4" />
                  {submitLabel()}
                </Button>
                <p className="mt-2 text-center text-xs text-admin-textMuted">
                  Products in Draft are not visible on the storefront.
                </p>
              </Card>

              {/* Visibility flags */}
              <Card title="Visibility" description="Control how this product appears on the storefront.">
                <div className="space-y-4">
                  <Toggle
                    label="Featured"
                    description="Show in the Featured section"
                    checked={form.featured}
                    onChange={(val) => setField('featured', val)}
                  />
                  <Toggle
                    label="New Arrival"
                    description="Show in New Arrivals section"
                    checked={form.newArrival}
                    onChange={(val) => setField('newArrival', val)}
                  />
                </div>
              </Card>

              {/* Inventory flags */}
              <Card title="Inventory">
                <div className="space-y-4">
                  <Toggle
                    label="In Stock"
                    description="Product is currently available"
                    checked={form.inStock}
                    onChange={(val) => setField('inStock', val)}
                  />
                  <Toggle
                    label="Track Inventory"
                    description="Enable stock level tracking"
                    checked={form.trackInventory}
                    onChange={(val) => setField('trackInventory', val)}
                  />
                </div>
              </Card>

              {/* Media — file upload */}
              <Card
                title="Media"
                description="Upload images directly. JPEG, PNG, WebP · max 10 MB each."
              >
                <div className="space-y-5">
                  <ThumbnailZone
                    currentUrl={thumbnailRemoved ? null : (product?.thumbnailUrl ?? null)}
                    file={thumbnailFile}
                    preview={thumbnailPreview}
                    onSelect={handleThumbnailSelect}
                    onClear={handleThumbnailClear}
                    error={thumbnailError}
                  />

                  <div className="border-t border-admin-border" />

                  <GalleryZone
                    currentUrls={keptGalleryUrls ?? (product?.imageUrls ?? [])}
                    files={galleryFiles}
                    previews={galleryPreviews}
                    onAdd={handleGalleryAdd}
                    onRemove={handleGalleryRemove}
                    onClearNew={handleGalleryClearNew}
                    onRemoveSaved={isEditMode ? handleGalleryRemoveSaved : undefined}
                    error={galleryError}
                  />
                </div>
              </Card>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}

export default ProductCreatePage
