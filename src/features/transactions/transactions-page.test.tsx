import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TransactionsPage } from './transactions-page'
import type { Paginated, Transaction } from '@/types'

const {
  listTransactionsMock,
  removeTransactionMock,
  listCategoriesMock,
  listMinistriesMock,
  listMembersMock,
  createTransactionMock,
  updateTransactionMock,
} = vi.hoisted(() => ({
  listTransactionsMock: vi.fn(),
  removeTransactionMock: vi.fn(),
  listCategoriesMock: vi.fn(),
  listMinistriesMock: vi.fn(),
  listMembersMock: vi.fn(),
  createTransactionMock: vi.fn(),
  updateTransactionMock: vi.fn(),
}))

vi.mock('@/services', () => ({
  listTransactions: listTransactionsMock,
  removeTransaction: removeTransactionMock,
  listCategories: listCategoriesMock,
  listMinistries: listMinistriesMock,
  listMembers: listMembersMock,
  createTransaction: createTransactionMock,
  updateTransaction: updateTransactionMock,
}))

const TRANSACTION: Transaction = {
  id: 'tx-1',
  type: 'income',
  value: 500,
  date: '2026-07-10',
  description: 'Dízimo de julho',
  category: { id: 'cat-1', name: 'Dízimos', color: '#1F7A54', deleted: false },
  member: { id: 'mem-1', name: 'João da Silva', deleted: false },
  ministry: null,
  createdAt: '2026-07-10T14:30:00Z',
  updatedAt: '2026-07-10T14:30:00Z',
}

function paginated(items: Transaction[]): Paginated<Transaction> {
  return { items, meta: { page: 1, limit: 20, total: items.length, totalPages: 1 } }
}

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <TransactionsPage />
    </QueryClientProvider>,
  )
}

afterEach(() => {
  vi.clearAllMocks()
})

describe('TransactionsPage', () => {
  it('lista as transações como card-row (não mais tabela)', async () => {
    listTransactionsMock.mockResolvedValue(paginated([TRANSACTION]))
    listCategoriesMock.mockResolvedValue({ items: [], meta: { page: 1, limit: 100, total: 0, totalPages: 0 } })
    listMinistriesMock.mockResolvedValue({ items: [] })

    renderPage()

    expect(await screen.findByText('Dízimos')).toBeInTheDocument()
    expect(screen.getByText('João da Silva')).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('exibe o estado vazio com botão de ação quando não há transações', async () => {
    listTransactionsMock.mockResolvedValue(paginated([]))
    listCategoriesMock.mockResolvedValue({ items: [], meta: { page: 1, limit: 100, total: 0, totalPages: 0 } })
    listMinistriesMock.mockResolvedValue({ items: [] })

    renderPage()

    expect(await screen.findByText('Nenhuma transação encontrada')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Adicionar transação' }).length).toBeGreaterThan(0)
  })

  it('exibe o estado de erro com botão de tentar novamente', async () => {
    listTransactionsMock.mockRejectedValue(new Error('falha de rede'))
    listCategoriesMock.mockResolvedValue({ items: [], meta: { page: 1, limit: 100, total: 0, totalPages: 0 } })
    listMinistriesMock.mockResolvedValue({ items: [] })

    renderPage()

    expect(await screen.findByText('Não foi possível carregar as transações.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Tentar novamente' })).toBeInTheDocument()
  })

  it('abre o menu do kebab e exclui a transação pelo ConfirmModal', async () => {
    const user = userEvent.setup()
    listTransactionsMock.mockResolvedValue(paginated([TRANSACTION]))
    listCategoriesMock.mockResolvedValue({ items: [], meta: { page: 1, limit: 100, total: 0, totalPages: 0 } })
    listMinistriesMock.mockResolvedValue({ items: [] })
    removeTransactionMock.mockResolvedValue(undefined)

    renderPage()

    expect(await screen.findByText('Dízimos')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /mais ações/i }))
    await user.click(await screen.findByRole('button', { name: 'Excluir' }))

    const dialog = await screen.findByRole('dialog', { name: 'Excluir transação' })
    await user.click(within(dialog).getByRole('button', { name: 'Excluir' }))

    await waitFor(() => {
      expect(removeTransactionMock).toHaveBeenCalledWith('tx-1')
    })
  })
})
