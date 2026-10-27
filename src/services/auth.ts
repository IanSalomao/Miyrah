// Autenticação — wiki/api/auth.md

import { apiClient } from '@/lib/api-client'
import type {
  CompleteSignupPayload,
  ForgotPasswordPayload,
  LoginPayload,
  LoginResponse,
  MessageResponse,
  RequestEmailVerificationPayload,
  RequestEmailVerificationResponse,
  ResetPasswordPayload,
  SignupResponse,
  VerifyEmailTokenPayload,
  VerifyEmailTokenResponse,
} from '@/types'

/** Etapa 0: envia o link de verificação. Resposta genérica (anti-enumeração). */
export function requestEmailVerification(
  payload: RequestEmailVerificationPayload,
): Promise<RequestEmailVerificationResponse> {
  return apiClient.post('/auth/signup/request-verification', payload)
}

/** Valida o token do link antes de abrir o formulário de finalização. */
export function verifySignupToken(
  payload: VerifyEmailTokenPayload,
): Promise<VerifyEmailTokenResponse> {
  return apiClient.post('/auth/signup/verify-token', payload)
}

/** Etapa 1: cria a conta com nome + senha e já devolve um token autenticado. */
export function completeSignup(payload: CompleteSignupPayload): Promise<SignupResponse> {
  return apiClient.post('/auth/signup/complete', payload)
}

export function login(payload: LoginPayload): Promise<LoginResponse> {
  return apiClient.post('/auth/login', payload)
}

export function forgotPassword(payload: ForgotPasswordPayload): Promise<MessageResponse> {
  return apiClient.post('/auth/forgot-password', payload)
}

export function resetPassword(payload: ResetPasswordPayload): Promise<MessageResponse> {
  return apiClient.post('/auth/reset-password', payload)
}
