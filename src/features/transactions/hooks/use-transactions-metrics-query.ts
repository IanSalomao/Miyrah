// Métricas (Entradas/Saídas/Balanço) da tela Transações — refletem os
// mesmos filtros da tabela (busca, período, categoria, tipo), mas nunca a
// paginação (wiki/pages/page_transactions.md: "cards ... ficam fixos ao
// paginar").
//
// Limitação conhecida: `GET /v1/transactions` não expõe um endpoint de
// agregação — usamos o maior `limit` permitido pela API (100) para somar os
// itens retornados. Em contas com mais de 100 transações filtradas ao mesmo
// tempo, os cards refletirão apenas essa amostra (decisão registrada para
// revisão; não há endpoint de soma documentado em wiki/api/transactions.md).

import { useQuery } from '@tanstack/react-query'
import { listTransactions } from '@/services'
import { queryKeys } from '@/lib/query-keys'
import type { TransactionsFilters } from './use-transactions-query'

const METRICS_LIMIT = 100

export interface TransactionsMetrics {
  income: number
  expense: number
  balance: number
  incomeCount: number
  expenseCount: number
  transactionsCount: number
}

export function useTransactionsMetricsQuery(filters: TransactionsFilters) {
  const query = {
    search: filters.search || undefined,
    dateFrom: filters.dateFrom || undefined,
    dateTo: filters.dateTo || undefined,
    categoryId: filters.categoryId || undefined,
    type: filters.type === 'all' ? undefined : filters.type,
    page: 1,
    limit: METRICS_LIMIT,
  }

  return useQuery({
    queryKey: [...queryKeys.transactions.all, 'metrics', query] as const,
    queryFn: async ({ signal }): Promise<TransactionsMetrics> => {
      const { items } = await listTransactions(query, signal)
      let income = 0
      let expense = 0
      let incomeCount = 0
      let expenseCount = 0
      for (const item of items) {
        if (item.value >= 0) {
          income += item.value
          incomeCount += 1
        } else {
          expense += item.value
          expenseCount += 1
        }
      }
      return {
        income,
        expense,
        balance: income + expense,
        incomeCount,
        expenseCount,
        transactionsCount: incomeCount + expenseCount,
      }
    },
  })
}
