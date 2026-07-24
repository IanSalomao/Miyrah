// component_pie_chart — wiki/components/component_pie_chart.md
// Gráfico de pizza (distribuição por categoria) usado em Início/Dashboard.
// Cada página instancia duas vezes lado a lado: Entradas por categoria / Saídas por categoria —
// mesma estrutura visual, a diferença é só qual array (`incomeByCategory`/`expenseByCategory`) alimenta o gráfico.
import { PieChartIcon } from 'lucide-react'
import {
  Cell,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  type TooltipContentProps,
} from 'recharts'

import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { CategorySlice } from '@/types'

function PieChartTooltip({ active, payload }: TooltipContentProps) {
  if (!active || !payload?.length) return null
  const entry = payload[0]
  const slice = entry.payload as CategorySlice

  return (
    <div className="rounded-md border border-border bg-popover px-3 py-2 text-xs shadow-sm">
      <div className="flex items-center gap-2">
        <span
          className="size-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: slice.color }}
          aria-hidden="true"
        />
        <span className="font-medium text-foreground">{slice.name}</span>
      </div>
      <p className="mt-1 text-right font-mono text-foreground">{formatCurrency(slice.value)}</p>
    </div>
  )
}

interface PieChartLegendProps {
  data: CategorySlice[]
  total: number
}

/** Legenda própria (Recharts `Legend` não suporta bem swatch + valor mono alinhado à direita). */
function PieChartLegend({ data, total }: PieChartLegendProps) {
  return (
    <ul className="flex flex-col gap-1.5 text-sm">
      {data.map((slice) => (
        <li key={slice.categoryId} className="flex items-center justify-between gap-4">
          <span className="flex min-w-0 items-center gap-2 text-foreground">
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: slice.color }}
              aria-hidden="true"
            />
            <span className="truncate">{slice.name}</span>
          </span>
          <span className="shrink-0 font-mono text-xs text-muted-foreground">
            {total > 0 ? `${((slice.value / total) * 100).toFixed(0)}%` : '0%'}
            <span className="ml-2 font-mono text-sm text-foreground">{formatCurrency(slice.value)}</span>
          </span>
        </li>
      ))}
    </ul>
  )
}

export interface PieChartProps {
  /** `incomeByCategory` ou `expenseByCategory` de `GET /v1/dashboard/by-category`. */
  data: CategorySlice[]
  /** Skeleton no lugar do gráfico enquanto o filtro/busca associado é aplicado. */
  isLoading?: boolean
  /** Título opcional (ex.: "Entradas por categoria" / "Saídas por categoria"). */
  title?: string
  className?: string
}

const CHART_HEIGHT = 'h-56'

/** Gráfico de pizza reutilizável (distribuição por categoria). Ver component_pie_chart.md. */
export function PieChart({ data, isLoading = false, title, className }: PieChartProps) {
  if (isLoading) {
    return (
      <div className={cn('w-full', className)}>
        {title ? <h3 className="mb-3 text-base font-semibold">{title}</h3> : null}
        <div
          role="status"
          aria-label="Carregando gráfico de categorias"
          className={cn(CHART_HEIGHT, 'w-full animate-pulse rounded-md bg-muted')}
        />
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className={cn('w-full', className)}>
        {title ? <h3 className="mb-3 text-base font-semibold">{title}</h3> : null}
        <div
          className={cn(
            CHART_HEIGHT,
            'flex w-full flex-col items-center justify-center gap-2 rounded-md border border-border text-muted-foreground',
          )}
        >
          <PieChartIcon className="size-8" aria-hidden="true" />
          <p className="text-sm">Nenhuma transação encontrada</p>
        </div>
      </div>
    )
  }

  const total = data.reduce((sum, slice) => sum + slice.value, 0)

  return (
    <div className={cn('w-full', className)}>
      {title ? <h3 className="mb-3 text-base font-semibold">{title}</h3> : null}
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
        <div className={cn(CHART_HEIGHT, 'w-full shrink-0 sm:w-56')}>
          <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 224, height: 224 }}>
            <RechartsPieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius="55%"
                outerRadius="85%"
                paddingAngle={2}
                strokeWidth={1}
                stroke="var(--card)"
              >
                {data.map((slice) => (
                  <Cell key={slice.categoryId} fill={slice.color} />
                ))}
              </Pie>
              <Tooltip content={(props) => <PieChartTooltip {...props} />} />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-full min-w-0 flex-1">
          <PieChartLegend data={data} total={total} />
        </div>
      </div>
    </div>
  )
}
