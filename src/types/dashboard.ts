// Dashboard/Início — wiki/api/dashboard.md
// Diferente de transactions: income/expense são magnitudes POSITIVAS;
// balance/periodBalance/balanceStart/balanceEnd são saldos líquidos (podem ser negativos).

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

/** GET /v1/dashboard/balance — saldo líquido "até a data", sem parâmetros nem filtro. */
export interface DashboardBalance {
  balance: number
}

/** GET /v1/dashboard/summary — métricas do período (filtros, exceto `type`). */
export interface DashboardSummary {
  income: number // magnitude positiva
  expense: number // magnitude positiva
  periodBalance: number // income − expense, pode ser negativo
  incomeCount: number
  expenseCount: number
  transactionsCount: number // incomeCount + expenseCount, do período
}

/** GET /v1/dashboard/counts — totais gerais correntes, sem parâmetro nem filtro. */
export interface DashboardCounts {
  membersCount: number
  ministriesCount: number
  categoriesCount: number
}

/** GET /v1/dashboard/balance-variation — só aceita dateFrom/dateTo concretos. */
export interface DashboardBalanceVariation {
  dateFrom: string
  dateTo: string
  balanceStart: number
  balanceEnd: number
  /** `null` quando `balanceStart = 0` (divisão impossível). */
  percentChange: number | null
}

export type LineGranularity = 'day' | 'week'

export interface LinePoint {
  date: string
  income: number
  expense: number
}

/** GET /v1/dashboard/line — série temporal com granularidade escolhida pelo cliente. */
export interface DashboardLine {
  granularity: LineGranularity
  line: LinePoint[]
}

export interface CategorySlice {
  categoryId: string
  name: string
  color: string // cor da categoria (dado do usuário)
  value: number
}

/** GET /v1/dashboard/by-category — as duas pizzas (entradas/saídas por categoria). */
export interface DashboardByCategory {
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
