import { createContext, useContext } from 'react'

export interface AuthContextValue {
  token: string | null
  isAuthenticated: boolean
  /** Salva o token (localStorage se remember, senão sessionStorage) e marca sessão. */
  login: (token: string, remember: boolean) => void
  /** Descarta o token no cliente (não há endpoint de logout). */
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>.')
  return ctx
}
