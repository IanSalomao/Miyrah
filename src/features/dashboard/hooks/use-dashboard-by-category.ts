// Dashboard — wiki/pages/page_dashboard.md, wiki/api/dashboard.md
// GET /v1/dashboard/by-category — alimenta os 2 component_pie_chart.

import { useQuery } from '@tanstack/react-query'
import { getDashboardByCategory } from '@/services'
import { queryKeys } from '@/lib/query-keys'
import type { DashboardFilters } from '@/types'
import { isDashboardFiltersReady } from '../filters'

export function useDashboardByCategory(filters: DashboardFilters) {
  return useQuery({
    queryKey: queryKeys.dashboard.byCategory(filters),
    queryFn: ({ signal }) => getDashboardByCategory(filters, signal),
    enabled: isDashboardFiltersReady(filters),
  })
}
