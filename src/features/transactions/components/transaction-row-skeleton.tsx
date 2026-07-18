// Skeleton do card-row de transação — usado enquanto a listagem/filtro está
// carregando (substitui as linhas de skeleton da DataTable genérica).
// Ver specs/transactions-screen-redesign.md.

import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { TRANSACTION_ROW_GRID_COLS } from './transaction-row'

export function TransactionRowSkeleton() {
  return (
    <div
      className={cn(
        'grid items-center gap-5 rounded-lg border border-border bg-card px-5 py-3.5 shadow-sm',
        TRANSACTION_ROW_GRID_COLS,
      )}
    >
      <Skeleton className="size-11 shrink-0 rounded-lg" />
      <div className="flex min-w-0 flex-col gap-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-40" />
      </div>
      <Skeleton className="h-4 w-28" />
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-3.5 w-20" />
        <Skeleton className="h-3 w-14" />
      </div>
      <Skeleton className="ml-auto h-4 w-20" />
      <span aria-hidden="true" />
    </div>
  )
}
