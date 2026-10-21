// Plano único do Miyrah em dois ciclos — preços e regras de contratação.
// Ver specs/subscription.md (Decisões 2 e 4) e wiki/pricing.md.

import type { BillingMethod, PaymentStatus, Subscription, SubscriptionPlan } from '@/types'

/**
 * Preços em centavos, espelhando wiki/pricing.md (preço único, sem descontos).
 * A API não expõe preço (vem da env do back) — manter os dois em sincronia.
 */
export const PLAN_PRICES_CENTS: Record<SubscriptionPlan, number> = {
  monthly: 2900,
  annual: 29000,
}

export const PLAN_LABELS: Record<SubscriptionPlan, string> = {
  monthly: 'Plano Mensal',
  annual: 'Plano Anual',
}

export const METHOD_LABELS: Record<BillingMethod, string> = {
  card: 'Cartão de crédito',
  pix: 'PIX',
}

export const METHOD_SHORT_LABELS: Record<BillingMethod, string> = {
  card: 'Cartão',
  pix: 'PIX',
}

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  paid: 'Paga',
  pending: 'Aguardando pagamento',
  failed: 'Falhou',
  refunded: 'Estornada',
}

/** Anual aceita cartão ou PIX; o padrão da API é PIX. */
export const DEFAULT_ANNUAL_METHOD: BillingMethod = 'pix'

/** Ação disponível no card de um plano. */
export type PlanCta = 'subscribe' | 'renew' | 'none'

export function isCurrentPlan(plan: SubscriptionPlan, subscription: Subscription): boolean {
  return subscription.status === 'active' && subscription.plan === plan
}

/**
 * Mensal ativo = recorrência viva na AbacatePay. Um 2º checkout criaria uma
 * cobrança recorrente duplicada (a API não impede), então o front não oferece.
 */
export function hasActiveRecurrence(subscription: Subscription): boolean {
  return isCurrentPlan('monthly', subscription)
}

/**
 * Sem assinatura ativa, os dois planos podem ser contratados. Com assinatura
 * ativa, só o anual pode ser renovado (o período novo empilha no atual); trocar
 * de plano exige cancelar antes.
 */
export function getPlanCta(plan: SubscriptionPlan, subscription: Subscription): PlanCta {
  if (subscription.status !== 'active') return 'subscribe'
  if (plan === 'annual' && subscription.plan === 'annual') return 'renew'
  return 'none'
}
