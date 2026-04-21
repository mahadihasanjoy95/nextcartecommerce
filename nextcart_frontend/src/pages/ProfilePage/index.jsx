import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  RiMailLine,
  RiPhoneLine,
  RiCalendarLine,
  RiShieldUserLine,
  RiCheckboxCircleFill,
  RiLogoutBoxRLine,
  RiEditLine,
  RiCloseLine,
  RiSaveLine,
  RiLockPasswordLine,
} from 'react-icons/ri'
import { useAuth } from '@/hooks/useAuth'
import authService from '@/services/authService'
import InputField from '@/components/common/InputField'

// ── Info card ─────────────────────────────────────────────────────────────────
function InfoCard({ icon: Icon, label, value, verified }) {
  return (
    <div className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 px-5 py-4 shadow-card">
      <div className="w-10 h-10 rounded-xl bg-brand-pink-50 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-brand-pink-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-body text-xs text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
        <p className="font-body text-sm font-medium text-gray-800 truncate">{value || '—'}</p>
      </div>
      {verified !== undefined && (
        <span className={`flex items-center gap-1 text-xs font-body font-medium shrink-0 ${
          verified ? 'text-emerald-600' : 'text-gray-400'
        }`}>
          {verified && <RiCheckboxCircleFill className="w-3.5 h-3.5" />}
          {verified ? 'Verified' : 'Unverified'}
        </span>
      )}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
function ProfilePage() {
  const { user, logout, updateUser } = useAuth()
  const navigate = useNavigate()

  // ── Profile edit state ──────────────────────────────────────────────────
  const [editMode, setEditMode]       = useState(false)
  const [profileForm, setProfileForm] = useState({
    firstName: user.firstName || '',
    lastName:  user.lastName  || '',
    phone:     user.phone     || '',
  })
  const [profileErrors, setProfileErrors]   = useState({})
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState('')
  const [profileError, setProfileError]     = useState('')

  // ── Password change state ───────────────────────────────────────────────
  const [pwForm, setPwForm]       = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [pwErrors, setPwErrors]   = useState({})
  const [pwLoading, setPwLoading] = useState(false)
  const [pwSuccess, setPwSuccess] = useState('')
  const [pwError, setPwError]     = useState('')

  const initials = [user.firstName?.[0], user.lastName?.[0]].filter(Boolean).join('').toUpperCase() || '?'
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ')
  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : null

  // ── Profile handlers ────────────────────────────────────────────────────
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
    if (hasPassword && !pwForm.currentPassword)           errors.currentPassword = 'Current password is required'
    if (!pwForm.newPassword)                              errors.newPassword     = 'New password is required'
    else if (pwForm.newPassword.length < 8)               errors.newPassword     = 'Must be at least 8 characters'
    if (pwForm.newPassword !== pwForm.confirmPassword)    errors.confirmPassword = 'Passwords do not match'
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

  const handleLogout = async () => {
    await logout()
    navigate('/', { replace: true })
  }

  return (
    <div className="page-container py-10 sm:py-14 animate-fade-in">
      <div className="max-w-2xl mx-auto space-y-8">

        {/* ── Identity header ────────────────────────────────────────────── */}
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-pink-400 to-brand-pink-600
                          flex items-center justify-center shadow-glow mb-4">
            <span className="font-heading text-2xl font-bold text-white">{initials}</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-semibold text-gray-900 mb-1">
            {fullName || 'Your Profile'}
          </h1>
          <p className="font-body text-sm text-gray-400">{user.email}</p>
        </div>

        {/* ── Account details ────────────────────────────────────────────── */}
        <section className="space-y-3">
          <p className="font-body text-xs font-semibold uppercase tracking-wider text-gray-400 px-1">Account Details</p>
          <InfoCard icon={RiMailLine}       label="Email"        value={user.email}   verified={user.emailVerified} />
          <InfoCard icon={RiPhoneLine}      label="Phone"        value={user.phone}   verified={user.phoneVerified} />
          {memberSince && <InfoCard icon={RiCalendarLine} label="Member Since" value={memberSince} />}
          <InfoCard icon={RiShieldUserLine} label="Account Type" value={user.userType === 'CUSTOMER' ? 'Customer' : user.userType} />
        </section>

        {/* ── Edit personal info ─────────────────────────────────────────── */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 space-y-5">
          <div className="flex items-center justify-between">
            <p className="font-body text-sm font-semibold text-gray-800">Personal Information</p>
            {!editMode && (
              <button
                onClick={() => { setProfileSuccess(''); setEditMode(true) }}
                className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:border-brand-pink-300 hover:text-brand-pink-500 hover:bg-brand-pink-50 transition-colors duration-150"
              >
                <RiEditLine className="w-3.5 h-3.5" />
                Edit
              </button>
            )}
          </div>

          {profileSuccess && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2.5 font-body text-sm text-emerald-700">
              {profileSuccess}
            </div>
          )}
          {profileError && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 font-body text-sm text-red-600">
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
                  className="btn-primary text-sm !px-5 !py-2.5 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {profileLoading
                    ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    : <RiSaveLine className="w-4 h-4" />
                  }
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleEditCancel}
                  className="btn-outline text-sm !px-5 !py-2.5"
                >
                  <RiCloseLine className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="font-body text-xs text-gray-400 mb-1">First Name</p>
                <p className="font-body text-sm font-medium text-gray-800">{user.firstName || '—'}</p>
              </div>
              <div>
                <p className="font-body text-xs text-gray-400 mb-1">Last Name</p>
                <p className="font-body text-sm font-medium text-gray-800">{user.lastName || '—'}</p>
              </div>
              <div>
                <p className="font-body text-xs text-gray-400 mb-1">Phone</p>
                <p className="font-body text-sm font-medium text-gray-800">{user.phone || '—'}</p>
              </div>
            </div>
          )}
        </section>

        {/* ── Change / Set password ──────────────────────────────────────── */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 space-y-5">
          <div className="flex items-center gap-2">
            <RiLockPasswordLine className="w-4 h-4 text-gray-400" />
            <p className="font-body text-sm font-semibold text-gray-800">
              {hasPassword ? 'Change Password' : 'Set a Password'}
            </p>
          </div>

          {!hasPassword && (
            <div className="rounded-xl bg-blue-50 border border-blue-200 px-4 py-3">
              <p className="font-body text-sm text-blue-700">
                Your account was created with Google. You can set a password here to also enable email/password sign-in.
              </p>
            </div>
          )}

          {pwSuccess && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2.5 font-body text-sm text-emerald-700">
              {pwSuccess}
            </div>
          )}
          {pwError && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 font-body text-sm text-red-600">
              {pwError}
            </div>
          )}

          <form onSubmit={handlePasswordSave} className="space-y-4">
            {hasPassword && (
              <InputField
                type="password"
                label="Current Password"
                value={pwForm.currentPassword}
                onChange={onPwChange('currentPassword')}
                error={pwErrors.currentPassword}
                placeholder="Enter your current password"
                autoComplete="current-password"
              />
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                type="password"
                label="New Password"
                value={pwForm.newPassword}
                onChange={onPwChange('newPassword')}
                error={pwErrors.newPassword}
                placeholder="At least 8 characters"
                autoComplete="new-password"
              />
              <InputField
                type="password"
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
              className="btn-primary text-sm !px-5 !py-2.5 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {pwLoading
                ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                : <RiLockPasswordLine className="w-4 h-4" />
              }
              {hasPassword ? 'Update Password' : 'Set Password'}
            </button>
          </form>
        </section>

        {/* ── Sign out ───────────────────────────────────────────────────── */}
        <div className="flex justify-center pb-4">
          <button
            onClick={handleLogout}
            className="btn-outline !border-gray-200 !text-gray-600
                       hover:!border-red-300 hover:!text-red-500 hover:!bg-red-50
                       text-sm !px-8 !py-3"
          >
            <RiLogoutBoxRLine className="w-4 h-4" />
            Sign Out
          </button>
        </div>

      </div>
    </div>
  )
}

export default ProfilePage
