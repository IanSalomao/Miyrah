// Query da listagem de transações — wiki/api/transactions.md
// Reflete busca, período, categoria e tipo (filtros da tela); cards de
// métrica leem o mesmo resultado (dados filtrados, não o total geral).

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { listTransactions } from '@/services'
import { queryKeys } from '@/lib/query-keys'
import type { TransactionsQuery } from '@/types'

export interface TransactionsFilters {
  search: string
  dateFrom: string
  dateTo: string
  categoryId: string
  type: 'all' | 'income' | 'expense'
  page: number
  limit: number
}

export function buildTransactionsQuery(filters: TransactionsFilters): TransactionsQuery {
  return {
    search: filters.search || undefined,
    dateFrom: filters.dateFrom || undefined,
    dateTo: filters.dateTo || undefined,
    categoryId: filters.categoryId || undefined,
    type: filters.type === 'all' ? undefined : filters.type,
    page: filters.page,
    limit: filters.limit,
    sort: '-date',
  }
}

export function useTransactionsQuery(filters: TransactionsFilters) {
  const query = buildTransactionsQuery(filters)
  return useQuery({
    queryKey: queryKeys.transactions.list(query),
    queryFn: ({ signal }) => listTransactions(query, signal),
    placeholderData: keepPreviousData,
  })
}
