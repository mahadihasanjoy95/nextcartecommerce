import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { RiCheckLine, RiCloseLine, RiRefreshLine } from 'react-icons/ri'
import userService from '@/services/userService'
import PageHeader from '@/components/common/PageHeader'
import Badge from '@/components/common/Badge'
import Button from '@/components/common/Button'
import DangerConfirmModal from '@/components/common/DangerConfirmModal'

function CustomersPage() {
  const [page, setPage] = useState(0)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const qc = useQueryClient()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['customers', page],
    queryFn: () => userService.getCustomers({ page, size: 20 }),
  })

  const { mutate: toggleEnable } = useMutation({
    mutationFn: ({ id, enabled }) =>
      enabled ? userService.disableUser(id) : userService.enableUser(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['customers'] }),
  })

  const { mutate: deleteUser, isPending: deletingUser, error: deleteError } = useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['customers'] })
      setDeleteTarget(null)
    },
  })

  const customers = data?.content ?? []
  const totalPages = data?.totalPages ?? 1

  return (
    <div className="page-container py-6">
      <PageHeader
        title="Customer Management"
        description="View customer accounts and control account status without mixing them into admin role management."
      />

      <div className="mt-6 overflow-hidden rounded-xl border border-admin-border bg-white shadow-card">
        {isLoading ? (
          <div className="p-10 text-center text-sm text-admin-textMuted">Loading customers…</div>
        ) : isError ? (
          <div className="p-10 text-center text-sm text-red-500">{error?.message}</div>
        ) : customers.length === 0 ? (
          <div className="p-10 text-center text-sm text-admin-textMuted">No customers found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-admin-border bg-admin-bg">
              <tr>
                {['Name', 'Email', 'Role', 'Type', 'Status', 'Actions'].map((heading) => (
                  <th
                    key={heading}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-admin-textMuted"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-admin-bg/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-admin-text">
                    {customer.firstName} {customer.lastName}
                  </td>
                  <td className="px-4 py-3 text-admin-textMuted">{customer.email || 'No email'}</td>
                  <td className="px-4 py-3">
                    {customer.roles?.map((role) => (
                      <Badge key={role} variant="default">{role}</Badge>
                    ))}
                  </td>
                  <td className="px-4 py-3 text-admin-textMuted capitalize">{customer.userType?.toLowerCase()}</td>
                  <td className="px-4 py-3">
                    <Badge variant={customer.enabled ? 'success' : 'danger'}>
                      {customer.enabled ? 'Active' : 'Disabled'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleEnable({ id: customer.id, enabled: customer.enabled })}
                      className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                        customer.enabled
                          ? 'border-red-200 text-red-600 hover:bg-red-50'
                          : 'border-green-200 text-green-600 hover:bg-green-50'
                      }`}
                      title={customer.enabled ? 'Disable customer' : 'Enable customer'}
                    >
                      {customer.enabled
                        ? <><RiCloseLine className="h-3.5 w-3.5" /> Disable</>
                        : <><RiCheckLine className="h-3.5 w-3.5" /> Enable</>
                      }
                    </button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="ml-2 text-red-600 hover:bg-red-50"
                      onClick={() => setDeleteTarget(customer)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-admin-border px-4 py-3">
            <span className="text-xs text-admin-textMuted">Page {page + 1} of {totalPages}</span>
            <div className="flex gap-2">
              <Button variant="ghost" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
                <RiRefreshLine className="h-3.5 w-3.5 -rotate-90" /> Prev
              </Button>
              <Button variant="ghost" disabled={page + 1 >= totalPages} onClick={() => setPage((p) => p + 1)}>
                Next <RiRefreshLine className="h-3.5 w-3.5 rotate-90" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {deleteTarget && (
        <DangerConfirmModal
          title={`Delete Customer — ${deleteTarget.firstName} ${deleteTarget.lastName}`}
          message="Deleting this customer will permanently remove the account and customer profile data."
          confirmText={deleteTarget.email || String(deleteTarget.id)}
          confirmationHint={`Type ${deleteTarget.email || deleteTarget.id} to confirm`}
          confirmLabel="Delete Customer"
          isPending={deletingUser}
          error={deleteError?.message}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => deleteUser(deleteTarget.id)}
        />
      )}
    </div>
  )
}

export default CustomersPage
