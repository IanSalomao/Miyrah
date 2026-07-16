import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Pagination } from './pagination'

describe('Pagination', () => {
  it('exibe a página atual e o total de páginas', () => {
    render(<Pagination page={2} limit={20} total={45} totalPages={3} onPageChange={vi.fn()} />)
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('desabilita "Anterior" na primeira página', () => {
    render(<Pagination page={1} limit={20} total={45} totalPages={3} onPageChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: /anterior/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /próxima página/i })).toBeEnabled()
  })

  it('desabilita "Próximo" na última página', () => {
    render(<Pagination page={3} limit={20} total={45} totalPages={3} onPageChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: /página anterior/i })).toBeEnabled()
    expect(screen.getByRole('button', { name: /próxima página/i })).toBeDisabled()
  })

  it('chama onPageChange com a página seguinte/anterior ao clicar', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(<Pagination page={2} limit={20} total={45} totalPages={3} onPageChange={onPageChange} />)

    await user.click(screen.getByRole('button', { name: /próxima página/i }))
    expect(onPageChange).toHaveBeenCalledWith(3)

    await user.click(screen.getByRole('button', { name: /página anterior/i }))
    expect(onPageChange).toHaveBeenCalledWith(1)
  })

  it('sem onLimitChange, mostra a contagem total em vez do seletor', () => {
    render(<Pagination page={1} limit={20} total={1} totalPages={1} onPageChange={vi.fn()} />)
    expect(screen.getByText('1 registro')).toBeInTheDocument()
  })
})
