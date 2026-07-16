// Início — wiki/pages/page_home.md, wiki/api/transactions.md
// GET /v1/transactions?limit=5&sort=-date — as 5 transações mais recentes.

import { useQuery } from '@tanstack/react-query'
import { listTransactions } from '@/services'
import { queryKeys } from '@/lib/query-keys'
import type { TransactionsQuery } from '@/types'

const RECENT_TRANSACTIONS_QUERY: TransactionsQuery = { limit: 5, sort: '-date' }

export function useRecentTransactions() {
  return useQuery({
    queryKey: queryKeys.transactions.list(RECENT_TRANSACTIONS_QUERY),
    queryFn: ({ signal }) => listTransactions(RECENT_TRANSACTIONS_QUERY, signal),
  })
}
