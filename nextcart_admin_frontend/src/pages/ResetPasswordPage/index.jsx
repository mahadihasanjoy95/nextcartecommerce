import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { RiShoppingBag3Line, RiAlertLine, RiArrowLeftLine } from 'react-icons/ri'
import InputField from '@/components/common/InputField'
import Button from '@/components/common/Button'
import { APP_NAME } from '@/constants/app'
import authService from '@/services/authService'

function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token') || ''

  const [form, setForm]         = useState({ newPassword: '', confirmPassword: '' })
  const [errors, setErrors]     = useState({})
  const [errorMsg, setErrorMsg] = useState(null)
  const [success, setSuccess]   = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-admin-bg px-4">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-admin-text mb-2">Invalid reset link</h1>
          <p className="text-sm text-admin-textMuted mb-4">This link is invalid or missing a token.</p>
          <Link to="/forgot-password" className="text-sm font-medium text-admin-primary hover:underline">
            Request a new link
          </Link>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-admin-bg px-4">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-admin-text mb-2">Password updated!</h1>
          <p className="text-sm text-admin-textMuted mb-4">Your password has been reset successfully.</p>
          <Link to="/login" className="text-sm font-medium text-admin-primary hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    )
  }

  const validate = () => {
    const errs = {}
    if (!form.newPassword) errs.newPassword = 'Password is required'
    else if (form.newPassword.length < 8) errs.newPassword = 'At least 8 characters'
    if (!form.confirmPassword) errs.confirmPassword = 'Please confirm your password'
    else if (form.newPassword !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setIsSubmitting(true)
    setErrorMsg(null)
    try {
      await authService.resetPassword(token, form.newPassword)
      setSuccess(true)
    } catch (err) {
      setErrorMsg(err.message || 'Failed to reset password. The link may have expired.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const onChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-admin-bg px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-admin-primary text-white shadow-lg">
            <RiShoppingBag3Line className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-semibold text-admin-text">{APP_NAME}</h1>
          <p className="mt-1 text-sm text-admin-textMuted">Set a new password</p>
        </div>

        <div className="rounded-2xl border border-admin-border bg-white px-8 py-8 shadow-panel">
          {errorMsg && (
            <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <RiAlertLine className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
              <p className="text-sm text-red-700">{errorMsg}</p>
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
            <Button
              type="submit"
              variant="primary"
              className="w-full justify-center py-2.5"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating…' : 'Reset Password'}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Link to="/login" className="inline-flex items-center gap-1 text-xs text-admin-textMuted hover:text-admin-primary transition-colors duration-150">
              <RiArrowLeftLine className="h-3 w-3" />
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage
