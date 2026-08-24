// page_reports (Relatórios) — wiki/pages/page_reports.md
// Geração de relatórios em PDF a partir de um painel granular de blocos + histórico
// dos relatórios já gerados. Relatórios não têm exclusão (só gerar e baixar).

import { useState } from 'react'
import { ApiError } from '@/lib/api-client'
import type { Report, ReportSection } from '@/types'
import { ReportGenerator } from '../components/report-generator'
import { ReportHistoryTable } from '../components/report-history-table'
import { IncludeMemberModal } from '../components/include-member-modal'
import {
  buildCreateReportPayload,
  createInitialReportForm,
  toggleSection,
  validateReportForm,
  type ReportFormErrors,
} from '../report-form'
import { useReportCategories } from '../hooks/use-report-categories'
import { useReportsQuery } from '../hooks/use-reports-query'
import { useCreateReport, useDownloadReport } from '../hooks/use-report-mutations'

const HISTORY_LIMIT = 20

// Abre o link temporário assinado num contexto de download (o storage responde
// com Content-Disposition). Anchor em vez de window.open evita bloqueio de pop-up.
function triggerBrowserDownload(url: string): void {
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.target = '_blank'
  anchor.rel = 'noopener'
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
}

export function ReportsPage() {
  const [form, setForm] = useState(createInitialReportForm)
  const [errors, setErrors] = useState<ReportFormErrors>({})
  const [memberModalOpen, setMemberModalOpen] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [historyFilters, setHistoryFilters] = useState({ page: 1, limit: HISTORY_LIMIT })

  const categoriesQuery = useReportCategories()
  const historyQuery = useReportsQuery(historyFilters)
  const createMutation = useCreateReport()
  const downloadMutation = useDownloadReport()

  function handleDateFromChange(dateFrom: string) {
    setForm((prev) => ({ ...prev, dateFrom }))
    setErrors((prev) => (prev.period ? { ...prev, period: undefined } : prev))
  }

  function handleDateToChange(dateTo: string) {
    setForm((prev) => ({ ...prev, dateTo }))
    setErrors((prev) => (prev.period ? { ...prev, period: undefined } : prev))
  }

  function handleCategoryIdsChange(categoryIds: string[]) {
    setForm((prev) => ({ ...prev, categoryIds }))
  }

  function handleToggleSection(section: ReportSection) {
    setForm((prev) => toggleSection(prev, section))
    setErrors((prev) => (prev.sections ? { ...prev, sections: undefined } : prev))
  }

  // Marcar "Incluir Membro" abre o pop-up de senha; desmarcar limpa a senha retida.
  function handleIncludeMemberToggle() {
    if (form.includeMember) {
      setForm((prev) => ({ ...prev, includeMember: false, currentPassword: '' }))
      return
    }
    setForm((prev) => ({ ...prev, currentPassword: '' }))
    setPasswordError(null)
    setMemberModalOpen(true)
  }

  function handleMemberPasswordChange(currentPassword: string) {
    setForm((prev) => ({ ...prev, currentPassword }))
    if (passwordError) setPasswordError(null)
  }

  // Confirmar retém a senha e mantém "Incluir Membro" marcado.
  function handleMemberConfirm() {
    setForm((prev) => ({ ...prev, includeMember: true }))
    setMemberModalOpen(false)
  }

  // Cancelar/fechar desmarca "Incluir Membro" e descarta a senha digitada.
  function handleMemberCancel() {
    setForm((prev) => ({ ...prev, includeMember: false, currentPassword: '' }))
    setPasswordError(null)
    setMemberModalOpen(false)
  }

  function handleGenerateError(error: unknown) {
    if (!(error instanceof ApiError)) return

    // Senha incorreta: reabre o pop-up mantendo os blocos selecionados.
    if (error.code === 'INVALID_CREDENTIALS') {
      setForm((prev) => ({ ...prev, currentPassword: '' }))
      setPasswordError('Senha atual incorreta.')
      setMemberModalOpen(true)
      return
    }

    // Validação do servidor: marca o Período e/ou a lista de blocos.
    if (error.code === 'VALIDATION_ERROR') {
      const nextErrors: ReportFormErrors = {}
      for (const detail of error.details ?? []) {
        if (detail.field === 'dateFrom' || detail.field === 'dateTo') {
          nextErrors.period = detail.message
        } else if (detail.field === 'sections') {
          nextErrors.sections = detail.message
        }
      }
      if (!nextErrors.period && !nextErrors.sections) {
        nextErrors.period = error.message
      }
      setErrors(nextErrors)
    }
  }

  function handleGenerate() {
    const validation = validateReportForm(form)
    if (validation.period || validation.sections) {
      setErrors(validation)
      return
    }
    setErrors({})
    createMutation.mutate(buildCreateReportPayload(form), {
      onSuccess: () => {
        // O novo relatório entra no topo — volta para a primeira página do histórico.
        setHistoryFilters((prev) => ({ ...prev, page: 1 }))
      },
      onError: handleGenerateError,
    })
  }

  async function handleDownload(report: Report) {
    try {
      const { downloadUrl } = await downloadMutation.mutateAsync(report.id)
      triggerBrowserDownload(downloadUrl)
    } catch {
      // 404 já recarrega a lista no hook; demais falhas não interrompem a tela.
    }
  }

  const meta = historyQuery.data?.meta
  const pagination =
    meta && meta.totalPages > 1
      ? {
          page: meta.page,
          limit: meta.limit,
          total: meta.total,
          totalPages: meta.totalPages,
          onPageChange: (page: number) => setHistoryFilters((prev) => ({ ...prev, page })),
          onLimitChange: (limit: number) => setHistoryFilters({ page: 1, limit }),
        }
      : undefined

  const downloadingId = downloadMutation.isPending ? (downloadMutation.variables ?? null) : null

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Relatórios</h1>
        <p className="text-sm text-muted-foreground">
          Monte um relatório em PDF sob medida e baixe os que já gerou.
        </p>
      </div>

      <ReportGenerator
        form={form}
        errors={errors}
        categories={categoriesQuery.data?.items ?? []}
        isGenerating={createMutation.isPending}
        onDateFromChange={handleDateFromChange}
        onDateToChange={handleDateToChange}
        onCategoryIdsChange={handleCategoryIdsChange}
        onToggleSection={handleToggleSection}
        onIncludeMemberToggle={handleIncludeMemberToggle}
        onGenerate={handleGenerate}
      />

      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Histórico</h2>
          <p className="text-sm text-muted-foreground">Relatórios já gerados pela igreja.</p>
        </div>

        <ReportHistoryTable
          reports={historyQuery.data?.items ?? []}
          isLoading={historyQuery.isLoading}
          isError={historyQuery.isError}
          onRetry={() => historyQuery.refetch()}
          onDownload={handleDownload}
          downloadingId={downloadingId}
          pagination={pagination}
        />
      </section>

      <IncludeMemberModal
        open={memberModalOpen}
        password={form.currentPassword}
        error={passwordError}
        onPasswordChange={handleMemberPasswordChange}
        onConfirm={handleMemberConfirm}
        onCancel={handleMemberCancel}
      />
    </div>
  )
}
