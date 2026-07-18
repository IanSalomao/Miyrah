// page_transactions (Transações) — wiki/pages/page_transactions.md
// Único lugar do sistema onde uma transação é lançada.

import { useState } from 'react'
import { MetricCard } from '@/components/metric-card/metric-card'
import { ConfirmModal } from '@/components/modal-form/confirm-modal'
import { formatDate } from '@/lib/format'
import type { Transaction } from '@/types'
import { TransactionsFilterBar } from './components/transactions-filter-bar'
import { TransactionRowList } from './components/transaction-row-list'
import { TransactionFormModal } from './components/transaction-form-modal'
import { useCategoriesOptions } from './hooks/use-categories-options'
import { useTransactionsQuery, type TransactionsFilters } from './hooks/use-transactions-query'
import { useTransactionsMetricsQuery } from './hooks/use-transactions-metrics-query'
import { useRemoveTransaction } from './hooks/use-transaction-mutations'

const DEFAULT_FILTERS: TransactionsFilters = {
  search: '',
  dateFrom: '',
  dateTo: '',
  categoryId: '',
  type: 'all',
  page: 1,
  limit: 20,
}

export function TransactionsPage() {
  const [filters, setFilters] = useState<TransactionsFilters>(DEFAULT_FILTERS)
  const [formModal, setFormModal] = useState<{ open: boolean; transaction: Transaction | null }>({
    open: false,
    transaction: null,
  })
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null)

  const transactionsQuery = useTransactionsQuery(filters)
  const metricsQuery = useTransactionsMetricsQuery(filters)
  const allCategoriesQuery = useCategoriesOptions()
  const removeMutation = useRemoveTransaction()

  function patchFilters(patch: Partial<TransactionsFilters>) {
    setFilters((prev) => ({ ...prev, ...patch }))
  }

  function openCreateModal() {
    setFormModal({ open: true, transaction: null })
  }

  function openEditModal(transaction: Transaction) {
    setFormModal({ open: true, transaction })
  }

  async function handleConfirmDelete() {
    if (!deletingTransaction) return
    await removeMutation.mutateAsync(deletingTransaction.id)
    setDeletingTransaction(null)
  }

  const metrics = metricsQuery.data ?? { income: 0, expense: 0, balance: 0 }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Transações</h1>
        <p className="text-sm text-muted-foreground">Lançamentos de entradas e saídas da igreja.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          label="Entradas"
          value={metrics.income}
          variant="income"
          loading={metricsQuery.isLoading}
        />
        <MetricCard
          label="Saídas"
          value={metrics.expense}
          variant="expense"
          loading={metricsQuery.isLoading}
        />
        <MetricCard
          label="Balanço"
          value={metrics.balance}
          variant="balance"
          loading={metricsQuery.isLoading}
        />
      </div>

      <TransactionsFilterBar
        filters={filters}
        onFiltersChange={patchFilters}
        categories={allCategoriesQuery.data?.items ?? []}
        onAddTransaction={openCreateModal}
      />

      <TransactionRowList
        transactions={transactionsQuery.data?.items ?? []}
        isLoading={transactionsQuery.isLoading}
        error={transactionsQuery.isError ? 'Não foi possível carregar as transações.' : null}
        onRetry={() => transactionsQuery.refetch()}
        onEdit={openEditModal}
        onDelete={(transaction) => setDeletingTransaction(transaction)}
        emptyState={{
          title: 'Nenhuma transação encontrada',
          actionLabel: 'Adicionar transação',
          onAction: openCreateModal,
        }}
        pagination={
          transactionsQuery.data
            ? {
                page: transactionsQuery.data.meta.page,
                limit: transactionsQuery.data.meta.limit,
                total: transactionsQuery.data.meta.total,
                totalPages: transactionsQuery.data.meta.totalPages,
                onPageChange: (page) => patchFilters({ page }),
                onLimitChange: (limit) => patchFilters({ limit, page: 1 }),
              }
            : undefined
        }
      />

      <TransactionFormModal
        open={formModal.open}
        onOpenChange={(open) => setFormModal((prev) => ({ ...prev, open }))}
        transaction={formModal.transaction}
      />

      <ConfirmModal
        open={Boolean(deletingTransaction)}
        onOpenChange={(open) => {
          if (!open) setDeletingTransaction(null)
        }}
        title="Excluir transação"
        description={
          deletingTransaction
            ? `Tem certeza de que deseja excluir a transação "${deletingTransaction.description || formatDate(deletingTransaction.date)}"? Esta ação não pode ser desfeita.`
            : ''
        }
        onConfirm={handleConfirmDelete}
        loading={removeMutation.isPending}
      />
    </div>
  )
}
