// Leitura da assinatura para a UI: badge + frase de contexto do card de situação
// e o estado do aviso global. Ver specs/subscription.md (Aba Plano e Aviso global).

import { daysUntil, formatDate } from '@/lib/format'
import type { Subscription } from '@/types'

/** Tom do badge — mapeado para variantes visuais em status-card. */
export type StatusTone = 'active' | 'neutral' | 'alert'

export interface SubscriptionSummary {
  badge: string
  tone: StatusTone
  description: string
}

/** Dias restantes do teste a partir dos quais o aviso global aparece. */
export const TRIAL_WARNING_DAYS = 3

/** "hoje" / "amanhã" / "em N dias". */
export function relativeDaysLabel(days: number): string {
  if (days <= 0) return 'hoje'
  if (days === 1) return 'amanhã'
  return `em ${days} dias`
}

function dateOrNull(value: string | null): string | null {
  return value ? formatDate(value) : null
}

export function describeSubscription(
  subscription: Subscription,
  now: Date = new Date(),
): SubscriptionSummary {
  const { status, plan, readOnly } = subscription
  const periodEnd = dateOrNull(subscription.currentPeriodEnd)

  if (status === 'trialing') {
    const trialEnd = subscription.trialEndsAt ?? subscription.currentPeriodEnd
    if (readOnly || !trialEnd) {
      return {
        badge: 'Teste encerrado',
        tone: 'alert',
        description: trialEnd
          ? `Seu teste grátis terminou em ${formatDate(trialEnd)}.`
          : 'Seu teste grátis terminou.',
      }
    }
    return {
      badge: 'Período de teste',
      tone: 'neutral',
      description: `Seu teste grátis termina em ${formatDate(trialEnd)} (${relativeDaysLabel(daysUntil(trialEnd, now))}).`,
    }
  }

  if (status === 'canceled') {
    if (readOnly) {
      return {
        badge: 'Cancelada',
        tone: 'alert',
        description: periodEnd ? `Assinatura encerrada em ${periodEnd}.` : 'Assinatura encerrada.',
      }
    }
    const canceledAt = dateOrNull(subscription.canceledAt)
    return {
      badge: 'Cancelada',
      tone: 'neutral',
      description: [
        canceledAt && `Cancelada em ${canceledAt}.`,
        periodEnd && `Acesso até ${periodEnd}.`,
      ]
        .filter(Boolean)
        .join(' '),
    }
  }

  // past_due, ou ativa com o período vencido (renovação ainda não confirmada).
  if (status === 'past_due' || readOnly) {
    return {
      badge: 'Pagamento pendente',
      tone: 'alert',
      description: 'Não identificamos o pagamento da assinatura.',
    }
  }

  if (plan === 'monthly') {
    return {
      badge: 'Ativa',
      tone: 'active',
      description: periodEnd
        ? `Plano Mensal · renovação automática em ${periodEnd}.`
        : 'Plano Mensal · renovação automática.',
    }
  }

  return {
    badge: 'Ativa',
    tone: 'active',
    description: periodEnd ? `Plano Anual · válido até ${periodEnd}.` : 'Plano Anual.',
  }
}

export type BannerState = { kind: 'readOnly' } | { kind: 'trialEnding'; days: number } | null

/** Aviso global no layout: somente leitura tem prioridade sobre o fim do teste. */
export function getBannerState(subscription: Subscription, now: Date = new Date()): BannerState {
  if (subscription.readOnly) return { kind: 'readOnly' }
  if (subscription.status === 'trialing' && subscription.trialEndsAt) {
    const days = daysUntil(subscription.trialEndsAt, now)
    if (days <= TRIAL_WARNING_DAYS) return { kind: 'trialEnding', days: Math.max(days, 0) }
  }
  return null
}
