// Fábrica de query keys padronizada por recurso.
// Mutations invalidam usando os prefixos (`*.all`) dos recursos afetados.

import type {
  CategoriesQuery,
  ComparisonGroupBy,
  DashboardFilters,
  MembersQuery,
  ReportsQuery,
  TransactionsQuery,
} from '@/types'

export const queryKeys = {
  account: ['account'] as const,
  members: {
    all: ['members'] as const,
    list: (query: MembersQuery) => ['members', 'list', query] as const,
    detail: (id: string) => ['members', 'detail', id] as const,
  },
  ministries: {
    all: ['ministries'] as const,
    list: () => ['ministries', 'list'] as const,
  },
  categories: {
    all: ['categories'] as const,
    list: (query: CategoriesQuery) => ['categories', 'list', query] as const,
  },
  transactions: {
    all: ['transactions'] as const,
    list: (query: TransactionsQuery) => ['transactions', 'list', query] as const,
    detail: (id: string) => ['transactions', 'detail', id] as const,
  },
  dashboard: {
    all: ['dashboard'] as const,
    summary: (filters: DashboardFilters) => ['dashboard', 'summary', filters] as const,
    charts: (filters: DashboardFilters) => ['dashboard', 'charts', filters] as const,
    comparison: (filters: DashboardFilters, groupBy: ComparisonGroupBy) =>
      ['dashboard', 'comparison', filters, groupBy] as const,
  },
  reports: {
    all: ['reports'] as const,
    list: (query: ReportsQuery) => ['reports', 'list', query] as const,
  },
} as const
