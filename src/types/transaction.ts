// Transações — wiki/api/transactions.md, wiki/database/transaction.md

import type { TransactionType } from './api'
import type { CategoryRef } from './category'
import type { MemberRef } from './member'
import type { MinistryRef } from './ministry'

export interface Transaction {
  id: string
  type: TransactionType
  /** Na resposta, `value` já vem COM sinal (positivo = entrada, negativo = saída). */
  value: number
  date: string // YYYY-MM-DD
  description: string | null
  category: CategoryRef
  member: MemberRef | null
  ministry: MinistryRef | null
  createdAt: string
  updatedAt: string
}

export interface CreateTransactionPayload {
  type: TransactionType
  /** No corpo da requisição, `value` é sempre POSITIVO (magnitude); o `type` define o sinal. */
  value: number
  date: string
  categoryId: string
  description?: string | null
  memberId?: string | null
  ministryId?: string | null
}

export type UpdateTransactionPayload = Partial<CreateTransactionPayload>

export interface TransactionsQuery {
  search?: string
  dateFrom?: string
  dateTo?: string
  categoryId?: string
  type?: TransactionType
  page?: number
  limit?: number
  sort?: string // ex.: "-date"
}
