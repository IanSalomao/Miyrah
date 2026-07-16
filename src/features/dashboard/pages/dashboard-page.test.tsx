import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ApiError } from '@/lib/api-client'
import type { DashboardCharts, DashboardSummary } from '@/types'
import { DashboardPage } from './dashboard-page'

const { getDashboardSummaryMock, getDashboardChartsMock, listCategoriesMock, listMinistriesMock } =
  vi.hoisted(() => ({
    getDashboardSummaryMock: vi.fn(),
    getDashboardChartsMock: vi.fn(),
    listCategoriesMock: vi.fn(),
    listMinistriesMock: vi.fn(),
  }))

vi.mock('@/services', () => ({
  getDashboardSummary: getDashboardSummaryMock,
  getDashboardCharts: getDashboardChartsMock,
  listCategories: listCategoriesMock,
  listMinistries: listMinistriesMock,
}))

const SUMMARY: DashboardSummary = {
  balance: 18500,
  income: 5000,
  expense: 3200,
  periodBalance: 1800,
  membersCount: 87,
  transactionsCount: 342,
  ministriesCount: 6,
  averageTicket: 245.5,
}

const CHARTS: DashboardCharts = {
  line: [{ date: '2026-07-01', income: 500, expense: 0 }],
  incomeByCategory: [{ categoryId: 'c1', name: 'Dízimo', color: '#22C55E', value: 500 }],
  expenseByCategory: [{ categoryId: 'c2', name: 'Aluguel', color: '#EF4444', value: 200 }],
}

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <DashboardPage />
    </QueryClientProvider>,
  )
}

afterEach(() => {
  vi.clearAllMocks()
})

describe('DashboardPage', () => {
  it('renderiza os 4 cards principais e os 4 extras a partir do summary', async () => {
    getDashboardSummaryMock.mockResolvedValue(SUMMARY)
    getDashboardChartsMock.mockResolvedValue(CHARTS)
    listCategoriesMock.mockResolvedValue({
      items: [],
      meta: { page: 1, limit: 100, total: 0, totalPages: 0 },
    })
    listMinistriesMock.mockResolvedValue({ items: [] })

    renderPage()

    expect(await screen.findByText('Saldo')).toBeInTheDocument()
    // "Entradas"/"Saídas" também aparecem no segmented control de Tipo da filter-bar.
    expect(screen.getAllByText('Entradas').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Saídas').length).toBeGreaterThan(0)
    expect(screen.getByText('Balanço')).toBeInTheDocument()

    // Saldo (balance=18500) e Balanço (periodBalance=1800) são valores diferentes.
    await waitFor(() => {
      expect(screen.getByText(/\+R\$\s?18\.500,00/)).toBeInTheDocument()
      expect(screen.getByText(/\+R\$\s?1\.800,00/)).toBeInTheDocument()
    })

    expect(screen.getByText('Membros cadastrados')).toBeInTheDocument()
    expect(screen.getByText('87')).toBeInTheDocument()
    expect(screen.getByText('Ticket médio')).toBeInTheDocument()

    expect(await screen.findByText('Entradas por categoria')).toBeInTheDocument()
    expect(screen.getByText('Saídas por categoria')).toBeInTheDocument()
    expect(await screen.findByText('Dízimo')).toBeInTheDocument()
    expect(screen.getByText('Aluguel')).toBeInTheDocument()
  })

  it('exibe estado de erro com "Tentar novamente" quando o summary falha', async () => {
    getDashboardSummaryMock.mockRejectedValue(
      new ApiError(
        { code: 'INTERNAL_ERROR', message: 'Falha ao carregar métricas.', details: null },
        500,
      ),
    )
    getDashboardChartsMock.mockResolvedValue(CHARTS)
    listCategoriesMock.mockResolvedValue({
      items: [],
      meta: { page: 1, limit: 100, total: 0, totalPages: 0 },
    })
    listMinistriesMock.mockResolvedValue({ items: [] })

    renderPage()

    // O erro do summary afeta os dois blocos que dependem dele (métricas principais
    // e métricas extras) — cada um exibe seu próprio "Tentar novamente".
    expect(await screen.findAllByText('Falha ao carregar métricas.')).toHaveLength(2)
    expect(screen.getAllByRole('button', { name: 'Tentar novamente' }).length).toBeGreaterThan(0)
  })
})
