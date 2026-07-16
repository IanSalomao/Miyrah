// Card de métrica (rótulo + valor), usado em blocos no topo de páginas de análise financeira.
// Ver wiki/components/component_metric_card.md e wiki/design_system.md.
import { Skeleton } from '@/components/ui/skeleton'
import { formatSignedCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'

export type MetricCardVariant = 'income' | 'expense' | 'balance' | 'neutral'

export interface MetricCardProps {
  label: string
  /**
   * Valor da métrica. Para `income`/`expense`, informe a magnitude (positiva) —
   * o sinal exibido (+ / −) é decidido pela variante, nunca pelo sinal bruto do dado
   * (ver DashboardSummary.income/expense: sempre magnitudes positivas).
   * Para `balance`, informe o saldo líquido (pode ser negativo).
   * Para `neutral`, informe a contagem (sem sinal, sem cifrão).
   */
  value: number
  variant: MetricCardVariant
  /** Skeleton no lugar do valor, enquanto o filtro/busca associado está sendo aplicado. */
  loading?: boolean
  /**
   * Override de formatação para a variante `neutral` (ex.: "Ticket médio" em moeda,
   * em vez do formato inteiro padrão de contagem). Sem efeito nas demais variantes,
   * que sempre usam moeda com sinal.
   */
  formatValue?: (value: number) => string
  className?: string
}

const integerFormatter = new Intl.NumberFormat('pt-BR')

function getSignedValue(variant: MetricCardVariant, value: number): number {
  switch (variant) {
    case 'income':
      return Math.abs(value)
    case 'expense':
      return -Math.abs(value)
    case 'balance':
    case 'neutral':
      return value
  }
}

function getColorClass(variant: MetricCardVariant, value: number): string {
  switch (variant) {
    case 'income':
      return 'text-income'
    case 'expense':
      return 'text-expense'
    case 'balance':
      return value < 0 ? 'text-expense' : 'text-income'
    case 'neutral':
      return 'text-foreground'
  }
}

export function MetricCard({
  label,
  value,
  variant,
  loading = false,
  formatValue,
  className,
}: MetricCardProps) {
  const colorClass = getColorClass(variant, value)
  const displayValue =
    variant === 'neutral'
      ? (formatValue ?? integerFormatter.format.bind(integerFormatter))(value)
      : formatSignedCurrency(getSignedValue(variant, value))

  return (
    <div className={cn('rounded-lg border border-border bg-card p-4 shadow-sm', className)}>
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</p>
      {loading ? (
        <Skeleton className="mt-2 h-8 w-28" aria-label={`${label} — carregando`} />
      ) : (
        <p
          className={cn(
            'mt-2 font-mono text-2xl leading-none font-semibold tabular-nums',
            colorClass,
          )}
        >
          {displayValue}
        </p>
      )}
    </div>
  )
}
