// Início — wiki/pages/page_home.md, wiki/api/dashboard.md
// GET /v1/dashboard/charts sem filtros = mês atual (granularidade diária).

import { useQuery } from '@tanstack/react-query'
import { getDashboardCharts } from '@/services'
import { queryKeys } from '@/lib/query-keys'
import { HOME_DASHBOARD_FILTERS } from './use-dashboard-summary'

export function useDashboardCharts() {
  return useQuery({
    queryKey: queryKeys.dashboard.charts(HOME_DASHBOARD_FILTERS),
    queryFn: ({ signal }) => getDashboardCharts(HOME_DASHBOARD_FILTERS, signal),
  })
}
