// Mapeia DashboardSummary para os dados dos component_metric_card da tela.
// Regra crítica (wiki/pages/page_dashboard.md, wiki/api/dashboard.md): o card Saldo
// usa `balance` (líquido "até a data", não afetado pelo filtro de período) — distinto
// do card Balanço, que usa `periodBalance` (recalculado pelos filtros ativos).

import { formatCurrency } from '@/lib/format'
import type { DashboardSummary } from '@/types'
import type { MetricCardVariant } from '@/components/metric-card'

export interface MetricCardData {
  key: 'balance' | 'income' | 'expense' | 'periodBalance'
  label: string
  value: number
  variant: MetricCardVariant
}

/** Os 4 cards principais — todos recalculados pelos filtros, exceto Saldo. */
export function buildMainMetricCards(summary: DashboardSummary | undefined): MetricCardData[] {
  return [
    { key: 'balance', label: 'Saldo', value: summary?.balance ?? 0, variant: 'balance' },
    { key: 'income', label: 'Entradas', value: summary?.income ?? 0, variant: 'income' },
    { key: 'expense', label: 'Saídas', value: summary?.expense ?? 0, variant: 'expense' },
    {
      key: 'periodBalance',
      label: 'Balanço',
      value: summary?.periodBalance ?? 0,
      variant: 'balance',
    },
  ]
}

export interface ExtraMetricCardData {
  key: 'membersCount' | 'transactionsCount' | 'ministriesCount' | 'averageTicket'
  label: string
  value: number
  formatValue?: (value: number) => string
}

/** Os 4 cards extras — sempre totais gerais, nunca afetados pelos filtros. */
export function buildExtraMetricCards(
  summary: DashboardSummary | undefined,
): ExtraMetricCardData[] {
  return [
    {
      key: 'membersCount',
      label: 'Membros cadastrados',
      value: summary?.membersCount ?? 0,
    },
    {
      key: 'transactionsCount',
      label: 'Transações',
      value: summary?.transactionsCount ?? 0,
    },
    {
      key: 'ministriesCount',
      label: 'Ministérios cadastrados',
      value: summary?.ministriesCount ?? 0,
    },
    {
      key: 'averageTicket',
      label: 'Ticket médio',
      value: summary?.averageTicket ?? 0,
      formatValue: formatCurrency,
    },
  ]
}
