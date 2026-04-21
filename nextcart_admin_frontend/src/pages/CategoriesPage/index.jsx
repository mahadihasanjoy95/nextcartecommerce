import { useMemo, useState } from 'react'
import { RiAddLine, RiDeleteBinLine, RiEditLine, RiFolderLine } from 'react-icons/ri'
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
import { useCategories, useCreateCategory, useDeleteCategory, useUpdateCategory } from '@/hooks/useCategories'
import { useToast } from '@/context/ToastContext'

function CategoriesPage() {
  const { data: categories = [], isLoading, isError, error, refetch } = useCategories()
  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const deleteCategory = useDeleteCategory()
  const toast = useToast()

  const [form, setForm] = useState({ name: '', slug: '', active: 'true' })
  const [editingCategory, setEditingCategory] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const activeCount = useMemo(() => categories.filter((c) => c.active).length, [categories])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      name:   form.name.trim(),
      slug:   form.slug.trim(),
      active: form.active === 'true',
    }

    try {
      if (editingCategory) {
        await updateCategory.mutateAsync({ categoryId: editingCategory.id, payload })
        toast.success('Category updated successfully')
      } else {
        await createCategory.mutateAsync(payload)
        toast.success('Category created successfully')
      }
      setForm({ name: '', slug: '', active: 'true' })
      setEditingCategory(null)
    } catch {
      // error shown inline
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        description="Create and manage storefront categories. Slugs are used in product filters and URLs."
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total" value={categories.length} />
        <StatCard label="Active" value={activeCount} tone="success" />
        <StatCard label="Inactive" value={categories.length - activeCount} tone="warning" />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">

        {/* Add form */}
        <div className="rounded-xl border border-admin-border bg-white shadow-card">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-admin-border">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-admin-priLight text-admin-primary shrink-0">
              <RiAddLine className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-admin-text">New Category</h3>
              <p className="text-xs text-admin-textSub">{editingCategory ? 'Update the selected category.' : 'Fill in the name and save.'}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <InputField
              label="Name *"
              placeholder="e.g. Women's Fashion"
              value={form.name}
              onChange={(e) => setField('name', e.target.value)}
              required
            />
            <InputField
              label="Slug"
              placeholder="e.g. womens-fashion"
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

            {(createCategory.isError || updateCategory.isError) && (
              <ErrorState message={createCategory.error?.message || updateCategory.error?.message} />
            )}

            <div className="flex gap-3">
              <Button type="submit" className="w-full" disabled={createCategory.isPending || updateCategory.isPending}>
                <RiAddLine className="h-4 w-4" />
                {createCategory.isPending || updateCategory.isPending
                  ? (editingCategory ? 'Saving…' : 'Creating…')
                  : (editingCategory ? 'Save Category' : 'Create Category')}
              </Button>
              {editingCategory && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setEditingCategory(null)
                    setForm({ name: '', slug: '', active: 'true' })
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* Category table */}
        <div className="rounded-xl border border-admin-border bg-white shadow-card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-admin-border">
            <div>
              <h3 className="text-sm font-semibold text-admin-text">All Categories</h3>
              <p className="text-xs text-admin-textMuted mt-0.5">{categories.length} total</p>
            </div>
          </div>

          <div>
            {isLoading ? (
              <div className="p-5"><Loader rows={5} /></div>
            ) : isError ? (
              <div className="p-5"><ErrorState message={error.message} onRetry={refetch} /></div>
            ) : categories.length === 0 ? (
              <EmptyState
                title="No categories yet"
                message="Create your first category using the form on the left."
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
                  {categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-admin-priLight text-admin-primary shrink-0">
                            <RiFolderLine className="h-3.5 w-3.5" />
                          </div>
                          <div>
                            <p className="font-medium text-admin-text">{cat.name}</p>
                            <p className="text-xs text-admin-textMuted">ID #{cat.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-admin-textSub font-mono text-xs">
                        {cat.slug}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <Badge variant={cat.active ? 'success' : 'default'}>
                          {cat.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => {
                              setEditingCategory(cat)
                              setForm({
                                name: cat.name,
                                slug: cat.slug ?? '',
                                active: String(cat.active),
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
                            onClick={() => setDeleteTarget(cat)}
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
          title={`Delete Category — ${deleteTarget.name}`}
          message="Deleting a category will remove it from admin filters and any product relations that still depend on it will block the delete."
          confirmText={deleteTarget.name}
          confirmationHint={`Type ${deleteTarget.name} to confirm`}
          confirmLabel="Delete Category"
          isPending={deleteCategory.isPending}
          error={deleteCategory.error?.message}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => deleteCategory.mutate(deleteTarget.id, {
            onSuccess: () => { setDeleteTarget(null); toast.success('Category deleted') },
          })}
        />
      )}
    </div>
  )
}

export default CategoriesPage
