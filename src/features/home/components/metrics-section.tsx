// Início — wiki/pages/page_home.md
// 4 cards de métrica (Saldo, Entradas, Saídas, Balanço), todos do mês atual.
// Saldo vem de GET /v1/dashboard/balance; Entradas/Saídas/Balanço de GET /v1/dashboard/summary.

import { MetricCard } from '@/components/metric-card/metric-card'
import { ApiError } from '@/lib/api-client'
import { useDashboardBalance } from '../hooks/use-dashboard-balance'
import { useDashboardSummary } from '../hooks/use-dashboard-summary'
import { BlockError } from './block-error'

export function MetricsSection() {
  const balanceQuery = useDashboardBalance()
  const summaryQuery = useDashboardSummary()

  if (balanceQuery.isError || summaryQuery.isError) {
    const error = balanceQuery.error ?? summaryQuery.error
    return (
      <BlockError
        message={error instanceof ApiError ? error.message : 'Não foi possível carregar as métricas.'}
        onRetry={() => {
          void balanceQuery.refetch()
          void summaryQuery.refetch()
        }}
      />
    )
  }

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        label="Saldo em Conta"
        value={balanceQuery.data?.balance ?? 0}
        variant="balance"
        loading={balanceQuery.isPending}
      />
      <MetricCard
        label="Entradas do Mês"
        value={summaryQuery.data?.income ?? 0}
        variant="income"
        loading={summaryQuery.isPending}
      />
      <MetricCard
        label="Saídas do Mês"
        value={summaryQuery.data?.expense ?? 0}
        variant="expense"
        loading={summaryQuery.isPending}
      />
      <MetricCard
        label="Balanço do Mês"
        value={summaryQuery.data?.periodBalance ?? 0}
        variant="balance"
        loading={summaryQuery.isPending}
      />
    </section>
  )
}
