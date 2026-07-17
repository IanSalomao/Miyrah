import { PieChart } from 'miyrah'

// O Recharts anima a entrada do gráfico (~1,5s). A captura tira o screenshot no
// `networkidle`, o que pega a animação no meio (pizza colapsada). Mantemos a
// rede ocupada por ~1,6s para que o `networkidle` — e o screenshot — só ocorram
// depois de a animação terminar. Ver .design-sync/learnings/wave-charts.md.
if (typeof window !== 'undefined' && typeof fetch === 'function') {
  let n = 0
  const timer = setInterval(() => {
    fetch(`/__ds_settle_ping?${n}`).catch(() => {})
    if (++n > 10) clearInterval(timer)
  }, 150)
}

const wrap: React.CSSProperties = {
  width: 520,
  minHeight: 300,
  padding: 24,
  background: 'var(--background)',
}

// Distribuição de entradas por categoria (cores são dado do usuário).
const incomeByCategory = [
  { categoryId: 'c1', name: 'Dízimos', color: '#1F7A54', value: 14200 },
  { categoryId: 'c2', name: 'Ofertas', color: '#1472E6', value: 6800 },
  { categoryId: 'c3', name: 'Doações', color: '#7A5AF8', value: 3120 },
  { categoryId: 'c4', name: 'Campanhas', color: '#E6A817', value: 1850 },
]

// Distribuição de saídas por categoria.
const expenseByCategory = [
  { categoryId: 'd1', name: 'Aluguel', color: '#B5443A', value: 5200 },
  { categoryId: 'd2', name: 'Contas de consumo', color: '#C77B2B', value: 2380 },
  { categoryId: 'd3', name: 'Manutenção', color: '#5A6B8C', value: 1640 },
  { categoryId: 'd4', name: 'Missões', color: '#2E9E8F', value: 980 },
]

// Pizza com título e legenda própria (swatch + valor mono à direita).
export function IncomeByCategory() {
  return (
    <div style={wrap}>
      <PieChart title="Entradas por categoria" data={incomeByCategory} />
    </div>
  )
}

// Segunda instância (Saídas por categoria) — mesma estrutura, outro array.
export function ExpenseByCategory() {
  return (
    <div style={wrap}>
      <PieChart title="Saídas por categoria" data={expenseByCategory} />
    </div>
  )
}

// Skeleton exibido enquanto o filtro/busca associado é aplicado.
export function Loading() {
  return (
    <div style={wrap}>
      <PieChart title="Entradas por categoria" data={[]} isLoading />
    </div>
  )
}
