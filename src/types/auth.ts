// Autenticação — wiki/api/auth.md

import type { Church } from './church'

export interface RegisterPayload {
  name: string
  email: string
  password: string
  phone?: string | null
}

export interface LoginPayload {
  email: string
  password: string
  rememberMe?: boolean
}

export interface ForgotPasswordPayload {
  email: string
}

export interface ResetPasswordPayload {
  token: string
  newPassword: string
}

/** Igreja retornada no register (subconjunto do perfil completo). */
export type AuthChurch = Pick<Church, 'id' | 'name' | 'email' | 'phone' | 'createdAt'>

export interface RegisterResponse {
  token: string
  church: AuthChurch
}

export interface LoginResponse {
  token: string
  expiresAt: string
}
