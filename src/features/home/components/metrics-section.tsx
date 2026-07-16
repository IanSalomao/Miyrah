// Início — wiki/pages/page_home.md
// 4 cards de métrica (Saldo, Entradas, Saídas, Balanço), todos do mês atual.

import { MetricCard } from '@/components/metric-card/metric-card'
import { ApiError } from '@/lib/api-client'
import { useDashboardSummary } from '../hooks/use-dashboard-summary'

export function MetricsSection() {
  const { data, isLoading, isError, error, refetch } = useDashboardSummary()

  const errorMessage = isError
    ? error instanceof ApiError
      ? error.message
      : 'Não foi possível carregar as métricas.'
    : null

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        label="Saldo em Conta"
        value={data?.balance ?? 0}
        variant="balance"
        isLoading={isLoading}
        error={errorMessage}
        onRetry={() => void refetch()}
      />
      <MetricCard
        label="Entradas do Mês"
        value={data?.income ?? 0}
        variant="income"
        isLoading={isLoading}
        error={errorMessage}
        onRetry={() => void refetch()}
      />
      <MetricCard
        label="Saídas do Mês"
        // income/expense vêm como magnitude positiva do dashboard — nega para
        // exibir o sinal "−" explícito (a cor já é fixa pela variante).
        value={-(data?.expense ?? 0)}
        variant="expense"
        isLoading={isLoading}
        error={errorMessage}
        onRetry={() => void refetch()}
      />
      <MetricCard
        label="Balanço do Mês"
        value={data?.periodBalance ?? 0}
        variant="balance"
        isLoading={isLoading}
        error={errorMessage}
        onRetry={() => void refetch()}
      />
    </section>
  )
}
