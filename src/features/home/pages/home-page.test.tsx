import { describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { HomePage } from './home-page'
import type {
  Category,
  DashboardBalance,
  DashboardComparison,
  DashboardLine,
  DashboardSummary,
  Ministry,
  Paginated,
  Transaction,
} from '@/types'

const balance: DashboardBalance = { balance: 18500 }

const summary: DashboardSummary = {
  income: 5000,
  expense: 3200,
  periodBalance: 1800,
  incomeCount: 42,
  expenseCount: 30,
  transactionsCount: 72,
}

const line: DashboardLine = {
  granularity: 'day',
  line: [
    { date: '2026-07-01', income: 500, expense: 0 },
    { date: '2026-07-02', income: 0, expense: 1200 },
  ],
}

function buildTransaction(index: number): Transaction {
  return {
    id: `transaction-${index}`,
    type: index % 2 === 0 ? 'income' : 'expense',
    value: index % 2 === 0 ? 100 * (index + 1) : -100 * (index + 1),
    date: `2026-07-0${index + 1}`,
    description: `Transação ${index + 1}`,
    category: { id: `category-${index}`, name: 'Categoria', color: '#22C55E', deleted: false },
    member: null,
    ministry: null,
    createdAt: '2026-07-01T09:00:00Z',
    updatedAt: '2026-07-01T09:00:00Z',
  }
}

const recentTransactions: Paginated<Transaction> = {
  items: Array.from({ length: 5 }, (_, index) => buildTransaction(index)),
  meta: { page: 1, limit: 5, total: 5, totalPages: 1 },
}

const categoriesPage: Paginated<Category> = {
  items: [],
  meta: { page: 1, limit: 20, total: 0, totalPages: 0 },
}

const comparison: DashboardComparison = {
  groupBy: 'month',
  buckets: [
    { periodStart: '2026-02-01', label: 'Fev/26', income: 4000, expense: 2500 },
    { periodStart: '2026-03-01', label: 'Mar/26', income: 4500, expense: 2800 },
  ],
  comparison: { sampleSize: 1, incomeVsAvg: 12.5, expenseVsAvg: -8.2 },
}

vi.mock('@/services', () => ({
  getDashboardBalance: vi.fn(() => Promise.resolve(balance)),
  getDashboardSummary: vi.fn(() => Promise.resolve(summary)),
  getDashboardLine: vi.fn(() => Promise.resolve(line)),
  getDashboardComparison: vi.fn(() => Promise.resolve(comparison)),
  listTransactions: vi.fn(() => Promise.resolve(recentTransactions)),
  listCategories: vi.fn(() => Promise.resolve(categoriesPage)),
  listMembers: vi.fn(() => Promise.resolve({ items: [], meta: { page: 1, limit: 20, total: 0, totalPages: 0 } })),
  listMinistries: vi.fn(() => Promise.resolve({ items: [] as Ministry[] })),
  updateTransaction: vi.fn(),
}))

function renderHomePage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/']}>
        <HomePage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('HomePage (Início)', () => {
  it('renderiza os 4 cards de métrica a partir do summary mockado', async () => {
    renderHomePage()

    expect(await screen.findByText('Saldo em Conta')).toBeInTheDocument()
    expect(screen.getByText('Entradas do Mês')).toBeInTheDocument()
    expect(screen.getByText('Saídas do Mês')).toBeInTheDocument()
    expect(screen.getByText('Balanço do Mês')).toBeInTheDocument()

    expect(await screen.findByText('+R$ 18.500,00')).toBeInTheDocument()
    expect(screen.getByText('+R$ 5.000,00')).toBeInTheDocument()
    expect(screen.getByText('−R$ 3.200,00')).toBeInTheDocument()
    expect(screen.getByText('+R$ 1.800,00')).toBeInTheDocument()
  })

  it('renderiza as 5 últimas transações e o link "Ver todas" leva a /transactions', async () => {
    renderHomePage()

    const heading = await screen.findByRole('heading', { name: 'Últimas transações' })
    const section = heading.closest('section')
    expect(section).not.toBeNull()

    const list = await within(section!).findByRole('list')
    expect(within(list).getAllByRole('listitem')).toHaveLength(5)

    const seeAllLink = screen.getByRole('link', { name: 'Ver todas' })
    expect(seeAllLink).toHaveAttribute('href', '/transactions')
  })

  it('exibe o estado vazio quando não há transações recentes', async () => {
    const { listTransactions } = await import('@/services')
    vi.mocked(listTransactions).mockResolvedValueOnce({
      items: [],
      meta: { page: 1, limit: 5, total: 0, totalPages: 0 },
    })

    renderHomePage()

    expect(await screen.findByText('Nenhuma transação encontrada')).toBeInTheDocument()
  })
})
