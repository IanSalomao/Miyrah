// Busca de membros (picker opcional do formulário) — wiki/api/members.md

import { useQuery } from '@tanstack/react-query'
import { listMembers } from '@/services'
import { queryKeys } from '@/lib/query-keys'

export function useMembersSearch(search: string) {
  const query = { search: search || undefined, limit: 20 }
  return useQuery({
    queryKey: queryKeys.members.list(query),
    queryFn: ({ signal }) => listMembers(query, signal),
  })
}
