import { useRef, useState } from 'react'
import {
  RiMailLine,
  RiPhoneLine,
  RiCalendarLine,
  RiShieldUserLine,
  RiCheckboxCircleFill,
  RiEditLine,
  RiCloseLine,
  RiSaveLine,
  RiLockPasswordLine,
  RiEyeLine,
  RiEyeOffLine,
  RiCameraLine,
} from 'react-icons/ri'
import { useAuth } from '@/hooks/useAuth'
import authService from '@/services/authService'
import uploadService from '@/services/uploadService'
import InputField from '@/components/common/InputField'
import PageHeader from '@/components/common/PageHeader'

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_IMAGE_SIZE = 10 * 1024 * 1024 // 10 MB

// ── Password input with show/hide toggle ─────────────────────────────────────
function PasswordInput({ label, error, ...props }) {
  const [show, setShow] = useState(false)
  return (
    <div className="flex flex-col gap-1.5">
      {label && <span className="text-sm font-medium text-admin-text">{label}</span>}
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          className={`w-full rounded-lg border bg-white px-3.5 py-2.5 pr-10 text-sm text-admin-text outline-none transition-colors duration-150
            placeholder:text-admin-textMuted
            focus:border-admin-primary focus:ring-2 focus:ring-admin-primary/15
            ${error ? 'border-admin-danger' : 'border-admin-inputBorder hover:border-gray-400'}`}
          {...props}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShow(p => !p)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-admin-textMuted hover:text-admin-text transition-colors duration-150"
        >
          {show ? <RiEyeOffLine className="h-4 w-4" /> : <RiEyeLine className="h-4 w-4" />}
        </button>
      </div>
      {error && <span className="text-xs text-admin-danger">{error}</span>}
    </div>
  )
}

// ── Info row ─────────────────────────────────────────────────────────────────
function InfoRow({ icon: Icon, label, value, verified }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-admin-border bg-admin-surface px-4 py-3.5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-admin-primary/10">
        <Icon className="h-4.5 w-4.5 text-admin-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wider text-admin-textMuted">{label}</p>
        <p className="text-sm font-medium text-admin-text truncate">{value || '—'}</p>
      </div>
      {verified !== undefined && (
        <span className={`flex items-center gap-1 text-xs font-medium shrink-0 ${
          verified ? 'text-emerald-500' : 'text-admin-textMuted'
        }`}>
          {verified && <RiCheckboxCircleFill className="h-3.5 w-3.5" />}
          {verified ? 'Verified' : 'Unverified'}
        </span>
      )}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
function ProfilePage() {
  const { user, updateUser } = useAuth()
  const picInputRef = useRef(null)

  // ── Profile picture state ───────────────────────────────────────────────
  const [picLoading, setPicLoading] = useState(false)
  const [picError,   setPicError]   = useState('')

  // ── Profile edit state ──────────────────────────────────────────────────
  const [editMode, setEditMode]       = useState(false)
  const [profileForm, setProfileForm] = useState({
    firstName: user.firstName || '',
    lastName:  user.lastName  || '',
    phone:     user.phone     || '',
  })
  const [profileErrors,  setProfileErrors]  = useState({})
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState('')
  const [profileError,   setProfileError]   = useState('')

  // ── Password change state ───────────────────────────────────────────────
  const [pwForm, setPwForm]     = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [pwErrors, setPwErrors] = useState({})
  const [pwLoading, setPwLoading] = useState(false)
  const [pwSuccess, setPwSuccess] = useState('')
  const [pwError,   setPwError]   = useState('')

  const initials    = [user.firstName?.[0], user.lastName?.[0]].filter(Boolean).join('').toUpperCase() || 'A'
  const fullName    = [user.firstName, user.lastName].filter(Boolean).join(' ')
  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : null

  // ── Profile picture handlers ────────────────────────────────────────────
  const handlePictureClick = () => {
    if (!picLoading) picInputRef.current?.click()
  }

  const handlePictureChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    // Reset input so the same file can be re-selected after removal
    e.target.value = ''

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setPicError('Only JPEG, PNG, and WebP images are allowed.')
      return
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setPicError('Image must be under 10 MB.')
      return
    }

    setPicLoading(true)
    setPicError('')
    try {
      const result = await uploadService.uploadProfilePicture(file)
      // result is UploadResponseDto { key, url }
      updateUser({ ...user, profilePictureUrl: result.url })
    } catch (err) {
      setPicError(err.message || 'Failed to upload profile picture.')
    } finally {
      setPicLoading(false)
    }
  }

  // ── Profile edit handlers ───────────────────────────────────────────────
  const onProfileChange = (field) => (e) => {
    setProfileForm(p => ({ ...p, [field]: e.target.value }))
    if (profileErrors[field]) setProfileErrors(p => ({ ...p, [field]: '' }))
    if (profileError) setProfileError('')
  }

  const handleProfileSave = async (e) => {
    e.preventDefault()
    const errors = {}
    if (!profileForm.firstName.trim()) errors.firstName = 'First name is required'
    if (Object.keys(errors).length) { setProfileErrors(errors); return }

    setProfileLoading(true)
    setProfileError('')
    setProfileSuccess('')
    try {
      const updated = await authService.updateProfile({
        firstName: profileForm.firstName.trim(),
        lastName:  profileForm.lastName.trim()  || null,
        phone:     profileForm.phone.trim()     || null,
      })
      updateUser(updated)
      setProfileSuccess('Profile updated successfully.')
      setEditMode(false)
    } catch (err) {
      setProfileError(err.message || 'Failed to update profile.')
    } finally {
      setProfileLoading(false)
    }
  }

  const handleEditCancel = () => {
    setProfileForm({ firstName: user.firstName || '', lastName: user.lastName || '', phone: user.phone || '' })
    setProfileErrors({})
    setProfileError('')
    setEditMode(false)
  }

  // hasPassword: true if user has a BCrypt password (false for Google-only accounts)
  const hasPassword = user.hasPassword ?? true

  // ── Password handlers ───────────────────────────────────────────────────
  const onPwChange = (field) => (e) => {
    setPwForm(p => ({ ...p, [field]: e.target.value }))
    if (pwErrors[field]) setPwErrors(p => ({ ...p, [field]: '' }))
    if (pwError) setPwError('')
  }

  const handlePasswordSave = async (e) => {
    e.preventDefault()
    const errors = {}
    // Only require currentPassword when the user already has one
    if (hasPassword && !pwForm.currentPassword)         errors.currentPassword  = 'Current password is required'
    if (!pwForm.newPassword)                            errors.newPassword      = 'New password is required'
    else if (pwForm.newPassword.length < 8)             errors.newPassword      = 'Must be at least 8 characters'
    if (pwForm.newPassword !== pwForm.confirmPassword)  errors.confirmPassword  = 'Passwords do not match'
    if (Object.keys(errors).length) { setPwErrors(errors); return }

    setPwLoading(true)
    setPwError('')
    setPwSuccess('')
    try {
      await authService.changePassword(
        hasPassword ? pwForm.currentPassword : null,
        pwForm.newPassword
      )
      setPwSuccess(hasPassword ? 'Password changed successfully.' : 'Password set successfully.')
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setPwError(err.message || 'Failed to change password.')
    } finally {
      setPwLoading(false)
    }
  }

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-3xl">
      <PageHeader
        title="My Profile"
        subtitle="View and update your account details"
      />

      {/* ── Identity card ─────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-admin-border bg-admin-card p-6 flex items-center gap-5">

        {/* Avatar with upload overlay */}
        <div className="shrink-0 flex flex-col items-center gap-1.5">
          <button
            type="button"
            title="Change profile picture"
            onClick={handlePictureClick}
            className="relative h-16 w-16 rounded-full overflow-hidden group focus:outline-none focus:ring-2 focus:ring-admin-primary focus:ring-offset-2"
          >
            {user.profilePictureUrl ? (
              <img
                src={user.profilePictureUrl}
                alt={fullName || 'Profile'}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-admin-primary flex items-center justify-center text-white text-xl font-bold">
                {initials}
              </div>
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
              {picLoading
                ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                : <RiCameraLine className="h-5 w-5 text-white" />
              }
            </div>
          </button>

          <span className="text-[10px] text-admin-textMuted">
            {picLoading ? 'Uploading…' : 'Change photo'}
          </span>

          {/* Hidden file input */}
          <input
            ref={picInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handlePictureChange}
          />
        </div>

        {/* Identity info */}
        <div className="min-w-0 flex-1">
          <p className="text-lg font-semibold text-admin-text">{fullName || 'No name set'}</p>
          <p className="text-sm text-admin-textMuted">{user.email}</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {[...(user.roles || [])].map(r => (
              <span key={r} className="inline-flex items-center rounded-full bg-admin-primary/10 px-2.5 py-0.5 text-xs font-medium text-admin-primary">
                {r}
              </span>
            ))}
          </div>

          {/* Upload error */}
          {picError && (
            <p className="mt-2 text-xs text-admin-danger">{picError}</p>
          )}
        </div>
      </div>

      {/* ── Read-only details ──────────────────────────────────────────── */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-admin-textMuted">Account Details</h2>
        <InfoRow icon={RiMailLine}        label="Email"        value={user.email}      verified={user.emailVerified} />
        <InfoRow icon={RiPhoneLine}       label="Phone"        value={user.phone}      verified={user.phoneVerified} />
        {memberSince && <InfoRow icon={RiCalendarLine} label="Member Since" value={memberSince} />}
        <InfoRow icon={RiShieldUserLine}  label="Account Type" value={user.userType} />
      </section>

      {/* ── Edit profile form ──────────────────────────────────────────── */}
      <section className="rounded-2xl border border-admin-border bg-admin-card p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-admin-text">Personal Information</h2>
          {!editMode && (
            <button
              onClick={() => { setProfileSuccess(''); setEditMode(true) }}
              className="flex items-center gap-1.5 rounded-lg border border-admin-border px-3 py-1.5 text-xs font-medium text-admin-text hover:bg-admin-sideHover hover:text-white transition-colors duration-150"
            >
              <RiEditLine className="h-3.5 w-3.5" />
              Edit
            </button>
          )}
        </div>

        {profileSuccess && (
          <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-2.5 text-sm text-emerald-700">
            {profileSuccess}
          </div>
        )}
        {profileError && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-admin-danger">
            {profileError}
          </div>
        )}

        {editMode ? (
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="First Name"
                value={profileForm.firstName}
                onChange={onProfileChange('firstName')}
                error={profileErrors.firstName}
                placeholder="Jane"
                autoFocus
              />
              <InputField
                label="Last Name"
                value={profileForm.lastName}
                onChange={onProfileChange('lastName')}
                error={profileErrors.lastName}
                placeholder="Doe"
              />
            </div>
            <InputField
              label="Phone"
              value={profileForm.phone}
              onChange={onProfileChange('phone')}
              error={profileErrors.phone}
              placeholder="+880 1XXX XXX XXX"
            />
            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={profileLoading}
                className="flex items-center gap-2 rounded-lg bg-admin-primary px-4 py-2 text-sm font-medium text-white hover:bg-admin-priDark transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {profileLoading
                  ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  : <RiSaveLine className="h-4 w-4" />
                }
                Save Changes
              </button>
              <button
                type="button"
                onClick={handleEditCancel}
                className="flex items-center gap-2 rounded-lg border border-admin-border px-4 py-2 text-sm font-medium text-admin-text hover:bg-admin-sideHover hover:text-white transition-colors duration-150"
              >
                <RiCloseLine className="h-4 w-4" />
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-admin-textMuted mb-1">First Name</p>
              <p className="text-sm font-medium text-admin-text">{user.firstName || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-admin-textMuted mb-1">Last Name</p>
              <p className="text-sm font-medium text-admin-text">{user.lastName || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-admin-textMuted mb-1">Phone</p>
              <p className="text-sm font-medium text-admin-text">{user.phone || '—'}</p>
            </div>
          </div>
        )}
      </section>

      {/* ── Change / Set password ──────────────────────────────────────── */}
      <section className="rounded-2xl border border-admin-border bg-admin-card p-6 space-y-5">
        <div className="flex items-center gap-2">
          <RiLockPasswordLine className="h-4.5 w-4.5 text-admin-textMuted" />
          <h2 className="text-sm font-semibold text-admin-text">
            {hasPassword ? 'Change Password' : 'Set a Password'}
          </h2>
        </div>

        {!hasPassword && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
            Your account was created with Google. You can set a password here to enable email/password sign-in as well.
          </div>
        )}

        {pwSuccess && (
          <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-2.5 text-sm text-emerald-700">
            {pwSuccess}
          </div>
        )}
        {pwError && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-admin-danger">
            {pwError}
          </div>
        )}

        <form onSubmit={handlePasswordSave} className="space-y-4">
          {hasPassword && (
            <PasswordInput
              label="Current Password"
              value={pwForm.currentPassword}
              onChange={onPwChange('currentPassword')}
              error={pwErrors.currentPassword}
              placeholder="Enter your current password"
              autoComplete="current-password"
            />
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PasswordInput
              label="New Password"
              value={pwForm.newPassword}
              onChange={onPwChange('newPassword')}
              error={pwErrors.newPassword}
              placeholder="At least 8 characters"
              autoComplete="new-password"
            />
            <PasswordInput
              label="Confirm New Password"
              value={pwForm.confirmPassword}
              onChange={onPwChange('confirmPassword')}
              error={pwErrors.confirmPassword}
              placeholder="Repeat new password"
              autoComplete="new-password"
            />
          </div>
          <button
            type="submit"
            disabled={pwLoading}
            className="flex items-center gap-2 rounded-lg bg-admin-primary px-4 py-2 text-sm font-medium text-white hover:bg-admin-priDark transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {pwLoading
              ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              : <RiLockPasswordLine className="h-4 w-4" />
            }
            {hasPassword ? 'Update Password' : 'Set Password'}
          </button>
        </form>
      </section>
    </div>
  )
}

export default ProfilePage
