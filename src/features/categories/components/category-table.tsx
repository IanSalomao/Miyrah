// Tabela de categorias — wiki/pages/page_categories.md.
// Colunas: Categoria (swatch + nome), Descrição, Tipo, Ações (Editar/Excluir).
import { Pencil, Tags, Trash2 } from 'lucide-react'
import { DataTable, type DataTableColumn } from '@/components/data-table/data-table'
import { Button } from '@/components/ui/button'
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
      key: 'name',
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
      key: 'description',
      header: 'Descrição',
      cell: (category) => (
        <span className="text-muted-foreground">{category.description ?? '—'}</span>
      ),
    },
    {
      key: 'type',
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
    {
      key: 'actions',
      header: 'Ações',
      align: 'right',
      cell: (category) => (
        <div className="flex justify-end gap-1 opacity-0 transition-opacity group-hover/row:opacity-100">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Editar ${category.name}`}
            onClick={() => onEdit(category)}
          >
            <Pencil className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Excluir ${category.name}`}
            onClick={() => onDelete(category)}
          >
            <Trash2 className="size-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={categories}
      getRowId={(category) => category.id}
      isLoading={isLoading}
      isError={isError}
      onRetry={onRetry}
      emptyMessage="Nenhuma categoria encontrada"
      emptyAction={
        <Button type="button" onClick={onAdd}>
          <Tags className="size-4" />
          Adicionar categoria
        </Button>
      }
    />
  )
}
