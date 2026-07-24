// Dashboard — wiki/pages/page_dashboard.md, wiki/api/dashboard.md
// GET /v1/dashboard/balance — saldo em conta "até a data", isolado dos demais
// blocos e imune a qualquer filtro (carregado uma vez na entrada da página).

import { useQuery } from '@tanstack/react-query'
import { getDashboardBalance } from '@/services'
import { queryKeys } from '@/lib/query-keys'

export function useDashboardBalance() {
  return useQuery({
    queryKey: queryKeys.dashboard.balance(),
    queryFn: ({ signal }) => getDashboardBalance(signal),
  })
}
