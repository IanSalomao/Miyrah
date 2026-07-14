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
