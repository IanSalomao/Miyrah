// Opções de categoria — wiki/api/categories.md
// Usado tanto pelo filtro (todas) quanto pelo formulário (filtrado por
// Tipo — o dropdown de categoria é sempre filtrado pelo Tipo selecionado).

import { useQuery } from '@tanstack/react-query'
import { listCategories } from '@/services'
import { queryKeys } from '@/lib/query-keys'
import type { TransactionType } from '@/types'

const CATEGORIES_LIMIT = 100

/** Categorias do tipo informado (ou todas, se `type` for omitido). */
export function useCategoriesOptions(type?: TransactionType) {
  const query = { type, limit: CATEGORIES_LIMIT }
  return useQuery({
    queryKey: queryKeys.categories.list(query),
    queryFn: ({ signal }) => listCategories(query, signal),
  })
}
