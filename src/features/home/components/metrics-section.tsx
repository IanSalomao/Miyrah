// Início — wiki/pages/page_home.md
// 4 cards de métrica (Saldo, Entradas, Saídas, Balanço), todos do mês atual.

import { MetricCard } from '@/components/metric-card/metric-card'
import { ApiError } from '@/lib/api-client'
import { useDashboardSummary } from '../hooks/use-dashboard-summary'
import { BlockError } from './block-error'

export function MetricsSection() {
  const { data, isLoading, isError, error, refetch } = useDashboardSummary()

  if (isError) {
    return (
      <BlockError
        message={error instanceof ApiError ? error.message : 'Não foi possível carregar as métricas.'}
        onRetry={() => void refetch()}
      />
    )
  }

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        label="Saldo em Conta"
        value={data?.balance ?? 0}
        variant="balance"
        loading={isLoading}
      />
      <MetricCard
        label="Entradas do Mês"
        value={data?.income ?? 0}
        variant="income"
        loading={isLoading}
      />
      <MetricCard
        label="Saídas do Mês"
        value={data?.expense ?? 0}
        variant="expense"
        loading={isLoading}
      />
      <MetricCard
        label="Balanço do Mês"
        value={data?.periodBalance ?? 0}
        variant="balance"
        loading={isLoading}
      />
    </section>
  )
}
