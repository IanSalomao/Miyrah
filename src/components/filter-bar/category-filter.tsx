// Filtro de categoria (seleção múltipla) do component_filter_bar, com swatch de cor.
// Aviso do design system: a cor da categoria é dado do usuário, não token.

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import type { Category } from '@/types'

interface CategoryFilterProps {
  categories: Category[]
  selectedIds: string[]
  onChange: (ids: string[]) => void
}

export function CategoryFilter({ categories, selectedIds, onChange }: CategoryFilterProps) {
  const [open, setOpen] = useState(false)
  const isActive = selectedIds.length > 0

  function toggle(id: string) {
    onChange(
      selectedIds.includes(id) ? selectedIds.filter((item) => item !== id) : [...selectedIds, id],
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn('gap-1.5', isActive && 'border-primary text-primary')}
        >
          Categoria{isActive ? ` (${selectedIds.length})` : ''}
          <ChevronDown className="size-4" aria-hidden />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-64">
        {categories.length === 0 ? (
          <p className="px-1 py-2 text-sm text-muted-foreground">Nenhuma categoria cadastrada.</p>
        ) : (
          <ul className="flex max-h-64 flex-col gap-0.5 overflow-y-auto">
            {categories.map((category) => (
              <li key={category.id}>
                <label className="flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1.5 text-sm hover:bg-muted">
                  <Checkbox
                    checked={selectedIds.includes(category.id)}
                    onCheckedChange={() => toggle(category.id)}
                  />
                  <span
                    aria-hidden
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="truncate">{category.name}</span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  )
}
