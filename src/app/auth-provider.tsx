import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { setUnauthorizedHandler } from '@/lib/api-client'
import { clearToken, getToken, setToken } from '@/lib/auth-storage'
import { AuthContext, type AuthContextValue } from './auth-context'
import { queryClient } from './query-client'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => getToken())

  const login = useCallback((newToken: string, remember: boolean) => {
    setToken(newToken, remember)
    setTokenState(newToken)
  }, [])

  const logout = useCallback(() => {
    clearToken()
    setTokenState(null)
    // Limpa o cache do servidor ao encerrar a sessão.
    queryClient.clear()
  }, [])

  // Um 401 em qualquer chamada limpa a sessão (o api-client já apaga o token).
  useEffect(() => {
    setUnauthorizedHandler(() => setTokenState(null))
    return () => setUnauthorizedHandler(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ token, isAuthenticated: token !== null, login, logout }),
    [token, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
