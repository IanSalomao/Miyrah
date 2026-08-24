// Mutations de relatório — wiki/api/reports.md.
// Gerar: POST /v1/reports (síncrono); ao concluir, o novo relatório entra no
// topo do histórico (invalidação da lista). Baixar: GET /v1/reports/{id}/download
// devolve um link temporário; se o relatório já não existe (404), recarrega a lista.

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ApiError } from '@/lib/api-client'
import { createReport, getReportDownload } from '@/services'
import { queryKeys } from '@/lib/query-keys'
import type { CreateReportPayload } from '@/types'

export function useCreateReport() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateReportPayload) => createReport(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.all })
    },
  })
}

export function useDownloadReport() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => getReportDownload(id),
    onError: (error) => {
      // 404: o relatório já não existe — recarrega a tabela para refletir.
      if (error instanceof ApiError && error.code === 'RESOURCE_NOT_FOUND') {
        queryClient.invalidateQueries({ queryKey: queryKeys.reports.all })
      }
    },
  })
}
