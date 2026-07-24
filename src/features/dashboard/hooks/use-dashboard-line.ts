// Dashboard — wiki/pages/page_dashboard.md, wiki/api/dashboard.md
// GET /v1/dashboard/line — recarrega isoladamente ao alternar o toggle Diário/Semanal.

import { useQuery } from '@tanstack/react-query'
import { getDashboardLine } from '@/services'
import { queryKeys } from '@/lib/query-keys'
import type { DashboardFilters, LineGranularity } from '@/types'
import { isDashboardFiltersReady } from '../filters'

export function useDashboardLine(filters: DashboardFilters, granularity: LineGranularity) {
  return useQuery({
    queryKey: queryKeys.dashboard.line(filters, granularity),
    queryFn: ({ signal }) => getDashboardLine(filters, granularity, signal),
    enabled: isDashboardFiltersReady(filters),
  })
}
