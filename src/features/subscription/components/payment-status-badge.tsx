// Badge de status de uma fatura (Payment.status). specs/subscription.md — Aba Faturas.
import { Badge } from '@/components/ui/badge'
import type { PaymentStatus } from '@/types'
import { PAYMENT_STATUS_LABELS } from '../plans'

const STATUS_CLASSES: Record<PaymentStatus, string> = {
  paid: 'border-transparent bg-accent text-accent-foreground',
  pending: 'border-border bg-transparent text-foreground',
  failed: 'border-transparent bg-destructive/10 text-destructive',
  refunded: 'border-border bg-transparent text-muted-foreground',
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <Badge variant="outline" className={STATUS_CLASSES[status]}>
      {PAYMENT_STATUS_LABELS[status]}
    </Badge>
  )
}
