// Instância do component_filter_bar para a tela Dashboard: período (com presets +
// intervalo personalizado), categoria (múltipla), tipo e ministério — sem busca
// (wiki/pages/page_dashboard.md).

import {
  CategoryFilter,
  FilterBar,
  MinistryFilter,
  PeriodFilter,
  TypeFilter,
} from '@/components/filter-bar'
import type { Category, Ministry } from '@/types'
import type { DashboardFilterState } from '../filters'

interface DashboardFilterBarProps {
  state: DashboardFilterState
  onChange: (state: DashboardFilterState) => void
  categories: Category[]
  ministries: Ministry[]
}

export function DashboardFilterBar({
  state,
  onChange,
  categories,
  ministries,
}: DashboardFilterBarProps) {
  return (
    <FilterBar>
      <PeriodFilter
        period={state.period}
        dateFrom={state.dateFrom}
        dateTo={state.dateTo}
        onPeriodChange={(period) => onChange({ ...state, period })}
        onDateFromChange={(dateFrom) => onChange({ ...state, dateFrom })}
        onDateToChange={(dateTo) => onChange({ ...state, dateTo })}
      />
      <CategoryFilter
        categories={categories}
        selectedIds={state.categoryIds}
        onChange={(categoryIds) => onChange({ ...state, categoryIds })}
      />
      <TypeFilter value={state.type} onChange={(type) => onChange({ ...state, type })} />
      <MinistryFilter
        ministries={ministries}
        value={state.ministryId}
        onChange={(ministryId) => onChange({ ...state, ministryId })}
      />
    </FilterBar>
  )
}
