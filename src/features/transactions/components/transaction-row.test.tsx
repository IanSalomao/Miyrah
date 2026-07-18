import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TransactionRow } from './transaction-row'
import type { Transaction } from '@/types'

// Normaliza espaços (Intl usa NBSP/narrow-NBSP entre "R$" e o número).
const norm = (s: string) => s.replace(/\s/g, ' ')

function buildTransaction(overrides: Partial<Transaction> = {}): Transaction {
  return {
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
    ...overrides,
  }
}

describe('TransactionRow', () => {
  it('exibe categoria, descrição, membro, data/hora e valor com sinal explícito', () => {
    render(<TransactionRow transaction={buildTransaction()} onEdit={vi.fn()} onDelete={vi.fn()} />)

    expect(screen.getByText('Dízimos')).toBeInTheDocument()
    expect(screen.getByText('Dízimo de julho')).toBeInTheDocument()
    expect(screen.getByText('João da Silva')).toBeInTheDocument()
    expect(screen.getByText('10/07/2026')).toBeInTheDocument()
    expect(screen.getByText(/^\d{2}:\d{2}$/)).toBeInTheDocument()
    expect(screen.getByText((_, el) => norm(el?.textContent ?? '') === '+R$ 500,00')).toBeInTheDocument()
  })

  it('formata saída com o sinal de subtração e cor de despesa', () => {
    render(
      <TransactionRow
        transaction={buildTransaction({
          value: -120,
          category: { id: 'cat-2', name: 'Manutenção', color: '#B5443A', deleted: false },
          member: null,
        })}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    )

    const amount = screen.getByText((_, el) => norm(el?.textContent ?? '') === '−R$ 120,00')
    expect(amount).toHaveClass('text-expense')
  })

  it('mostra ministério com ícone quando não há membro vinculado', () => {
    render(
      <TransactionRow
        transaction={buildTransaction({
          member: null,
          ministry: { id: 'min-1', name: 'Ministério de Louvor', deleted: false },
        })}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    )

    expect(screen.getByText('Ministério de Louvor')).toBeInTheDocument()
  })

  it('indica categoria e membro excluídos sem perder o nome', () => {
    render(
      <TransactionRow
        transaction={buildTransaction({
          category: { id: 'cat-3', name: 'Categoria antiga', color: '#1472E6', deleted: true },
          member: { id: 'mem-2', name: 'Maria Souza', deleted: true },
        })}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    )

    expect(screen.getByText(/Categoria antiga/)).toHaveTextContent('Categoria antiga (excluído)')
    expect(screen.getByText(/Maria Souza/)).toHaveTextContent('Maria Souza (excluído)')
  })

  it('abre o menu de ações no kebab e aciona editar/excluir', async () => {
    const user = userEvent.setup()
    const onEdit = vi.fn()
    const onDelete = vi.fn()
    const transaction = buildTransaction()

    render(<TransactionRow transaction={transaction} onEdit={onEdit} onDelete={onDelete} />)

    await user.click(screen.getByRole('button', { name: /mais ações/i }))
    await user.click(await screen.findByRole('button', { name: 'Editar' }))
    expect(onEdit).toHaveBeenCalledWith(transaction)

    await user.click(screen.getByRole('button', { name: /mais ações/i }))
    await user.click(await screen.findByRole('button', { name: 'Excluir' }))
    expect(onDelete).toHaveBeenCalledWith(transaction)
  })
})
