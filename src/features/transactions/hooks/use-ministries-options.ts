// Lista de ministérios (seletor opcional do formulário) — wiki/api/ministries.md
// Sem busca nem paginação — o endpoint retorna a lista completa.

import { useQuery } from '@tanstack/react-query'
import { listMinistries } from '@/services'
import { queryKeys } from '@/lib/query-keys'

export function useMinistriesOptions() {
  return useQuery({
    queryKey: queryKeys.ministries.list(),
    queryFn: ({ signal }) => listMinistries(signal),
  })
}
