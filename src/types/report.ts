// Relatórios — wiki/api/reports.md. Sem soft delete (só gerar e baixar).

export interface Report {
  id: string
  generatedAt: string
}

export interface CreateReportPayload {
  dateFrom: string
  dateTo: string
  categoryIds?: string[]
}

export interface ReportDownload {
  downloadUrl: string
  expiresAt: string
}

export interface ReportsQuery {
  page?: number
  limit?: number
}
