// Início — wiki/pages/page_home.md ("Bloco 'Últimas transações'")
// Lista das 5 transações mais recentes; cada linha é clicável e abre o
// modal de edição; "Ver todas" leva a /transactions. Sem botão de adicionar
// (a Início nunca lança transação — isso é feito só em Transações).

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, Inbox } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ApiError } from '@/lib/api-client'
import { formatDate, formatSignedCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Transaction } from '@/types'
import { useRecentTransactions } from '../hooks/use-recent-transactions'
import { TransactionEditModal } from './transaction-edit-modal'

export function RecentTransactions() {
  const { data, isLoading, isError, error, refetch } = useRecentTransactions()
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)

  const items = data?.items ?? []
  const errorMessage = isError
    ? error instanceof ApiError
      ? error.message
      : 'Não foi possível carregar as transações.'
    : null

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">Últimas transações</h2>
        <Link
          to="/transactions"
          className="text-sm text-primary underline-offset-4 hover:underline"
        >
          Ver todas
        </Link>
      </div>

      {errorMessage ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-border py-10 text-center text-sm text-muted-foreground">
          <AlertCircle className="size-6 text-expense" />
          <span>{errorMessage}</span>
          <Button type="button" variant="outline" size="sm" onClick={() => void refetch()}>
            Tentar novamente
          </Button>
        </div>
      ) : isLoading ? (
        <div className="flex flex-col gap-2 rounded-md border border-border p-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-full" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-border py-10 text-center text-sm text-muted-foreground">
          <Inbox className="size-6" />
          <span>Nenhuma transação encontrada</span>
        </div>
      ) : (
        <ul className="divide-y divide-border rounded-md border border-border">
          {items.map((transaction) => (
            <li key={transaction.id}>
              <button
                type="button"
                onClick={() => setEditingTransaction(transaction)}
                className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"
              >
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="truncate text-sm font-medium">
                    {transaction.description || transaction.category.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(transaction.date)}
                  </span>
                </div>
                <span
                  className={cn(
                    'shrink-0 font-mono text-sm font-medium tabular-nums',
                    transaction.value < 0 ? 'text-expense' : 'text-income',
                  )}
                >
                  {formatSignedCurrency(transaction.value)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {editingTransaction && (
        <TransactionEditModal
          transaction={editingTransaction}
          open={!!editingTransaction}
          onOpenChange={(open) => {
            if (!open) setEditingTransaction(null)
          }}
          onNotFound={() => void refetch()}
        />
      )}
    </section>
  )
}
