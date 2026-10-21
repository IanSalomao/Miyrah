// Aba "Plano" — situação atual, cancelamento e contratação/renovação. specs/subscription.md.
import { useState } from 'react'
import { Info } from 'lucide-react'
import { ApiError } from '@/lib/api-client'
import { redirectToExternal } from '@/lib/navigation'
import type { BillingMethod, Subscription, SubscriptionPlan } from '@/types'
import { useCreateCheckout } from '../hooks/use-subscription-mutations'
import { getPlanCta, isCurrentPlan } from '../plans'
import { CancelSubscriptionModal } from './cancel-subscription-modal'
import { PlanCard } from './plan-card'
import { StatusCard } from './status-card'

const PLANS: SubscriptionPlan[] = ['monthly', 'annual']

interface PlanTabProps {
  subscription: Subscription
}

export function PlanTab({ subscription }: PlanTabProps) {
  const createCheckout = useCreateCheckout()
  const [cancelOpen, setCancelOpen] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  // O checkout segue "em andamento" até o navegador sair para a AbacatePay.
  const [pendingPlan, setPendingPlan] = useState<SubscriptionPlan | null>(null)

  const isActive = subscription.status === 'active'

  function handleCheckout(plan: SubscriptionPlan, method?: BillingMethod) {
    setCheckoutError(null)
    setPendingPlan(plan)
    createCheckout.mutate(
      { plan, method },
      {
        onSuccess: (checkout) => redirectToExternal(checkout.checkoutUrl),
        onError: (error) => {
          setPendingPlan(null)
          setCheckoutError(
            error instanceof ApiError
              ? error.message
              : 'Não foi possível abrir o pagamento. Tente novamente.',
          )
        },
      },
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <StatusCard subscription={subscription} onCancel={() => setCancelOpen(true)} />

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">{isActive ? 'Seu plano' : 'Escolha seu plano'}</h2>
          <p className="text-sm text-muted-foreground">
            Um plano só, com tudo incluso: transações, membros, ministérios, categorias e relatórios
            sem limite.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {PLANS.map((plan) => (
            <PlanCard
              key={plan}
              plan={plan}
              cta={getPlanCta(plan, subscription)}
              isCurrent={isCurrentPlan(plan, subscription)}
              loading={pendingPlan === plan}
              disabled={pendingPlan !== null}
              onCheckout={(method) => handleCheckout(plan, method)}
            />
          ))}
        </div>

        {checkoutError && (
          <p role="alert" className="text-sm text-destructive">
            {checkoutError}
          </p>
        )}

        {isActive && (
          <p className="flex items-start gap-2 text-sm text-muted-foreground">
            <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
            Para mudar de plano, cancele a assinatura atual. Seu acesso segue até o fim do período,
            e o novo plano começa a contar a partir dele.
          </p>
        )}
      </div>

      <CancelSubscriptionModal
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        subscription={subscription}
      />
    </div>
  )
}
