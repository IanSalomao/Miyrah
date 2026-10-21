// Assinatura — Plano, Forma de pagamento e Faturas. specs/subscription.md.
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AlertTriangle, Info, X } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/tabs/tabs'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ApiError } from '@/lib/api-client'
import { InvoicesTab } from './components/invoices-tab'
import { PaymentMethodTab } from './components/payment-method-tab'
import { PlanTab } from './components/plan-tab'
import { useSubscription } from './hooks/use-subscription'

type SubscriptionTab = 'plan' | 'payment' | 'invoices'

/** Valor de `?checkout=` na volta do checkout hospedado (BILLING_COMPLETION_URL do back). */
const CHECKOUT_COMPLETED_PARAM = 'completed'

// A confirmação chega por webhook: na volta do checkout, reconsulta por um tempo.
const CHECKOUT_POLL_INTERVAL_MS = 5_000
const CHECKOUT_POLL_DURATION_MS = 60_000

export function SubscriptionPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [tab, setTab] = useState<SubscriptionTab>('plan')
  const returnedFromCheckout = searchParams.get('checkout') === CHECKOUT_COMPLETED_PARAM
  const [pollUntil] = useState(() =>
    returnedFromCheckout ? Date.now() + CHECKOUT_POLL_DURATION_MS : 0,
  )
  const refetchInterval = () => (Date.now() < pollUntil ? CHECKOUT_POLL_INTERVAL_MS : false)

  const subscriptionQuery = useSubscription({ refetchInterval })

  function dismissCheckoutNotice() {
    setSearchParams({}, { replace: true })
  }

  return (
    <div className="flex max-w-4xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Assinatura</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie o plano, a forma de pagamento e as faturas da igreja.
        </p>
      </div>

      {returnedFromCheckout && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-lg border border-primary/30 bg-accent px-4 py-3 text-sm"
        >
          <Info className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
          <p className="flex-1 text-foreground">
            <strong className="font-medium">Pagamento em processamento.</strong> Assim que a
            AbacatePay confirmar, sua assinatura é atualizada aqui automaticamente — no PIX costuma
            levar alguns segundos.
          </p>
          <button
            type="button"
            onClick={dismissCheckoutNotice}
            aria-label="Fechar aviso"
            className="rounded-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      {subscriptionQuery.isPending ? (
        <div className="flex flex-col gap-4" aria-label="Carregando assinatura">
          <Skeleton className="h-9 w-72" />
          <Skeleton className="h-32 w-full" />
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      ) : subscriptionQuery.isError ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-border bg-card p-8 text-center text-muted-foreground shadow-sm">
          <AlertTriangle className="size-8 text-destructive" aria-hidden />
          <p className="text-sm">
            {subscriptionQuery.error instanceof ApiError
              ? subscriptionQuery.error.message
              : 'Não foi possível carregar a assinatura.'}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => subscriptionQuery.refetch()}
          >
            Tentar novamente
          </Button>
        </div>
      ) : (
        <Tabs value={tab} onValueChange={(value) => setTab(value as SubscriptionTab)}>
          <TabsList>
            <TabsTrigger value="plan">Plano</TabsTrigger>
            <TabsTrigger value="payment">Pagamento</TabsTrigger>
            <TabsTrigger value="invoices">Faturas</TabsTrigger>
          </TabsList>
          <TabsContent value="plan">
            <PlanTab subscription={subscriptionQuery.data} />
          </TabsContent>
          <TabsContent value="payment">
            <PaymentMethodTab
              subscription={subscriptionQuery.data}
              onGoToPlans={() => setTab('plan')}
            />
          </TabsContent>
          <TabsContent value="invoices">
            <InvoicesTab refetchInterval={refetchInterval} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
