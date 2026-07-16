// Queries e mutations de Ministérios — wiki/api/ministries.md
// A listagem não é paginada: `listMinistries` retorna `{ items }` (sem meta).

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createMinistry, listMinistries, removeMinistry, updateMinistry } from '@/services'
import { queryKeys } from '@/lib/query-keys'
import type { CreateMinistryPayload, UpdateMinistryPayload } from '@/types'

export function useMinistries() {
  return useQuery({
    queryKey: queryKeys.ministries.list(),
    queryFn: ({ signal }) => listMinistries(signal),
  })
}

export function useCreateMinistry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateMinistryPayload) => createMinistry(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.ministries.all })
    },
  })
}

export function useUpdateMinistry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateMinistryPayload }) =>
      updateMinistry(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.ministries.all })
    },
  })
}

export function useRemoveMinistry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => removeMinistry(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.ministries.all })
    },
  })
}
