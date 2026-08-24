// Opções de categoria para o filtro do relatório — todas (entrada e saída), já que
// um relatório pode combinar categorias dos dois tipos (wiki/pages/page_reports.md).

import { useQuery } from '@tanstack/react-query'
import { listCategories } from '@/services'
import { queryKeys } from '@/lib/query-keys'

const CATEGORIES_LIMIT = 100

export function useReportCategories() {
  const query = { limit: CATEGORIES_LIMIT }
  return useQuery({
    queryKey: queryKeys.categories.list(query),
    queryFn: ({ signal }) => listCategories(query, signal),
  })
}
