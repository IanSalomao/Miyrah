import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Trash2 } from 'lucide-react'
import { DataTable, type DataTableColumn } from './data-table'
import { DeletedValue } from './deleted-value'

interface Row {
  id: string
  name: string
  amount: number
  memberDeleted?: boolean
}

const rows: Row[] = [
  { id: '1', name: 'Dízimo', amount: 500 },
  { id: '2', name: 'Aluguel', amount: -1200 },
]

const columns: DataTableColumn<Row>[] = [
  {
    id: 'name',
    header: 'Descrição',
    cell: (row) => (row.memberDeleted ? <DeletedValue>{row.name}</DeletedValue> : row.name),
  },
  {
    id: 'amount',
    header: 'Valor',
    numeric: true,
    cell: (row) => String(row.amount),
  },
]

describe('DataTable', () => {
  it('renderiza as linhas a partir dos dados', () => {
    render(
      <DataTable
        columns={columns}
        data={rows}
        getRowId={(row) => row.id}
        emptyState={{ title: 'Nenhum item encontrado' }}
      />,
    )
    expect(screen.getByText('Dízimo')).toBeInTheDocument()
    expect(screen.getByText('Aluguel')).toBeInTheDocument()
    expect(screen.getByText('500')).toBeInTheDocument()
  })

  it('exibe linhas em skeleton no estado de loading', () => {
    const { container } = render(
      <DataTable
        columns={columns}
        data={[]}
        getRowId={(row) => row.id}
        isLoading
        emptyState={{ title: 'Nenhum item encontrado' }}
      />,
    )
    expect(container.querySelectorAll('[data-slot="skeleton"]').length).toBeGreaterThan(0)
    expect(screen.queryByText('Nenhum item encontrado')).not.toBeInTheDocument()
  })

  it('exibe o estado vazio com botão de ação principal', async () => {
    const user = userEvent.setup()
    const onAction = vi.fn()
    render(
      <DataTable
        columns={columns}
        data={[]}
        getRowId={(row) => row.id}
        emptyState={{
          title: 'Nenhuma transação encontrada',
          actionLabel: 'Adicionar transação',
          onAction,
        }}
      />,
    )
    expect(screen.getByText('Nenhuma transação encontrada')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Adicionar transação' }))
    expect(onAction).toHaveBeenCalledOnce()
  })

  it('exibe o estado de erro com "Tentar novamente"', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()
    render(
      <DataTable
        columns={columns}
        data={[]}
        getRowId={(row) => row.id}
        error="Não foi possível carregar os dados."
        onRetry={onRetry}
        emptyState={{ title: 'Nenhum item encontrado' }}
      />,
    )
    expect(screen.getByText('Não foi possível carregar os dados.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }))
    expect(onRetry).toHaveBeenCalledOnce()
  })

  it('aplica o estilo de "excluído" numa célula de registro relacionado', () => {
    render(
      <DataTable
        columns={columns}
        data={[{ id: '3', name: 'Fulano de Tal', amount: 100, memberDeleted: true }]}
        getRowId={(row) => row.id}
        emptyState={{ title: 'Nenhum item encontrado' }}
      />,
    )
    const cell = screen.getByText('Fulano de Tal')
    expect(cell.className).toContain('italic')
    expect(cell.className).toContain('text-muted-foreground')
    expect(screen.getByText('(excluído)')).toBeInTheDocument()
  })

  it('embute a paginação e propaga a interação de onPageChange', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(
      <DataTable
        columns={columns}
        data={rows}
        getRowId={(row) => row.id}
        emptyState={{ title: 'Nenhum item encontrado' }}
        pagination={{ page: 1, limit: 20, total: 40, totalPages: 2, onPageChange }}
      />,
    )
    await user.click(screen.getByRole('button', { name: /próxima página/i }))
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('revela ações de linha (Editar/Excluir) por linha', () => {
    render(
      <DataTable
        columns={columns}
        data={rows}
        getRowId={(row) => row.id}
        emptyState={{ title: 'Nenhum item encontrado' }}
        rowActions={[{ label: 'Excluir', icon: Trash2, onClick: vi.fn(), variant: 'destructive' }]}
      />,
    )
    expect(screen.getAllByRole('button', { name: 'Excluir' })).toHaveLength(rows.length)
  })
})
