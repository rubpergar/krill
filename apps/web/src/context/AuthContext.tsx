import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { User } from '../types'
import { getAccessToken, setAccessToken, setRefreshToken, clearTokens, getRefreshToken } from '../lib/auth-storage'
import { api } from '../lib/api'

export interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isAdmin: boolean
  isLoading: boolean
  login: (accessToken: string, refreshToken: string, user: User) => void
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  isLoading: true,
  login: () => {},
  logout: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = getAccessToken()
    if (!token) {
      setIsLoading(false)
      return
    }
    api.get<{ user: User }>('/auth/me')
      .then((res) => setUser(res.user))
      .catch(() => clearTokens())
      .finally(() => setIsLoading(false))
  }, [])

  const login = useCallback((accessToken: string, refreshToken: string, user: User) => {
    setAccessToken(accessToken)
    setRefreshToken(refreshToken)
    setUser(user)
  }, [])

  const logout = useCallback(async () => {
    const refreshToken = getRefreshToken()
    if (refreshToken) {
      try {
        await api.post('/auth/logout', { refreshToken })
      } catch {
        // ignore errors on logout
      }
    }
    clearTokens()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      isLoading,
      login,
      logout,
    }),
    [user, isLoading, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
