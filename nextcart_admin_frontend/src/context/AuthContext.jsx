import { createContext, useCallback, useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import authService from '@/services/authService'
import { BLOCKED_ROLES, TOKEN_KEYS } from '@/constants/api'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]         = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const queryClient             = useQueryClient()

  // ── logout ────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem(TOKEN_KEYS.REFRESH)
    if (refreshToken) {
      authService.logout(refreshToken).catch(() => {}) // fire-and-forget
    }
    localStorage.removeItem(TOKEN_KEYS.ACCESS)
    localStorage.removeItem(TOKEN_KEYS.REFRESH)
    queryClient.clear()
    setUser(null)
  }, [queryClient])

  // ── listen for forced logout dispatched by apiClient on refresh failure ─
  useEffect(() => {
    window.addEventListener('auth:logout', logout)
    return () => window.removeEventListener('auth:logout', logout)
  }, [logout])

  // ── startup: validate stored token ────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEYS.ACCESS)
    if (!token) {
      setIsLoading(false)
      return
    }

    authService
      .getMe()
      .then((profile) => {
        const isBlocked = profile?.roles?.every((r) => BLOCKED_ROLES.includes(r))
        if (!isBlocked) {
          setUser(profile)
        } else {
          localStorage.removeItem(TOKEN_KEYS.ACCESS)
          localStorage.removeItem(TOKEN_KEYS.REFRESH)
        }
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEYS.ACCESS)
        localStorage.removeItem(TOKEN_KEYS.REFRESH)
      })
      .finally(() => setIsLoading(false))
  }, [])

  // ── login ─────────────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    const tokens = await authService.login(email, password)
    localStorage.setItem(TOKEN_KEYS.ACCESS,  tokens.accessToken)
    localStorage.setItem(TOKEN_KEYS.REFRESH, tokens.refreshToken)

    const profile = await authService.getMe()
    const isBlocked = profile?.roles?.every((r) => BLOCKED_ROLES.includes(r))

    if (isBlocked) {
      localStorage.removeItem(TOKEN_KEYS.ACCESS)
      localStorage.removeItem(TOKEN_KEYS.REFRESH)
      throw new Error('Access denied. Customer accounts cannot access the admin panel.')
    }

    setUser(profile)
  }, [])

  // ── fullscreen spinner while checking stored session ──────────────────
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-admin-bg">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-admin-primary border-t-transparent" />
      </div>
    )
  }

  const updateUser = (updatedProfile) => setUser(updatedProfile)

  const value = {
    user,
    isAuthenticated: user !== null,
    login,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
