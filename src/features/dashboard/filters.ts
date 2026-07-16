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
