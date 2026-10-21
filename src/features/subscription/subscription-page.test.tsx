import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ApiError } from '@/lib/api-client'
import type { Paginated, Payment, Subscription } from '@/types'
import { SubscriptionBanner } from './components/subscription-banner'
import { SubscriptionPage } from './subscription-page'

const {
  getSubscriptionMock,
  createCheckoutMock,
  cancelSubscriptionMock,
  listPaymentsMock,
  redirectMock,
} = vi.hoisted(() => ({
  getSubscriptionMock: vi.fn(),
  createCheckoutMock: vi.fn(),
  cancelSubscriptionMock: vi.fn(),
  listPaymentsMock: vi.fn(),
  redirectMock: vi.fn(),
}))

vi.mock('@/services', () => ({
  getSubscription: getSubscriptionMock,
  createCheckout: createCheckoutMock,
  cancelSubscription: cancelSubscriptionMock,
  listPayments: listPaymentsMock,
}))

vi.mock('@/lib/navigation', () => ({ redirectToExternal: redirectMock }))

// Datas ao meio-dia local: a data exibida não depende do fuso do ambiente de teste.
function at(year: number, month: number, day: number): string {
  return new Date(year, month - 1, day, 12, 0).toISOString()
}

const TRIAL: Subscription = {
  status: 'trialing',
  plan: null,
  trialEndsAt: at(2026, 10, 30),
  currentPeriodEnd: at(2026, 10, 30),
  canceledAt: null,
  readOnly: false,
}

const ACTIVE_MONTHLY: Subscription = {
  status: 'active',
  plan: 'monthly',
  trialEndsAt: null,
  currentPeriodEnd: at(2026, 11, 15),
  canceledAt: null,
  readOnly: false,
}

const PAID_CARD: Payment = {
  id: 'pay-1',
  plan: 'monthly',
  method: 'card',
  status: 'paid',
  amountCents: 2900,
  periodStart: at(2026, 10, 15),
  periodEnd: at(2026, 11, 15),
  paidAt: at(2026, 10, 15),
  createdAt: at(2026, 10, 15),
}

function paginated(items: Payment[]): Paginated<Payment> {
  return { items, meta: { page: 1, limit: 20, total: items.length, totalPages: 1 } }
}

// Normaliza espaços (Intl usa NBSP entre "R$" e o número).
const norm = (s: string | null) => (s ?? '').replace(/\s/g, ' ')

function renderAt(path: string) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[path]}>
        <SubscriptionBanner />
        <Routes>
          <Route path="/subscription" element={<SubscriptionPage />} />
          <Route path="/transactions" element={<h1>Transações</h1>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

beforeEach(() => {
  // Só o relógio: timers reais para o react-query e o user-event.
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date(2026, 9, 19, 10, 0))
})

afterEach(() => {
  vi.useRealTimers()
  vi.clearAllMocks()
})

describe('SubscriptionPage — aba Plano', () => {
  it('no teste grátis mostra a situação e os dois planos para contratar', async () => {
    getSubscriptionMock.mockResolvedValue(TRIAL)
    renderAt('/subscription')

    expect(await screen.findByText('Período de teste')).toBeInTheDocument()
    expect(
      screen.getByText('Seu teste grátis termina em 30/10/2026 (em 11 dias).'),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Assinar plano mensal' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Assinar plano anual' })).toBeEnabled()
    expect(screen.queryByRole('button', { name: 'Cancelar assinatura' })).not.toBeInTheDocument()

    const annual = screen.getByRole('region', { name: 'Plano Anual' })
    expect(norm(within(annual).getByText(/R\$/).textContent)).toBe('R$ 290,00')
  })

  it('assina o anual com a forma escolhida e redireciona para o checkout', async () => {
    getSubscriptionMock.mockResolvedValue(TRIAL)
    createCheckoutMock.mockResolvedValue({
      checkoutUrl: 'https://pay.abacatepay.com/bill_1',
      plan: 'annual',
      method: 'card',
      paymentId: 'pay-9',
    })
    const user = userEvent.setup()
    renderAt('/subscription')

    const annual = await screen.findByRole('region', { name: 'Plano Anual' })
    // PIX vem selecionado por padrão; troca para cartão.
    expect(within(annual).getByRole('button', { name: 'PIX' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    await user.click(within(annual).getByRole('button', { name: 'Cartão' }))
    await user.click(within(annual).getByRole('button', { name: 'Assinar plano anual' }))

    await waitFor(() =>
      expect(redirectMock).toHaveBeenCalledWith('https://pay.abacatepay.com/bill_1'),
    )
    expect(createCheckoutMock).toHaveBeenCalledWith({ plan: 'annual', method: 'card' })
  })

  it('o mensal não envia forma (é sempre cartão)', async () => {
    getSubscriptionMock.mockResolvedValue(TRIAL)
    createCheckoutMock.mockResolvedValue({
      checkoutUrl: 'https://pay.abacatepay.com/sub_1',
      plan: 'monthly',
      method: 'card',
      paymentId: 'pay-8',
    })
    const user = userEvent.setup()
    renderAt('/subscription')

    await user.click(await screen.findByRole('button', { name: 'Assinar plano mensal' }))

    await waitFor(() => expect(redirectMock).toHaveBeenCalled())
    expect(createCheckoutMock).toHaveBeenCalledWith({ plan: 'monthly', method: undefined })
  })

  it('mostra o erro da API quando o checkout falha', async () => {
    getSubscriptionMock.mockResolvedValue(TRIAL)
    createCheckoutMock.mockRejectedValue(
      new ApiError(
        { code: 'INTERNAL_ERROR', message: 'Gateway indisponível.', details: null },
        502,
      ),
    )
    const user = userEvent.setup()
    renderAt('/subscription')

    await user.click(await screen.findByRole('button', { name: 'Assinar plano mensal' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Gateway indisponível.')
    expect(redirectMock).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Assinar plano mensal' })).toBeEnabled()
  })

  it('mensal ativo: marca o plano atual, sem novos checkouts, e permite cancelar', async () => {
    const canceled: Subscription = {
      ...ACTIVE_MONTHLY,
      status: 'canceled',
      canceledAt: at(2026, 10, 19),
    }
    getSubscriptionMock.mockResolvedValue(ACTIVE_MONTHLY)
    cancelSubscriptionMock.mockImplementation(async () => {
      // A partir daqui o back já devolve a assinatura cancelada.
      getSubscriptionMock.mockResolvedValue(canceled)
      return canceled
    })
    const user = userEvent.setup()
    renderAt('/subscription')

    expect(await screen.findByText('Plano atual')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Assinar plano/ })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Cancelar assinatura' }))
    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByText('15/11/2026')).toBeInTheDocument()
    await user.click(within(dialog).getByRole('button', { name: 'Cancelar assinatura' }))

    await waitFor(() => expect(cancelSubscriptionMock).toHaveBeenCalledTimes(1))
    expect(
      await screen.findByText('Cancelada em 19/10/2026. Acesso até 15/11/2026.'),
    ).toBeInTheDocument()
    // Cancelada: os dois planos voltam a poder ser contratados.
    expect(screen.getByRole('button', { name: 'Assinar plano mensal' })).toBeInTheDocument()
  })

  it('conta em somente leitura mostra a nota no card de situação', async () => {
    getSubscriptionMock.mockResolvedValue({
      ...TRIAL,
      trialEndsAt: at(2026, 10, 10),
      currentPeriodEnd: at(2026, 10, 10),
      readOnly: true,
    })
    renderAt('/subscription')

    expect(await screen.findByText('Teste encerrado')).toBeInTheDocument()
    expect(screen.getByText('Conta em somente leitura.')).toBeInTheDocument()
    // O aviso global não se repete na própria tela de Assinatura.
    expect(screen.queryByText('Sua conta está em somente leitura.')).not.toBeInTheDocument()
  })

  it('na volta do checkout mostra o aviso de processamento', async () => {
    getSubscriptionMock.mockResolvedValue(TRIAL)
    const user = userEvent.setup()
    renderAt('/subscription?checkout=completed')

    expect(await screen.findByText('Pagamento em processamento.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Fechar aviso' }))
    expect(screen.queryByText('Pagamento em processamento.')).not.toBeInTheDocument()
  })
})

describe('SubscriptionPage — abas Pagamento e Faturas', () => {
  it('sem pagamento confirmado, Pagamento leva para a escolha de plano', async () => {
    getSubscriptionMock.mockResolvedValue(TRIAL)
    listPaymentsMock.mockResolvedValue(paginated([]))
    const user = userEvent.setup()
    renderAt('/subscription')

    await user.click(await screen.findByRole('tab', { name: 'Pagamento' }))
    expect(await screen.findByText('Nenhuma forma de pagamento cadastrada')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Escolher plano' }))
    expect(await screen.findByRole('button', { name: 'Assinar plano anual' })).toBeInTheDocument()
  })

  it('mensal ativo mostra o cartão e orienta cancelar para trocar', async () => {
    getSubscriptionMock.mockResolvedValue(ACTIVE_MONTHLY)
    listPaymentsMock.mockResolvedValue(paginated([PAID_CARD]))
    const user = userEvent.setup()
    renderAt('/subscription')

    await user.click(await screen.findByRole('tab', { name: 'Pagamento' }))
    expect(await screen.findByText('Cartão de crédito')).toBeInTheDocument()
    expect(screen.getByText(/último pagamento em 15\/10\/2026/)).toBeInTheDocument()
    expect(
      screen.getByText(/Para usar outro cartão, cancele a assinatura atual/),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ir para Plano' })).toBeInTheDocument()
  })

  it('Faturas lista o histórico com valor neutro e status', async () => {
    getSubscriptionMock.mockResolvedValue(ACTIVE_MONTHLY)
    listPaymentsMock.mockResolvedValue(
      paginated([
        {
          ...PAID_CARD,
          id: 'pay-2',
          status: 'pending',
          paidAt: null,
          createdAt: at(2026, 10, 18),
          method: 'pix',
          plan: 'annual',
          amountCents: 29000,
        },
        PAID_CARD,
      ]),
    )
    const user = userEvent.setup()
    renderAt('/subscription')

    await user.click(await screen.findByRole('tab', { name: 'Faturas' }))
    const rows = await screen.findAllByRole('row')
    // Cabeçalho + 2 faturas.
    expect(rows).toHaveLength(3)
    expect(within(rows[1]).getByText('Plano Anual')).toBeInTheDocument()
    expect(within(rows[1]).getByText('Aguardando pagamento')).toBeInTheDocument()
    expect(norm(rows[1].lastElementChild?.textContent ?? null)).toBe('R$ 290,00')
    expect(within(rows[2]).getByText('Paga')).toBeInTheDocument()
    expect(within(rows[2]).getByText('15/10/2026 – 15/11/2026')).toBeInTheDocument()
    expect(listPaymentsMock).toHaveBeenCalledWith({ page: 1, limit: 20 }, expect.anything())
  })

  it('Faturas sem histórico mostra o estado vazio', async () => {
    getSubscriptionMock.mockResolvedValue(TRIAL)
    listPaymentsMock.mockResolvedValue(paginated([]))
    const user = userEvent.setup()
    renderAt('/subscription')

    await user.click(await screen.findByRole('tab', { name: 'Faturas' }))
    expect(await screen.findByText('Nenhuma fatura encontrada')).toBeInTheDocument()
  })
})

describe('SubscriptionBanner', () => {
  it('avisa somente leitura nas outras telas, com link para regularizar', async () => {
    getSubscriptionMock.mockResolvedValue({ ...TRIAL, readOnly: true })
    renderAt('/transactions')

    expect(await screen.findByRole('alert')).toHaveTextContent('Sua conta está em somente leitura.')
    expect(screen.getByRole('link', { name: 'Regularizar assinatura' })).toHaveAttribute(
      'href',
      '/subscription',
    )
  })

  it('avisa o fim do teste nos últimos dias', async () => {
    getSubscriptionMock.mockResolvedValue({ ...TRIAL, trialEndsAt: at(2026, 10, 20) })
    renderAt('/transactions')

    expect(await screen.findByText('Seu teste grátis termina amanhã.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Escolher plano' })).toBeInTheDocument()
  })

  it('não aparece com assinatura em dia', async () => {
    getSubscriptionMock.mockResolvedValue(ACTIVE_MONTHLY)
    renderAt('/transactions')

    await waitFor(() => expect(getSubscriptionMock).toHaveBeenCalled())
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})
