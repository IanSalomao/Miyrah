// Dashboard — wiki/pages/page_dashboard.md, wiki/api/dashboard.md
// GET /v1/dashboard/counts — totais gerais (membros/ministérios/categorias),
// sem parâmetros nem filtro.

import { useQuery } from '@tanstack/react-query'
import { getDashboardCounts } from '@/services'
import { queryKeys } from '@/lib/query-keys'

export function useDashboardCounts() {
  return useQuery({
    queryKey: queryKeys.dashboard.counts(),
    queryFn: ({ signal }) => getDashboardCounts(signal),
  })
}
