// Relatórios — wiki/api/reports.md. Sem soft delete (só gerar e baixar).

/**
 * Blocos do relatório (chaves do enum `sections`). A ordem no PDF é fixa no
 * backend (Capa → Entradas → Saídas → Resumo), independente da ordem enviada.
 */
export type ReportSection =
  | 'summary'
  | 'incomeByCategory'
  | 'incomeByMinistry'
  | 'incomeCategoryChart'
  | 'incomeMonthlyChart'
  | 'expenseByMinistry'
  | 'expenseByCategory'
  | 'expenseCategoryChart'
  | 'expenseMonthlyChart'
  | 'transactionList'

/** Snapshot da configuração usada — histórico informativo (nunca inclui a senha). */
export interface ReportParams {
  dateFrom: string
  dateTo: string
  categoryIds: string[]
  sections: ReportSection[]
  includeMember: boolean
}

/** Item do histórico — GET /v1/reports. */
export interface Report {
  id: string
  generatedAt: string
  params: ReportParams
}

/** Resposta de POST /v1/reports — já traz um link inicial pronto para download. */
export interface GeneratedReport {
  id: string
  generatedAt: string
  downloadUrl: string
  expiresAt: string
}

/** Corpo de POST /v1/reports. */
export interface CreateReportPayload {
  dateFrom: string
  dateTo: string
  categoryIds?: string[]
  sections: ReportSection[]
  /** Só válido com o bloco `transactionList` selecionado. */
  includeMember?: boolean
  /** Obrigatório apenas quando `includeMember` é `true`. Nunca é armazenado. */
  currentPassword?: string
}

/** GET /v1/reports/{id}/download — link temporário gerado sob demanda. */
export interface ReportDownload {
  downloadUrl: string
  expiresAt: string
}

export interface ReportsQuery {
  page?: number
  limit?: number
}
