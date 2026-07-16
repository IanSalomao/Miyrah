// Filtro de tipo (segmented control) do component_filter_bar — Todas/Entradas/Saídas.

import { cn } from '@/lib/utils'
import type { DashboardType } from '@/types'

const OPTIONS: { value: DashboardType; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'income', label: 'Entradas' },
  { value: 'expense', label: 'Saídas' },
]

interface TypeFilterProps {
  value: DashboardType
  onChange: (value: DashboardType) => void
}

export function TypeFilter({ value, onChange }: TypeFilterProps) {
  return (
    <div
      role="group"
      aria-label="Tipo"
      className="flex items-center gap-0.5 rounded-md border border-border p-0.5"
    >
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'rounded-sm px-2.5 py-1 text-sm transition-colors',
            value === option.value
              ? 'bg-primary text-primary-foreground'
              : 'text-foreground hover:bg-muted',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
