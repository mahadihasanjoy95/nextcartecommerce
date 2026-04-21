import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { RiUserAddLine } from 'react-icons/ri'
import InputField from '@/components/common/InputField'
import { useAuth } from '@/hooks/useAuth'
import { validateSignupForm } from '@/utils/validators'

function SignupPage() {
  const { isAuthenticated, signup } = useAuth()
  const navigate = useNavigate()

  const [form, setForm]         = useState({ firstName: '', lastName: '', email: '', password: '' })
  const [errors, setErrors]     = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading]   = useState(false)

  if (isAuthenticated) return <Navigate to="/" replace />

  const onChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
    if (apiError) setApiError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { isValid, errors: validationErrors } = validateSignupForm(form)
    if (!isValid) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    setApiError('')

    try {
      await signup(
        form.firstName.trim(),
        form.lastName.trim(),
        form.email.trim(),
        form.password,
      )
      navigate('/', { replace: true })
    } catch (err) {
      setApiError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-semibold text-gray-900 mb-2">
          Create Account
        </h1>
        <p className="font-body text-sm text-gray-500">
          Join us and discover curated fashion collections
        </p>
      </div>

      {apiError && (
        <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
          <p className="font-body text-sm text-red-600">{apiError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label="First Name"
            placeholder="Jane"
            value={form.firstName}
            onChange={onChange('firstName')}
            error={errors.firstName}
            autoComplete="given-name"
            autoFocus
          />
          <InputField
            label="Last Name"
            placeholder="Doe"
            value={form.lastName}
            onChange={onChange('lastName')}
            error={errors.lastName}
            autoComplete="family-name"
          />
        </div>

        <InputField
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={onChange('email')}
          error={errors.email}
          autoComplete="email"
        />

        <InputField
          label="Password"
          type="password"
          placeholder="At least 8 characters"
          value={form.password}
          onChange={onChange('password')}
          error={errors.password}
          hint="Must be at least 8 characters"
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
              Creating account...
            </>
          ) : (
            <>
              <RiUserAddLine className="w-5 h-5" />
              Create Account
            </>
          )}
        </button>
      </form>

      <p className="mt-8 text-center font-body text-sm text-gray-500">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-semibold text-brand-pink-500 hover:text-brand-pink-600 transition-colors duration-150"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}

export default SignupPage
