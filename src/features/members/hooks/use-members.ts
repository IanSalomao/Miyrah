// Queries e mutations de Membros — wiki/api/members.md. Sem fetch solto em componente.

import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createMember, listMembers, removeMember, updateMember } from '@/services'
import { queryKeys } from '@/lib/query-keys'
import type { CreateMemberPayload, MembersQuery, UpdateMemberPayload } from '@/types'

export function useMembers(query: MembersQuery) {
  return useQuery({
    queryKey: queryKeys.members.list(query),
    queryFn: ({ signal }) => listMembers(query, signal),
    placeholderData: keepPreviousData,
  })
}

export function useCreateMember() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateMemberPayload) => createMember(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.members.all })
    },
  })
}

export function useUpdateMember() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateMemberPayload }) =>
      updateMember(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.members.all })
    },
  })
}

export function useDeleteMember() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => removeMember(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.members.all })
    },
  })
}
