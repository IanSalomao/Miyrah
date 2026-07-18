import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TransactionFormModal } from './transaction-form-modal'
import { listCategories, listMembers, listMinistries } from '@/services'
import { ApiError } from '@/lib/api-client'
import type { Transaction } from '@/types'

// jsdom não implementa `hasPointerCapture`/`scrollIntoView` — necessários
// pelo Radix Select (campo Categoria/Ministério) durante a interação de abrir
// o dropdown e clicar numa opção.
beforeAll(() => {
  Element.prototype.hasPointerCapture = Element.prototype.hasPointerCapture ?? (() => false)
  Element.prototype.scrollIntoView = Element.prototype.scrollIntoView ?? (() => {})
})

const { createTransaction, updateTransaction } = vi.hoisted(() => ({
  createTransaction: vi.fn(),
  updateTransaction: vi.fn(),
}))

vi.mock('@/services', () => ({
  listCategories: vi.fn(),
  listMinistries: vi.fn(),
  listMembers: vi.fn(),
  createTransaction,
  updateTransaction,
}))

const mockedListCategories = vi.mocked(listCategories)
const mockedListMinistries = vi.mocked(listMinistries)
const mockedListMembers = vi.mocked(listMembers)

beforeEach(() => {
  vi.resetAllMocks()
})

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

const editingTransaction: Transaction = {
  id: 'txn-1',
  type: 'income',
  value: 500,
  date: '2026-07-01',
  description: 'Dízimo do mês',
  category: { id: 'cat-income', name: 'Dízimo', color: '#22C55E', deleted: false },
  member: null,
  ministry: null,
  createdAt: '2026-07-01T00:00:00Z',
  updatedAt: '2026-07-01T00:00:00Z',
}

function mockDefaultData() {
  mockedListMinistries.mockResolvedValue({ items: [] })
  mockedListMembers.mockResolvedValue({
    items: [],
    meta: { page: 1, limit: 20, total: 0, totalPages: 0 },
  })
}

function renderModal({
  open = true,
  onOpenChange = vi.fn(),
  transaction = null,
}: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  transaction?: Transaction | null
} = {}) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  render(
    <QueryClientProvider client={queryClient}>
      <TransactionFormModal open={open} onOpenChange={onOpenChange} transaction={transaction} />
    </QueryClientProvider>,
  )
  return { onOpenChange }
}

async function selectCategory(
  user: ReturnType<typeof userEvent.setup>,
  comboIndex: number,
  name: string,
) {
  const combos = screen.getAllByRole('combobox', { name: 'Categoria' })
  await user.click(combos[comboIndex])
  const option = await screen.findByRole('option', { name })
  await user.click(option)
}

describe('TransactionFormModal — dropdown de categoria filtrado pelo tipo', () => {
  it('busca categorias do tipo income por padrão (criação começa como Entrada)', async () => {
    mockedListCategories.mockResolvedValue({
      items: incomeCategories,
      meta: { page: 1, limit: 100, total: 1, totalPages: 1 },
    })
    mockDefaultData()

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
    mockDefaultData()

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

describe('TransactionFormModal — modo edição (sem encadeamento)', () => {
  it('continua funcionando com um único card, sem Adicionar/Duplicar', async () => {
    const user = userEvent.setup()
    mockedListCategories.mockResolvedValue({
      items: incomeCategories,
      meta: { page: 1, limit: 100, total: 1, totalPages: 1 },
    })
    mockDefaultData()
    updateTransaction.mockResolvedValue({ ...editingTransaction, description: 'Ajustado' })

    const { onOpenChange } = renderModal({ transaction: editingTransaction })

    expect(screen.queryByRole('button', { name: /adicionar/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /duplicar/i })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Editar transação' })).toBeInTheDocument()

    const description = screen.getByLabelText('Descrição')
    await user.clear(description)
    await user.type(description, 'Ajustado')

    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    await waitFor(() => expect(updateTransaction).toHaveBeenCalledTimes(1))
    expect(updateTransaction).toHaveBeenCalledWith(
      'txn-1',
      expect.objectContaining({ description: 'Ajustado' }),
    )
    expect(onOpenChange).toHaveBeenCalledWith(false)
    expect(createTransaction).not.toHaveBeenCalled()
  })
})

describe('TransactionFormModal — modo criação com lançamentos encadeados', () => {
  it('dispara uma chamada de criação por card ao submeter em lote', async () => {
    const user = userEvent.setup()
    mockedListCategories.mockResolvedValue({
      items: incomeCategories,
      meta: { page: 1, limit: 100, total: 1, totalPages: 1 },
    })
    mockDefaultData()
    createTransaction.mockResolvedValue({ ...editingTransaction, id: 'new-id' })

    const { onOpenChange } = renderModal()

    expect(screen.getByText('Lançamento #1')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Salvar 1 transação' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /adicionar/i }))

    expect(screen.getByText('Lançamento #2')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Salvar 2 transações' })).toBeInTheDocument()

    await selectCategory(user, 0, 'Dízimo')
    await selectCategory(user, 1, 'Dízimo')

    const valueInputs = screen.getAllByLabelText('Valor')
    await user.clear(valueInputs[0])
    await user.type(valueInputs[0], '100')
    await user.clear(valueInputs[1])
    await user.type(valueInputs[1], '200')

    await user.click(screen.getByRole('button', { name: 'Salvar 2 transações' }))

    await waitFor(() => expect(createTransaction).toHaveBeenCalledTimes(2))
    expect(createTransaction).toHaveBeenNthCalledWith(1, expect.objectContaining({ value: 100 }))
    expect(createTransaction).toHaveBeenNthCalledWith(2, expect.objectContaining({ value: 200 }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('bloqueia o submit quando algum card é inválido (categoria não selecionada)', async () => {
    const user = userEvent.setup()
    mockedListCategories.mockResolvedValue({
      items: incomeCategories,
      meta: { page: 1, limit: 100, total: 1, totalPages: 1 },
    })
    mockDefaultData()

    renderModal()

    const valueInput = screen.getByLabelText('Valor')
    await user.clear(valueInput)
    await user.type(valueInput, '100')

    await user.click(screen.getByRole('button', { name: 'Salvar 1 transação' }))

    expect(await screen.findByText('Selecione uma categoria.')).toBeInTheDocument()
    expect(createTransaction).not.toHaveBeenCalled()
  })

  it('em sucesso parcial, mantém no drawer só os cards com falha, preservando os dados digitados', async () => {
    const user = userEvent.setup()
    mockedListCategories.mockResolvedValue({
      items: incomeCategories,
      meta: { page: 1, limit: 100, total: 1, totalPages: 1 },
    })
    mockDefaultData()
    createTransaction
      .mockResolvedValueOnce({ ...editingTransaction, id: 'ok-id' })
      .mockRejectedValueOnce(
        new ApiError(
          {
            code: 'VALIDATION_ERROR',
            message: 'O valor deve ser maior que zero.',
            details: [{ field: 'value', message: 'O valor deve ser maior que zero.' }],
          },
          400,
        ),
      )

    const { onOpenChange } = renderModal()

    await user.click(screen.getByRole('button', { name: /adicionar/i }))

    await selectCategory(user, 0, 'Dízimo')
    await selectCategory(user, 1, 'Dízimo')

    const valueInputs = screen.getAllByLabelText('Valor')
    await user.clear(valueInputs[0])
    await user.type(valueInputs[0], '100')
    await user.clear(valueInputs[1])
    await user.type(valueInputs[1], '200')

    await user.type(screen.getAllByLabelText('Descrição')[1], 'Card que falhou')

    await user.click(screen.getByRole('button', { name: 'Salvar 2 transações' }))

    await waitFor(() => expect(createTransaction).toHaveBeenCalledTimes(2))

    // Não fecha o drawer em sucesso parcial.
    expect(onOpenChange).not.toHaveBeenCalledWith(false)

    // Só sobra o card que falhou, com o dado já digitado preservado.
    await waitFor(() => {
      expect(screen.queryByText('Lançamento #2')).not.toBeInTheDocument()
    })
    expect(screen.getByText('Lançamento #1')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Salvar 1 transação' })).toBeInTheDocument()
    expect(screen.getByLabelText('Descrição')).toHaveValue('Card que falhou')
    expect(screen.getByText('O valor deve ser maior que zero.')).toBeInTheDocument()
  })
})
