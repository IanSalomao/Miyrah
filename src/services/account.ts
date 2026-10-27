// Conta da igreja — wiki/api/account.md

import { apiClient } from '@/lib/api-client'
import type {
  ChangePasswordPayload,
  Church,
  DeleteAccountPayload,
  MessageResponse,
  UpdateAccountPayload,
} from '@/types'

export function getAccount(signal?: AbortSignal): Promise<Church> {
  return apiClient.get('/account', undefined, signal)
}

export function updateAccount(payload: UpdateAccountPayload): Promise<Church> {
  return apiClient.patch('/account', payload)
}

export function changePassword(payload: ChangePasswordPayload): Promise<MessageResponse> {
  return apiClient.patch('/account/password', payload)
}

/** Marca o primeiro acesso como concluído (fecha o popup de início do trial). */
export function markOnboardingSeen(): Promise<MessageResponse> {
  return apiClient.post('/account/onboarding-seen', undefined)
}

export function deleteAccount(payload: DeleteAccountPayload): Promise<MessageResponse> {
  return apiClient.del('/account', payload)
}
