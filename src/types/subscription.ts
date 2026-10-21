// Assinatura SaaS da igreja — módulo `subscriptions` da API (gateway AbacatePay).
// Sem spec na wiki ainda: contrato espelhado dos DTOs do back (ver specs/subscription.md).

/** Ciclo do plano único: mensal (recorrente, só cartão) ou anual (pagamento único). */
export type SubscriptionPlan = 'monthly' | 'annual'

/** trialing = teste grátis · past_due = inadimplente · canceled = sem renovação. */
export type SubscriptionStatus = 'trialing' | 'active' | 'past_due' | 'canceled'

/** Forma de pagamento de uma cobrança (boleto não existe na API). */
export type BillingMethod = 'card' | 'pix'

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

/** GET /v1/subscriptions/me (também é a resposta de POST /cancel). */
export interface Subscription {
  status: SubscriptionStatus
  /** null durante o trial. */
  plan: SubscriptionPlan | null
  /** Fim do teste grátis (null se não está mais em trial). */
  trialEndsAt: string | null
  /** Até quando o acesso de escrita é válido (fim do trial ou do ciclo pago). */
  currentPeriodEnd: string | null
  canceledAt: string | null
  /** Fonte da verdade do bloqueio: true = conta em somente leitura. */
  readOnly: boolean
}

/** Item do histórico — GET /v1/subscriptions/payments. */
export interface Payment {
  id: string
  plan: SubscriptionPlan
  method: BillingMethod
  status: PaymentStatus
  /** Valor em centavos (padrão do gateway). */
  amountCents: number
  periodStart: string | null
  periodEnd: string | null
  paidAt: string | null
  createdAt: string
}

/** Corpo de POST /v1/subscriptions/checkout. `method` é ignorado no mensal (sempre cartão). */
export interface CreateCheckoutPayload {
  plan: SubscriptionPlan
  method?: BillingMethod
}

/** Resposta de POST /v1/subscriptions/checkout. */
export interface CheckoutCreated {
  /** URL do checkout hospedado da AbacatePay. */
  checkoutUrl: string
  plan: SubscriptionPlan
  method: BillingMethod
  paymentId: string
}

export interface PaymentsQuery {
  page?: number
  limit?: number
}
