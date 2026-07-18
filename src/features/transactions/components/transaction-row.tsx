// Card-row de transação — substitui a linha de tabela genérica por um bloco
// mais denso visualmente (ícone entrada/saída, categoria+descrição,
// membro/ministério, data+hora, valor e ações). Ver
// specs/transactions-screen-redesign.md e wiki/pages/page_transactions.md.

import { useState } from 'react'
import {
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  ClockIcon,
  MoreHorizontalIcon,
  PencilIcon,
  TagIcon,
  Trash2Icon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { formatDate, formatSignedCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Transaction } from '@/types'
import { TransactionLinkedCell } from './transaction-linked-cell'

/**
 * Template de colunas compartilhado entre cabeçalho e linhas, para as colunas
 * ficarem visualmente alinhadas: ícone · categoria/descrição · membro/ministério
 * · data e hora · valor · ações (kebab, sem rótulo).
 */
export const TRANSACTION_ROW_GRID_COLS =
  'grid-cols-[44px_minmax(0,2.4fr)_1.35fr_0.95fr_auto_40px]'

const timeFormatter = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' })

/**
 * Extrai só `HH:mm` de um timestamp ISO. O tipo `Transaction` não tem hora
 * própria de lançamento (só `date`, sem hora) — usamos `createdAt` como proxy
 * do horário em que a transação foi lançada (decisão registrada em
 * specs/transactions-screen-redesign.md; não inventa campo novo na API).
 */
function formatTime(isoTimestamp: string): string {
  return timeFormatter.format(new Date(isoTimestamp))
}

export function TransactionRowHeader() {
  const headerCell = 'text-xs font-semibold tracking-wide text-muted-foreground uppercase'
  return (
    <div className={cn('grid items-center gap-5 px-5', TRANSACTION_ROW_GRID_COLS)}>
      <span aria-hidden="true" />
      <span className={headerCell}>Categoria &amp; descrição</span>
      <span className={headerCell}>Membro / ministério</span>
      <span className={headerCell}>Data e hora</span>
      <span className={cn(headerCell, 'text-right')}>Valor</span>
      <span aria-hidden="true" />
    </div>
  )
}

export interface TransactionRowProps {
  transaction: Transaction
  onEdit: (transaction: Transaction) => void
  onDelete: (transaction: Transaction) => void
}

export function TransactionRow({ transaction, onEdit, onDelete }: TransactionRowProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const income = transaction.value >= 0
  const ArrowIcon = income ? ArrowDownLeftIcon : ArrowUpRightIcon
  const category = transaction.category

  return (
    <div
      className={cn(
        'group grid items-center gap-5 rounded-lg border border-border bg-card px-5 py-3.5 shadow-sm transition-shadow hover:shadow-md',
        TRANSACTION_ROW_GRID_COLS,
      )}
    >
      {/* 1 · entrada/saída */}
      <div
        className={cn(
          'grid size-11 shrink-0 place-items-center rounded-lg',
          income ? 'bg-income/10 text-income' : 'bg-expense/10 text-expense',
        )}
        aria-hidden="true"
      >
        <ArrowIcon className="size-5" strokeWidth={2.25} />
      </div>

      {/* 2 · categoria (tag colorida + nome) / descrição */}
      <div className="min-w-0">
        <div className="mb-0.5 flex items-center gap-1.5">
          <TagIcon
            className="size-3.5 shrink-0"
            style={{ color: category.color }}
            aria-hidden="true"
          />
          <span
            className={cn(
              'truncate text-sm font-semibold text-foreground',
              category.deleted && 'text-muted-foreground italic',
            )}
          >
            {category.name}
            {category.deleted && ' (excluído)'}
          </span>
        </div>
        {transaction.description && (
          <p className="truncate text-xs text-muted-foreground">{transaction.description}</p>
        )}
      </div>

      {/* 3 · membro / ministério */}
      <div className="min-w-0 text-sm">
        <TransactionLinkedCell
          member={transaction.member}
          ministry={transaction.ministry}
          avatarSize="sm"
        />
      </div>

      {/* 4 · data e hora */}
      <div className="text-sm text-foreground">
        <div className="font-mono tabular-nums">{formatDate(transaction.date)}</div>
        <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
          <ClockIcon className="size-3.5" aria-hidden="true" />
          <span className="font-mono tabular-nums">{formatTime(transaction.createdAt)}</span>
        </div>
      </div>

      {/* 5 · valor (mono, alinhado à direita, cor semântica, sinal explícito) */}
      <div
        className={cn(
          'text-right font-mono text-base font-semibold whitespace-nowrap tabular-nums',
          income ? 'text-income' : 'text-expense',
        )}
      >
        {formatSignedCurrency(transaction.value)}
      </div>

      {/* 6 · ações — kebab visível só no hover/foco/aberto (decisão do spec) */}
      <div className="flex justify-end">
        <Popover open={menuOpen} onOpenChange={setMenuOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={`Mais ações para a transação de ${category.name}`}
              className="opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 data-[state=open]:opacity-100"
            >
              <MoreHorizontalIcon className="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-40 gap-1 p-1">
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-muted"
              onClick={() => {
                setMenuOpen(false)
                onEdit(transaction)
              }}
            >
              <PencilIcon className="size-4" />
              Editar
            </button>
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-destructive transition-colors hover:bg-destructive/10"
              onClick={() => {
                setMenuOpen(false)
                onDelete(transaction)
              }}
            >
              <Trash2Icon className="size-4" />
              Excluir
            </button>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
