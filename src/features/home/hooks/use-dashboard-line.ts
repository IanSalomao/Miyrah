// Início — wiki/pages/page_home.md, wiki/api/dashboard.md
// GET /v1/dashboard/line sem parâmetros = mês atual, granularidade diária (default).
// A Início não tem toggle de agrupamento — granularity nunca é enviada.

import { useQuery } from '@tanstack/react-query'
import { getDashboardLine } from '@/services'
import { queryKeys } from '@/lib/query-keys'
import { HOME_DASHBOARD_FILTERS } from './use-dashboard-summary'

export function useDashboardLine() {
  return useQuery({
    queryKey: queryKeys.dashboard.line(HOME_DASHBOARD_FILTERS, 'day'),
    queryFn: ({ signal }) => getDashboardLine(HOME_DASHBOARD_FILTERS, 'day', signal),
  })
}
