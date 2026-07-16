import { useQuery } from '@tanstack/react-query'
import { getDashboardSummary } from '@/services'
import { queryKeys } from '@/lib/query-keys'
import type { DashboardFilters } from '@/types'
import { isDashboardFiltersReady } from '../filters'

export function useDashboardSummary(filters: DashboardFilters) {
  return useQuery({
    queryKey: queryKeys.dashboard.summary(filters),
    queryFn: ({ signal }) => getDashboardSummary(filters, signal),
    enabled: isDashboardFiltersReady(filters),
  })
}
