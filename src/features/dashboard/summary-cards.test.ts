import { describe, expect, it } from 'vitest'
import { buildExtraMetricCards, buildMainMetricCards } from './summary-cards'
import type { DashboardSummary } from '@/types'

const SUMMARY: DashboardSummary = {
  balance: 18500,
  income: 5000,
  expense: 3200,
  periodBalance: 1800,
  membersCount: 87,
  transactionsCount: 342,
  ministriesCount: 6,
  averageTicket: 245.5,
}

describe('buildMainMetricCards', () => {
  it('o card Saldo usa balance (cumulativo), distinto de periodBalance', () => {
    const cards = buildMainMetricCards(SUMMARY)
    const saldo = cards.find((card) => card.key === 'balance')
    const balanco = cards.find((card) => card.key === 'periodBalance')
    expect(saldo?.value).toBe(18500)
    expect(balanco?.value).toBe(1800)
    expect(saldo?.value).not.toBe(balanco?.value)
  })

  it('Saldo e Balanço usam a variante balance (cor pelo sinal); Entradas/Saídas usam suas variantes', () => {
    const cards = buildMainMetricCards(SUMMARY)
    expect(cards.find((c) => c.key === 'balance')?.variant).toBe('balance')
    expect(cards.find((c) => c.key === 'periodBalance')?.variant).toBe('balance')
    expect(cards.find((c) => c.key === 'income')?.variant).toBe('income')
    expect(cards.find((c) => c.key === 'expense')?.variant).toBe('expense')
  })

  it('o Saldo não muda ao alterar o período do estado local (mesmo summary, filtros diferentes)', () => {
    // Simula duas respostas do backend para períodos diferentes: `balance` é sempre
    // o mesmo (cumulativo "até a data"), só `periodBalance` muda com o filtro.
    const currentMonth: DashboardSummary = { ...SUMMARY, periodBalance: 1800 }
    const last12Months: DashboardSummary = { ...SUMMARY, periodBalance: 12000 }

    const saldoCurrentMonth = buildMainMetricCards(currentMonth).find((c) => c.key === 'balance')
    const saldoLast12Months = buildMainMetricCards(last12Months).find((c) => c.key === 'balance')

    expect(saldoCurrentMonth?.value).toBe(saldoLast12Months?.value)
    expect(saldoCurrentMonth?.value).toBe(18500)
  })

  it('usa 0 como fallback quando summary ainda não carregou', () => {
    const cards = buildMainMetricCards(undefined)
    expect(cards.every((card) => card.value === 0)).toBe(true)
  })
})

describe('buildExtraMetricCards', () => {
  it('são sempre totais gerais, com formatValue de moeda só no ticket médio', () => {
    const cards = buildExtraMetricCards(SUMMARY)
    expect(cards.find((c) => c.key === 'membersCount')?.value).toBe(87)
    expect(cards.find((c) => c.key === 'transactionsCount')?.value).toBe(342)
    expect(cards.find((c) => c.key === 'ministriesCount')?.value).toBe(6)
    const ticket = cards.find((c) => c.key === 'averageTicket')
    expect(ticket?.value).toBe(245.5)
    expect(ticket?.formatValue?.(245.5)).toContain('R$')
  })
})
