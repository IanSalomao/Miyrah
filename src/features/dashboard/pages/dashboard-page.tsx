// page_dashboard — wiki/pages/page_dashboard.md
// Tela de análise financeira com barra de filtros globais. Sem lista de últimas
// transações, sem botão de adicionar transação (lançamento é em /transactions).

import { useState, type ReactNode } from 'react'
import { FolderTree, DollarSign, TrendingDown, TrendingUp, Users, Wallet } from 'lucide-react'
import { MetricCard } from '@/components/metric-card'
import { LineChart } from '@/components/line-chart'
import { PieChart } from '@/components/pie-chart'
import { BarChart } from '@/components/bar-chart'
import { ApiError } from '@/lib/api-client'
import type { ComparisonGroupBy, DashboardSummary, LineGranularity } from '@/types'
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

// Ícone + texto explicativo por card, casados pela `key` dos builders de summary-cards.
const CARD_ICONS: Record<string, ReactNode> = {
  income: <TrendingUp />,
  expense: <TrendingDown />,
  periodBalance: <DollarSign />,
  balanceStart: <Wallet />,
  balanceEnd: <Wallet />,
  membersCount: <Users />,
  ministriesCount: <FolderTree />,
  categoriesCount: <FolderTree />,
}


const CARD_INFO: Record<string, string> = {
  income: 'Total de entradas no período e filtros selecionados.',
  expense: 'Total de saídas no período e filtros selecionados.',
  periodBalance: 'Entradas menos saídas do período filtrado. Positivo indica superávit; negativo, déficit.',
  balanceStart: 'Saldo acumulado até o dia anterior ao início do período selecionado.',
  balanceEnd: 'Saldo acumulado até o fim do período. A variação (%) compara com o saldo inicial.',
  membersCount: 'Total de membros cadastrados na igreja. Não depende dos filtros.',
  ministriesCount: 'Total de ministérios cadastrados. Não depende dos filtros.',
  categoriesCount: 'Total de categorias de transação cadastradas. Não depende dos filtros.',
}

// "1 transação" / "N transações".
function transactionsLabel(count: number): string {
  return `${count} ${count === 1 ? 'transação' : 'transações'}`
}

const PERIOD_CARD_COUNTS: Record<string, keyof DashboardSummary> = {
  income: 'incomeCount',
  expense: 'expenseCount',
  periodBalance: 'transactionsCount',
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
          icon={<Wallet />}
          info="Saldo total da igreja até hoje — soma de todas as entradas menos as saídas. Nunca é afetado pelos filtros."
          className="sm:max-w-1/3"
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {periodCards.map((card) => {
                const countField = PERIOD_CARD_COUNTS[card.key]
                const count = summaryQuery.data?.[countField]
                return (
                  <MetricCard
                    key={card.key}
                    label={card.label}
                    value={card.value}
                    variant={card.variant}
                    loading={summaryQuery.isPending}
                    icon={CARD_ICONS[card.key]}
                    info={CARD_INFO[card.key]}
                    secondary={count !== undefined ? transactionsLabel(count) : undefined}
                  />
                )
              })}
              {balanceVariationCards.map((card) => (
                <MetricCard
                  key={card.key}
                  label={card.label}
                  value={card.value}
                  variant={card.variant}
                  percentChange={card.percentChange}
                  loading={balanceVariationQuery.isPending}
                  icon={CARD_ICONS[card.key]}
                  info={CARD_INFO[card.key]}
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
                  icon={CARD_ICONS[card.key]}
                  info={CARD_INFO[card.key]}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
