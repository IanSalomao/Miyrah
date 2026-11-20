// Mutations de transação — wiki/api/transactions.md
// Toda mutation invalida queryKeys.transactions.all (tabela + métricas) e
// queryKeys.dashboard.all (cards e gráficos da Início/Dashboard).

import { useMutation, useQueryClient, type QueryClient } from '@tanstack/react-query'
import { ApiError } from '@/lib/api-client'
import { createTransaction, removeTransaction, updateTransaction } from '@/services'
import { queryKeys } from '@/lib/query-keys'
import type {
  CreateTransactionPayload,
  Paginated,
  Transaction,
  UpdateTransactionPayload,
} from '@/types'

function invalidateTransactionViews(queryClient: QueryClient) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all }),
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all }),
  ])
}

export function useCreateTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateTransactionPayload) => createTransaction(payload),
    onSuccess: () => invalidateTransactionViews(queryClient),
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
        return invalidateTransactionViews(queryClient)
      }
    },
  })
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTransactionPayload }) =>
      updateTransaction(id, payload),
    onSuccess: () => invalidateTransactionViews(queryClient),
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
    onSuccess: (_data, id) => {
      // Tira a linha de todas as listagens em cache na hora, sem depender do
      // refetch; o `return` mantém a mutation pendente (modal em
      // "Processando…") até as listagens e os totais voltarem atualizados.
      queryClient.setQueriesData<Paginated<Transaction>>(
        { queryKey: [...queryKeys.transactions.all, 'list'] },
        (data) => data && { ...data, items: data.items.filter((item) => item.id !== id) },
      )
      return invalidateTransactionViews(queryClient)
    },
    onError: (error) => {
      if (error instanceof ApiError && error.code === 'RESOURCE_NOT_FOUND') {
        queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all })
      }
    },
  })
}
