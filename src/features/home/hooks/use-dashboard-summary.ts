// Início — wiki/pages/page_home.md, wiki/api/dashboard.md
// GET /v1/dashboard/summary sem filtros = mês atual (currentMonth implícito).
// Alimenta Entradas/Saídas/Balanço do Mês — o Saldo em Conta vem de use-dashboard-balance.

import { useQuery } from '@tanstack/react-query'
import { getDashboardSummary } from '@/services'
import { queryKeys } from '@/lib/query-keys'
import type { DashboardFilters } from '@/types'

/** Início não tem filtros — sempre o mês atual. */
export const HOME_DASHBOARD_FILTERS: DashboardFilters = {}

export function useDashboardSummary() {
  return useQuery({
    queryKey: queryKeys.dashboard.summary(HOME_DASHBOARD_FILTERS),
    queryFn: ({ signal }) => getDashboardSummary(HOME_DASHBOARD_FILTERS, signal),
  })
}
