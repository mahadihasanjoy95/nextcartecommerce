import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { RiLockPasswordLine, RiArrowLeftLine } from 'react-icons/ri'
import InputField from '@/components/common/InputField'
import authService from '@/services/authService'

function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token') || ''

  const [form, setForm]         = useState({ newPassword: '', confirmPassword: '' })
  const [errors, setErrors]     = useState({})
  const [apiError, setApiError] = useState('')
  const [success, setSuccess]   = useState(false)
  const [loading, setLoading]   = useState(false)

  if (!token) {
    return (
      <div className="animate-fade-in text-center">
        <h1 className="font-heading text-2xl font-semibold text-gray-900 mb-2">Invalid link</h1>
        <p className="font-body text-sm text-gray-500 mb-6">This reset link is invalid or missing a token.</p>
        <Link to="/forgot-password" className="font-body text-sm font-medium text-brand-pink-500 hover:text-brand-pink-600 transition-colors duration-150">
          Request a new link
        </Link>
      </div>
    )
  }

  if (success) {
    return (
      <div className="animate-fade-in text-center">
        <h1 className="font-heading text-2xl font-semibold text-gray-900 mb-2">Password updated!</h1>
        <p className="font-body text-sm text-gray-500 mb-6">Your password has been reset successfully.</p>
        <Link to="/login" className="font-body text-sm font-medium text-brand-pink-500 hover:text-brand-pink-600 transition-colors duration-150">
          Sign in
        </Link>
      </div>
    )
  }

  const validate = () => {
    const errs = {}
    if (!form.newPassword) errs.newPassword = 'Password is required'
    else if (form.newPassword.length < 8) errs.newPassword = 'Password must be at least 8 characters'
    if (!form.confirmPassword) errs.confirmPassword = 'Please confirm your password'
    else if (form.newPassword !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    setApiError('')

    try {
      await authService.resetPassword(token, form.newPassword)
      setSuccess(true)
    } catch (err) {
      setApiError(err.message || 'Failed to reset password. The link may have expired.')
    } finally {
      setLoading(false)
    }
  }

  const onChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  return (
    <div className="animate-fade-in">
      <Link to="/login" className="mb-6 inline-flex items-center gap-1.5 font-body text-xs text-gray-400 hover:text-gray-600 transition-colors duration-150">
        <RiArrowLeftLine className="h-3.5 w-3.5" />
        Back to login
      </Link>

      <div className="mb-8">
        <h1 className="font-heading text-3xl font-semibold text-gray-900 mb-2">Set new password</h1>
        <p className="font-body text-sm text-gray-500">Choose a strong password to secure your account.</p>
      </div>

      {apiError && (
        <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
          <p className="font-body text-sm text-red-600">{apiError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <InputField
          label="New password"
          type="password"
          placeholder="At least 8 characters"
          value={form.newPassword}
          onChange={onChange('newPassword')}
          error={errors.newPassword}
          autoComplete="new-password"
          autoFocus
        />
        <InputField
          label="Confirm password"
          type="password"
          placeholder="Repeat your new password"
          value={form.confirmPassword}
          onChange={onChange('confirmPassword')}
          error={errors.confirmPassword}
          autoComplete="new-password"
        />

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full !py-3.5 text-sm disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-md"
        >
          {loading ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Updating…
            </>
          ) : (
            <>
              <RiLockPasswordLine className="w-5 h-5" />
              Reset Password
            </>
          )}
        </button>
      </form>
    </div>
  )
}

export default ResetPasswordPage
