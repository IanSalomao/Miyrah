// component_line_chart — wiki/components/component_line_chart.md
// Gráfico de linha (Entradas x Saídas ao longo do tempo) usado em Início/Dashboard.
// Cores das séries são os tokens semânticos --income/--expense (nunca cor de categoria).
import { LineChartIcon } from 'lucide-react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from 'recharts'

import { formatCurrency, formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { LinePoint } from '@/types'

const SERIES_LABEL: Record<'income' | 'expense', string> = {
  income: 'Entradas',
  expense: 'Saídas',
}

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
              <span
                className={cn(
                  'font-mono',
                  key === 'income' ? 'text-income' : 'text-expense',
                )}
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

export interface LineChartProps {
  /** Array `line` de `GET /v1/dashboard/charts` — granularidade já vem definida pelos dados. */
  data: LinePoint[]
  /** Skeleton no lugar do gráfico enquanto o filtro/busca associado é aplicado. */
  isLoading?: boolean
  className?: string
}

const CHART_HEIGHT = 'h-72'

/** Gráfico de linha reutilizável (Entradas x Saídas). Ver component_line_chart.md. */
export function LineChart({ data, isLoading = false, className }: LineChartProps) {
  if (isLoading) {
    return (
      <div
        role="status"
        aria-label="Carregando gráfico de entradas e saídas"
        className={cn(CHART_HEIGHT, 'w-full animate-pulse rounded-md bg-muted', className)}
      />
    )
  }

  if (data.length === 0) {
    return (
      <div
        className={cn(
          CHART_HEIGHT,
          'flex w-full flex-col items-center justify-center gap-2 rounded-md border border-border text-muted-foreground',
          className,
        )}
      >
        <LineChartIcon className="size-8" aria-hidden="true" />
        <p className="text-sm">Nenhuma transação encontrada</p>
      </div>
    )
  }

  return (
    <div className={cn(CHART_HEIGHT, 'w-full', className)}>
      <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 480, height: 288 }}>
        <RechartsLineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
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
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}
            tickLine={false}
            axisLine={false}
            width={92}
          />
          <Tooltip content={(props) => <LineChartTooltip {...props} />} />
          <Legend
            formatter={(value: string) => SERIES_LABEL[value as 'income' | 'expense']}
            wrapperStyle={{ fontSize: 12, color: 'var(--foreground)' }}
          />
          <Line
            type="monotone"
            dataKey="income"
            name="income"
            stroke="var(--income)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="expense"
            name="expense"
            stroke="var(--expense)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  )
}
