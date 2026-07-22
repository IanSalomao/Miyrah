import { useQuery } from '@tanstack/react-query'
import { getDashboardComparison } from '@/services'
import { queryKeys } from '@/lib/query-keys'
import type { ComparisonGroupBy, DashboardFilters } from '@/types'
import { isDashboardFiltersReady } from '../filters'

export function useDashboardComparison(filters: DashboardFilters, groupBy: ComparisonGroupBy) {
  return useQuery({
    queryKey: queryKeys.dashboard.comparison(filters, groupBy),
    queryFn: ({ signal }) => getDashboardComparison(filters, groupBy, signal),
    enabled: isDashboardFiltersReady(filters),
  })
}
