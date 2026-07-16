// Início — wiki/pages/page_home.md
// component_line_chart (entradas/saídas por dia) + 2x component_pie_chart
// (entradas por categoria, saídas por categoria), todos do mês atual.

import { LineChart } from '@/components/line-chart/line-chart'
import { PieChart } from '@/components/pie-chart/pie-chart'
import { ApiError } from '@/lib/api-client'
import { useDashboardCharts } from '../hooks/use-dashboard-charts'

export function ChartsSection() {
  const { data, isLoading, isError, error, refetch } = useDashboardCharts()

  const errorMessage = isError
    ? error instanceof ApiError
      ? error.message
      : 'Não foi possível carregar os gráficos.'
    : null

  return (
    <section className="flex flex-col gap-4">
      <LineChart
        data={data?.line ?? []}
        isLoading={isLoading}
        error={errorMessage}
        onRetry={() => void refetch()}
      />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PieChart
          title="Entradas por categoria"
          data={data?.incomeByCategory ?? []}
          isLoading={isLoading}
          error={errorMessage}
          onRetry={() => void refetch()}
        />
        <PieChart
          title="Saídas por categoria"
          data={data?.expenseByCategory ?? []}
          isLoading={isLoading}
          error={errorMessage}
          onRetry={() => void refetch()}
        />
      </div>
    </section>
  )
}
