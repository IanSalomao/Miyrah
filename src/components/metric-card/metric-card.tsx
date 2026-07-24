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
  /**
   * Sub-indicador de variação percentual (seta ↑/↓, verde/vermelho) — ex.: card
   * "Saldo no fim do período" com o `percentChange` de `balance-variation`.
   * Omitido = sem indicador. `null` = estado neutro (sem base de comparação, ex.:
   * saldo inicial 0).
   */
  percentChange?: number | null
  className?: string
}

function PercentChangeIndicator({ percentChange }: { percentChange: number | null }) {
  if (percentChange === null) {
    return (
      <p className="mt-1 text-xs text-muted-foreground">
        <span aria-hidden="true">—</span>
        <span className="sr-only">sem base de comparação</span>
      </p>
    )
  }

  const arrow = percentChange >= 0 ? '↑' : '↓'
  const percent = Math.abs(percentChange).toFixed(1).replace('.', ',')
  const colorClass = percentChange >= 0 ? 'text-income' : 'text-expense'

  return (
    <p className={cn('mt-1 text-xs font-medium', colorClass)}>
      {arrow} {percent}%
    </p>
  )
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

function getColorClass(variant: MetricCardVariant): string {
  switch (variant) {
    case 'income':
      return 'text-income'
    case 'expense':
      return 'text-expense'
    case 'balance':
      // Saldo destacado em Azul (token primary) por decisão de produto.
      // Nota: diverge do design_system ("Azul nunca é cor de dinheiro"); o sinal +/− continua explícito.
      return 'text-primary'
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
  percentChange,
  className,
}: MetricCardProps) {
  const colorClass = getColorClass(variant)
  const displayValue =
    variant === 'neutral'
      ? (formatValue ?? integerFormatter.format.bind(integerFormatter))(value)
      : formatSignedCurrency(getSignedValue(variant, value))

  return (
    <div className={cn('rounded-lg border border-border bg-card p-6 shadow-sm', className)}>
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</p>
      {loading ? (
        <Skeleton className="mt-2 h-8 w-28" aria-label={`${label} — carregando`} />
      ) : (
        <>
          <p className={cn('mt-2 font-black text-2xl leading-none tabular-nums', colorClass)}>
            {displayValue}
          </p>
          {percentChange !== undefined ? (
            <PercentChangeIndicator percentChange={percentChange} />
          ) : null}
        </>
      )}
    </div>
  )
}
