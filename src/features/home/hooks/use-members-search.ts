// Usado pelo campo Membro (opcional) do modal de edição de transação —
// busca membros conforme o usuário digita.

import { useQuery } from '@tanstack/react-query'
import { listMembers } from '@/services'
import { queryKeys } from '@/lib/query-keys'

export function useMembersSearch(search: string, enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.members.list({ search }),
    queryFn: ({ signal }) => listMembers({ search }, signal),
    enabled,
  })
}
