// Aba "Pagamento" — forma de pagamento em uso e formas aceitas. specs/subscription.md.
// A API não guarda cartões: a forma é escolhida a cada checkout na AbacatePay, então
// "em uso" é a do último pagamento confirmado (Decisão 4).
import { CreditCard, Info, QrCode, ShieldCheck, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate } from '@/lib/format'
import type { Payment, Subscription } from '@/types'
import { usePayments } from '../hooks/use-payments'
import { hasActiveRecurrence, METHOD_LABELS } from '../plans'

interface PaymentMethodTabProps {
  subscription: Subscription
  /** Leva o usuário para a aba Plano (onde a forma é escolhida no checkout). */
  onGoToPlans: () => void
}

function methodContext(payment: Payment): string {
  return payment.plan === 'monthly' ? 'Cobrança recorrente mensal' : 'Pagamento anual à vista'
}

export function PaymentMethodTab({ subscription, onGoToPlans }: PaymentMethodTabProps) {
  // Mesma 1ª página da aba Faturas (cache compartilhado), ordenada do mais recente.
  const paymentsQuery = usePayments(1)
  const lastPaid = paymentsQuery.data?.items.find((payment) => payment.status === 'paid')
  const recurring = hasActiveRecurrence(subscription)

  return (
    <div className="flex flex-col gap-6">
      <section
        aria-labelledby="payment-method-title"
        className="rounded-lg border border-border bg-card shadow-sm"
      >
        <div className="flex flex-col gap-1 p-6 pb-0">
          <h2 id="payment-method-title" className="text-lg font-semibold">
            Forma de pagamento
          </h2>
          <p className="text-sm text-muted-foreground">
            A forma usada na cobrança mais recente da assinatura.
          </p>
        </div>

        <div className="p-6">
          {paymentsQuery.isPending ? (
            <Skeleton className="h-14 w-full max-w-sm" />
          ) : paymentsQuery.isError ? (
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              Não foi possível carregar a forma de pagamento.
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => paymentsQuery.refetch()}
              >
                Tentar novamente
              </Button>
            </div>
          ) : lastPaid ? (
            <div className="flex items-center gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-accent text-primary">
                {lastPaid.method === 'card' ? (
                  <CreditCard className="size-5" aria-hidden />
                ) : (
                  <QrCode className="size-5" aria-hidden />
                )}
              </span>
              <div className="flex flex-col gap-0.5">
                <span className="font-medium">{METHOD_LABELS[lastPaid.method]}</span>
                <span className="text-sm text-muted-foreground">
                  {methodContext(lastPaid)}
                  {lastPaid.paidAt && ` · último pagamento em ${formatDate(lastPaid.paidAt)}`}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 py-6 text-center">
              <Wallet className="size-6 text-muted-foreground" aria-hidden />
              <p className="text-sm text-muted-foreground">Nenhuma forma de pagamento cadastrada</p>
              <Button type="button" size="sm" onClick={onGoToPlans}>
                Escolher plano
              </Button>
            </div>
          )}
        </div>

        {lastPaid && (
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border px-6 py-4">
            {recurring ? (
              <p className="flex max-w-xl items-start gap-2 text-sm text-muted-foreground">
                <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
                Para usar outro cartão, cancele a assinatura atual e assine de novo com o cartão
                novo. Seu acesso não é interrompido: o novo período começa a contar a partir do fim
                do atual.
              </p>
            ) : (
              <p className="max-w-xl text-sm text-muted-foreground">
                A forma é escolhida a cada contratação: cartão no Mensal; Cartão ou PIX no Anual.
              </p>
            )}
            <Button type="button" variant="outline" onClick={onGoToPlans}>
              {recurring ? 'Ir para Plano' : 'Trocar forma de pagamento'}
            </Button>
          </div>
        )}
      </section>

      <section
        aria-labelledby="accepted-methods-title"
        className="rounded-lg border border-border bg-card shadow-sm"
      >
        <div className="flex flex-col gap-1 p-6 pb-4">
          <h2 id="accepted-methods-title" className="text-lg font-semibold">
            Formas aceitas
          </h2>
        </div>
        <dl className="divide-y divide-border border-t border-border text-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 px-6 py-3">
            <dt className="font-medium">Plano Mensal</dt>
            <dd className="text-muted-foreground">Cartão de crédito · cobrança recorrente</dd>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 px-6 py-3">
            <dt className="font-medium">Plano Anual</dt>
            <dd className="text-muted-foreground">Cartão de crédito ou PIX · pagamento único</dd>
          </div>
        </dl>
        <p className="flex items-start gap-2 border-t border-border px-6 py-4 text-sm text-muted-foreground">
          <ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden />
          Os dados de pagamento ficam com a AbacatePay, nossa parceira de pagamentos. O Miyrah não
          armazena número de cartão.
        </p>
      </section>
    </div>
  )
}
