// Categorias de transações — wiki/api/categories.md,
// wiki/database/church_transaction_categories.md

import type { TransactionType } from './api'

export interface Category {
  id: string
  name: string
  description: string | null
  type: TransactionType // imutável após a criação
  color: string // hex escolhido pelo usuário — é dado, não token de design
  createdAt: string
  updatedAt: string
}

/** Referência aninhada de categoria (em transações). */
export interface CategoryRef {
  id: string
  name: string
  color: string
  deleted: boolean
}

export interface CreateCategoryPayload {
  name: string
  type: TransactionType
  color: string
  description?: string | null
}

/** Na edição o `type` não é aceito (CATEGORY_TYPE_IMMUTABLE). */
export interface UpdateCategoryPayload {
  name?: string
  color?: string
  description?: string | null
}

export interface CategoriesQuery {
  type?: TransactionType // omitido = ambos (aba "Todas")
  page?: number
  limit?: number
}
