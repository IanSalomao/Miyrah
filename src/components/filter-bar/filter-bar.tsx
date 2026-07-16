// component_filter_bar — wiki/components/component_filter_bar.md
// Container da barra de filtros. Cada página compõe só os controles que fizerem
// sentido para ela (ver primitivos neste diretório: period-filter, type-filter,
// category-filter, ministry-filter).

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface FilterBarProps {
  children: ReactNode
  className?: string
}

export function FilterBar({ children, className }: FilterBarProps) {
  return (
    <div
      role="toolbar"
      aria-label="Filtros"
      className={cn(
        'flex flex-wrap items-center gap-3 rounded-md border border-border bg-card p-3 shadow-xs',
        className,
      )}
    >
      {children}
    </div>
  )
}
