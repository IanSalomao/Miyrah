// Armazenamento do token JWT (sem refresh token).
// "Lembrar-me" marcado → localStorage (30 dias); senão → sessionStorage (24h).
// Util única compartilhada pelo api-client e pelo AuthProvider.

const TOKEN_KEY = 'chf.token'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string, remember: boolean): void {
  // Garante que o token não fique duplicado nos dois storages.
  clearToken()
  const store = remember ? localStorage : sessionStorage
  store.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(TOKEN_KEY)
}
