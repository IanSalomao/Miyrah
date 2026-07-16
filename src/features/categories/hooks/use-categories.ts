// Query de listagem de categorias — wiki/api/categories.md (GET /v1/categories).
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { listCategories } from '@/services'
import { queryKeys } from '@/lib/query-keys'
import type { CategoriesQuery } from '@/types'

export function useCategories(query: CategoriesQuery) {
  return useQuery({
    queryKey: queryKeys.categories.list(query),
    queryFn: ({ signal }) => listCategories(query, signal),
    placeholderData: keepPreviousData,
  })
}
