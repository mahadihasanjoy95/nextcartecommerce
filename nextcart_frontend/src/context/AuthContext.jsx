import { createContext, useCallback, useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import authService from '@/services/authService'
import { TOKEN_KEYS } from '@/constants/api'
import { RiSparklingLine } from 'react-icons/ri'
import { APP_NAME } from '@/constants/app'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]           = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const queryClient               = useQueryClient()

  // ── logout ────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem(TOKEN_KEYS.REFRESH)
    if (refreshToken) {
      authService.logout(refreshToken).catch(() => {})
    }
    localStorage.removeItem(TOKEN_KEYS.ACCESS)
    localStorage.removeItem(TOKEN_KEYS.REFRESH)
    queryClient.clear()
    setUser(null)
  }, [queryClient])

  // ── listen for forced logout from apiClient on refresh failure ────────────
  useEffect(() => {
    window.addEventListener('auth:logout', logout)
    return () => window.removeEventListener('auth:logout', logout)
  }, [logout])

  // ── startup: validate stored token ────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEYS.ACCESS)
    if (!token) {
      setIsLoading(false)
      return
    }

    authService
      .getMe()
      .then((profile) => setUser(profile))
      .catch(() => {
        localStorage.removeItem(TOKEN_KEYS.ACCESS)
        localStorage.removeItem(TOKEN_KEYS.REFRESH)
      })
      .finally(() => setIsLoading(false))
  }, [])

  // ── login ─────────────────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    const tokens = await authService.login(email, password)
    localStorage.setItem(TOKEN_KEYS.ACCESS,  tokens.accessToken)
    localStorage.setItem(TOKEN_KEYS.REFRESH, tokens.refreshToken)

    const profile = await authService.getMe()
    setUser(profile)
  }, [])

  // ── signup + auto-login ───────────────────────────────────────────────────
  const signup = useCallback(async (firstName, lastName, email, password) => {
    await authService.register(firstName, lastName, email, password)
    await login(email, password)
  }, [login])

  // ── OAuth2 callback — called by OAuthCallbackPage after receiving tokens from URL ──
  const loginWithTokens = useCallback(async (accessToken, refreshToken) => {
    localStorage.setItem(TOKEN_KEYS.ACCESS,  accessToken)
    localStorage.setItem(TOKEN_KEYS.REFRESH, refreshToken)
    const profile = await authService.getMe()
    setUser(profile)
  }, [])

  // ── fullscreen spinner while checking stored session ──────────────────────
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-surface gap-4">
        <div className="flex items-center gap-2">
          <RiSparklingLine className="w-7 h-7 text-brand-pink-500 animate-float" />
          <span className="font-heading text-2xl font-semibold text-gray-900">
            {APP_NAME}<span className="text-brand-pink-500">.</span>
          </span>
        </div>
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-pink-200 border-t-brand-pink-500" />
      </div>
    )
  }

  const updateUser = (updatedProfile) => setUser(updatedProfile)

  const value = {
    user,
    isAuthenticated: user !== null,
    login,
    loginWithTokens,
    signup,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
