import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  RiAddLine, RiCloseLine, RiAlertLine, RiDeleteBinLine, RiEditLine,
  RiLockLine, RiLockUnlockLine, RiGlobalLine,
} from 'react-icons/ri'
import apiMapService from '@/services/apiMapService'
import permissionService from '@/services/permissionService'
import PageHeader from '@/components/common/PageHeader'
import Badge from '@/components/common/Badge'
import Button from '@/components/common/Button'
import InputField from '@/components/common/InputField'
import DangerConfirmModal from '@/components/common/DangerConfirmModal'

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']

const methodVariant = (m) => ({
  GET: 'success', POST: 'primary', PUT: 'warning', PATCH: 'warning', DELETE: 'danger',
}[m] || 'default')

const MODE_OPTIONS = [
  { value: 'public',        label: 'Public',             desc: 'No token required' },
  { value: 'authenticated', label: 'Authenticated only', desc: 'Any valid JWT' },
  { value: 'permission',    label: 'Permission-based',   desc: 'Requires specific permission code' },
]

function deriveMode(map) {
  if (map.isPublic) return 'public'
  if (map.authenticatedOnly) return 'authenticated'
  return 'permission'
}

// ── Modal wrapper ────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-modal max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-admin-border px-6 py-4 shrink-0">
          <h2 className="text-base font-semibold text-admin-text">{title}</h2>
          <button onClick={onClose} className="text-admin-textMuted hover:text-admin-text">
            <RiCloseLine className="h-5 w-5" />
          </button>
        </div>
        <div className="px-6 py-5 overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}

// ── Map Form (used by both Create and Edit) ──────────────────────────────
function MapForm({ initial, permissions, onSubmit, isPending, onCancel }) {
  const [form, setForm] = useState({
    httpMethod:    initial?.httpMethod    ?? 'GET',
    pathPattern:   initial?.pathPattern   ?? '',
    mode:          initial ? deriveMode(initial) : 'permission',
    permissionCode: initial?.permission?.code ?? '',
    active:        initial?.active        ?? true,
    description:   initial?.description  ?? '',
  })
  const [error, setError] = useState(null)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  async function handleSubmit() {
    setError(null)
    const payload = {
      httpMethod:       form.httpMethod,
      pathPattern:      form.pathPattern,
      isPublic:         form.mode === 'public',
      authenticatedOnly: form.mode === 'authenticated',
      permissionCode:   form.mode === 'permission' ? form.permissionCode || null : null,
      description:      form.description || null,
    }
    if (initial) payload.active = form.active
    try {
      await onSubmit(payload)
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
          <RiAlertLine className="mt-0.5 h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-admin-text">HTTP Method</span>
          <select
            value={form.httpMethod}
            onChange={set('httpMethod')}
            className="rounded-lg border border-admin-inputBorder px-3.5 py-2.5 text-sm text-admin-text outline-none focus:border-admin-primary focus:ring-2 focus:ring-admin-primary/15"
          >
            {HTTP_METHODS.map((m) => <option key={m}>{m}</option>)}
          </select>
        </div>
        <InputField label="Path Pattern" value={form.pathPattern} onChange={set('pathPattern')} placeholder="/api/v1/products/**" />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-admin-text">Access Mode</span>
        <div className="space-y-2">
          {MODE_OPTIONS.map((o) => (
            <label key={o.value} className="flex cursor-pointer items-center gap-3 rounded-lg border border-admin-border p-3 hover:bg-admin-bg transition-colors">
              <input type="radio" name="mode" value={o.value} checked={form.mode === o.value} onChange={set('mode')} className="accent-admin-primary" />
              <div>
                <p className="text-sm font-medium text-admin-text">{o.label}</p>
                <p className="text-xs text-admin-textMuted">{o.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {form.mode === 'permission' && (
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-admin-text">Permission Code</span>
          <select
            value={form.permissionCode}
            onChange={set('permissionCode')}
            className="rounded-lg border border-admin-inputBorder px-3.5 py-2.5 text-sm text-admin-text outline-none focus:border-admin-primary focus:ring-2 focus:ring-admin-primary/15"
          >
            <option value="">— Select permission —</option>
            {permissions.map((p) => (
              <option key={p.id} value={p.code}>{p.code}</option>
            ))}
          </select>
        </div>
      )}

      {initial && (
        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-admin-border p-3 hover:bg-admin-bg transition-colors">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
            className="accent-admin-primary h-4 w-4"
          />
          <div>
            <p className="text-sm font-medium text-admin-text">Active</p>
            <p className="text-xs text-admin-textMuted">Inactive rules are ignored by the authorization engine</p>
          </div>
        </label>
      )}

      <InputField label="Description (optional)" value={form.description} onChange={set('description')} placeholder="Brief note about this rule" />

      <div className="flex justify-end gap-3 pt-2">
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit} disabled={isPending || !form.pathPattern}>
          {isPending ? 'Saving…' : initial ? 'Update Rule' : 'Create Rule'}
        </Button>
      </div>
    </div>
  )
}

// ── Main Page ────────────────────────────────────────────────────────────
function ApiMapsPage() {
  const [showCreate, setShowCreate] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const qc = useQueryClient()

  const { data: maps = [], isLoading, isError, error } = useQuery({
    queryKey: ['api-maps'],
    queryFn: () => apiMapService.getAll(),
  })

  const { data: permissions = [] } = useQuery({
    queryKey: ['permissions'],
    queryFn: () => permissionService.getAllPermissions(),
  })

  const { mutate: createMap, isPending: creating } = useMutation({
    mutationFn: (payload) => apiMapService.create(payload),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['api-maps'] }); setShowCreate(false) },
  })

  const { mutate: updateMap, isPending: updating } = useMutation({
    mutationFn: (payload) => apiMapService.update(editTarget.id, payload),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['api-maps'] }); setEditTarget(null) },
  })

  const { mutate: deleteMap, isPending: deleting, error: deleteError } = useMutation({
    mutationFn: () => apiMapService.delete(deleteTarget.id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['api-maps'] }); setDeleteTarget(null) },
  })

  return (
    <div className="page-container py-6">
      <PageHeader
        title="API Permission Map"
        description="Define which endpoints are public, authenticated-only, or require specific permissions."
        action={
          <Button variant="primary" onClick={() => setShowCreate(true)}>
            <RiAddLine className="h-4 w-4" /> New Rule
          </Button>
        }
      />

      <div className="mt-6 rounded-xl border border-admin-border bg-white shadow-card overflow-hidden">
        {isLoading ? (
          <div className="p-10 text-center text-sm text-admin-textMuted">Loading rules…</div>
        ) : isError ? (
          <div className="p-10 text-center text-sm text-red-500">{error?.message}</div>
        ) : maps.length === 0 ? (
          <div className="p-10 text-center text-sm text-admin-textMuted">No rules configured yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-admin-bg border-b border-admin-border">
              <tr>
                {['Method', 'Path Pattern', 'Access', 'Permission', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-admin-textMuted">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border">
              {maps.map((m) => (
                <tr key={m.id} className="hover:bg-admin-bg/50 transition-colors">
                  <td className="px-4 py-3">
                    <Badge variant={methodVariant(m.httpMethod)}>{m.httpMethod}</Badge>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-admin-text">{m.pathPattern}</td>
                  <td className="px-4 py-3">
                    {m.isPublic ? (
                      <span className="inline-flex items-center gap-1 text-xs text-green-600">
                        <RiGlobalLine className="h-3.5 w-3.5" /> Public
                      </span>
                    ) : m.authenticatedOnly ? (
                      <span className="inline-flex items-center gap-1 text-xs text-blue-600">
                        <RiLockUnlockLine className="h-3.5 w-3.5" /> Auth only
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-amber-600">
                        <RiLockLine className="h-3.5 w-3.5" /> Permission
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-admin-textMuted">
                    {m.permission?.code || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={m.active ? 'success' : 'danger'}>
                      {m.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditTarget(m)}
                        className="inline-flex items-center gap-1 rounded-lg border border-admin-border px-2.5 py-1.5 text-xs font-medium text-admin-text hover:bg-admin-bg transition-colors"
                      >
                        <RiEditLine className="h-3.5 w-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(m)}
                        className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <RiDeleteBinLine className="h-3.5 w-3.5" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create Modal */}
      {showCreate && (
        <Modal title="New API Rule" onClose={() => setShowCreate(false)}>
          <MapForm permissions={permissions} isPending={creating} onCancel={() => setShowCreate(false)} onSubmit={createMap} />
        </Modal>
      )}

      {/* Edit Modal */}
      {editTarget && (
        <Modal title="Edit API Rule" onClose={() => setEditTarget(null)}>
          <MapForm initial={editTarget} permissions={permissions} isPending={updating} onCancel={() => setEditTarget(null)} onSubmit={updateMap} />
        </Modal>
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <DangerConfirmModal
          title={`Delete API Rule — ${deleteTarget.httpMethod} ${deleteTarget.pathPattern}`}
          description="This will permanently remove the API permission mapping. Type the exact rule path to confirm this destructive action."
          confirmText={deleteTarget.pathPattern}
          confirmationHint={`Type ${deleteTarget.pathPattern} to confirm`}
          confirmLabel="Delete Rule"
          isPending={deleting}
          error={deleteError?.message}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => deleteMap()}
        />
      )}
    </div>
  )
}

export default ApiMapsPage
