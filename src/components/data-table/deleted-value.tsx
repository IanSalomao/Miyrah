import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface DeletedValueProps {
  children: ReactNode
  className?: string
}

/**
 * Indicação visual de "excluído" para nomes de registros relacionados
 * (ex.: membro) que sofreram soft delete mas continuam referenciados em
 * registros antigos (ver component_data_table, estado "Linha — vínculo excluído",
 * e component_avatar, estado "Vínculo excluído").
 */
export function DeletedValue({ children, className }: DeletedValueProps) {
  return (
    <span className={cn('italic text-muted-foreground', className)}>
      {children}
      <span className="ml-1 text-xs not-italic">(excluído)</span>
    </span>
  )
}
