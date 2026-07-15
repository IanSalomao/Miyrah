// Relatórios — wiki/api/reports.md
// Domínio ainda ausente em src/types/api-types.d.ts (backend não implementou
// /v1/reports ainda) — mantido conforme a spec da wiki para não bloquear a
// tela de Relatórios quando a rota existir.

import { apiClient } from '@/lib/api-client'
import type { CreateReportPayload, Paginated, Report, ReportDownload, ReportsQuery } from '@/types'

export function listReports(query: ReportsQuery, signal?: AbortSignal): Promise<Paginated<Report>> {
  return apiClient.get('/reports', { ...query }, signal)
}

export function createReport(payload: CreateReportPayload): Promise<Report> {
  return apiClient.post('/reports', payload)
}

export function getReportDownload(id: string, signal?: AbortSignal): Promise<ReportDownload> {
  return apiClient.get(`/reports/${id}/download`, undefined, signal)
}
