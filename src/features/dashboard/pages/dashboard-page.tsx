// page_dashboard — wiki/pages/page_dashboard.md
// Tela de análise financeira com barra de filtros globais. Sem lista de últimas
// transações, sem botão de adicionar transação (lançamento é em /transactions).

import { useState } from 'react'
import { MetricCard } from '@/components/metric-card'
import { LineChart } from '@/components/line-chart'
import { PieChart } from '@/components/pie-chart'
import { ApiError } from '@/lib/api-client'
import { DashboardFilterBar } from '../components/dashboard-filter-bar'
import { BlockError } from '../components/block-error'
import {
  DEFAULT_DASHBOARD_FILTER_STATE,
  isDashboardFiltersReady,
  toDashboardFilters,
} from '../filters'
import { buildExtraMetricCards, buildMainMetricCards } from '../summary-cards'
import { useDashboardSummary } from '../hooks/use-dashboard-summary'
import { useDashboardCharts } from '../hooks/use-dashboard-charts'
import { useDashboardFilterOptions } from '../hooks/use-dashboard-filter-options'

function errorMessage(error: unknown): string | undefined {
  return error instanceof ApiError ? error.message : undefined
}

export function DashboardPage() {
  const [filterState, setFilterState] = useState(DEFAULT_DASHBOARD_FILTER_STATE)
  const filters = toDashboardFilters(filterState)
  const filtersReady = isDashboardFiltersReady(filters)

  const { categories, ministries } = useDashboardFilterOptions()
  const summaryQuery = useDashboardSummary(filters)
  const chartsQuery = useDashboardCharts(filters)

  const mainCards = buildMainMetricCards(summaryQuery.data)
  const extraCards = buildExtraMetricCards(summaryQuery.data)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Análise financeira com filtros globais — o Saldo é sempre até a data de hoje.
        </p>
      </div>

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
          {summaryQuery.isError ? (
            <BlockError
              message={errorMessage(summaryQuery.error) ?? 'Não foi possível carregar as métricas.'}
              onRetry={() => summaryQuery.refetch()}
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {mainCards.map((card) => (
                <MetricCard
                  key={card.key}
                  label={card.label}
                  value={card.value}
                  variant={card.variant}
                  loading={summaryQuery.isPending}
                />
              ))}
            </div>
          )}

          {chartsQuery.isError ? (
            <BlockError
              message={errorMessage(chartsQuery.error) ?? 'Não foi possível carregar os gráficos.'}
              onRetry={() => chartsQuery.refetch()}
            />
          ) : (
            <>
              <LineChart data={chartsQuery.data?.line ?? []} isLoading={chartsQuery.isPending} />

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <PieChart
                  title="Entradas por categoria"
                  data={chartsQuery.data?.incomeByCategory ?? []}
                  isLoading={chartsQuery.isPending}
                />
                <PieChart
                  title="Saídas por categoria"
                  data={chartsQuery.data?.expenseByCategory ?? []}
                  isLoading={chartsQuery.isPending}
                />
              </div>
            </>
          )}

          {summaryQuery.isError ? (
            <BlockError
              message={
                errorMessage(summaryQuery.error) ?? 'Não foi possível carregar as métricas extras.'
              }
              onRetry={() => summaryQuery.refetch()}
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {extraCards.map((card) => (
                <MetricCard
                  key={card.key}
                  label={card.label}
                  value={card.value}
                  variant="neutral"
                  formatValue={card.formatValue}
                  loading={summaryQuery.isPending}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
