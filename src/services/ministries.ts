// Ministérios — wiki/api/ministries.md
// A listagem não é paginada (data = { items }, sem meta).
//
// GET /ministries/{id} não está documentado na wiki, mas existe na API real
// (confirmado em src/types/api-types.d.ts — MinistriesController_findOne).
// Incluído por decisão explícita do usuário para não bloquear telas futuras.

import { apiClient } from '@/lib/api-client'
import type { CreateMinistryPayload, MessageResponse, Ministry, UpdateMinistryPayload } from '@/types'

export function listMinistries(signal?: AbortSignal): Promise<{ items: Ministry[] }> {
  return apiClient.get('/ministries', undefined, signal)
}

export function getMinistry(id: string, signal?: AbortSignal): Promise<Ministry> {
  return apiClient.get(`/ministries/${id}`, undefined, signal)
}

export function createMinistry(payload: CreateMinistryPayload): Promise<Ministry> {
  return apiClient.post('/ministries', payload)
}

export function updateMinistry(id: string, payload: UpdateMinistryPayload): Promise<Ministry> {
  return apiClient.patch(`/ministries/${id}`, payload)
}

export function removeMinistry(id: string): Promise<MessageResponse> {
  return apiClient.del(`/ministries/${id}`)
}
