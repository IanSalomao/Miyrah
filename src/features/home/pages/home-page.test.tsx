import { describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { HomePage } from './home-page'
import type {
  Category,
  DashboardCharts,
  DashboardSummary,
  Ministry,
  Paginated,
  Transaction,
} from '@/types'

const summary: DashboardSummary = {
  balance: 18500,
  income: 5000,
  expense: 3200,
  periodBalance: 1800,
  membersCount: 87,
  transactionsCount: 342,
  ministriesCount: 6,
  averageTicket: 245.5,
}

const charts: DashboardCharts = {
  line: [
    { date: '2026-07-01', income: 500, expense: 0 },
    { date: '2026-07-02', income: 0, expense: 1200 },
  ],
  incomeByCategory: [
    { categoryId: 'cat-income-1', name: 'Dízimo', color: '#22C55E', value: 500 },
  ],
  expenseByCategory: [
    { categoryId: 'cat-expense-1', name: 'Aluguel', color: '#EF4444', value: 1200 },
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

vi.mock('@/services', () => ({
  getDashboardSummary: vi.fn(() => Promise.resolve(summary)),
  getDashboardCharts: vi.fn(() => Promise.resolve(charts)),
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
