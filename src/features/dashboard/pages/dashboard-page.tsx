// page_dashboard — wiki/pages/page_dashboard.md
// Tela de análise financeira com barra de filtros globais. Sem lista de últimas
// transações, sem botão de adicionar transação (lançamento é em /transactions).

import { useState } from 'react'
import { MetricCard } from '@/components/metric-card'
import { LineChart } from '@/components/line-chart'
import { PieChart } from '@/components/pie-chart'
import { BarChart } from '@/components/bar-chart'
import { ApiError } from '@/lib/api-client'
import type { ComparisonGroupBy, LineGranularity } from '@/types'
import { DashboardFilterBar } from '../components/dashboard-filter-bar'
import { BlockError } from '../components/block-error'
import {
  DEFAULT_DASHBOARD_FILTER_STATE,
  isDashboardFiltersReady,
  toDashboardFilters,
} from '../filters'
import { buildBalanceVariationCards, buildExtraMetricCards, buildPeriodMetricCards } from '../summary-cards'
import { useDashboardBalance } from '../hooks/use-dashboard-balance'
import { useDashboardSummary } from '../hooks/use-dashboard-summary'
import { useDashboardCounts } from '../hooks/use-dashboard-counts'
import { useDashboardBalanceVariation } from '../hooks/use-dashboard-balance-variation'
import { useDashboardLine } from '../hooks/use-dashboard-line'
import { useDashboardByCategory } from '../hooks/use-dashboard-by-category'
import { useDashboardComparison } from '../hooks/use-dashboard-comparison'
import { useDashboardFilterOptions } from '../hooks/use-dashboard-filter-options'

function errorMessage(error: unknown): string | undefined {
  return error instanceof ApiError ? error.message : undefined
}

export function DashboardPage() {
  const [filterState, setFilterState] = useState(DEFAULT_DASHBOARD_FILTER_STATE)
  const filters = toDashboardFilters(filterState)
  const filtersReady = isDashboardFiltersReady(filters)

  const [groupBy, setGroupBy] = useState<ComparisonGroupBy>('month')
  const [granularity, setGranularity] = useState<LineGranularity>('day')

  const { categories, ministries } = useDashboardFilterOptions()

  // Saldo isolado — carregado uma vez, imune a qualquer filtro.
  const balanceQuery = useDashboardBalance()

  // Bloco de métricas do período — recalculado pelos filtros ativos.
  const summaryQuery = useDashboardSummary(filters)
  const balanceVariationQuery = useDashboardBalanceVariation(filters)

  const lineQuery = useDashboardLine(filters, granularity)
  const byCategoryQuery = useDashboardByCategory(filters)
  const comparisonQuery = useDashboardComparison(filters, groupBy)

  // Bloco de métricas extras — sempre totais gerais, sem filtro.
  const countsQuery = useDashboardCounts()

  const periodCards = buildPeriodMetricCards(summaryQuery.data)
  const balanceVariationCards = buildBalanceVariationCards(balanceVariationQuery.data)
  const extraCards = buildExtraMetricCards(countsQuery.data)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Análise financeira com filtros globais — o Saldo é sempre até a data de hoje.
        </p>
      </div>

      {balanceQuery.isError ? (
        <BlockError
          message={errorMessage(balanceQuery.error) ?? 'Não foi possível carregar o saldo.'}
          onRetry={() => balanceQuery.refetch()}
        />
      ) : (
        <MetricCard
          label="Saldo"
          value={balanceQuery.data?.balance ?? 0}
          variant="balance"
          loading={balanceQuery.isPending}
          className="sm:max-w-xs"
        />
      )}

      <DashboardFilterBar
        state={filterState}
        onChange={setFilterState}
        categories={categories}
        ministries={ministries}
      />

      {!filtersReady ? (
        <p className="rounded-md border border-border p-4 text-sm text-muted-foreground">
          Selecione a data inicial e final do intervalo personalizado para calcular o dashboard.
        </p>
      ) : (
        <>
          {summaryQuery.isError || balanceVariationQuery.isError ? (
            <BlockError
              message={
                errorMessage(summaryQuery.error) ??
                errorMessage(balanceVariationQuery.error) ??
                'Não foi possível carregar as métricas do período.'
              }
              onRetry={() => {
                void summaryQuery.refetch()
                void balanceVariationQuery.refetch()
              }}
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {periodCards.map((card) => (
                <MetricCard
                  key={card.key}
                  label={card.label}
                  value={card.value}
                  variant={card.variant}
                  loading={summaryQuery.isPending}
                />
              ))}
              {balanceVariationCards.map((card) => (
                <MetricCard
                  key={card.key}
                  label={card.label}
                  value={card.value}
                  variant={card.variant}
                  percentChange={card.percentChange}
                  loading={balanceVariationQuery.isPending}
                />
              ))}
            </div>
          )}

          {lineQuery.isError ? (
            <BlockError
              message={errorMessage(lineQuery.error) ?? 'Não foi possível carregar o gráfico de linha.'}
              onRetry={() => lineQuery.refetch()}
            />
          ) : (
            <LineChart
              data={lineQuery.data?.line ?? []}
              isLoading={lineQuery.isPending}
              granularity={granularity}
              onGranularityChange={setGranularity}
              title="Entradas e saídas"
            />
          )}

          {comparisonQuery.isError ? (
            <BlockError
              message={
                errorMessage(comparisonQuery.error) ??
                'Não foi possível carregar o comparativo por período.'
              }
              onRetry={() => comparisonQuery.refetch()}
            />
          ) : (
            <BarChart
              data={comparisonQuery.data?.buckets ?? []}
              comparison={comparisonQuery.data?.comparison}
              isLoading={comparisonQuery.isPending}
              groupBy={groupBy}
              onGroupByChange={setGroupBy}
              title="Comparativo por período"
            />
          )}

          {byCategoryQuery.isError ? (
            <BlockError
              message={
                errorMessage(byCategoryQuery.error) ??
                'Não foi possível carregar os gráficos por categoria.'
              }
              onRetry={() => byCategoryQuery.refetch()}
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <PieChart
                title="Entradas por categoria"
                data={byCategoryQuery.data?.incomeByCategory ?? []}
                isLoading={byCategoryQuery.isPending}
              />
              <PieChart
                title="Saídas por categoria"
                data={byCategoryQuery.data?.expenseByCategory ?? []}
                isLoading={byCategoryQuery.isPending}
              />
            </div>
          )}

          {countsQuery.isError ? (
            <BlockError
              message={errorMessage(countsQuery.error) ?? 'Não foi possível carregar as métricas extras.'}
              onRetry={() => countsQuery.refetch()}
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {extraCards.map((card) => (
                <MetricCard
                  key={card.key}
                  label={card.label}
                  value={card.value}
                  variant="neutral"
                  loading={countsQuery.isPending}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
