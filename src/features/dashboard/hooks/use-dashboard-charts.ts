import { useQuery } from '@tanstack/react-query'
import { getDashboardCharts } from '@/services'
import { queryKeys } from '@/lib/query-keys'
import type { DashboardFilters } from '@/types'
import { isDashboardFiltersReady } from '../filters'

export function useDashboardCharts(filters: DashboardFilters) {
  return useQuery({
    queryKey: queryKeys.dashboard.charts(filters),
    queryFn: ({ signal }) => getDashboardCharts(filters, signal),
    enabled: isDashboardFiltersReady(filters),
  })
}
