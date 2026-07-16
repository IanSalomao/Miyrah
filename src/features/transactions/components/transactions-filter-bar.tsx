// Filtros da tela Transações — component_filter_bar (busca, período,
// categoria, tipo). Ver wiki/pages/page_transactions.md.
//
// Nota: a spec de página pede categoria como "seleção múltipla", mas
// `GET /v1/transactions` (wiki/api/transactions.md) só documenta um
// `categoryId` (uuid) singular — sem suporte a múltiplos valores. Optamos por
// um seletor de categoria único (respeitando o contrato real da API) em vez
// de inventar um parâmetro não documentado. Decisão registrada para revisão.

import { FilterBar, SearchFilter, TypeFilter } from '@/components/filter-bar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Category } from '@/types'
import type { TransactionsFilters } from '../hooks/use-transactions-query'

interface TransactionsFilterBarProps {
  filters: TransactionsFilters
  onFiltersChange: (patch: Partial<TransactionsFilters>) => void
  categories: Category[]
  onAddTransaction: () => void
}

export function TransactionsFilterBar({
  filters,
  onFiltersChange,
  categories,
  onAddTransaction,
}: TransactionsFilterBarProps) {
  return (
    <FilterBar>
      <SearchFilter
        value={filters.search}
        onChange={(value) => onFiltersChange({ search: value, page: 1 })}
        placeholder="Buscar por descrição..."
      />

      <div className="flex items-center gap-1.5">
        <Input
          type="date"
          aria-label="Data inicial"
          className="w-36"
          value={filters.dateFrom}
          onChange={(event) => onFiltersChange({ dateFrom: event.target.value, page: 1 })}
        />
        <span className="text-sm text-muted-foreground">até</span>
        <Input
          type="date"
          aria-label="Data final"
          className="w-36"
          value={filters.dateTo}
          onChange={(event) => onFiltersChange({ dateTo: event.target.value, page: 1 })}
        />
      </div>

      <Select
        value={filters.categoryId || 'all'}
        onValueChange={(value) =>
          onFiltersChange({ categoryId: value === 'all' ? '' : value, page: 1 })
        }
      >
        <SelectTrigger aria-label="Filtrar por categoria">
          <SelectValue placeholder="Categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as categorias</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              <span
                aria-hidden="true"
                className="inline-block size-2.5 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <TypeFilter
        value={filters.type}
        onChange={(value) => onFiltersChange({ type: value, page: 1 })}
      />

      <Button type="button" className="ml-auto" onClick={onAddTransaction}>
        Adicionar transação
      </Button>
    </FilterBar>
  )
}
