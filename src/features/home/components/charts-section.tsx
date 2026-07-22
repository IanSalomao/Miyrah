// Início — wiki/pages/page_home.md
// component_line_chart (entradas/saídas por dia, mês atual) + component_bar_chart
// (comparativo entrada x saída dos últimos 6 meses, sem toggle de agrupamento).

import { BarChart } from '@/components/bar-chart/bar-chart'
import { LineChart } from '@/components/line-chart/line-chart'
import { ApiError } from '@/lib/api-client'
import { useDashboardCharts } from '../hooks/use-dashboard-charts'
import { useDashboardComparison } from '../hooks/use-dashboard-comparison'
import { BlockError } from './block-error'

export function ChartsSection() {
  const {
    data: charts,
    isLoading: isChartsLoading,
    isError: isChartsError,
    error: chartsError,
    refetch: refetchCharts,
  } = useDashboardCharts()

  const {
    data: comparison,
    isLoading: isComparisonLoading,
    isError: isComparisonError,
    error: comparisonError,
    refetch: refetchComparison,
  } = useDashboardComparison()

  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2">
        {isChartsError ? (
          <BlockError
            message={
              chartsError instanceof ApiError
                ? chartsError.message
                : 'Não foi possível carregar os gráficos.'
            }
            onRetry={() => void refetchCharts()}
          />
        ) : (
          <LineChart data={charts?.line ?? []} isLoading={isChartsLoading} />
        )}
      </div>
      <div className="lg:col-span-1">
        {isComparisonError ? (
          <BlockError
            message={
              comparisonError instanceof ApiError
                ? comparisonError.message
                : 'Não foi possível carregar os gráficos.'
            }
            onRetry={() => void refetchComparison()}
          />
        ) : (
          <BarChart
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
