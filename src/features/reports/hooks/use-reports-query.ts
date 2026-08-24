// Histórico de relatórios — GET /v1/reports (wiki/api/reports.md).
// Paginado; mantém os dados anteriores enquanto troca de página.

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { listReports } from '@/services'
import { queryKeys } from '@/lib/query-keys'
import type { ReportsQuery } from '@/types'

export interface ReportsHistoryFilters {
  page: number
  limit: number
}

export function useReportsQuery(filters: ReportsHistoryFilters) {
  const query: ReportsQuery = { page: filters.page, limit: filters.limit }
  return useQuery({
    queryKey: queryKeys.reports.list(query),
    queryFn: ({ signal }) => listReports(query, signal),
    placeholderData: keepPreviousData,
  })
}
