// Dashboard/Início — wiki/api/dashboard.md
// Endpoints granulares: cada bloco de UI chama só o que exibe.

import { apiClient } from '@/lib/api-client'
import type { QueryParams } from '@/lib/api-client'
import type {
  ComparisonGroupBy,
  DashboardBalance,
  DashboardBalanceVariation,
  DashboardByCategory,
  DashboardComparison,
  DashboardCounts,
  DashboardFilters,
  DashboardLine,
  DashboardSummary,
  LineGranularity,
} from '@/types'

/** `categoryIds` vai na query como uuids separados por vírgula. */
function toQueryParams(filters: DashboardFilters): QueryParams {
  return {
    period: filters.period,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
    categoryIds: filters.categoryIds?.join(','),
    ministryId: filters.ministryId,
  }
}

/** `/dashboard/line` e `/dashboard/by-category` também aceitam `type`. */
function toTypedQueryParams(filters: DashboardFilters): QueryParams {
  return { ...toQueryParams(filters), type: filters.type }
}

/**
 * `/dashboard/comparison` não aceita `type` (a série separa entradas/saídas pelas
 * próprias colunas `income`/`expense`, não pelo filtro de tipo) — por isso não
 * reutiliza `toTypedQueryParams`.
 */
function toComparisonQueryParams(
  filters: DashboardFilters,
  groupBy: ComparisonGroupBy,
): QueryParams {
  return { ...toQueryParams(filters), groupBy }
}

/** Saldo em conta "até a data" — sem parâmetros, imune a qualquer filtro. */
export function getDashboardBalance(signal?: AbortSignal): Promise<DashboardBalance> {
  return apiClient.get('/dashboard/balance', undefined, signal)
}

export function getDashboardSummary(
  filters: DashboardFilters,
  signal?: AbortSignal,
): Promise<DashboardSummary> {
  return apiClient.get('/dashboard/summary', toQueryParams(filters), signal)
}

/** Contagens gerais (membros/ministérios/categorias) — sem parâmetros nem filtro. */
export function getDashboardCounts(signal?: AbortSignal): Promise<DashboardCounts> {
  return apiClient.get('/dashboard/counts', undefined, signal)
}

/** Só aceita `dateFrom`/`dateTo` concretos — ver resolveBalanceVariationRange. */
export function getDashboardBalanceVariation(
  dateFrom: string,
  dateTo: string,
  signal?: AbortSignal,
): Promise<DashboardBalanceVariation> {
  return apiClient.get('/dashboard/balance-variation', { dateFrom, dateTo }, signal)
}

export function getDashboardLine(
  filters: DashboardFilters,
  granularity: LineGranularity = 'day',
  signal?: AbortSignal,
): Promise<DashboardLine> {
  return apiClient.get('/dashboard/line', { ...toTypedQueryParams(filters), granularity }, signal)
}

export function getDashboardByCategory(
  filters: DashboardFilters,
  signal?: AbortSignal,
): Promise<DashboardByCategory> {
  return apiClient.get('/dashboard/by-category', toTypedQueryParams(filters), signal)
}

export function getDashboardComparison(
  filters: DashboardFilters,
  groupBy: ComparisonGroupBy = 'month',
  signal?: AbortSignal,
): Promise<DashboardComparison> {
  return apiClient.get('/dashboard/comparison', toComparisonQueryParams(filters, groupBy), signal)
}
