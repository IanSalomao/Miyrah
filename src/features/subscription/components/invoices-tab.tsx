// Aba "Faturas" — histórico de cobranças da assinatura. specs/subscription.md.
// Sem download: a API não expõe recibo nem NFS-e. Valor em neutro (Decisão 3).
import { useState } from 'react'
import { CreditCard, QrCode, Receipt } from 'lucide-react'
import { DataTable, type DataTableColumn } from '@/components/data-table/data-table'
import { formatCents, formatDate } from '@/lib/format'
import type { Payment } from '@/types'
import { PAYMENTS_PAGE_SIZE, usePayments } from '../hooks/use-payments'
import { METHOD_SHORT_LABELS, PLAN_LABELS } from '../plans'
import { PaymentStatusBadge } from './payment-status-badge'

interface InvoicesTabProps {
  refetchInterval?: () => number | false
}

function periodLabel(payment: Payment): string | null {
  if (!payment.periodStart || !payment.periodEnd) return null
  return `${formatDate(payment.periodStart)} – ${formatDate(payment.periodEnd)}`
}

const columns: DataTableColumn<Payment>[] = [
  {
    id: 'date',
    header: 'Data',
    cellClassName: 'font-mono tabular-nums',
    cell: (payment) => formatDate(payment.paidAt ?? payment.createdAt),
  },
  {
    id: 'description',
    header: 'Descrição',
    cell: (payment) => {
      const period = periodLabel(payment)
      return (
        <div className="flex flex-col gap-0.5">
          <span className="text-foreground">{PLAN_LABELS[payment.plan]}</span>
          {period && <span className="text-xs text-muted-foreground">{period}</span>}
        </div>
      )
    },
  },
  {
    id: 'method',
    header: 'Forma',
    cell: (payment) => {
      const Icon = payment.method === 'card' ? CreditCard : QrCode
      return (
        <span className="inline-flex items-center gap-2">
          <Icon className="size-4 text-muted-foreground" aria-hidden />
          {METHOD_SHORT_LABELS[payment.method]}
        </span>
      )
    },
  },
  {
    id: 'status',
    header: 'Status',
    cell: (payment) => <PaymentStatusBadge status={payment.status} />,
  },
  {
    id: 'amount',
    header: 'Valor',
    numeric: true,
    cellClassName: 'tabular-nums text-foreground',
    cell: (payment) => formatCents(payment.amountCents),
  },
]

export function InvoicesTab({ refetchInterval }: InvoicesTabProps) {
  const [page, setPage] = useState(1)
  const paymentsQuery = usePayments(page, { refetchInterval })
  const meta = paymentsQuery.data?.meta

  return (
    <DataTable
      columns={columns}
      data={paymentsQuery.data?.items ?? []}
      getRowId={(payment) => payment.id}
      isLoading={paymentsQuery.isPending}
      error={paymentsQuery.isError ? 'Não foi possível carregar as faturas.' : null}
      onRetry={() => paymentsQuery.refetch()}
      emptyState={{ icon: Receipt, title: 'Nenhuma fatura encontrada' }}
      skeletonRowCount={3}
      pagination={
        meta && meta.totalPages > 1
          ? {
              page: meta.page,
              limit: PAYMENTS_PAGE_SIZE,
              total: meta.total,
              totalPages: meta.totalPages,
              onPageChange: setPage,
            }
          : undefined
      }
    />
  )
}
