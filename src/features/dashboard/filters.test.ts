import { describe, expect, it } from 'vitest'
import {
  DEFAULT_DASHBOARD_FILTER_STATE,
  isDashboardFiltersReady,
  toDashboardFilters,
  type DashboardFilterState,
} from './filters'

describe('toDashboardFilters', () => {
  it('omite dateFrom/dateTo quando o período não é custom', () => {
    const state: DashboardFilterState = {
      ...DEFAULT_DASHBOARD_FILTER_STATE,
      period: 'last3Months',
      dateFrom: '2026-01-01',
      dateTo: '2026-01-31',
    }
    const filters = toDashboardFilters(state)
    expect(filters.period).toBe('last3Months')
    expect(filters.dateFrom).toBeUndefined()
    expect(filters.dateTo).toBeUndefined()
  })

  it('inclui dateFrom/dateTo quando o período é custom', () => {
    const state: DashboardFilterState = {
      ...DEFAULT_DASHBOARD_FILTER_STATE,
      period: 'custom',
      dateFrom: '2026-01-01',
      dateTo: '2026-01-31',
    }
    const filters = toDashboardFilters(state)
    expect(filters.dateFrom).toBe('2026-01-01')
    expect(filters.dateTo).toBe('2026-01-31')
  })

  it('envia categoryIds só quando houver seleção', () => {
    expect(toDashboardFilters(DEFAULT_DASHBOARD_FILTER_STATE).categoryIds).toBeUndefined()
    const withCategories = toDashboardFilters({
      ...DEFAULT_DASHBOARD_FILTER_STATE,
      categoryIds: ['cat-1', 'cat-2'],
    })
    expect(withCategories.categoryIds).toEqual(['cat-1', 'cat-2'])
  })

  it('repassa type e ministryId', () => {
    const filters = toDashboardFilters({
      ...DEFAULT_DASHBOARD_FILTER_STATE,
      type: 'income',
      ministryId: 'min-1',
    })
    expect(filters.type).toBe('income')
    expect(filters.ministryId).toBe('min-1')
  })
})

describe('isDashboardFiltersReady', () => {
  it('é sempre pronto para presets fixos', () => {
    expect(isDashboardFiltersReady(toDashboardFilters(DEFAULT_DASHBOARD_FILTER_STATE))).toBe(true)
  })

  it('exige dateFrom e dateTo quando period é custom', () => {
    expect(isDashboardFiltersReady({ period: 'custom', dateFrom: '2026-01-01' })).toBe(false)
    expect(
      isDashboardFiltersReady({ period: 'custom', dateFrom: '2026-01-01', dateTo: '2026-01-31' }),
    ).toBe(true)
    expect(isDashboardFiltersReady({ period: 'custom' })).toBe(false)
  })
})
