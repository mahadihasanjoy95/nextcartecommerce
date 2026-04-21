import { useState } from 'react'
import { Link } from 'react-router-dom'
import { RiShoppingBag3Line, RiMailLine, RiAlertLine, RiArrowLeftLine } from 'react-icons/ri'
import InputField from '@/components/common/InputField'
import Button from '@/components/common/Button'
import { APP_NAME } from '@/constants/app'
import authService from '@/services/authService'

function ForgotPasswordPage() {
  const [email, setEmail]       = useState('')
  const [status, setStatus]     = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setIsSubmitting(true)
    setErrorMsg(null)
    try {
      const result = await authService.forgotPassword(email.trim())
      setStatus(result.type)
    } catch (err) {
      setErrorMsg(err.message || 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (status) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-admin-bg px-4">
        <div className="w-full max-w-sm text-center">
          <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-admin-primary text-white shadow-lg">
            <RiMailLine className="h-7 w-7" />
          </div>
          <h1 className="text-xl font-semibold text-admin-text mb-2">
            {status === 'EMAIL_SENT' ? 'Check your email' : 'Google account detected'}
          </h1>
          <p className="text-sm text-admin-textMuted mb-6">
            {status === 'EMAIL_SENT'
              ? `We sent a reset link to ${email}. It expires in 30 minutes.`
              : 'Your account uses Google Sign-In. We sent you instructions via email.'}
          </p>
          <Link to="/login" className="text-sm font-medium text-admin-primary hover:underline">
            Back to login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-admin-bg px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-admin-primary text-white shadow-lg">
            <RiShoppingBag3Line className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-semibold text-admin-text">{APP_NAME}</h1>
          <p className="mt-1 text-sm text-admin-textMuted">Reset your admin password</p>
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
              label="Email address"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              autoFocus
              required
            />
            <Button
              type="submit"
              variant="primary"
              className="w-full justify-center py-2.5"
              disabled={isSubmitting || !email.trim()}
            >
              {isSubmitting ? 'Sending…' : 'Send Reset Link'}
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

export default ForgotPasswordPage
