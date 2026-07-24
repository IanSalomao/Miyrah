import { describe, expect, it } from 'vitest'
import { buildBalanceVariationCards, buildExtraMetricCards, buildPeriodMetricCards } from './summary-cards'
import type { DashboardBalanceVariation, DashboardCounts, DashboardSummary } from '@/types'

const SUMMARY: DashboardSummary = {
  income: 5000,
  expense: 3200,
  periodBalance: 1800,
  incomeCount: 42,
  expenseCount: 30,
  transactionsCount: 72,
}

const COUNTS: DashboardCounts = {
  membersCount: 87,
  ministriesCount: 6,
  categoriesCount: 14,
}

const BALANCE_VARIATION: DashboardBalanceVariation = {
  dateFrom: '2026-01-01',
  dateTo: '2026-07-23',
  balanceStart: 12000,
  balanceEnd: 18500,
  percentChange: 54.2,
}

describe('buildPeriodMetricCards', () => {
  it('usa income/expense/periodBalance com as variantes corretas', () => {
    const cards = buildPeriodMetricCards(SUMMARY)
    expect(cards.find((c) => c.key === 'income')).toMatchObject({ value: 5000, variant: 'income' })
    expect(cards.find((c) => c.key === 'expense')).toMatchObject({ value: 3200, variant: 'expense' })
    expect(cards.find((c) => c.key === 'periodBalance')).toMatchObject({
      value: 1800,
      variant: 'balance',
    })
  })

  it('usa 0 como fallback quando summary ainda não carregou', () => {
    const cards = buildPeriodMetricCards(undefined)
    expect(cards.every((card) => card.value === 0)).toBe(true)
  })
})

describe('buildBalanceVariationCards', () => {
  it('mapeia balanceStart/balanceEnd, com percentChange só no card de fim', () => {
    const cards = buildBalanceVariationCards(BALANCE_VARIATION)
    const start = cards.find((c) => c.key === 'balanceStart')
    const end = cards.find((c) => c.key === 'balanceEnd')

    expect(start?.value).toBe(12000)
    expect(start?.percentChange).toBeUndefined()

    expect(end?.value).toBe(18500)
    expect(end?.percentChange).toBe(54.2)
  })

  it('repassa percentChange null (sem base de comparação) tal qual veio da API', () => {
    const cards = buildBalanceVariationCards({ ...BALANCE_VARIATION, percentChange: null })
    expect(cards.find((c) => c.key === 'balanceEnd')?.percentChange).toBeNull()
  })

  it('sem indicador (undefined) enquanto os dados ainda não carregaram', () => {
    const cards = buildBalanceVariationCards(undefined)
    expect(cards.every((card) => card.value === 0)).toBe(true)
    expect(cards.find((c) => c.key === 'balanceEnd')?.percentChange).toBeUndefined()
  })
})

describe('buildExtraMetricCards', () => {
  it('são as 3 contagens gerais de GET /dashboard/counts, sem ticket médio nem transações', () => {
    const cards = buildExtraMetricCards(COUNTS)
    expect(cards).toHaveLength(3)
    expect(cards.find((c) => c.key === 'membersCount')?.value).toBe(87)
    expect(cards.find((c) => c.key === 'ministriesCount')?.value).toBe(6)
    expect(cards.find((c) => c.key === 'categoriesCount')?.value).toBe(14)
  })

  it('usa 0 como fallback quando counts ainda não carregou', () => {
    const cards = buildExtraMetricCards(undefined)
    expect(cards.every((card) => card.value === 0)).toBe(true)
  })
})
