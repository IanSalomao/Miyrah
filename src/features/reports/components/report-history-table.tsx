// Histórico de relatórios gerados — wiki/pages/page_reports.md.
// Colunas: Data de geração (com o período e a contagem de blocos do snapshot
// `params`, para o histórico ser informativo) e a ação Baixar. Sem Editar/Excluir:
// relatórios não têm exclusão.

import { Download, FileText, Loader2 } from 'lucide-react'
import { DataTable, type DataTableColumn } from '@/components/data-table/data-table'
import type { PaginationProps } from '@/components/pagination/pagination'
import { Button } from '@/components/ui/button'
import { formatDate, formatDateTime } from '@/lib/format'
import type { Report } from '@/types'

interface ReportHistoryTableProps {
  reports: Report[]
  isLoading: boolean
  isError: boolean
  onRetry: () => void
  onDownload: (report: Report) => void
  /** Id do relatório em download no momento (desabilita o botão da linha). */
  downloadingId: string | null
  /** Só passada quando o histórico cresce o suficiente para paginar. */
  pagination?: PaginationProps
}

function blocksLabel(count: number): string {
  return `${count} ${count === 1 ? 'bloco' : 'blocos'}`
}

export function ReportHistoryTable({
  reports,
  isLoading,
  isError,
  onRetry,
  onDownload,
  downloadingId,
  pagination,
}: ReportHistoryTableProps) {
  const columns: DataTableColumn<Report>[] = [
    {
      id: 'generatedAt',
      header: 'Data de geração',
      cell: (report) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-mono tabular-nums text-foreground">
            {formatDateTime(report.generatedAt)}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatDate(report.params.dateFrom)} – {formatDate(report.params.dateTo)} ·{' '}
            {blocksLabel(report.params.sections.length)}
          </span>
        </div>
      ),
    },
    {
      id: 'actions',
      header: <span className="sr-only">Ações</span>,
      headerClassName: 'w-0 text-right',
      cellClassName: 'text-right',
      cell: (report) => {
        const isDownloading = downloadingId === report.id
        return (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onDownload(report)}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <Loader2 className="animate-spin" aria-hidden />
            ) : (
              <Download aria-hidden />
            )}
            {isDownloading ? 'Baixando…' : 'Baixar'}
          </Button>
        )
      },
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={reports}
      getRowId={(report) => report.id}
      isLoading={isLoading}
      error={isError ? 'Não foi possível carregar o histórico de relatórios.' : null}
      onRetry={onRetry}
      emptyState={{ icon: FileText, title: 'Nenhum relatório encontrado' }}
      // A paginação é embutida pelo DataTable; passamos só quando há mais de uma página.
      pagination={pagination}
    />
  )
}
