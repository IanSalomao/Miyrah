// Início — wiki/pages/page_home.md
// 4 cards de métrica (Saldo, Entradas, Saídas, Balanço), todos do mês atual.
// Saldo vem de GET /v1/dashboard/balance; Entradas/Saídas/Balanço de GET /v1/dashboard/summary.

import { Scale, TrendingDown, TrendingUp, Wallet } from 'lucide-react'
import { MetricCard } from '@/components/metric-card/metric-card'
import { ApiError } from '@/lib/api-client'
import { useDashboardBalance } from '../hooks/use-dashboard-balance'
import { useDashboardSummary } from '../hooks/use-dashboard-summary'
import { BlockError } from './block-error'

// "1 transação" / "N transações".
function transactionsLabel(count: number): string {
  return `${count} ${count === 1 ? 'transação' : 'transações'}`
}

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

  const summary = summaryQuery.data

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        label="Saldo em Conta"
        value={balanceQuery.data?.balance ?? 0}
        variant="balance"
        loading={balanceQuery.isPending}
        icon={<Wallet />}
        info="Soma de todas as entradas menos as saídas desde o início, até hoje. Não é afetado pelo mês exibido."
      />
      <MetricCard
        label="Entradas do Mês"
        value={summary?.income ?? 0}
        variant="income"
        loading={summaryQuery.isPending}
        icon={<TrendingUp />}
        secondary={summary ? transactionsLabel(summary.incomeCount) : undefined}
        info="Total recebido no mês atual — dízimos, ofertas e demais entradas."
      />
      <MetricCard
        label="Saídas do Mês"
        value={summary?.expense ?? 0}
        variant="expense"
        loading={summaryQuery.isPending}
        icon={<TrendingDown />}
        secondary={summary ? transactionsLabel(summary.expenseCount) : undefined}
        info="Total gasto no mês atual — despesas e demais saídas."
      />
      <MetricCard
        label="Balanço do Mês"
        value={summary?.periodBalance ?? 0}
        variant="balance"
        loading={summaryQuery.isPending}
        icon={<Scale />}
        secondary={summary ? transactionsLabel(summary.transactionsCount) : undefined}
        info="Entradas menos saídas do mês atual. Positivo indica superávit; negativo, déficit."
      />
    </section>
  )
}
