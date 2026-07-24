// Dashboard — wiki/pages/page_dashboard.md, wiki/api/dashboard.md
// GET /v1/dashboard/balance-variation só aceita dateFrom/dateTo concretos — o
// período ativo do filtro (mesmo um preset) é resolvido antes do disparo via
// resolveBalanceVariationRange. Não aceita categoryIds/ministryId/type.

import { useQuery } from '@tanstack/react-query'
import { getDashboardBalanceVariation } from '@/services'
import { queryKeys } from '@/lib/query-keys'
import type { DashboardFilters } from '@/types'
import { isDashboardFiltersReady, resolveBalanceVariationRange } from '../filters'

export function useDashboardBalanceVariation(filters: DashboardFilters) {
  const { dateFrom, dateTo } = resolveBalanceVariationRange(filters)

  return useQuery({
    queryKey: queryKeys.dashboard.balanceVariation(dateFrom, dateTo),
    queryFn: ({ signal }) => getDashboardBalanceVariation(dateFrom, dateTo, signal),
    enabled: isDashboardFiltersReady(filters),
  })
}
