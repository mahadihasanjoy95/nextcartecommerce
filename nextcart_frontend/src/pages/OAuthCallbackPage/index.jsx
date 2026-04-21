import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { APP_NAME } from '@/constants/app'
import { RiSparklingLine } from 'react-icons/ri'

function OAuthCallbackPage() {
  const [searchParams] = useSearchParams()
  const { loginWithTokens } = useAuth()
  const navigate = useNavigate()
  const handled = useRef(false)

  useEffect(() => {
    if (handled.current) return
    handled.current = true

    const accessToken  = searchParams.get('accessToken')
    const refreshToken = searchParams.get('refreshToken')
    const error        = searchParams.get('error')

    if (error || !accessToken || !refreshToken) {
      navigate('/login?error=oauth2_failed', { replace: true })
      return
    }

    loginWithTokens(accessToken, refreshToken)
      .then(() => navigate('/', { replace: true }))
      .catch(() => navigate('/login?error=oauth2_failed', { replace: true }))
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-surface gap-4">
      <div className="flex items-center gap-2">
        <RiSparklingLine className="w-7 h-7 text-brand-pink-500 animate-float" />
        <span className="font-heading text-2xl font-semibold text-gray-900">
          {APP_NAME}<span className="text-brand-pink-500">.</span>
        </span>
      </div>
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-pink-200 border-t-brand-pink-500" />
      <p className="font-body text-sm text-gray-400">Signing you in…</p>
    </div>
  )
}

export default OAuthCallbackPage
