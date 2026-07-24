// Início — wiki/pages/page_home.md
// component_line_chart (entradas/saídas por dia, mês atual, sem toggle de agrupamento) +
// component_bar_chart (comparativo entrada x saída dos últimos 6 meses, sem toggle de agrupamento).

import { BarChart } from '@/components/bar-chart/bar-chart'
import { LineChart } from '@/components/line-chart/line-chart'
import { ApiError } from '@/lib/api-client'
import { useDashboardLine } from '../hooks/use-dashboard-line'
import { useDashboardComparison } from '../hooks/use-dashboard-comparison'
import { BlockError } from './block-error'

export function ChartsSection() {
  const {
    data: line,
    isLoading: isChartsLoading,
    isError: isChartsError,
    error: chartsError,
    refetch: refetchCharts,
  } = useDashboardLine()

  const {
    data: comparison,
    isLoading: isComparisonLoading,
    isError: isComparisonError,
    error: comparisonError,
    refetch: refetchComparison,
  } = useDashboardComparison()

  return (
    <section className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-3">
      <div className="flex flex-col lg:col-span-2">
        {isChartsError ? (
          <BlockError
            className="flex-1"
            message={
              chartsError instanceof ApiError
                ? chartsError.message
                : 'Não foi possível carregar os gráficos.'
            }
            onRetry={() => void refetchCharts()}
          />
        ) : (
          <LineChart className="flex-1" data={line?.line ?? []} isLoading={isChartsLoading} />
        )}
      </div>
      <div className="flex flex-col lg:col-span-1">
        {isComparisonError ? (
          <BlockError
            className="flex-1"
            message={
              comparisonError instanceof ApiError
                ? comparisonError.message
                : 'Não foi possível carregar os gráficos.'
            }
            onRetry={() => void refetchComparison()}
          />
        ) : (
          <BarChart
            className="flex-1"
            data={comparison?.buckets ?? []}
            comparison={comparison?.comparison}
            isLoading={isComparisonLoading}
            title="Últimos 6 meses"
          />
        )}
      </div>
    </section>
  )
}
