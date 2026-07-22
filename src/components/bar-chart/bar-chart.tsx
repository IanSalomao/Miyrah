// component_bar_chart — wiki/components/component_bar_chart.md
// Gráfico de barras comparativas (Entradas x Saídas por período) — GET /v1/dashboard/comparison.
// Cores das séries são os tokens semânticos --income/--expense (nunca cor de categoria).
import { BarChart3 } from 'lucide-react'
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from 'recharts'

import { FilterTabs, type FilterTabOption } from '@/components/tabs/filter-tabs'
import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { ComparisonBucket, ComparisonGroupBy, DashboardComparisonStats } from '@/types'

const SERIES_LABEL: Record<'income' | 'expense', string> = {
  income: 'Entradas',
  expense: 'Saídas',
}

const GROUP_BY_OPTIONS: FilterTabOption<ComparisonGroupBy>[] = [
  { value: 'month', label: 'Mês' },
  { value: 'week', label: 'Semana' },
]

function BarChartTooltip({ active, payload, label }: TooltipContentProps) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-md border border-border bg-popover px-3 py-2 text-xs shadow-sm">
      <p className="mb-1 font-medium text-foreground">{String(label)}</p>
      <ul className="space-y-0.5">
        {payload.map((entry) => {
          const key = entry.dataKey as 'income' | 'expense'
          return (
            <li key={key} className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">{SERIES_LABEL[key]}</span>
              <span
                className={cn('font-mono', key === 'income' ? 'text-income' : 'text-expense')}
              >
                {formatCurrency(Number(entry.value ?? 0))}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

interface ComparisonIndicatorItemProps {
  seriesKey: 'income' | 'expense'
  value: number | null
  sampleSize: number
  groupBy: ComparisonGroupBy
}

/**
 * Texto por série (ex.: "Entradas ↓ 10,0% vs. média dos 5 meses anteriores").
 * `value`/`sampleSize` nulos ou zerados → "—", nunca "0%" (cor Entradas/Saídas é
 * reservada a valor monetário, então aqui o texto é neutro/muted).
 */
function ComparisonIndicatorItem({
  seriesKey,
  value,
  sampleSize,
  groupBy,
}: ComparisonIndicatorItemProps) {
  const label = SERIES_LABEL[seriesKey]

  if (value === null || sampleSize === 0) {
    return (
      <p className="text-xs text-muted-foreground">
        {label} <span aria-hidden="true">—</span>
        <span className="sr-only">sem base de comparação</span>
      </p>
    )
  }

  const arrow = value >= 0 ? '↑' : '↓'
  const percent = Math.abs(value).toFixed(1).replace('.', ',')
  const unit = groupBy === 'week' ? 'semanas' : 'meses'
  const article = groupBy === 'week' ? 'das' : 'dos'

  return (
    <p className="text-xs text-muted-foreground">
      {label} {arrow} {percent}% vs. média {article} {sampleSize} {unit} anteriores
    </p>
  )
}

export interface BarChartProps {
  /** `buckets` de GET /v1/dashboard/comparison. Uma dupla de barras (entrada×saída) por item. */
  data: ComparisonBucket[]
  /** Objeto `comparison` da API — alimenta o indicador textual. Omitido = sem indicador. */
  comparison?: DashboardComparisonStats
  /** Skeleton no lugar do gráfico enquanto recarrega. */
  isLoading?: boolean
  /** Valor atual do toggle Mês/Semana. Só relevante quando `onGroupByChange` é passado. */
  groupBy?: ComparisonGroupBy
  /** Handler do toggle. QUANDO AUSENTE, o toggle NÃO é renderizado (caso da tela Início). */
  onGroupByChange?: (value: ComparisonGroupBy) => void
  /** Título opcional do cabeçalho do card. */
  title?: string
  className?: string
}

const CHART_HEIGHT = 'h-72'

/** Gráfico de barras comparativas reutilizável (Entradas x Saídas). Ver component_bar_chart.md. */
export function BarChart({
  data,
  comparison,
  isLoading = false,
  groupBy = 'month',
  onGroupByChange,
  title,
  className,
}: BarChartProps) {
  const header =
    title || onGroupByChange ? (
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        {title ? <h3 className="text-base font-semibold text-foreground">{title}</h3> : <span />}
        {onGroupByChange ? (
          <FilterTabs
            options={GROUP_BY_OPTIONS}
            value={groupBy}
            onValueChange={onGroupByChange}
          />
        ) : null}
      </div>
    ) : null

  const indicator = comparison ? (
    <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
      <ComparisonIndicatorItem
        seriesKey="income"
        value={comparison.incomeVsAvg}
        sampleSize={comparison.sampleSize}
        groupBy={groupBy}
      />
      <ComparisonIndicatorItem
        seriesKey="expense"
        value={comparison.expenseVsAvg}
        sampleSize={comparison.sampleSize}
        groupBy={groupBy}
      />
    </div>
  ) : null

  if (isLoading) {
    return (
      <div className={cn('w-full', className)}>
        {header}
        <div
          role="status"
          aria-label="Carregando gráfico de entradas e saídas"
          className={cn(CHART_HEIGHT, 'w-full animate-pulse rounded-md bg-muted')}
        />
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className={cn('w-full', className)}>
        {header}
        <div
          className={cn(
            CHART_HEIGHT,
            'flex w-full flex-col items-center justify-center gap-2 rounded-md border border-border text-muted-foreground',
          )}
        >
          <BarChart3 className="size-8" aria-hidden="true" />
          <p className="text-sm">Nenhuma transação encontrada</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('w-full', className)}>
      {header}
      {indicator}
      <div className={cn(CHART_HEIGHT, 'w-full')}>
        <ResponsiveContainer
          width="100%"
          height="100%"
          initialDimension={{ width: 480, height: 288 }}
        >
          <RechartsBarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
              tickLine={false}
              axisLine={{ stroke: 'var(--border)' }}
            />
            <YAxis
              tickFormatter={(value: number) => formatCurrency(value)}
              tick={{ fontSize: 11, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}
              tickLine={false}
              axisLine={false}
              width={92}
            />
            <Tooltip content={(props) => <BarChartTooltip {...props} />} />
            <Legend
              formatter={(value: string) => SERIES_LABEL[value as 'income' | 'expense']}
              wrapperStyle={{ fontSize: 12, color: 'var(--foreground)' }}
            />
            <Bar dataKey="income" name="income" fill="var(--income)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" name="expense" fill="var(--expense)" radius={[4, 4, 0, 0]} />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
