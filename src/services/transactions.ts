// Transações — wiki/api/transactions.md

import { apiClient } from '@/lib/api-client'
import type {
  CreateTransactionPayload,
  MessageResponse,
  Paginated,
  Transaction,
  TransactionsQuery,
  UpdateTransactionPayload,
} from '@/types'

export function listTransactions(
  query: TransactionsQuery,
  signal?: AbortSignal,
): Promise<Paginated<Transaction>> {
  return apiClient.get('/transactions', { ...query }, signal)
}

export function getTransaction(id: string, signal?: AbortSignal): Promise<Transaction> {
  return apiClient.get(`/transactions/${id}`, undefined, signal)
}

export function createTransaction(payload: CreateTransactionPayload): Promise<Transaction> {
  return apiClient.post('/transactions', payload)
}

export function updateTransaction(
  id: string,
  payload: UpdateTransactionPayload,
): Promise<Transaction> {
  return apiClient.patch(`/transactions/${id}`, payload)
}

export function removeTransaction(id: string): Promise<MessageResponse> {
  return apiClient.del(`/transactions/${id}`)
}
