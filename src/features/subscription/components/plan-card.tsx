// Card de um ciclo do plano único (Mensal/Anual) — aba Plano. specs/subscription.md.
// Preço em neutro, sem sinal (Decisão 3): não é lançamento do caixa da igreja.
import { useState } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCents } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { BillingMethod, SubscriptionPlan } from '@/types'
import {
  DEFAULT_ANNUAL_METHOD,
  METHOD_SHORT_LABELS,
  PLAN_PRICES_CENTS,
  type PlanCta,
} from '../plans'

interface PlanContent {
  title: string
  periodSuffix: string
  description: string
  ctaLabel: Record<Exclude<PlanCta, 'none'>, string>
}

const PLAN_CONTENT: Record<SubscriptionPlan, PlanContent> = {
  monthly: {
    title: 'Mensal',
    periodSuffix: '/mês',
    description: 'Cobrança recorrente no cartão de crédito. Cancele quando quiser, sem multa.',
    ctaLabel: { subscribe: 'Assinar plano mensal', renew: 'Assinar plano mensal' },
  },
  annual: {
    title: 'Anual',
    periodSuffix: '/ano',
    description: 'Equivale a 10 meses — 2 meses grátis. Pagamento único no cartão ou PIX.',
    ctaLabel: { subscribe: 'Assinar plano anual', renew: 'Renovar plano anual' },
  },
}

const ANNUAL_METHODS: BillingMethod[] = ['pix', 'card']

interface PlanCardProps {
  plan: SubscriptionPlan
  cta: PlanCta
  isCurrent: boolean
  /** Este card está criando o checkout. */
  loading: boolean
  /** Algum checkout em andamento — bloqueia os dois cards. */
  disabled: boolean
  onCheckout: (method?: BillingMethod) => void
}

export function PlanCard({ plan, cta, isCurrent, loading, disabled, onCheckout }: PlanCardProps) {
  const content = PLAN_CONTENT[plan]
  const [method, setMethod] = useState<BillingMethod>(DEFAULT_ANNUAL_METHOD)
  // Só o anual deixa escolher a forma; o mensal é sempre cartão.
  const showMethodSelector = plan === 'annual' && cta !== 'none'

  return (
    <section
      aria-label={`Plano ${content.title}`}
      className={cn(
        'flex flex-col gap-5 rounded-lg border bg-card p-6 shadow-sm',
        isCurrent ? 'border-primary' : 'border-border',
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold">{content.title}</h3>
        {isCurrent && (
          <Badge className="border-transparent bg-accent text-accent-foreground">
            <Check aria-hidden />
            Plano atual
          </Badge>
        )}
      </div>

      <p className="flex items-baseline gap-1">
        <span className="font-mono text-3xl font-semibold tabular-nums text-foreground">
          {formatCents(PLAN_PRICES_CENTS[plan])}
        </span>
        <span className="text-sm text-muted-foreground">{content.periodSuffix}</span>
      </p>

      <p className="text-sm text-muted-foreground">{content.description}</p>

      {showMethodSelector && (
        <div className="flex flex-col gap-1.5">
          <span id={`plan-${plan}-method`} className="text-sm font-medium">
            Forma de pagamento
          </span>
          <div
            role="group"
            aria-labelledby={`plan-${plan}-method`}
            className="flex w-fit items-center gap-0.5 rounded-md border border-border p-0.5"
          >
            {ANNUAL_METHODS.map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={method === option}
                disabled={disabled}
                onClick={() => setMethod(option)}
                className={cn(
                  'rounded-sm px-3 py-1 text-sm transition-colors disabled:opacity-50',
                  method === option
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted',
                )}
              >
                {METHOD_SHORT_LABELS[option]}
              </button>
            ))}
          </div>
        </div>
      )}

      {cta !== 'none' && (
        <Button
          type="button"
          className="mt-auto"
          disabled={disabled}
          onClick={() => onCheckout(plan === 'annual' ? method : undefined)}
        >
          {loading && <Loader2 className="animate-spin" aria-hidden />}
          {loading ? 'Abrindo pagamento…' : content.ctaLabel[cta]}
        </Button>
      )}
    </section>
  )
}
