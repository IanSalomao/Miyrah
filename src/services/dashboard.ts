// Dashboard/Início — wiki/api/dashboard.md

import { apiClient } from '@/lib/api-client'
import type { QueryParams } from '@/lib/api-client'
import type { DashboardCharts, DashboardFilters, DashboardSummary } from '@/types'

/** `categoryIds` vai na query como uuids separados por vírgula. */
function toQueryParams(filters: DashboardFilters): QueryParams {
  return {
    period: filters.period,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
    categoryIds: filters.categoryIds?.join(','),
    type: filters.type,
    ministryId: filters.ministryId,
  }
}

export function getDashboardSummary(
  filters: DashboardFilters,
  signal?: AbortSignal,
): Promise<DashboardSummary> {
  return apiClient.get('/dashboard/summary', toQueryParams(filters), signal)
}

export function getDashboardCharts(
  filters: DashboardFilters,
  signal?: AbortSignal,
): Promise<DashboardCharts> {
  return apiClient.get('/dashboard/charts', toQueryParams(filters), signal)
}
