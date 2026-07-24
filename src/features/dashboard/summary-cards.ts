// Mapeia os endpoints granulares do dashboard para os dados dos component_metric_card
// da tela. Ver wiki/pages/page_dashboard.md, wiki/api/dashboard.md.
// Regra crítica: o card Saldo (isolado, GET /dashboard/balance) fica fora deste
// módulo — é renderizado direto na página, pois não pertence a nenhum dos blocos
// recalculados pelo filtro.

import type { DashboardBalanceVariation, DashboardCounts, DashboardSummary } from '@/types'
import type { MetricCardVariant } from '@/components/metric-card'

export interface MetricCardData {
  key: 'income' | 'expense' | 'periodBalance'
  label: string
  value: number
  variant: MetricCardVariant
}

/** Bloco de métricas do período (Entradas/Saídas/Balanço) — recalculado pelos filtros. */
export function buildPeriodMetricCards(summary: DashboardSummary | undefined): MetricCardData[] {
  return [
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

export interface BalanceVariationCardData {
  key: 'balanceStart' | 'balanceEnd'
  label: string
  value: number
  variant: MetricCardVariant
  /** Só o card de fim traz o indicador; `undefined` = sem indicador nenhum. */
  percentChange?: number | null
}

/**
 * Saldo no início/fim do período (`GET /dashboard/balance-variation`) — a variação
 * percentual (seta ↑/↓, verde/vermelho) aparece só no card de fim; `percentChange`
 * `null` (saldo inicial 0) renderiza o estado neutro no `MetricCard`.
 */
export function buildBalanceVariationCards(
  data: DashboardBalanceVariation | undefined,
): BalanceVariationCardData[] {
  return [
    {
      key: 'balanceStart',
      label: 'Saldo no início do período',
      value: data?.balanceStart ?? 0,
      variant: 'balance',
    },
    {
      key: 'balanceEnd',
      label: 'Saldo no fim do período',
      value: data?.balanceEnd ?? 0,
      variant: 'balance',
      percentChange: data ? data.percentChange : undefined,
    },
  ]
}

export interface ExtraMetricCardData {
  key: 'membersCount' | 'ministriesCount' | 'categoriesCount'
  label: string
  value: number
}

/** Os 3 cards extras — sempre totais gerais (`GET /dashboard/counts`), sem filtro. */
export function buildExtraMetricCards(counts: DashboardCounts | undefined): ExtraMetricCardData[] {
  return [
    { key: 'membersCount', label: 'Membros cadastrados', value: counts?.membersCount ?? 0 },
    { key: 'ministriesCount', label: 'Ministérios cadastrados', value: counts?.ministriesCount ?? 0 },
    { key: 'categoriesCount', label: 'Categorias cadastradas', value: counts?.categoriesCount ?? 0 },
  ]
}
