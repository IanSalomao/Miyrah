// Metadata do painel de composição do relatório — wiki/pages/page_reports.md e
// wiki/Miyrah.md (seção Relatórios). Os blocos são agrupados nos mesmos 4 grupos
// visuais da spec; a sub-opção "Incluir Membro" (dado sensível) é tratada à parte
// na página, pois não é um bloco do enum `sections` e sim o campo `includeMember`.

import type { ReportSection } from '@/types'

export interface SectionOption {
  key: ReportSection
  label: string
}

export interface SectionGroup {
  title: string
  options: SectionOption[]
}

/**
 * Grupos e blocos, na ordem da spec. As chaves batem com o enum de `sections`
 * da API (wiki/api/reports.md). "Lista de transações" (`transactionList`) mora
 * no grupo Detalhe e destrava a sub-opção "Incluir Membro".
 */
export const SECTION_GROUPS: SectionGroup[] = [
  {
    title: 'Resumo',
    options: [{ key: 'summary', label: 'Saldo do período' }],
  },
  {
    title: 'Entradas',
    options: [
      { key: 'incomeByCategory', label: 'Entradas por categoria' },
      { key: 'incomeByMinistry', label: 'Entradas por ministério' },
      { key: 'incomeCategoryChart', label: 'Distribuição por categoria' },
      { key: 'incomeMonthlyChart', label: 'Histórico mensal' },
    ],
  },
  {
    title: 'Saídas',
    options: [
      { key: 'expenseByMinistry', label: 'Saídas por ministério' },
      { key: 'expenseByCategory', label: 'Saídas por categoria' },
      { key: 'expenseCategoryChart', label: 'Distribuição por categoria' },
      { key: 'expenseMonthlyChart', label: 'Histórico mensal' },
    ],
  },
  {
    title: 'Detalhe',
    options: [{ key: 'transactionList', label: 'Lista de transações' }],
  },
]

/** Bloco que destrava a sub-opção "Incluir Membro". */
export const MEMBER_PARENT_SECTION: ReportSection = 'transactionList'

/** "Saídas por Ministério" vem pré-marcada; todos os demais, desmarcados. */
export const DEFAULT_SECTIONS: ReportSection[] = ['expenseByMinistry']
