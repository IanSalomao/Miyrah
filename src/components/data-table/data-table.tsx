import type { ComponentType, ReactNode } from 'react'
import { AlertCircle, Inbox } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Pagination, type PaginationProps } from '@/components/pagination/pagination'
import { cn } from '@/lib/utils'

export interface DataTableColumn<TRow> {
  /** Identificador único da coluna (chave de renderização). */
  id: string
  header: ReactNode
  /** Extrai o conteúdo da célula a partir da linha. */
  cell: (row: TRow) => ReactNode
  /** Coluna numérica/monetária: alinha à direita e usa fonte mono (Dado/Utilitário). */
  numeric?: boolean
  headerClassName?: string
  cellClassName?: string
}

export interface DataTableRowAction<TRow> {
  label: string
  icon: ComponentType<{ className?: string }>
  onClick: (row: TRow) => void
  /** `destructive` usa a cor `Saídas` (ex.: excluir). */
  variant?: 'default' | 'destructive'
  /** Oculta a ação para linhas específicas. */
  hidden?: (row: TRow) => boolean
}

export interface DataTableEmptyState {
  icon?: ComponentType<{ className?: string }>
  /** Ex.: "Nenhuma transação encontrada". */
  title: string
  actionLabel?: string
  onAction?: () => void
}

export interface DataTableProps<TRow> {
  columns: DataTableColumn<TRow>[]
  data: TRow[]
  getRowId: (row: TRow) => string
  /** Linhas em skeleton enquanto a busca/filtro está sendo aplicada. */
  isLoading?: boolean
  /** Mensagem de erro (pt-BR) — presença ativa o estado de erro com "Tentar novamente". */
  error?: string | null
  onRetry?: () => void
  rowActions?: DataTableRowAction<TRow>[]
  emptyState: DataTableEmptyState
  skeletonRowCount?: number
  /** Omitido quando a listagem não pagina (embute component_pagination). */
  pagination?: PaginationProps
  className?: string
}

/**
 * Tabela genérica e tipada por colunas — espinha dorsal das telas de CRUD
 * (Transações, Membros, Categorias, histórico de Relatórios).
 * Ver wiki/components/component_data_table.md.
 */
export function DataTable<TRow>({
  columns,
  data,
  getRowId,
  isLoading = false,
  error = null,
  onRetry,
  rowActions,
  emptyState,
  skeletonRowCount = 5,
  pagination,
  className,
}: DataTableProps<TRow>) {
  const hasActions = Boolean(rowActions?.length)
  const columnCount = columns.length + (hasActions ? 1 : 0)

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div className="overflow-hidden rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {columns.map((column) => (
                <TableHead
                  key={column.id}
                  className={cn(column.numeric && 'text-right', column.headerClassName)}
                >
                  {column.header}
                </TableHead>
              ))}
              {hasActions && (
                <TableHead className="w-0 text-right">
                  <span className="sr-only">Ações</span>
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {error ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columnCount} className="h-40 text-center">
                  <div className="flex flex-col items-center justify-center gap-3 py-6">
                    <AlertCircle className="size-6 text-destructive" />
                    <p className="text-sm text-muted-foreground">{error}</p>
                    {onRetry && (
                      <Button type="button" variant="outline" size="sm" onClick={onRetry}>
                        Tentar novamente
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : isLoading ? (
              Array.from({ length: skeletonRowCount }).map((_, rowIndex) => (
                <TableRow key={`skeleton-${rowIndex}`} className="hover:bg-transparent">
                  {columns.map((column) => (
                    <TableCell key={column.id} className={cn(column.numeric && 'text-right')}>
                      <Skeleton
                        className={cn('h-4 w-full max-w-32', column.numeric && 'ml-auto')}
                      />
                    </TableCell>
                  ))}
                  {hasActions && (
                    <TableCell>
                      <Skeleton className="ml-auto h-4 w-12" />
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columnCount} className="h-40 text-center">
                  <div className="flex flex-col items-center justify-center gap-3 py-6">
                    {emptyState.icon ? (
                      <emptyState.icon className="size-6 text-muted-foreground" />
                    ) : (
                      <Inbox className="size-6 text-muted-foreground" />
                    )}
                    <p className="text-sm text-muted-foreground">{emptyState.title}</p>
                    {emptyState.actionLabel && emptyState.onAction && (
                      <Button type="button" size="sm" onClick={emptyState.onAction}>
                        {emptyState.actionLabel}
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => {
                const rowId = getRowId(row)
                return (
                  <TableRow key={rowId} className="group">
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        className={cn(
                          column.numeric && 'text-right font-mono',
                          column.cellClassName,
                        )}
                      >
                        {column.cell(row)}
                      </TableCell>
                    ))}
                    {hasActions && (
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                          {rowActions
                            ?.filter((action) => !action.hidden?.(row))
                            .map((action) => (
                              <Button
                                key={action.label}
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                aria-label={action.label}
                                title={action.label}
                                onClick={() => action.onClick(row)}
                                className={cn(
                                  action.variant === 'destructive' &&
                                    'text-destructive hover:bg-destructive/10 hover:text-destructive',
                                )}
                              >
                                <action.icon className="size-4" />
                              </Button>
                            ))}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
      {pagination && <Pagination {...pagination} />}
    </div>
  )
}
