import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { RiLoginCircleLine, RiArrowLeftLine } from 'react-icons/ri'
import InputField from '@/components/common/InputField'
import { useAuth } from '@/hooks/useAuth'
import { validateLoginForm } from '@/utils/validators'
import { GOOGLE_LOGIN_URL } from '@/constants/api'

const GOOGLE_SIGN_IN_REQUIRED_CODE = 'GOOGLE_SIGN_IN_REQUIRED'

function LoginPage() {
  const { isAuthenticated, login } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const from      = location.state?.from?.pathname || '/'

  const [form, setForm]                 = useState({ email: '', password: '' })
  const [errors, setErrors]             = useState({})
  const [apiError, setApiError]         = useState('')
  const [googleNudge, setGoogleNudge]   = useState(false)
  const [loading, setLoading]           = useState(false)

  if (isAuthenticated) return <Navigate to="/" replace />

  const onChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
    if (apiError) setApiError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { isValid, errors: validationErrors } = validateLoginForm(form)
    if (!isValid) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    setApiError('')

    try {
      await login(form.email.trim(), form.password)
      navigate(from, { replace: true })
    } catch (err) {
      if (err.code === GOOGLE_SIGN_IN_REQUIRED_CODE) {
        setGoogleNudge(true)
      } else {
        setApiError(err.message || 'Login failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-fade-in">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 mb-6 font-body text-sm text-gray-400 hover:text-brand-pink-500 transition-colors duration-150"
      >
        <RiArrowLeftLine className="w-4 h-4" />
        Back to Home
      </Link>

      <div className="mb-8">
        <h1 className="font-heading text-3xl font-semibold text-gray-900 mb-2">
          Welcome Back
        </h1>
        <p className="font-body text-sm text-gray-500">
          Sign in to your account to continue shopping
        </p>
      </div>

      {googleNudge && (
        <div className="mb-6 rounded-xl bg-blue-50 border border-blue-200 px-4 py-3">
          <p className="font-body text-sm text-blue-700 font-medium mb-2">
            This account was created with Google.
          </p>
          <a
            href={GOOGLE_LOGIN_URL}
            className="inline-flex items-center gap-2 rounded-lg border border-blue-300 bg-white px-3 py-2 text-xs font-medium text-blue-700 hover:bg-blue-50 transition-colors duration-150"
          >
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Sign in with Google instead
          </a>
        </div>
      )}

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
          value={form.email}
          onChange={onChange('email')}
          error={errors.email}
          autoComplete="email"
          autoFocus
        />

        <div>
          <InputField
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={onChange('password')}
            error={errors.password}
            autoComplete="current-password"
          />
          <div className="mt-1.5 flex justify-end">
            <Link
              to="/forgot-password"
              className="font-body text-xs text-gray-400 hover:text-brand-pink-500 transition-colors duration-150"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full !py-3.5 text-sm disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-md"
        >
          {loading ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              <RiLoginCircleLine className="w-5 h-5" />
              Sign In
            </>
          )}
        </button>
      </form>

      {/* ── Divider ───────────────────────────────────────────────────────── */}
      <div className="mt-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="font-body text-xs text-gray-400 uppercase tracking-wider">or</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      {/* ── Google OAuth2 ─────────────────────────────────────────────────── */}
      <a
        href={GOOGLE_LOGIN_URL}
        className="mt-4 flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition-all duration-150 hover:bg-gray-50 hover:border-gray-300 hover:shadow"
      >
        {/* Google SVG icon */}
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
          <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
          <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
          <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
        </svg>
        Continue with Google
      </a>

      <p className="mt-6 text-center font-body text-sm text-gray-500">
        Don&apos;t have an account?{' '}
        <Link
          to="/signup"
          className="font-semibold text-brand-pink-500 hover:text-brand-pink-600 transition-colors duration-150"
        >
          Create one
        </Link>
      </p>
    </div>
  )
}

export default LoginPage
