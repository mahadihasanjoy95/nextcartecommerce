import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  RiShieldLine, RiAddLine, RiDeleteBinLine, RiCloseLine, RiAlertLine, RiCheckboxLine, RiCheckboxBlankLine,
} from 'react-icons/ri'
import roleService from '@/services/roleService'
import permissionService from '@/services/permissionService'
import PageHeader from '@/components/common/PageHeader'
import Badge from '@/components/common/Badge'
import Button from '@/components/common/Button'
import DangerConfirmModal from '@/components/common/DangerConfirmModal'
import InputField from '@/components/common/InputField'

const roleMeta = (name, description) => {
  if (name === 'SUPER_ADMIN') {
    return { badge: 'Super Admin', variant: 'warning', desc: description || 'Unconditional access to all endpoints' }
  }
  if (name === 'CUSTOMER') {
    return { badge: 'Customer', variant: 'default', desc: description || 'Standard customer access only' }
  }
  if (name === 'ADMIN') {
    return { badge: 'Admin', variant: 'primary', desc: description || 'Permission-based access to admin features' }
  }
  return { badge: 'Custom Role', variant: 'primary', desc: description || 'Custom permission-based staff role' }
}

const isProtectedRole = (roleName) => roleName === 'SUPER_ADMIN' || roleName === 'ADMIN' || roleName === 'CUSTOMER'

// ── Modal wrapper ────────────────────────────────────────────────────────
function Modal({ title, onClose, children, wide }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className={`w-full ${wide ? 'max-w-2xl' : 'max-w-md'} rounded-2xl bg-white shadow-modal max-h-[90vh] flex flex-col`}>
        <div className="flex items-center justify-between border-b border-admin-border px-6 py-4 shrink-0">
          <h2 className="text-base font-semibold text-admin-text">{title}</h2>
          <button onClick={onClose} className="text-admin-textMuted hover:text-admin-text transition-colors">
            <RiCloseLine className="h-5 w-5" />
          </button>
        </div>
        <div className="px-6 py-5 overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}

// ── Create Permission Modal ──────────────────────────────────────────────
function CreatePermissionModal({ onClose }) {
  const qc = useQueryClient()
  const [form, setForm] = useState({ code: '', description: '', module: '' })
  const [error, setError] = useState(null)

  const { mutate, isPending } = useMutation({
    mutationFn: () => permissionService.createPermission(form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['permissions'] }); onClose() },
    onError: (e) => setError(e.message),
  })

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  return (
    <Modal title="Create Permission" onClose={onClose}>
      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
          <RiAlertLine className="mt-0.5 h-4 w-4 shrink-0" /> {error}
        </div>
      )}
      <div className="space-y-4">
        <InputField
          label="Permission code"
          value={form.code}
          onChange={set('code')}
          placeholder="e.g. product:create"
          hint="Format: module:action (lowercase, hyphens allowed)"
        />
        <InputField label="Module" value={form.module} onChange={set('module')} placeholder="e.g. product" />
        <InputField label="Description" value={form.description} onChange={set('description')} placeholder="Optional description" />
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={() => mutate()} disabled={isPending || !form.code || !form.module}>
          {isPending ? 'Creating…' : 'Create Permission'}
        </Button>
      </div>
    </Modal>
  )
}

function CreateRoleModal({ onClose }) {
  const qc = useQueryClient()
  const [form, setForm] = useState({ name: '', description: '' })
  const [error, setError] = useState(null)

  const { mutate, isPending } = useMutation({
    mutationFn: () => roleService.createRole(form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['roles'] })
      onClose()
    },
    onError: (e) => setError(e.message),
  })

  const set = (key) => (e) => {
    const nextValue = key === 'name'
      ? e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, '_')
      : e.target.value

    setForm((current) => ({ ...current, [key]: nextValue }))
  }

  return (
    <Modal title="Create Role" onClose={onClose}>
      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
          <RiAlertLine className="mt-0.5 h-4 w-4 shrink-0" /> {error}
        </div>
      )}
      <div className="space-y-4">
        <InputField
          label="Role name"
          value={form.name}
          onChange={set('name')}
          placeholder="e.g. CATALOG_MANAGER"
          hint="Uppercase only. Use letters, numbers, and underscores."
        />
        <InputField
          label="Description"
          value={form.description}
          onChange={set('description')}
          placeholder="What this role is for"
        />
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={() => mutate()} disabled={isPending || !form.name}>
          {isPending ? 'Creating…' : 'Create Role'}
        </Button>
      </div>
    </Modal>
  )
}

function DeleteRoleModal({ role, onClose }) {
  const qc = useQueryClient()

  const { mutate, isPending, error } = useMutation({
    mutationFn: () => roleService.deleteRole(role.id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['roles'] })
      onClose()
    },
  })

  return (
    <DangerConfirmModal
      title={`Delete Role — ${role.name}`}
      message="Deleting this role will permanently remove it and clear its role-permission assignments first."
      confirmText={role.name}
      confirmationHint={`Type ${role.name} to confirm`}
      confirmLabel="Delete Role"
      isPending={isPending}
      error={error?.message}
      onClose={onClose}
      onConfirm={() => mutate()}
    />
  )
}

// ── Assign Permissions Modal ─────────────────────────────────────────────
function AssignPermissionsModal({ roleName, roleId, onClose }) {
  const qc = useQueryClient()
  const [error, setError] = useState(null)

  const { data: allPerms = [], isLoading: loadingPerms } = useQuery({
    queryKey: ['permissions'],
    queryFn: () => permissionService.getAllPermissions(),
  })

  const { data: roleData, isLoading: loadingRole } = useQuery({
    queryKey: ['role-permissions', roleId],
    queryFn: () => roleService.getRolePermissions(roleId),
  })

  const assignedIds = new Set((roleData?.permissions ?? []).map((p) => p.id))
  const [selected, setSelected] = useState(null) // lazy init after data loads

  const effectiveSelected = selected ?? assignedIds

  const toggle = (id) => {
    const next = new Set(effectiveSelected)
    next.has(id) ? next.delete(id) : next.add(id)
    setSelected(next)
  }

  const { mutate, isPending } = useMutation({
    mutationFn: () => roleService.assignRolePermissions(roleId, [...effectiveSelected]),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['roles'] })
      qc.invalidateQueries({ queryKey: ['role-permissions', roleId] })
      onClose()
    },
    onError: (e) => setError(e.message),
  })

  const isLoading = loadingPerms || loadingRole

  // Group permissions by module
  const grouped = allPerms.reduce((acc, p) => {
    const mod = p.module || 'other'
    if (!acc[mod]) acc[mod] = []
    acc[mod].push(p)
    return acc
  }, {})

  return (
    <Modal title={`Assign Permissions — ${roleName}`} onClose={onClose} wide>
      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
          <RiAlertLine className="mt-0.5 h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      {isLoading ? (
        <div className="py-8 text-center text-sm text-admin-textMuted">Loading permissions…</div>
      ) : allPerms.length === 0 ? (
        <div className="py-8 text-center text-sm text-admin-textMuted">No permissions found. Create some first.</div>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([mod, perms]) => (
            <div key={mod}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-admin-textMuted">{mod}</p>
              <div className="space-y-1">
                {perms.map((p) => {
                  const checked = effectiveSelected.has(p.id)
                  return (
                    <label
                      key={p.id}
                      className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 hover:bg-admin-bg transition-colors"
                    >
                      <span className="text-admin-primary">
                        {checked
                          ? <RiCheckboxLine className="h-4.5 w-4.5" />
                          : <RiCheckboxBlankLine className="h-4.5 w-4.5 text-admin-textMuted" />}
                      </span>
                      <input type="checkbox" className="sr-only" checked={checked} onChange={() => toggle(p.id)} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-admin-text">{p.code}</p>
                        {p.description && <p className="text-xs text-admin-textMuted">{p.description}</p>}
                      </div>
                    </label>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={() => mutate()} disabled={isPending || isLoading}>
          {isPending ? 'Saving…' : 'Save Permissions'}
        </Button>
      </div>
    </Modal>
  )
}

// ── Main Page ────────────────────────────────────────────────────────────
function RolesPage() {
  const [showCreateRole, setShowCreateRole] = useState(false)
  const [showCreatePerm, setShowCreatePerm] = useState(false)
  const [assignRole, setAssignRole] = useState(null) // { id, name }
  const [deleteRoleTarget, setDeleteRoleTarget] = useState(null)

  const { data: roles = [], isLoading: loadingRoles } = useQuery({
    queryKey: ['roles'],
    queryFn: () => roleService.getAllRoles(),
  })

  const { data: allPerms = [], isLoading: loadingPerms } = useQuery({
    queryKey: ['permissions'],
    queryFn: () => permissionService.getAllPermissions(),
  })

  return (
    <div className="page-container py-6 space-y-8">
      <PageHeader
        title="Roles & Permissions"
        description="View role definitions, manage permissions, and control what each role can access."
        action={
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setShowCreateRole(true)}>
              <RiAddLine className="h-4 w-4" /> New Role
            </Button>
            <Button variant="primary" onClick={() => setShowCreatePerm(true)}>
              <RiAddLine className="h-4 w-4" /> New Permission
            </Button>
          </div>
        }
      />

      {/* Roles grid */}
      <section>
        <h2 className="mb-4 text-sm font-semibold text-admin-text">Roles</h2>
        {loadingRoles ? (
          <div className="rounded-xl border border-admin-border bg-white p-8 text-center text-sm text-admin-textMuted shadow-card">
            Loading roles…
          </div>
        ) : roles.length === 0 ? (
          <div className="rounded-xl border border-admin-border bg-white p-8 text-center text-sm text-admin-textMuted shadow-card">
            No roles found yet. Create your first role to start building access profiles.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {roles.map((role) => {
              const meta = roleMeta(role.name, role.description)
              const protectedRole = isProtectedRole(role.name)
              return (
                <div key={role.id} className="rounded-xl border border-admin-border bg-white p-5 shadow-card">
                  <div className="mb-3 flex items-start justify-between">
                    <RiShieldLine className="h-6 w-6 text-admin-primary" />
                    <Badge variant={meta.variant}>{meta.badge}</Badge>
                  </div>
                  <p className="mb-1 text-sm font-semibold text-admin-text">{role.name}</p>
                  <p className="mb-4 text-xs text-admin-textMuted">{meta.desc}</p>
                  <div className="mb-4 text-xs text-admin-textMuted">
                    {role.permissions?.length || 0} permission{role.permissions?.length === 1 ? '' : 's'}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      className="flex-1 justify-center text-xs"
                      onClick={() => setAssignRole({ id: role.id, name: role.name })}
                    >
                      Manage Permissions
                    </Button>
                    {protectedRole ? (
                      <Button variant="ghost" className="justify-center px-3 text-xs" disabled>
                        Protected
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        className="justify-center px-3 text-xs text-red-600 hover:bg-red-50"
                        onClick={() => setDeleteRoleTarget({ id: role.id, name: role.name })}
                      >
                        <RiDeleteBinLine className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* All permissions table */}
      <section>
        <h2 className="mb-4 text-sm font-semibold text-admin-text">
          All Permissions
          <span className="ml-2 text-xs font-normal text-admin-textMuted">({allPerms.length})</span>
        </h2>
        <div className="rounded-xl border border-admin-border bg-white shadow-card overflow-hidden">
          {loadingPerms ? (
            <div className="p-8 text-center text-sm text-admin-textMuted">Loading…</div>
          ) : allPerms.length === 0 ? (
            <div className="p-8 text-center text-sm text-admin-textMuted">
              No permissions yet. Create your first permission above.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-admin-bg border-b border-admin-border">
                <tr>
                  {['Code', 'Module', 'Description', 'Created'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-admin-textMuted">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-admin-border">
                {allPerms.map((p) => (
                  <tr key={p.id} className="hover:bg-admin-bg/50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-admin-primary">{p.code}</td>
                    <td className="px-4 py-3">
                      <Badge variant="default">{p.module}</Badge>
                    </td>
                    <td className="px-4 py-3 text-admin-textMuted">{p.description || '—'}</td>
                    <td className="px-4 py-3 text-admin-textMuted text-xs">
                      {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {showCreateRole && <CreateRoleModal onClose={() => setShowCreateRole(false)} />}
      {showCreatePerm && <CreatePermissionModal onClose={() => setShowCreatePerm(false)} />}
      {deleteRoleTarget && <DeleteRoleModal role={deleteRoleTarget} onClose={() => setDeleteRoleTarget(null)} />}
      {assignRole && (
        <AssignPermissionsModal
          roleName={assignRole.name}
          roleId={assignRole.id}
          onClose={() => setAssignRole(null)}
        />
      )}
    </div>
  )
}

export default RolesPage
