// Início — wiki/pages/page_home.md
// PATCH /v1/transactions/{id} — editar transação a partir da Início.

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateTransaction } from '@/services'
import { queryKeys } from '@/lib/query-keys'
import type { UpdateTransactionPayload } from '@/types'

export function useUpdateTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTransactionPayload }) =>
      updateTransaction(id, payload),
    onSuccess: () => {
      // Sucesso: atualiza a linha na lista e recalcula os cards/gráficos.
      void queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all })
      void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all })
    },
  })
}
