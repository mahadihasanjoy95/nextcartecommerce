import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { RiUserAddLine, RiShieldUserLine, RiCheckLine, RiCloseLine, RiAlertLine, RiRefreshLine, RiLoader4Line } from 'react-icons/ri'
import userService from '@/services/userService'
import roleService from '@/services/roleService'
import PageHeader from '@/components/common/PageHeader'
import Badge from '@/components/common/Badge'
import Button from '@/components/common/Button'
import DangerConfirmModal from '@/components/common/DangerConfirmModal'
import InputField from '@/components/common/InputField'

const RESERVED_ROLES = new Set(['SUPER_ADMIN', 'CUSTOMER'])

const roleBadgeVariant = (role) => {
  if (role === 'SUPER_ADMIN') return 'warning'
  if (role === 'ADMIN') return 'primary'
  return 'default'
}

const isSuperAdminUser = (user) => user.roles?.includes('SUPER_ADMIN')

// ── Modal wrapper ────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-modal">
        <div className="flex items-center justify-between border-b border-admin-border px-6 py-4">
          <h2 className="text-base font-semibold text-admin-text">{title}</h2>
          <button onClick={onClose} className="text-admin-textMuted hover:text-admin-text transition-colors">
            <RiCloseLine className="h-5 w-5" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}

// ── Create Admin Modal ───────────────────────────────────────────────────
function CreateAdminModal({ onClose }) {
  const qc = useQueryClient()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', role: '' })
  const [error, setError] = useState(null)

  // Fetch assignable roles (excludes SUPER_ADMIN and CUSTOMER on the server side too,
  // but we also filter client-side so the dropdown only shows staff-appropriate roles)
  const { data: allRoles = [], isLoading: loadingRoles } = useQuery({
    queryKey: ['roles'],
    queryFn: () => roleService.getAllRoles(),
  })
  const assignableRoles = allRoles.filter((r) => !RESERVED_ROLES.has(r.name))

  const { mutate, isPending } = useMutation({
    mutationFn: () => userService.createAdmin(form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-users'] }); onClose() },
    onError: (e) => setError(e.message),
  })

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  return (
    <Modal title="Create Staff Account" onClose={onClose}>
      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
          <RiAlertLine className="mt-0.5 h-4 w-4 shrink-0" /> {error}
        </div>
      )}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <InputField label="First name" value={form.firstName} onChange={set('firstName')} placeholder="John" />
          <InputField label="Last name"  value={form.lastName}  onChange={set('lastName')}  placeholder="Doe" />
        </div>
        <InputField label="Email" type="email" value={form.email} onChange={set('email')} placeholder="admin@example.com" />

        {/* Role selector */}
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-admin-text">Role</span>
          {loadingRoles ? (
            <div className="flex items-center gap-2 rounded-lg border border-admin-border px-3.5 py-2.5 text-sm text-admin-textMuted">
              <RiLoader4Line className="h-4 w-4 animate-spin" /> Loading roles…
            </div>
          ) : assignableRoles.length === 0 ? (
            <div className="rounded-lg border border-admin-border bg-admin-bg px-3.5 py-2.5 text-sm text-admin-textMuted">
              No assignable roles found. Create a role first from Roles &amp; Permissions.
            </div>
          ) : (
            <select
              value={form.role}
              onChange={set('role')}
              className="w-full rounded-lg border border-admin-inputBorder bg-white px-3.5 py-2.5 text-sm text-admin-text outline-none transition-colors duration-150 hover:border-gray-400 focus:border-admin-primary focus:ring-2 focus:ring-admin-primary/15"
            >
              <option value="">— Select a role (defaults to ADMIN) —</option>
              {assignableRoles.map((r) => (
                <option key={r.id} value={r.name}>{r.name}{r.description ? ` — ${r.description}` : ''}</option>
              ))}
            </select>
          )}
        </div>

        <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5">
          <RiAlertLine className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <p className="text-xs text-amber-700 leading-relaxed">
            A temporary password will be generated automatically and sent to this email address.
            The user will be prompted to change it after their first login.
          </p>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button
          variant="primary"
          onClick={() => mutate()}
          disabled={isPending || !form.firstName || !form.email || loadingRoles}
        >
          {isPending ? 'Sending invite…' : 'Send Invite'}
        </Button>
      </div>
    </Modal>
  )
}

// ── Assign Role Modal ────────────────────────────────────────────────────
function AssignRoleModal({ user, onClose }) {
  const qc = useQueryClient()
  const [role, setRole] = useState(user.roles?.find((item) => !RESERVED_ROLES.has(item)) || 'ADMIN')
  const [error, setError] = useState(null)

  const { data: allRoles = [], isLoading: loadingRoles } = useQuery({
    queryKey: ['roles'],
    queryFn: () => roleService.getAllRoles(),
  })

  const assignableRoles = allRoles.filter((item) => !RESERVED_ROLES.has(item.name))

  const { mutate, isPending } = useMutation({
    mutationFn: () => userService.assignRole(user.id, role),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-users'] }); onClose() },
    onError: (e) => setError(e.message),
  })

  return (
    <Modal title={`Assign Role — ${user.firstName} ${user.lastName}`} onClose={onClose}>
      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
          <RiAlertLine className="mt-0.5 h-4 w-4 shrink-0" /> {error}
        </div>
      )}
      <p className="mb-4 text-sm text-admin-textMuted">
        Assigning a new role will revoke all active sessions for this user.
      </p>
      {loadingRoles ? (
        <div className="py-6 text-center text-sm text-admin-textMuted">Loading roles…</div>
      ) : assignableRoles.length === 0 ? (
        <div className="rounded-lg border border-admin-border bg-admin-bg px-4 py-3 text-sm text-admin-textMuted">
          No assignable staff roles found. Create a role first from Roles & Permissions.
        </div>
      ) : (
        <div className="space-y-2">
          {assignableRoles.map((item) => (
            <label key={item.id} className="flex cursor-pointer items-center gap-3 rounded-lg border border-admin-border p-3 hover:bg-admin-bg transition-colors">
              <input
                type="radio"
                name="role"
                value={item.name}
                checked={role === item.name}
                onChange={() => setRole(item.name)}
                className="accent-admin-primary"
              />
              <div>
                <p className="text-sm font-medium text-admin-text">{item.name}</p>
                <p className="text-xs text-admin-textMuted">{item.description || 'Custom staff role'}</p>
              </div>
            </label>
          ))}
        </div>
      )}
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={() => mutate()} disabled={isPending || loadingRoles || assignableRoles.length === 0}>
          {isPending ? 'Saving…' : 'Save Role'}
        </Button>
      </div>
    </Modal>
  )
}

// ── Main Page ────────────────────────────────────────────────────────────
function UsersPage() {
  const [showCreate, setShowCreate] = useState(false)
  const [assignTarget, setAssignTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [page, setPage] = useState(0)
  const qc = useQueryClient()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['admin-users', page],
    queryFn: () => userService.getAdminUsers({ page, size: 20 }),
  })

  const { mutate: toggleEnable } = useMutation({
    mutationFn: ({ id, enabled }) =>
      enabled ? userService.disableUser(id) : userService.enableUser(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  })

  const { mutate: deleteUser, isPending: deletingUser, error: deleteError } = useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-users'] })
      setDeleteTarget(null)
    },
  })

  const users = data?.content ?? []
  const totalPages = data?.totalPages ?? 1

  return (
    <div className="page-container py-6">
      <PageHeader
        title="Admin Management"
        description="Manage staff accounts, admin roles, and back-office access."
        action={
          <Button variant="primary" onClick={() => setShowCreate(true)}>
            <RiUserAddLine className="h-4 w-4" /> Create Admin
          </Button>
        }
      />

      <div className="mt-6 rounded-xl border border-admin-border bg-white shadow-card overflow-hidden">
        {isLoading ? (
          <div className="p-10 text-center text-sm text-admin-textMuted">Loading users…</div>
        ) : isError ? (
          <div className="p-10 text-center text-sm text-red-500">{error?.message}</div>
        ) : users.length === 0 ? (
          <div className="p-10 text-center text-sm text-admin-textMuted">No admin users found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-admin-bg border-b border-admin-border">
              <tr>
                {['Name', 'Email', 'Role', 'Type', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-admin-textMuted">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border">
              {users.map((u) => {
                const isProtectedSuperAdmin = isSuperAdminUser(u)

                return (
                <tr key={u.id} className="hover:bg-admin-bg/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-admin-text">
                    {u.firstName} {u.lastName}
                  </td>
                  <td className="px-4 py-3 text-admin-textMuted">{u.email}</td>
                  <td className="px-4 py-3">
                    {u.roles?.map((r) => (
                      <Badge key={r} variant={roleBadgeVariant(r)}>{r}</Badge>
                    ))}
                  </td>
                  <td className="px-4 py-3 text-admin-textMuted capitalize">{u.userType?.toLowerCase()}</td>
                  <td className="px-4 py-3">
                    <Badge variant={u.enabled ? 'success' : 'danger'}>
                      {u.enabled ? 'Active' : 'Disabled'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {isProtectedSuperAdmin ? (
                        <Badge variant="warning">Protected</Badge>
                      ) : (
                        <>
                          <button
                            onClick={() => setAssignTarget(u)}
                            className="inline-flex items-center gap-1 rounded-lg border border-admin-border px-2.5 py-1.5 text-xs font-medium text-admin-text hover:bg-admin-bg transition-colors"
                            title="Assign Role"
                          >
                            <RiShieldUserLine className="h-3.5 w-3.5" /> Role
                          </button>
                          <button
                            onClick={() => toggleEnable({ id: u.id, enabled: u.enabled })}
                            className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                              u.enabled
                                ? 'border-red-200 text-red-600 hover:bg-red-50'
                                : 'border-green-200 text-green-600 hover:bg-green-50'
                            }`}
                            title={u.enabled ? 'Disable user' : 'Enable user'}
                          >
                            {u.enabled
                              ? <><RiCloseLine className="h-3.5 w-3.5" /> Disable</>
                              : <><RiCheckLine className="h-3.5 w-3.5" /> Enable</>
                            }
                          </button>
                          <button
                            onClick={() => setDeleteTarget(u)}
                            className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                            title="Delete user"
                          >
                            <RiCloseLine className="h-3.5 w-3.5" /> Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
                )
              })}
            </tbody>
          </table>
        )}

        {/* Pagination */}
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

      {showCreate && <CreateAdminModal onClose={() => setShowCreate(false)} />}
      {assignTarget && <AssignRoleModal user={assignTarget} onClose={() => setAssignTarget(null)} />}
      {deleteTarget && (
        <DangerConfirmModal
          title={`Delete Admin — ${deleteTarget.firstName} ${deleteTarget.lastName}`}
          message="Deleting this admin user will permanently remove the account from the admin panel."
          confirmText={deleteTarget.email}
          confirmationHint={`Type ${deleteTarget.email} to confirm`}
          confirmLabel="Delete Admin"
          isPending={deletingUser}
          error={deleteError?.message}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => deleteUser(deleteTarget.id)}
        />
      )}
    </div>
  )
}

export default UsersPage
