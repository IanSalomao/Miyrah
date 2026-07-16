// Célula de valor monetário — sempre `font-mono`, alinhado à direita, cor
// semântica (Entradas/Saídas) e sinal explícito (design_system.md).

import { formatSignedCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'

export function TransactionAmountCell({ value }: { value: number }) {
  return (
    <span className={cn('font-mono tabular-nums', value < 0 ? 'text-expense' : 'text-income')}>
      {formatSignedCurrency(value)}
    </span>
  )
}
