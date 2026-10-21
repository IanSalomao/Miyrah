import { describe, expect, it } from 'vitest'
import type { Subscription } from '@/types'
import { getPlanCta, hasActiveRecurrence, isCurrentPlan } from './plans'
import { describeSubscription, getBannerState, relativeDaysLabel } from './subscription-status'

const NOW = new Date(2026, 9, 19, 10, 0) // 19/10/2026 local

// Datas ao meio-dia local: a data exibida não depende do fuso do ambiente de teste.
function at(year: number, month: number, day: number): string {
  return new Date(year, month - 1, day, 12, 0).toISOString()
}

function subscription(overrides: Partial<Subscription> = {}): Subscription {
  return {
    status: 'trialing',
    plan: null,
    trialEndsAt: at(2026, 10, 30),
    currentPeriodEnd: at(2026, 10, 30),
    canceledAt: null,
    readOnly: false,
    ...overrides,
  }
}

const ACTIVE_MONTHLY = subscription({
  status: 'active',
  plan: 'monthly',
  trialEndsAt: null,
  currentPeriodEnd: at(2026, 11, 15),
})
const ACTIVE_ANNUAL = subscription({
  status: 'active',
  plan: 'annual',
  trialEndsAt: null,
  currentPeriodEnd: at(2027, 11, 15),
})

describe('relativeDaysLabel', () => {
  it('fala hoje/amanhã/em N dias', () => {
    expect(relativeDaysLabel(0)).toBe('hoje')
    expect(relativeDaysLabel(-2)).toBe('hoje')
    expect(relativeDaysLabel(1)).toBe('amanhã')
    expect(relativeDaysLabel(11)).toBe('em 11 dias')
  })
})

describe('describeSubscription', () => {
  it('teste em andamento mostra a data de fim e os dias restantes', () => {
    expect(describeSubscription(subscription(), NOW)).toEqual({
      badge: 'Período de teste',
      tone: 'neutral',
      description: 'Seu teste grátis termina em 30/10/2026 (em 11 dias).',
    })
  })

  it('teste vencido vira alerta de somente leitura', () => {
    const summary = describeSubscription(
      subscription({
        trialEndsAt: at(2026, 10, 10),
        currentPeriodEnd: at(2026, 10, 10),
        readOnly: true,
      }),
      NOW,
    )
    expect(summary.badge).toBe('Teste encerrado')
    expect(summary.tone).toBe('alert')
    expect(summary.description).toBe('Seu teste grátis terminou em 10/10/2026.')
  })

  it('mensal ativo fala em renovação automática; anual, em validade', () => {
    expect(describeSubscription(ACTIVE_MONTHLY, NOW)).toMatchObject({
      badge: 'Ativa',
      tone: 'active',
      description: 'Plano Mensal · renovação automática em 15/11/2026.',
    })
    expect(describeSubscription(ACTIVE_ANNUAL, NOW).description).toBe(
      'Plano Anual · válido até 15/11/2027.',
    )
  })

  it('cancelada com acesso mostra até quando o acesso segue', () => {
    const summary = describeSubscription(
      { ...ACTIVE_MONTHLY, status: 'canceled', canceledAt: at(2026, 10, 18) },
      NOW,
    )
    expect(summary).toEqual({
      badge: 'Cancelada',
      tone: 'neutral',
      description: 'Cancelada em 18/10/2026. Acesso até 15/11/2026.',
    })
  })

  it('cancelada e vencida vira alerta', () => {
    const summary = describeSubscription(
      { ...ACTIVE_MONTHLY, status: 'canceled', currentPeriodEnd: at(2026, 10, 1), readOnly: true },
      NOW,
    )
    expect(summary.tone).toBe('alert')
    expect(summary.description).toBe('Assinatura encerrada em 01/10/2026.')
  })

  it('inadimplente — ou ativa com período vencido — é pagamento pendente', () => {
    expect(
      describeSubscription({ ...ACTIVE_MONTHLY, status: 'past_due', readOnly: true }, NOW).badge,
    ).toBe('Pagamento pendente')
    expect(describeSubscription({ ...ACTIVE_ANNUAL, readOnly: true }, NOW)).toMatchObject({
      badge: 'Pagamento pendente',
      tone: 'alert',
    })
  })
})

describe('getBannerState', () => {
  it('somente leitura tem prioridade', () => {
    expect(getBannerState(subscription({ readOnly: true }), NOW)).toEqual({ kind: 'readOnly' })
  })

  it('avisa o fim do teste só nos últimos 3 dias', () => {
    expect(getBannerState(subscription(), NOW)).toBeNull()
    expect(getBannerState(subscription({ trialEndsAt: at(2026, 10, 22) }), NOW)).toEqual({
      kind: 'trialEnding',
      days: 3,
    })
    expect(getBannerState(subscription({ trialEndsAt: at(2026, 10, 19) }), NOW)).toEqual({
      kind: 'trialEnding',
      days: 0,
    })
  })

  it('assinatura ativa não tem aviso', () => {
    expect(getBannerState(ACTIVE_MONTHLY, NOW)).toBeNull()
  })
})

describe('regras de plano', () => {
  it('sem assinatura ativa, os dois planos podem ser contratados', () => {
    for (const s of [subscription(), { ...ACTIVE_MONTHLY, status: 'canceled' as const }]) {
      expect(getPlanCta('monthly', s)).toBe('subscribe')
      expect(getPlanCta('annual', s)).toBe('subscribe')
      expect(isCurrentPlan('monthly', s)).toBe(false)
    }
  })

  it('mensal ativo bloqueia novos checkouts (recorrência viva)', () => {
    expect(hasActiveRecurrence(ACTIVE_MONTHLY)).toBe(true)
    expect(isCurrentPlan('monthly', ACTIVE_MONTHLY)).toBe(true)
    expect(getPlanCta('monthly', ACTIVE_MONTHLY)).toBe('none')
    expect(getPlanCta('annual', ACTIVE_MONTHLY)).toBe('none')
  })

  it('anual ativo só permite renovar o anual', () => {
    expect(hasActiveRecurrence(ACTIVE_ANNUAL)).toBe(false)
    expect(getPlanCta('annual', ACTIVE_ANNUAL)).toBe('renew')
    expect(getPlanCta('monthly', ACTIVE_ANNUAL)).toBe('none')
  })
})
