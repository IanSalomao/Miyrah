// Dashboard/Início — wiki/api/dashboard.md

import { apiClient } from '@/lib/api-client'
import type { QueryParams } from '@/lib/api-client'
import type {
  ComparisonGroupBy,
  DashboardCharts,
  DashboardComparison,
  DashboardFilters,
  DashboardSummary,
} from '@/types'

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

/**
 * `/dashboard/comparison` não aceita `type` (a série separa entradas/saídas pelas
 * próprias colunas `income`/`expense`, não pelo filtro de tipo) — por isso não
 * reutiliza `toQueryParams`.
 */
function toComparisonQueryParams(
  filters: DashboardFilters,
  groupBy: ComparisonGroupBy,
): QueryParams {
  return {
    period: filters.period,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
    categoryIds: filters.categoryIds?.join(','),
    ministryId: filters.ministryId,
    groupBy,
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

export function getDashboardComparison(
  filters: DashboardFilters,
  groupBy: ComparisonGroupBy = 'month',
  signal?: AbortSignal,
): Promise<DashboardComparison> {
  return apiClient.get('/dashboard/comparison', toComparisonQueryParams(filters, groupBy), signal)
}
