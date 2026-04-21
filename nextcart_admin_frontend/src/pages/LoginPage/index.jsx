import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { RiEyeLine, RiEyeOffLine, RiShoppingBag3Line, RiAlertLine } from 'react-icons/ri'
import { useAuth } from '@/hooks/useAuth'
import InputField from '@/components/common/InputField'
import Button from '@/components/common/Button'
import { APP_NAME } from '@/constants/app'

function LoginPage() {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail]           = useState('')
  const [password, setPassword]     = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg]     = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/products" replace />
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErrorMsg(null)
    setIsSubmitting(true)
    try {
      await login(email.trim(), password)
      navigate('/products', { replace: true })
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-admin-bg px-4">
      <div className="w-full max-w-sm">

        {/* Logo + heading */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-admin-primary text-white shadow-lg">
            <RiShoppingBag3Line className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-semibold text-admin-text">{APP_NAME}</h1>
          <p className="mt-1 text-sm text-admin-textMuted">Sign in to your admin account</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-admin-border bg-white px-8 py-8 shadow-panel">

          {/* Error banner */}
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
              required
            />

            {/* Password with show/hide toggle */}
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-admin-text">Password</span>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="w-full rounded-lg border border-admin-inputBorder bg-white px-3.5 py-2.5 pr-10 text-sm text-admin-text outline-none transition-colors duration-150 placeholder:text-admin-textMuted hover:border-gray-400 focus:border-admin-primary focus:ring-2 focus:ring-admin-primary/15"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-3 flex items-center text-admin-textMuted hover:text-admin-text transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword
                    ? <RiEyeOffLine className="h-4 w-4" />
                    : <RiEyeLine    className="h-4 w-4" />
                  }
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full justify-center py-2.5"
              disabled={isSubmitting || !email || !password}
            >
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Link
              to="/forgot-password"
              className="text-xs text-admin-textMuted hover:text-admin-primary transition-colors duration-150"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-admin-textMuted">
          Admin access only. Contact your super admin if you need an account.
        </p>
      </div>
    </div>
  )
}

export default LoginPage
