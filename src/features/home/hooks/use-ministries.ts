// Usado pelo campo Ministério (opcional) do modal de edição de transação —
// listagem completa, sem busca (endpoint não pagina nem filtra).

import { useQuery } from '@tanstack/react-query'
import { listMinistries } from '@/services'
import { queryKeys } from '@/lib/query-keys'

export function useMinistries() {
  return useQuery({
    queryKey: queryKeys.ministries.list(),
    queryFn: ({ signal }) => listMinistries(signal),
  })
}
