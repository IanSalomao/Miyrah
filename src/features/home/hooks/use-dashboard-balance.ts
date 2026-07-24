// Início — wiki/pages/page_home.md, wiki/api/dashboard.md
// GET /v1/dashboard/balance — saldo em conta "até a data", sem parâmetros nem filtro.

import { useQuery } from '@tanstack/react-query'
import { getDashboardBalance } from '@/services'
import { queryKeys } from '@/lib/query-keys'

export function useDashboardBalance() {
  return useQuery({
    queryKey: queryKeys.dashboard.balance(),
    queryFn: ({ signal }) => getDashboardBalance(signal),
  })
}
