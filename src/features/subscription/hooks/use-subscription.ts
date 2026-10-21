// Assinatura da igreja — GET /v1/subscriptions/me (specs/subscription.md).
// Compartilhada pela tela de Assinatura e pelo aviso global do layout.

import { useQuery } from '@tanstack/react-query'
import { getSubscription } from '@/services'
import { queryKeys } from '@/lib/query-keys'

interface UseSubscriptionOptions {
  /** Reconsulta periódica (ms) — usada na volta do checkout, enquanto o webhook não chega. */
  refetchInterval?: () => number | false
}

export function useSubscription({ refetchInterval }: UseSubscriptionOptions = {}) {
  return useQuery({
    queryKey: queryKeys.subscription.me(),
    queryFn: ({ signal }) => getSubscription(signal),
    refetchInterval,
  })
}
