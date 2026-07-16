// page_home (Início) — wiki/pages/page_home.md
// Primeira tela pós-login: sempre o mês atual, sem filtros de tempo e sem
// botão de adicionar transação (lançamentos acontecem só em /transactions).

import { ChartsSection } from '../components/charts-section'
import { MetricsSection } from '../components/metrics-section'
import { RecentTransactions } from '../components/recent-transactions'

export function HomePage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-display text-2xl font-semibold tracking-tight">Início</h1>
      <MetricsSection />
      <ChartsSection />
      <RecentTransactions />
    </div>
  )
}
