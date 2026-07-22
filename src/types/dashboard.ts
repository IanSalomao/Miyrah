// Dashboard/Início — wiki/api/dashboard.md
// Diferente de transactions: income/expense são magnitudes POSITIVAS;
// balance é o saldo líquido (pode ser negativo) e é sempre "até a data".

export type DashboardPeriod =
  | 'currentMonth'
  | 'last3Months'
  | 'last6Months'
  | 'last12Months'
  | 'currentYear'
  | 'custom'

export type DashboardType = 'all' | 'income' | 'expense'

export interface DashboardFilters {
  period?: DashboardPeriod
  dateFrom?: string // obrigatório se period = custom
  dateTo?: string // obrigatório se period = custom
  categoryIds?: string[] // enviado como CSV na query
  type?: DashboardType
  ministryId?: string // filtrar por ministério oculta transações sem ministério
}

export interface DashboardSummary {
  balance: number // líquido até a data (não afetado pelo período)
  income: number // magnitude positiva
  expense: number // magnitude positiva
  periodBalance: number
  membersCount: number
  transactionsCount: number
  ministriesCount: number
  averageTicket: number
}

export interface LinePoint {
  date: string
  income: number
  expense: number
}

export interface CategorySlice {
  categoryId: string
  name: string
  color: string // cor da categoria (dado do usuário)
  value: number
}

export interface DashboardCharts {
  line: LinePoint[]
  incomeByCategory: CategorySlice[]
  expenseByCategory: CategorySlice[]
}

export type ComparisonGroupBy = 'month' | 'week'

export interface ComparisonBucket {
  periodStart: string // ISO date — ordenação e tooltip
  label: string // rótulo pt-BR já formatado pela API (ex.: "Jul/26" ou "12–18/jul")
  income: number // magnitude POSITIVA
  expense: number // magnitude POSITIVA
}

export interface DashboardComparisonStats {
  sampleSize: number // qtd de buckets na média (todos menos o último)
  incomeVsAvg: number | null // % com 1 casa; null = sem base de comparação
  expenseVsAvg: number | null
}

export interface DashboardComparison {
  groupBy: ComparisonGroupBy
  buckets: ComparisonBucket[]
  comparison: DashboardComparisonStats
}
