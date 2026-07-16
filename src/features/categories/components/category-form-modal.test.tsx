import { describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CategoryFormModal } from './category-form-modal'
import type { Category } from '@/types'

const { createCategory, updateCategory } = vi.hoisted(() => ({
  createCategory: vi.fn(),
  updateCategory: vi.fn(),
}))

vi.mock('@/services', () => ({
  createCategory,
  updateCategory,
  removeCategory: vi.fn(),
  listCategories: vi.fn(),
}))

function renderWithClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)
}

const category: Category = {
  id: 'cat-1',
  name: 'Dízimo',
  description: 'Contribuição mensal',
  type: 'income',
  color: '#1E7A46',
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
}

describe('CategoryFormModal — imutabilidade do tipo', () => {
  it('desabilita o campo Tipo no modo edição', () => {
    renderWithClient(
      <CategoryFormModal open onOpenChange={() => {}} category={category} defaultType="income" />,
    )

    expect(screen.getByRole('combobox')).toBeDisabled()
  })

  it('não desabilita o campo Tipo no modo criação', () => {
    renderWithClient(
      <CategoryFormModal open onOpenChange={() => {}} category={null} defaultType="income" />,
    )

    expect(screen.getByRole('combobox')).toBeEnabled()
  })

  it('envia o payload de edição sem o campo type', async () => {
    updateCategory.mockResolvedValueOnce({ ...category, name: 'Dízimo mensal' })
    const user = userEvent.setup()

    renderWithClient(
      <CategoryFormModal open onOpenChange={() => {}} category={category} defaultType="income" />,
    )

    const nameInput = screen.getByLabelText('Nome')
    await user.clear(nameInput)
    await user.type(nameInput, 'Dízimo mensal')
    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    await waitFor(() => expect(updateCategory).toHaveBeenCalledTimes(1))
    const [id, payload] = updateCategory.mock.calls[0]
    expect(id).toBe('cat-1')
    expect(payload).toEqual({
      name: 'Dízimo mensal',
      description: 'Contribuição mensal',
      color: '#1E7A46',
    })
    expect(payload).not.toHaveProperty('type')
  })

  it('ao criar, envia o type da aba ativa', async () => {
    createCategory.mockResolvedValueOnce({ ...category, id: 'cat-2', type: 'expense' })
    const user = userEvent.setup()

    renderWithClient(
      <CategoryFormModal open onOpenChange={() => {}} category={null} defaultType="expense" />,
    )

    await user.type(screen.getByLabelText('Nome'), 'Aluguel')
    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    await waitFor(() => expect(createCategory).toHaveBeenCalledTimes(1))
    expect(createCategory.mock.calls[0][0]).toMatchObject({ name: 'Aluguel', type: 'expense' })
  })
})
