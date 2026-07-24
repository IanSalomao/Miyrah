import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ApiError } from '@/lib/api-client'
import type {
  DashboardBalance,
  DashboardBalanceVariation,
  DashboardByCategory,
  DashboardCounts,
  DashboardSummary,
} from '@/types'
import { DashboardPage } from './dashboard-page'

const {
  getDashboardBalanceMock,
  getDashboardSummaryMock,
  getDashboardCountsMock,
  getDashboardBalanceVariationMock,
  getDashboardLineMock,
  getDashboardByCategoryMock,
  getDashboardComparisonMock,
  listCategoriesMock,
  listMinistriesMock,
} = vi.hoisted(() => ({
  getDashboardBalanceMock: vi.fn(),
  getDashboardSummaryMock: vi.fn(),
  getDashboardCountsMock: vi.fn(),
  getDashboardBalanceVariationMock: vi.fn(),
  getDashboardLineMock: vi.fn(),
  getDashboardByCategoryMock: vi.fn(),
  getDashboardComparisonMock: vi.fn(),
  listCategoriesMock: vi.fn(),
  listMinistriesMock: vi.fn(),
}))

vi.mock('@/services', () => ({
  getDashboardBalance: getDashboardBalanceMock,
  getDashboardSummary: getDashboardSummaryMock,
  getDashboardCounts: getDashboardCountsMock,
  getDashboardBalanceVariation: getDashboardBalanceVariationMock,
  getDashboardLine: getDashboardLineMock,
  getDashboardByCategory: getDashboardByCategoryMock,
  getDashboardComparison: getDashboardComparisonMock,
  listCategories: listCategoriesMock,
  listMinistries: listMinistriesMock,
}))

const BALANCE: DashboardBalance = { balance: 21300 }

const SUMMARY: DashboardSummary = {
  income: 5000,
  expense: 3200,
  periodBalance: 1800,
  incomeCount: 42,
  expenseCount: 30,
  transactionsCount: 72,
}

const COUNTS: DashboardCounts = { membersCount: 87, ministriesCount: 6, categoriesCount: 14 }

const BALANCE_VARIATION: DashboardBalanceVariation = {
  dateFrom: '2026-07-01',
  dateTo: '2026-07-23',
  balanceStart: 12000,
  balanceEnd: 18500,
  percentChange: 54.2,
}

const BY_CATEGORY: DashboardByCategory = {
  incomeByCategory: [{ categoryId: 'c1', name: 'Dízimo', color: '#22C55E', value: 500 }],
  expenseByCategory: [{ categoryId: 'c2', name: 'Aluguel', color: '#EF4444', value: 200 }],
}

function mockHappyPath() {
  getDashboardBalanceMock.mockResolvedValue(BALANCE)
  getDashboardSummaryMock.mockResolvedValue(SUMMARY)
  getDashboardCountsMock.mockResolvedValue(COUNTS)
  getDashboardBalanceVariationMock.mockResolvedValue(BALANCE_VARIATION)
  getDashboardLineMock.mockResolvedValue({ granularity: 'day', line: [] })
  getDashboardByCategoryMock.mockResolvedValue(BY_CATEGORY)
  getDashboardComparisonMock.mockResolvedValue({
    groupBy: 'month',
    buckets: [],
    comparison: { sampleSize: 0, incomeVsAvg: null, expenseVsAvg: null },
  })
  listCategoriesMock.mockResolvedValue({
    items: [],
    meta: { page: 1, limit: 100, total: 0, totalPages: 0 },
  })
  listMinistriesMock.mockResolvedValue({ items: [] })
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
  it('renderiza o Saldo isolado, o bloco do período (com saldo início/fim + %) e o bloco de contagens', async () => {
    mockHappyPath()

    renderPage()

    expect(await screen.findByText('Saldo')).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByText(/\+R\$\s?21\.300,00/)).toBeInTheDocument()
    })

    // "Entradas"/"Saídas" também aparecem no segmented control de Tipo da filter-bar.
    expect(screen.getAllByText('Entradas').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Saídas').length).toBeGreaterThan(0)
    expect(screen.getByText('Balanço')).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByText(/\+R\$\s?1\.800,00/)).toBeInTheDocument()
    })

    expect(screen.getByText('Saldo no início do período')).toBeInTheDocument()
    expect(screen.getByText('Saldo no fim do período')).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByText(/\+R\$\s?12\.000,00/)).toBeInTheDocument()
    })
    expect(screen.getByText('↑ 54,2%')).toBeInTheDocument()

    expect(screen.getByText('Membros cadastrados')).toBeInTheDocument()
    expect(screen.getByText('87')).toBeInTheDocument()
    expect(screen.getByText('Ministérios cadastrados')).toBeInTheDocument()
    expect(screen.getByText('Categorias cadastradas')).toBeInTheDocument()
    expect(screen.getByText('14')).toBeInTheDocument()
    expect(screen.queryByText('Ticket médio')).not.toBeInTheDocument()
    expect(screen.queryByText('Transações')).not.toBeInTheDocument()

    expect(await screen.findByText('Entradas por categoria')).toBeInTheDocument()
    expect(screen.getByText('Saídas por categoria')).toBeInTheDocument()
    expect(await screen.findByText('Dízimo')).toBeInTheDocument()
    expect(screen.getByText('Aluguel')).toBeInTheDocument()

    expect(screen.getByText('Diário')).toBeInTheDocument()
    expect(screen.getByText('Semanal')).toBeInTheDocument()
  })

  it('exibe estado de erro com "Tentar novamente" quando o summary falha', async () => {
    mockHappyPath()
    getDashboardSummaryMock.mockRejectedValue(
      new ApiError(
        { code: 'INTERNAL_ERROR', message: 'Falha ao carregar métricas.', details: null },
        500,
      ),
    )

    renderPage()

    expect(await screen.findByText('Falha ao carregar métricas.')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Tentar novamente' }).length).toBeGreaterThan(0)
  })

  it('o card Saldo não é afetado por um erro no summary', async () => {
    mockHappyPath()
    getDashboardSummaryMock.mockRejectedValue(
      new ApiError({ code: 'INTERNAL_ERROR', message: 'Falha.', details: null }, 500),
    )

    renderPage()

    expect(await screen.findByText('Saldo')).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByText(/\+R\$\s?21\.300,00/)).toBeInTheDocument()
    })
  })
})
