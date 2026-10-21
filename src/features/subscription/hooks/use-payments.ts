// Histórico de pagamentos — GET /v1/subscriptions/payments (specs/subscription.md).
// Paginado; mantém os dados anteriores enquanto troca de página.

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { listPayments } from '@/services'
import { queryKeys } from '@/lib/query-keys'
import type { PaymentsQuery } from '@/types'

export const PAYMENTS_PAGE_SIZE = 20

interface UsePaymentsOptions {
  refetchInterval?: () => number | false
}

export function usePayments(page: number, { refetchInterval }: UsePaymentsOptions = {}) {
  const query: PaymentsQuery = { page, limit: PAYMENTS_PAGE_SIZE }
  return useQuery({
    queryKey: queryKeys.subscription.payments(query),
    queryFn: ({ signal }) => listPayments(query, signal),
    placeholderData: keepPreviousData,
    refetchInterval,
  })
}
