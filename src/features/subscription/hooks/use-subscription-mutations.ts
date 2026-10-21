// Mutations da assinatura (specs/subscription.md).
// Checkout: cria a cobrança e devolve a URL hospedada da AbacatePay — quem chama
// redireciona. Cancelar: a resposta já é a assinatura atualizada.

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cancelSubscription, createCheckout } from '@/services'
import { queryKeys } from '@/lib/query-keys'
import type { CreateCheckoutPayload } from '@/types'

export function useCreateCheckout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateCheckoutPayload) => createCheckout(payload),
    // Uma cobrança pendente entra no histórico.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.subscription.all }),
  })
}

export function useCancelSubscription() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => cancelSubscription(),
    onSuccess: (subscription) => {
      queryClient.setQueryData(queryKeys.subscription.me(), subscription)
      queryClient.invalidateQueries({ queryKey: queryKeys.subscription.all })
    },
  })
}
