import { useMemo, useState } from 'react'
import { RiAddLine, RiDeleteBinLine, RiEditLine, RiPriceTag3Line } from 'react-icons/ri'
import PageHeader  from '@/components/common/PageHeader'
import StatCard    from '@/components/common/StatCard'
import InputField  from '@/components/common/InputField'
import SelectField from '@/components/common/SelectField'
import Button      from '@/components/common/Button'
import Badge       from '@/components/common/Badge'
import Loader      from '@/components/common/Loader'
import ErrorState  from '@/components/common/ErrorState'
import EmptyState  from '@/components/common/EmptyState'
import DangerConfirmModal from '@/components/common/DangerConfirmModal'
import { useBrands, useCreateBrand, useDeleteBrand, useUpdateBrand } from '@/hooks/useBrands'
import { useToast } from '@/context/ToastContext'

function BrandsPage() {
  const { data: brands = [], isLoading, isError, error, refetch } = useBrands()
  const createBrand = useCreateBrand()
  const updateBrand = useUpdateBrand()
  const deleteBrand = useDeleteBrand()
  const toast = useToast()

  const [form, setForm] = useState({ name: '', slug: '', active: 'true' })
  const [editingBrand, setEditingBrand] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const activeCount = useMemo(() => brands.filter((b) => b.active).length, [brands])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      name:   form.name.trim(),
      slug:   form.slug.trim(),
      active: form.active === 'true',
    }

    try {
      if (editingBrand) {
        await updateBrand.mutateAsync({ brandId: editingBrand.id, payload })
        toast.success('Brand updated successfully')
      } else {
        await createBrand.mutateAsync(payload)
        toast.success('Brand created successfully')
      }
      setForm({ name: '', slug: '', active: 'true' })
      setEditingBrand(null)
    } catch {
      // error shown inline via isError
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Brands"
        description="Manage brand records for product attribution and storefront merchandising."
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total" value={brands.length} />
        <StatCard label="Active" value={activeCount} tone="success" />
        <StatCard label="Inactive" value={brands.length - activeCount} tone="warning" />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">

        {/* Add form */}
        <div className="rounded-xl border border-admin-border bg-white shadow-card">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-admin-border">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-admin-priLight text-admin-primary shrink-0">
              <RiAddLine className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-admin-text">New Brand</h3>
              <p className="text-xs text-admin-textSub">{editingBrand ? 'Update the selected brand.' : 'Enter a name and save.'}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <InputField
              label="Name *"
              placeholder="e.g. Zara"
              value={form.name}
              onChange={(e) => setField('name', e.target.value)}
              required
            />
            <InputField
              label="Slug"
              placeholder="e.g. zara"
              hint="Leave blank to auto-generate from name."
              value={form.slug}
              onChange={(e) => setField('slug', e.target.value)}
            />
            <SelectField
              label="Status"
              value={form.active}
              onChange={(e) => setField('active', e.target.value)}
              options={[
                { value: 'true',  label: 'Active' },
                { value: 'false', label: 'Inactive' },
              ]}
            />

            {(createBrand.isError || updateBrand.isError) && (
              <ErrorState message={createBrand.error?.message || updateBrand.error?.message} />
            )}

            <div className="flex gap-3">
              <Button type="submit" className="w-full" disabled={createBrand.isPending || updateBrand.isPending}>
                <RiAddLine className="h-4 w-4" />
                {createBrand.isPending || updateBrand.isPending
                  ? (editingBrand ? 'Saving…' : 'Creating…')
                  : (editingBrand ? 'Save Brand' : 'Create Brand')}
              </Button>
              {editingBrand && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setEditingBrand(null)
                    setForm({ name: '', slug: '', active: 'true' })
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* Brands table */}
        <div className="rounded-xl border border-admin-border bg-white shadow-card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-admin-border">
            <div>
              <h3 className="text-sm font-semibold text-admin-text">All Brands</h3>
              <p className="text-xs text-admin-textMuted mt-0.5">{brands.length} total</p>
            </div>
          </div>

          <div>
            {isLoading ? (
              <div className="p-5"><Loader rows={5} /></div>
            ) : isError ? (
              <div className="p-5"><ErrorState message={error.message} onRetry={refetch} /></div>
            ) : brands.length === 0 ? (
              <EmptyState
                title="No brands yet"
                message="Create your first brand using the form on the left."
              />
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-admin-border bg-gray-50/50 text-xs font-semibold uppercase tracking-wider text-admin-textSub">
                    <th className="px-5 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Slug</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-admin-border">
                  {brands.map((brand) => (
                    <tr key={brand.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-admin-textSub shrink-0">
                            <RiPriceTag3Line className="h-3.5 w-3.5" />
                          </div>
                          <div>
                            <p className="font-medium text-admin-text">{brand.name}</p>
                            <p className="text-xs text-admin-textMuted">ID #{brand.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-admin-textSub font-mono text-xs">
                        {brand.slug}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <Badge variant={brand.active ? 'success' : 'default'}>
                          {brand.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => {
                              setEditingBrand(brand)
                              setForm({
                                name: brand.name,
                                slug: brand.slug ?? '',
                                active: String(brand.active),
                              })
                            }}
                          >
                            <RiEditLine className="h-4 w-4" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => setDeleteTarget(brand)}
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
        </div>
      </div>

      {deleteTarget && (
        <DangerConfirmModal
          title={`Delete Brand — ${deleteTarget.name}`}
          message="Deleting a brand will remove it from admin filters and any product relations that still depend on it will block the delete."
          confirmText={deleteTarget.name}
          confirmationHint={`Type ${deleteTarget.name} to confirm`}
          confirmLabel="Delete Brand"
          isPending={deleteBrand.isPending}
          error={deleteBrand.error?.message}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => deleteBrand.mutate(deleteTarget.id, {
            onSuccess: () => { setDeleteTarget(null); toast.success('Brand deleted') },
          })}
        />
      )}
    </div>
  )
}

export default BrandsPage
