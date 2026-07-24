// component_line_chart — wiki/components/component_line_chart.md
// Gráfico de área (Entradas x Saídas ao longo do tempo) usado em Início/Dashboard.
// Cores das séries são os tokens semânticos --income/--expense (nunca cor de categoria).
import { LineChartIcon } from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from 'recharts'

import { FilterTabs, type FilterTabOption } from '@/components/tabs/filter-tabs'
import { formatCurrency, formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { LineGranularity, LinePoint } from '@/types'

const SERIES_LABEL: Record<'income' | 'expense', string> = {
  income: 'Entradas',
  expense: 'Saídas',
}

const GRANULARITY_OPTIONS: FilterTabOption<LineGranularity>[] = [
  { value: 'day', label: 'Diário' },
  { value: 'week', label: 'Semanal' },
]

function LineChartTooltip({ active, payload, label }: TooltipContentProps) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-md border border-border bg-popover px-3 py-2 text-xs shadow-sm">
      <p className="mb-1 font-medium text-foreground">{formatDate(String(label))}</p>
      <ul className="space-y-0.5">
        {payload.map((entry) => {
          const key = entry.dataKey as 'income' | 'expense'
          return (
            <li key={key} className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">{SERIES_LABEL[key]}</span>
              <span className={cn('font-mono', key === 'income' ? 'text-income' : 'text-expense')}>
                {formatCurrency(Number(entry.value ?? 0))}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export interface LineChartProps {
  /** Array `line` de `GET /v1/dashboard/line`. */
  data: LinePoint[]
  /** Skeleton no lugar do gráfico enquanto o filtro/busca associado é aplicado. */
  isLoading?: boolean
  /** Valor atual do toggle Diário/Semanal. Só relevante quando `onGranularityChange` é passado. */
  granularity?: LineGranularity
  /** Handler do toggle. QUANDO AUSENTE, o toggle NÃO é renderizado (caso da tela Início). */
  onGranularityChange?: (value: LineGranularity) => void
  /** Título opcional do cabeçalho do card. */
  title?: string
  className?: string
}

// Área do gráfico: cresce para preencher o card (flex-1) com piso de altura, para
// que cards lado a lado com conteúdos de cabeçalho diferentes fiquem na mesma altura.
const CHART_AREA = 'min-h-72 flex-1'
// Elevação de card (design_system.md): contorno em Linha + fundo Superfície + sombra.
// flex-col para a área do gráfico esticar até o fim do card.
const CARD = 'flex flex-col rounded-lg border border-border bg-card p-4 shadow-sm'

/** Gráfico de linha reutilizável (Entradas x Saídas). Ver component_line_chart.md. */
export function LineChart({
  data,
  isLoading = false,
  granularity = 'day',
  onGranularityChange,
  title,
  className,
}: LineChartProps) {
  const header =
    title || onGranularityChange ? (
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        {title ? <h3 className="text-base font-semibold text-foreground">{title}</h3> : <span />}
        {onGranularityChange ? (
          <FilterTabs
            options={GRANULARITY_OPTIONS}
            value={granularity}
            onValueChange={onGranularityChange}
          />
        ) : null}
      </div>
    ) : null

  if (isLoading) {
    return (
      <div className={cn(CARD, className)}>
        {header}
        <div
          role="status"
          aria-label="Carregando gráfico de entradas e saídas"
          className={cn(CHART_AREA, 'w-full animate-pulse rounded-md bg-muted')}
        />
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className={cn(CARD, className)}>
        {header}
        <div
          className={cn(
            CHART_AREA,
            'flex w-full flex-col items-center justify-center gap-2 rounded-md text-muted-foreground',
          )}
        >
          <LineChartIcon className="size-8" aria-hidden="true" />
          <p className="text-sm">Nenhuma transação encontrada</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(CARD, className)}>
      {header}
      {/* relative + inset-0: dá altura concreta ao ResponsiveContainer mesmo quando o
          card cresce via flex (senão height="100%" resolve para 0 em contexto empilhado). */}
      <div className={cn(CHART_AREA, 'relative w-full')}>
        <div className="absolute inset-0">
          <ResponsiveContainer
            width="100%"
            height="100%"
            initialDimension={{ width: 480, height: 288 }}
          >
            <AreaChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="line-chart-income" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--income)" stopOpacity={0.24} />
                  <stop offset="100%" stopColor="var(--income)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="line-chart-expense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--expense)" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="var(--expense)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={(value: string) => formatDate(value)}
                tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                tickLine={false}
                axisLine={{ stroke: 'var(--border)' }}
              />
              <YAxis
                tickFormatter={(value: number) => formatCurrency(value)}
                tick={{
                  fontSize: 11,
                  fill: 'var(--muted-foreground)',
                  fontFamily: 'var(--font-mono)',
                }}
                tickLine={false}
                axisLine={false}
                width={92}
              />
              <Tooltip content={(props) => <LineChartTooltip {...props} />} />
              <Legend
                formatter={(value: string) => SERIES_LABEL[value as 'income' | 'expense']}
                wrapperStyle={{ fontSize: 12, color: 'var(--foreground)' }}
              />
              <Area
                type="monotone"
                dataKey="income"
                name="income"
                stroke="var(--income)"
                strokeWidth={2}
                fill="url(#line-chart-income)"
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Area
                type="monotone"
                dataKey="expense"
                name="expense"
                stroke="var(--expense)"
                strokeWidth={2}
                fill="url(#line-chart-expense)"
                dot={false}
                activeDot={{ r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
