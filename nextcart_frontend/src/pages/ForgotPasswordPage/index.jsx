import { useState } from 'react'
import { Link } from 'react-router-dom'
import { RiMailLine, RiArrowLeftLine } from 'react-icons/ri'
import InputField from '@/components/common/InputField'
import authService from '@/services/authService'

function ForgotPasswordPage() {
  const [email, setEmail]       = useState('')
  const [status, setStatus]     = useState(null) // 'EMAIL_SENT' | 'SOCIAL_ACCOUNT'
  const [apiError, setApiError] = useState('')
  const [loading, setLoading]   = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return

    setLoading(true)
    setApiError('')

    try {
      const result = await authService.forgotPassword(email.trim())
      setStatus(result.type)
    } catch (err) {
      setApiError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'EMAIL_SENT') {
    return (
      <div className="animate-fade-in text-center">
        <div className="mx-auto mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
          <RiMailLine className="h-7 w-7 text-green-600" />
        </div>
        <h1 className="font-heading text-2xl font-semibold text-gray-900 mb-2">Check your inbox</h1>
        <p className="font-body text-sm text-gray-500 mb-6">
          We sent a password reset link to <strong>{email}</strong>. The link expires in 30 minutes.
        </p>
        <Link to="/login" className="font-body text-sm font-medium text-brand-pink-500 hover:text-brand-pink-600 transition-colors duration-150">
          Back to login
        </Link>
      </div>
    )
  }

  if (status === 'SOCIAL_ACCOUNT') {
    return (
      <div className="animate-fade-in text-center">
        <h1 className="font-heading text-2xl font-semibold text-gray-900 mb-2">Google account detected</h1>
        <p className="font-body text-sm text-gray-500 mb-6">
          Your account uses Google Sign-In. We&apos;ve sent you an email with instructions. Please sign in with Google.
        </p>
        <Link to="/login" className="font-body text-sm font-medium text-brand-pink-500 hover:text-brand-pink-600 transition-colors duration-150">
          Back to login
        </Link>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <Link to="/login" className="mb-6 inline-flex items-center gap-1.5 font-body text-xs text-gray-400 hover:text-gray-600 transition-colors duration-150">
        <RiArrowLeftLine className="h-3.5 w-3.5" />
        Back to login
      </Link>

      <div className="mb-8">
        <h1 className="font-heading text-3xl font-semibold text-gray-900 mb-2">Forgot password?</h1>
        <p className="font-body text-sm text-gray-500">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      {apiError && (
        <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
          <p className="font-body text-sm text-red-600">{apiError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <InputField
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          autoFocus
        />

        <button
          type="submit"
          disabled={loading || !email.trim()}
          className="btn-primary w-full !py-3.5 text-sm disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-md"
        >
          {loading ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Sending…
            </>
          ) : (
            <>
              <RiMailLine className="w-5 h-5" />
              Send Reset Link
            </>
          )}
        </button>
      </form>
    </div>
  )
}

export default ForgotPasswordPage
