// Membros — wiki/api/members.md

import { apiClient } from '@/lib/api-client'
import type {
  CreateMemberPayload,
  Member,
  MembersQuery,
  MessageResponse,
  Paginated,
  UpdateMemberPayload,
} from '@/types'

export function listMembers(query: MembersQuery, signal?: AbortSignal): Promise<Paginated<Member>> {
  return apiClient.get('/members', { ...query }, signal)
}

export function getMember(id: string, signal?: AbortSignal): Promise<Member> {
  return apiClient.get(`/members/${id}`, undefined, signal)
}

export function createMember(payload: CreateMemberPayload): Promise<Member> {
  return apiClient.post('/members', payload)
}

export function updateMember(id: string, payload: UpdateMemberPayload): Promise<Member> {
  return apiClient.patch(`/members/${id}`, payload)
}

export function removeMember(id: string): Promise<MessageResponse> {
  return apiClient.del(`/members/${id}`)
}
