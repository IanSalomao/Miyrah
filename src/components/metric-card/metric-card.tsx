// Card de métrica (rótulo + valor + valor secundário), usado em blocos no topo de
// páginas de análise financeira. Ver wiki/components/component_metric_card.md e
// wiki/design_system.md.
import type { ReactNode } from 'react'
import { Info } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { formatSignedCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'

export type MetricCardVariant = 'income' | 'expense' | 'balance' | 'neutral' | 'periodBalance'

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
   * saldo inicial 0). Tem prioridade sobre `secondary`.
   */
  percentChange?: number | null
  /**
   * Terceira linha auxiliar (ex.: "4 transações"), quando não há variação percentual.
   * Ignorado quando `percentChange` está definido.
   */
  secondary?: string
  /**
   * Ícone exibido no círculo à direita do card. Omitido = card sem círculo.
   * O container aplica tamanho, cor e formato — passe apenas o glifo (ex.: `<TrendingUp />`).
   */
  icon?: ReactNode
  /** Override do fundo/cor do círculo do ícone (padrão: derivado da variante). */
  iconClassName?: string
  /**
   * Texto explicativo (o que a métrica representa e como é calculada), exibido em
   * tooltip ao passar o mouse no ícone de informação no canto superior direito.
   * Omitido = sem ícone de informação.
   */
  info?: string
  className?: string
}

function PercentChangeIndicator({ percentChange }: { percentChange: number | null }) {
  if (percentChange === null) {
    return (
      <p className="mt-1.5 text-xs text-muted-foreground">
        <span aria-hidden="true">—</span>
        <span className="sr-only">sem base de comparação</span>
      </p>
    )
  }

  const arrow = percentChange >= 0 ? '↑' : '↓'
  const percent = Math.abs(percentChange).toFixed(1).replace('.', ',')
  const colorClass = percentChange >= 0 ? 'text-income' : 'text-expense'

  return (
    <p className={cn('mt-1.5 text-xs font-medium', colorClass)}>
      {arrow} {percent}%
    </p>
  )
}

const integerFormatter = new Intl.NumberFormat('pt-BR')

/**
 * Como cada variante deriva o sinal do valor (regra de negócio, não escolha do
 * call site): `income`/`expense` chegam como magnitude e recebem o sinal fixo da
 * semântica; `raw` respeita o sinal natural do número (saldo pode ser negativo).
 */
type SignRule = 'positive' | 'negative' | 'raw'

/** Como o valor é formatado: moeda com sinal explícito ou contagem inteira. */
type ValueFormat = 'currency' | 'count'

interface VariantStyle {
  /** Cor do valor principal (token semântico — nunca livre no call site). */
  valueColor: string
  /** Fundo + traço do círculo do ícone (tint suave da cor semântica). */
  iconAccent: string
  sign: SignRule
  format: ValueFormat
}

/**
 * Fonte única de verdade do mapeamento variante → aparência. Concentra aqui as
 * invariantes do design_system (Entradas verde/`+`, Saídas vermelho/`−`, valor
 * sempre em cor semântica, "a cor nunca é a única pista") em vez de espalhá-las
 * por vários `switch`. Adicionar uma variante = adicionar uma linha.
 */
const VARIANT_STYLES: Record<MetricCardVariant, VariantStyle> = {
  income: {
    valueColor: 'text-income',
    iconAccent: 'bg-income/12 text-income',
    sign: 'positive',
    format: 'currency',
  },
  expense: {
    valueColor: 'text-expense',
    iconAccent: 'bg-expense/12 text-expense',
    sign: 'negative',
    format: 'currency',
  },
  balance: {
    valueColor: 'text-primary',
    iconAccent: 'bg-primary/12 text-primary',
    sign: 'raw',
    format: 'currency',
  },
  neutral: {
    valueColor: 'text-foreground',
    iconAccent: 'bg-muted text-muted-foreground',
    sign: 'raw',
    format: 'count',
  },
  periodBalance: {
    valueColor: 'text-primary',
    iconAccent: 'bg-primary/12 text-primary',
    sign: 'raw',
    format: 'currency',
  }
}

function applySign(sign: SignRule, value: number): number {
  switch (sign) {
    case 'positive':
      return Math.abs(value)
    case 'negative':
      return -Math.abs(value)
    case 'raw':
      return value
  }
}

export function MetricCard({
  label,
  value,
  variant,
  loading = false,
  formatValue,
  percentChange,
  secondary,
  icon,
  iconClassName,
  info,
  className,
}: MetricCardProps) {
  const style = VARIANT_STYLES[variant]
  const displayValue =
    style.format === 'count'
      ? (formatValue ?? integerFormatter.format.bind(integerFormatter))(value)
      : formatSignedCurrency(applySign(style.sign, value))

  return (
    <div
      className={cn(
        'relative flex items-center gap-4 rounded-lg border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md',
        className,
      )}
    >
      {info ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              aria-label={`Sobre ${label}`}
              className="absolute top-3 right-3 rounded-full p-0.5 text-muted-foreground/70 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <Info className="size-4" aria-hidden="true" />
            </button>
          </TooltipTrigger>
          <TooltipContent>{info}</TooltipContent>
        </Tooltip>
      ) : null}

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</p>
        {loading ? (
          <Skeleton className="mt-2 h-8 w-28" aria-label={`${label} — carregando`} />
        ) : (
          <>
            <p
              className={cn(
                'mt-2 font-mono font-black text-2xl leading-none tabular-nums',
                style.valueColor,
              )}
            >
              {displayValue}
            </p>
            {percentChange !== undefined ? (
              <PercentChangeIndicator percentChange={percentChange} />
            ) : secondary ? (
              <p className="mt-1.5 text-xs text-muted-foreground">{secondary}</p>
            ) : null}
          </>
        )}
      </div>

      {icon ? (
        <div
          className={cn(
            'flex size-12 shrink-0 items-center justify-center rounded-full [&_svg]:size-5',
            iconClassName,
            style.iconAccent,
          )}
          aria-hidden="true"
        >
          {icon}
        </div>
      ) : null}
    </div>
  )
}
