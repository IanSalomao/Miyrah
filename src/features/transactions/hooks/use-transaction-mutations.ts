// Mutations de transação — wiki/api/transactions.md
// Toda mutation invalida queryKeys.transactions.all (tabela + métricas).

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ApiError } from '@/lib/api-client'
import { createTransaction, removeTransaction, updateTransaction } from '@/services'
import { queryKeys } from '@/lib/query-keys'
import type { CreateTransactionPayload, UpdateTransactionPayload } from '@/types'

export function useCreateTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateTransactionPayload) => createTransaction(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all })
    },
  })
}

/**
 * Criação em lote (lançamentos encadeados) — como só existe
 * `POST /v1/transactions` (uma transação por chamada), dispara uma chamada
 * por item via `Promise.allSettled` (sucesso parcial não interrompe as
 * demais). Invalida as queries uma única vez ao final, se ao menos uma
 * transação tiver sido criada.
 */
export function useCreateTransactions() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payloads: CreateTransactionPayload[]) =>
      Promise.allSettled(payloads.map((payload) => createTransaction(payload))),
    onSuccess: (results) => {
      const hasSuccess = results.some((result) => result.status === 'fulfilled')
      if (hasSuccess) {
        queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all })
      }
    },
  })
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTransactionPayload }) =>
      updateTransaction(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all })
    },
    onError: (error) => {
      // 404: a transação já não existe mais — recarrega a tabela mesmo assim.
      if (error instanceof ApiError && error.code === 'RESOURCE_NOT_FOUND') {
        queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all })
      }
    },
  })
}

export function useRemoveTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => removeTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all })
    },
    onError: (error) => {
      if (error instanceof ApiError && error.code === 'RESOURCE_NOT_FOUND') {
        queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all })
      }
    },
  })
}
