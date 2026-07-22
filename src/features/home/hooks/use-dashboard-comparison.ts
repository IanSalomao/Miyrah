// Início — wiki/pages/page_home.md, wiki/api/dashboard.md
// GET /v1/dashboard/comparison fixo em últimos 6 meses, agrupamento mensal (sem toggle).

import { useQuery } from '@tanstack/react-query'
import { getDashboardComparison } from '@/services'
import { queryKeys } from '@/lib/query-keys'
import type { DashboardFilters } from '@/types'

// Início é fixa: últimos 6 meses, agrupamento mensal.
const HOME_COMPARISON_FILTERS: DashboardFilters = { period: 'last6Months' }

export function useDashboardComparison() {
  return useQuery({
    queryKey: queryKeys.dashboard.comparison(HOME_COMPARISON_FILTERS, 'month'),
    queryFn: ({ signal }) => getDashboardComparison(HOME_COMPARISON_FILTERS, 'month', signal),
  })
}
