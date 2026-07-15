// Categorias de transações — wiki/api/categories.md

import { apiClient } from '@/lib/api-client'
import type {
  CategoriesQuery,
  Category,
  CreateCategoryPayload,
  MessageResponse,
  Paginated,
  UpdateCategoryPayload,
} from '@/types'

export function listCategories(
  query: CategoriesQuery,
  signal?: AbortSignal,
): Promise<Paginated<Category>> {
  return apiClient.get('/categories', { ...query }, signal)
}

export function createCategory(payload: CreateCategoryPayload): Promise<Category> {
  return apiClient.post('/categories', payload)
}

export function updateCategory(id: string, payload: UpdateCategoryPayload): Promise<Category> {
  return apiClient.patch(`/categories/${id}`, payload)
}

export function removeCategory(id: string): Promise<MessageResponse> {
  return apiClient.del(`/categories/${id}`)
}
