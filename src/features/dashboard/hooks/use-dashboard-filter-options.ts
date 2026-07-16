// Opções de Categoria/Ministério da filter-bar do Dashboard.
// GET /v1/categories sem `type` (ambos os tipos) e GET /v1/ministries (sem paginação).

import { useQuery } from '@tanstack/react-query'
import { listCategories, listMinistries } from '@/services'
import { queryKeys } from '@/lib/query-keys'

const CATEGORIES_QUERY = { limit: 100 }

export function useDashboardFilterOptions() {
  const categoriesQuery = useQuery({
    queryKey: queryKeys.categories.list(CATEGORIES_QUERY),
    queryFn: ({ signal }) => listCategories(CATEGORIES_QUERY, signal),
  })

  const ministriesQuery = useQuery({
    queryKey: queryKeys.ministries.list(),
    queryFn: ({ signal }) => listMinistries(signal),
  })

  return {
    categories: categoriesQuery.data?.items ?? [],
    ministries: ministriesQuery.data?.items ?? [],
  }
}
