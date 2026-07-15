// Autenticação — wiki/api/auth.md

import { apiClient } from '@/lib/api-client'
import type {
  ForgotPasswordPayload,
  LoginPayload,
  LoginResponse,
  MessageResponse,
  RegisterPayload,
  RegisterResponse,
  ResetPasswordPayload,
} from '@/types'

export function register(payload: RegisterPayload): Promise<RegisterResponse> {
  return apiClient.post('/auth/register', payload)
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
