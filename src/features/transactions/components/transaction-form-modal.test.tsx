import { describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TransactionFormModal } from './transaction-form-modal'
import { listCategories, listMembers, listMinistries } from '@/services'

vi.mock('@/services', () => ({
  listCategories: vi.fn(),
  listMinistries: vi.fn(),
  listMembers: vi.fn(),
  createTransaction: vi.fn(),
  updateTransaction: vi.fn(),
}))

const mockedListCategories = vi.mocked(listCategories)
const mockedListMinistries = vi.mocked(listMinistries)
const mockedListMembers = vi.mocked(listMembers)

const incomeCategories = [
  {
    id: 'cat-income',
    name: 'Dízimo',
    description: null,
    type: 'income' as const,
    color: '#22C55E',
    createdAt: '',
    updatedAt: '',
  },
]

const expenseCategories = [
  {
    id: 'cat-expense',
    name: 'Manutenção',
    description: null,
    type: 'expense' as const,
    color: '#A6342A',
    createdAt: '',
    updatedAt: '',
  },
]

function renderModal() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <TransactionFormModal open onOpenChange={vi.fn()} transaction={null} />
    </QueryClientProvider>,
  )
}

describe('TransactionFormModal — dropdown de categoria filtrado pelo tipo', () => {
  it('busca categorias do tipo income por padrão (criação começa como Entrada)', async () => {
    mockedListCategories.mockResolvedValue({
      items: incomeCategories,
      meta: { page: 1, limit: 100, total: 1, totalPages: 1 },
    })
    mockedListMinistries.mockResolvedValue({ items: [] })
    mockedListMembers.mockResolvedValue({
      items: [],
      meta: { page: 1, limit: 20, total: 0, totalPages: 0 },
    })

    renderModal()

    await waitFor(() => {
      expect(mockedListCategories).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'income' }),
        expect.anything(),
      )
    })
    expect(await screen.findByText('Dízimo')).toBeInTheDocument()
  })

  it('refaz a busca com type=expense e limpa a categoria ao trocar o Tipo', async () => {
    const user = userEvent.setup()
    mockedListCategories.mockImplementation((query) => {
      const items = query.type === 'expense' ? expenseCategories : incomeCategories
      return Promise.resolve({
        items,
        meta: { page: 1, limit: 100, total: items.length, totalPages: 1 },
      })
    })
    mockedListMinistries.mockResolvedValue({ items: [] })
    mockedListMembers.mockResolvedValue({
      items: [],
      meta: { page: 1, limit: 20, total: 0, totalPages: 0 },
    })

    renderModal()

    expect(await screen.findByText('Dízimo')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Saída' }))

    await waitFor(() => {
      expect(mockedListCategories).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'expense' }),
        expect.anything(),
      )
    })
    expect(await screen.findByText('Manutenção')).toBeInTheDocument()
    expect(screen.queryByText('Dízimo')).not.toBeInTheDocument()
  })
})
