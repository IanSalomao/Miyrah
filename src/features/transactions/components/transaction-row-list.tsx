// Lista de transações em card-row — substitui a DataTable genérica, mantendo
// o mesmo contrato de loading/erro/vazio/paginação. Ver
// specs/transactions-screen-redesign.md e wiki/pages/page_transactions.md.

import { AlertCircleIcon, InboxIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Pagination, type PaginationProps } from '@/components/pagination/pagination'
import type { Transaction } from '@/types'
import { TransactionRow, TransactionRowHeader } from './transaction-row'
import { TransactionRowSkeleton } from './transaction-row-skeleton'

export interface TransactionRowListEmptyState {
  title: string
  actionLabel?: string
  onAction?: () => void
}

export interface TransactionRowListProps {
  transactions: Transaction[]
  /** Card-rows em skeleton enquanto a busca/filtro está sendo aplicada. */
  isLoading?: boolean
  /** Mensagem de erro (pt-BR) — presença ativa o estado de erro com "Tentar novamente". */
  error?: string | null
  onRetry?: () => void
  onEdit: (transaction: Transaction) => void
  onDelete: (transaction: Transaction) => void
  emptyState: TransactionRowListEmptyState
  /** Omitido quando a listagem não pagina. */
  pagination?: PaginationProps
  skeletonRowCount?: number
}

export function TransactionRowList({
  transactions,
  isLoading = false,
  error = null,
  onRetry,
  onEdit,
  onDelete,
  emptyState,
  pagination,
  skeletonRowCount = 6,
}: TransactionRowListProps) {
  return (
    <div className="flex flex-col gap-4">
      {!error && <TransactionRowHeader />}

      {error ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-border bg-card px-5 py-14 text-center shadow-sm">
          <AlertCircleIcon className="size-6 text-destructive" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">{error}</p>
          {onRetry && (
            <Button type="button" variant="outline" size="sm" onClick={onRetry}>
              Tentar novamente
            </Button>
          )}
        </div>
      ) : isLoading ? (
        <div className="flex flex-col gap-2.5">
          {Array.from({ length: skeletonRowCount }).map((_, index) => (
            <TransactionRowSkeleton key={`transaction-row-skeleton-${index}`} />
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-border bg-card px-5 py-14 text-center shadow-sm">
          <InboxIcon className="size-6 text-muted-foreground" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">{emptyState.title}</p>
          {emptyState.actionLabel && emptyState.onAction && (
            <Button type="button" size="sm" onClick={emptyState.onAction}>
              {emptyState.actionLabel}
            </Button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {transactions.map((transaction) => (
            <TransactionRow
              key={transaction.id}
              transaction={transaction}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      {pagination && <Pagination {...pagination} />}
    </div>
  )
}
