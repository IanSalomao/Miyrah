// Tabela de categorias — wiki/pages/page_categories.md.
// Colunas: Categoria (swatch + nome), Descrição, Tipo, Ações (Editar/Excluir).
import { Pencil, Tags, Trash2 } from 'lucide-react'
import {
  DataTable,
  type DataTableColumn,
  type DataTableRowAction,
} from '@/components/data-table/data-table'
import { Badge } from '@/components/ui/badge'
import type { Category, TransactionType } from '@/types'

const TYPE_LABELS: Record<TransactionType, string> = {
  income: 'Entrada',
  expense: 'Saída',
}

interface CategoryTableProps {
  categories: Category[]
  isLoading: boolean
  isError: boolean
  onRetry: () => void
  onAdd: () => void
  onEdit: (category: Category) => void
  onDelete: (category: Category) => void
}

export function CategoryTable({
  categories,
  isLoading,
  isError,
  onRetry,
  onAdd,
  onEdit,
  onDelete,
}: CategoryTableProps) {
  const columns: DataTableColumn<Category>[] = [
    {
      id: 'name',
      header: 'Categoria',
      cell: (category) => (
        <div className="flex items-center gap-2">
          <span
            className="size-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: category.color }}
            aria-hidden
          />
          <span className="font-medium">{category.name}</span>
        </div>
      ),
    },
    {
      id: 'description',
      header: 'Descrição',
      cell: (category) => (
        <span className="text-muted-foreground">{category.description ?? '—'}</span>
      ),
    },
    {
      id: 'type',
      header: 'Tipo',
      cell: (category) => (
        <Badge
          variant="outline"
          className={
            category.type === 'income'
              ? 'border-income/30 text-income'
              : 'border-expense/30 text-expense'
          }
        >
          {TYPE_LABELS[category.type]}
        </Badge>
      ),
    },
  ]

  const rowActions: DataTableRowAction<Category>[] = [
    {
      label: 'Editar',
      icon: Pencil,
      onClick: (category) => onEdit(category),
    },
    {
      label: 'Excluir',
      icon: Trash2,
      variant: 'destructive',
      onClick: (category) => onDelete(category),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={categories}
      getRowId={(category) => category.id}
      isLoading={isLoading}
      error={isError ? 'Não foi possível carregar as categorias.' : null}
      onRetry={onRetry}
      rowActions={rowActions}
      emptyState={{
        icon: Tags,
        title: 'Nenhuma categoria encontrada',
        actionLabel: 'Adicionar categoria',
        onAction: onAdd,
      }}
    />
  )
}
