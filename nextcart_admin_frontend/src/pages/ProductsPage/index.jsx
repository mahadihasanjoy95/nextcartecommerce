import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  RiBox3Line,
  RiSearch2Line,
  RiFilterLine,
  RiRefreshLine,
  RiStarLine,
  RiTimeLine,
  RiDeleteBinLine,
  RiEditLine,
} from 'react-icons/ri'
import PageHeader  from '@/components/common/PageHeader'
import StatCard    from '@/components/common/StatCard'
import SelectField from '@/components/common/SelectField'
import Button      from '@/components/common/Button'
import Badge       from '@/components/common/Badge'
import Loader      from '@/components/common/Loader'
import ErrorState  from '@/components/common/ErrorState'
import EmptyState  from '@/components/common/EmptyState'
import DangerConfirmModal from '@/components/common/DangerConfirmModal'
import { useDeleteProduct, useProducts, useUpdateProduct }   from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useCategories'
import { useBrands }     from '@/hooks/useBrands'

const PAGE_SIZE = 12

/* ── helpers ── */
function statusVariant(status) {
  if (status === 'ACTIVE')   return 'success'
  if (status === 'DRAFT')    return 'warning'
  if (status === 'INACTIVE') return 'danger'
  return 'default'
}

function formatPrice(value, currency = 'BDT') {
  if (value == null) return '—'
  return new Intl.NumberFormat('en-BD', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value)
}

/* ── component ── */
function ProductsPage() {
  const [filters, setFilters] = useState({
    q:           '',
    categorySlug: '',
    brandSlug:   '',
    status:      'all',
    inStock:     'all',
    sortBy:      'NEWEST',
    sortDir:     'DESC',
  })
  const [page, setPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const productParams = {
    page:         page - 1,
    size:         PAGE_SIZE,
    q:            filters.q            || undefined,
    categorySlug: filters.categorySlug || undefined,
    brandSlug:    filters.brandSlug    || undefined,
    status:       filters.status === 'all' ? undefined : filters.status,
    inStock:      filters.inStock === 'all' ? undefined : filters.inStock === 'true',
    sortBy:       filters.sortBy,
    sortDir:      filters.sortDir,
  }

  const { data, isLoading, isError, error, refetch, isFetching } = useProducts(productParams)
  const updateProduct = useUpdateProduct()
  const deleteProduct = useDeleteProduct()
  const { data: categories = [] } = useCategories()
  const { data: brands      = [] } = useBrands()

  const products  = data?.content       ?? []
  const totalItems = data?.totalElements ?? 0
  const totalPages = data?.totalPages    ?? 0

  const activeCount   = useMemo(() => products.filter((p) => p.status === 'ACTIVE').length,   [products])
  const featuredCount = useMemo(() => products.filter((p) => p.featured).length,               [products])

  const handleFilter = (key, value) => { setFilters((prev) => ({ ...prev, [key]: value })); setPage(1) }
  const handleReset  = () => { setFilters({ q: '', categorySlug: '', brandSlug: '', status: 'all', inStock: 'all', sortBy: 'NEWEST', sortDir: 'DESC' }); setPage(1) }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="Manage your product catalog, pricing, and visibility flags."
      />

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Results"    value={totalItems}   />
        <StatCard label="Active on Page"   value={activeCount}  tone="success" />
        <StatCard label="Featured on Page" value={featuredCount} tone="primary" icon={RiStarLine} />
        <StatCard label="Page"             value={`${page} / ${Math.max(totalPages, 1)}`} tone="warning" icon={RiTimeLine} />
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-admin-border bg-white p-4 shadow-card">
        <div className="flex items-center gap-2 mb-3">
          <RiFilterLine className="h-4 w-4 text-admin-textSub" />
          <span className="text-sm font-medium text-admin-textSub">Filters</span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr_1fr_1fr_1fr_auto]">
          {/* Search */}
          <div className="flex items-center gap-2 rounded-lg border border-admin-inputBorder bg-admin-bg px-3 py-2.5 focus-within:border-admin-primary focus-within:ring-2 focus-within:ring-admin-primary/15 transition-colors">
            <RiSearch2Line className="h-4 w-4 text-admin-textMuted shrink-0" />
            <input
              value={filters.q}
              onChange={(e) => handleFilter('q', e.target.value)}
              placeholder="Search products…"
              className="w-full bg-transparent text-sm text-admin-text placeholder:text-admin-textMuted outline-none"
            />
          </div>

          <SelectField
            value={filters.categorySlug}
            onChange={(e) => handleFilter('categorySlug', e.target.value)}
            options={[{ value: '', label: 'All Categories' }, ...categories.map((c) => ({ value: c.slug, label: c.name }))]}
          />

          <SelectField
            value={filters.brandSlug}
            onChange={(e) => handleFilter('brandSlug', e.target.value)}
            options={[{ value: '', label: 'All Brands' }, ...brands.map((b) => ({ value: b.slug, label: b.name }))]}
          />

          <SelectField
            value={filters.inStock}
            onChange={(e) => handleFilter('inStock', e.target.value)}
            options={[
              { value: 'all',   label: 'Any Stock' },
              { value: 'true',  label: 'In Stock' },
              { value: 'false', label: 'Out of Stock' },
            ]}
          />

          <SelectField
            value={filters.status}
            onChange={(e) => handleFilter('status', e.target.value)}
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'ACTIVE', label: 'Active' },
              { value: 'DRAFT', label: 'Draft' },
              { value: 'INACTIVE', label: 'Inactive' },
              { value: 'ARCHIVED', label: 'Archived' },
            ]}
          />

          <SelectField
            value={filters.sortBy}
            onChange={(e) => handleFilter('sortBy', e.target.value)}
            options={[
              { value: 'NEWEST', label: 'Newest First' },
              { value: 'NAME',   label: 'Name A–Z' },
              { value: 'PRICE',  label: 'Price' },
            ]}
          />

          <Button variant="secondary" size="sm" onClick={handleReset} className="self-end">
            <RiRefreshLine className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-admin-border bg-white shadow-card">
        {/* Table header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-admin-border">
          <div>
            <h2 className="text-sm font-semibold text-admin-text">All Products</h2>
            <p className="text-xs text-admin-textMuted mt-0.5">
              {isFetching ? 'Refreshing…' : `${totalItems} result${totalItems !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-5">
              <Loader rows={6} />
            </div>
          ) : isError ? (
            <div className="p-5">
              <ErrorState message={error.message} onRetry={refetch} />
            </div>
          ) : products.length === 0 ? (
            <EmptyState
              title="No products found"
              message="Try broadening your search or adjusting the filters."
              action={<Button variant="secondary" size="sm" onClick={handleReset}>Clear filters</Button>}
            />
          ) : (
            <table className="w-full min-w-[800px] text-sm">
              <thead>
                <tr className="border-b border-admin-border bg-gray-50/50 text-xs font-semibold uppercase tracking-wider text-admin-textSub">
                  <th className="px-5 py-3 text-left">Product</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Brand</th>
                  <th className="px-4 py-3 text-right">Price</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-center">Stock</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-admin-border">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/60 transition-colors">
                    {/* Product name + thumbnail */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-lg border border-admin-border bg-gray-100 overflow-hidden shrink-0">
                          {product.thumbnailUrl ? (
                            <img
                              src={product.thumbnailUrl}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full grid place-items-center text-admin-textMuted">
                              <RiBox3Line className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-admin-text truncate max-w-[180px]">{product.name}</p>
                          <p className="text-xs text-admin-textMuted mt-0.5 truncate max-w-[180px]">{product.slug}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3.5">
                      <span className="text-admin-textSub">{product.categoryName || '—'}</span>
                    </td>

                    {/* Brand */}
                    <td className="px-4 py-3.5">
                      <span className="text-admin-textSub">{product.brandName || '—'}</span>
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex flex-col items-end gap-0.5">
                        <span className="font-semibold text-admin-text">
                          {formatPrice(product.salePrice ?? product.basePrice, product.currency)}
                        </span>
                        {product.salePrice != null && product.basePrice != null && product.salePrice < product.basePrice && (
                          <span className="text-xs text-admin-textMuted line-through">
                            {formatPrice(product.basePrice, product.currency)}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5 text-center">
                      <SelectField
                        value={product.status}
                        onChange={(e) => updateProduct.mutate({ productId: product.id, payload: { status: e.target.value } })}
                        options={[
                          { value: 'DRAFT', label: 'Draft' },
                          { value: 'ACTIVE', label: 'Active' },
                          { value: 'INACTIVE', label: 'Inactive' },
                          { value: 'ARCHIVED', label: 'Archived' },
                        ]}
                        className="min-w-[130px]"
                      />
                    </td>

                    {/* Stock */}
                    <td className="px-4 py-3.5 text-center">
                      <Button
                        size="sm"
                        variant={product.inStock ? 'secondary' : 'ghost'}
                        onClick={() => updateProduct.mutate({ productId: product.id, payload: { inStock: !product.inStock } })}
                      >
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </Button>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="flex justify-end gap-2">
                        <Link to={`/products/${product.id}/edit`}>
                          <Button size="sm" variant="secondary">
                            <RiEditLine className="h-4 w-4" />
                            Edit
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => setDeleteTarget({ id: product.id, name: product.name })}
                        >
                          <RiDeleteBinLine className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-admin-border px-5 py-3">
            <p className="text-xs text-admin-textSub">
              Page {page} of {totalPages} &middot; {totalItems} total
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {deleteTarget && (
        <DangerConfirmModal
          title={`Delete Product — ${deleteTarget.name}`}
          message="Deleting this product will remove it from the admin catalog and storefront responses."
          confirmText={deleteTarget.name}
          confirmationHint={`Type ${deleteTarget.name} to confirm`}
          confirmLabel="Delete Product"
          isPending={deleteProduct.isPending}
          error={deleteProduct.error?.message}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => deleteProduct.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })}
        />
      )}
    </div>
  )
}

export default ProductsPage
