// Estado local dos filtros do Dashboard e sua serialização para `DashboardFilters`
// (o shape que os hooks/services enviam à API). Ver wiki/api/dashboard.md e
// wiki/pages/page_dashboard.md.

import type { DashboardFilters, DashboardPeriod, DashboardType } from '@/types'

/** Estado controlado pela filter-bar da tela — 1:1 com os controles visuais. */
export interface DashboardFilterState {
  period: DashboardPeriod
  dateFrom?: string
  dateTo?: string
  categoryIds: string[]
  type: DashboardType
  ministryId?: string
}

export const DEFAULT_DASHBOARD_FILTER_STATE: DashboardFilterState = {
  period: 'currentMonth',
  categoryIds: [],
  type: 'all',
}

/**
 * Converte o estado da filter-bar em `DashboardFilters` (query real enviada aos
 * endpoints de summary/charts). `dateFrom`/`dateTo` só são enviados quando o
 * período é "custom" — nos demais presets o backend já resolve o intervalo.
 */
export function toDashboardFilters(state: DashboardFilterState): DashboardFilters {
  return {
    period: state.period,
    dateFrom: state.period === 'custom' ? state.dateFrom : undefined,
    dateTo: state.period === 'custom' ? state.dateTo : undefined,
    categoryIds: state.categoryIds.length > 0 ? state.categoryIds : undefined,
    type: state.type,
    ministryId: state.ministryId,
  }
}

/**
 * Período "custom" exige `dateFrom` e `dateTo` (400 VALIDATION_ERROR caso contrário —
 * ver wiki/api/dashboard.md). Usado para não disparar a query com filtro incompleto.
 */
export function isDashboardFiltersReady(filters: DashboardFilters): boolean {
  if (filters.period === 'custom') return Boolean(filters.dateFrom && filters.dateTo)
  return true
}

function toIsoDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/** Primeiro dia do mês `monthsAgo` meses antes de `today` (0 = mês atual). */
function firstDayOfMonthsAgo(today: Date, monthsAgo: number): Date {
  return new Date(today.getFullYear(), today.getMonth() - monthsAgo, 1)
}

/**
 * Resolve o período ativo do filtro (que pode ser um preset) em `dateFrom`/`dateTo`
 * concretos — exigido por `GET /v1/dashboard/balance-variation`, que não entende
 * presets. Períodos que terminam no presente usam `today` como `dateTo`; `custom`
 * repassa as próprias datas do filtro (ver wiki/api/dashboard.md).
 */
export function resolveBalanceVariationRange(
  filters: DashboardFilters,
  today: Date = new Date(),
): { dateFrom: string; dateTo: string } {
  if (filters.period === 'custom') {
    return { dateFrom: filters.dateFrom ?? toIsoDate(today), dateTo: filters.dateTo ?? toIsoDate(today) }
  }

  const dateTo = toIsoDate(today)
  switch (filters.period) {
    case 'last3Months':
      return { dateFrom: toIsoDate(firstDayOfMonthsAgo(today, 2)), dateTo }
    case 'last6Months':
      return { dateFrom: toIsoDate(firstDayOfMonthsAgo(today, 5)), dateTo }
    case 'last12Months':
      return { dateFrom: toIsoDate(firstDayOfMonthsAgo(today, 11)), dateTo }
    case 'currentYear':
      return { dateFrom: toIsoDate(new Date(today.getFullYear(), 0, 1)), dateTo }
    case 'currentMonth':
    default:
      return { dateFrom: toIsoDate(firstDayOfMonthsAgo(today, 0)), dateTo }
  }
}
