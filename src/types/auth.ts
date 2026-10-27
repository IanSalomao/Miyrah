// Autenticação — wiki/api/auth.md

import type { Church } from './church'

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

// ─── Cadastro em etapas ──────────────────────────────────────────────────────

/** Etapa 0: solicita o link de verificação para o e-mail. */
export interface RequestEmailVerificationPayload {
  email: string
}

export interface RequestEmailVerificationResponse {
  message: string
  /** Janela de cooldown (s) antes de um novo reenvio — alimenta o contador de retry. */
  retryAfterSeconds: number
}

/** Valida o token do link e devolve o e-mail associado. */
export interface VerifyEmailTokenPayload {
  token: string
}

export interface VerifyEmailTokenResponse {
  email: string
}

/** Etapa 1: finaliza o cadastro (cria a conta) com nome + senha. */
export interface CompleteSignupPayload {
  token: string
  name: string
  password: string
}

/** Igreja retornada na finalização do cadastro (subconjunto do perfil completo). */
export type AuthChurch = Pick<Church, 'id' | 'name' | 'email' | 'phone' | 'createdAt'>

export interface SignupResponse {
  token: string
  church: AuthChurch
}

export interface LoginResponse {
  token: string
  expiresAt: string
}
