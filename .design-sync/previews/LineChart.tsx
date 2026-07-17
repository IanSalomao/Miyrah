import { LineChart } from 'miyrah'

// O Recharts anima a entrada do gráfico (~1,5s). A captura tira o screenshot no
// `networkidle`, o que pega a animação no meio (linhas incompletas). Mantemos a
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
  width: 560,
  height: 340,
  padding: 24,
  background: 'var(--background)',
}

// Série mensal de entradas x saídas (jan–jun), como no gráfico do Dashboard.
const monthly = [
  { date: '2026-01-31', income: 18450, expense: 12300 },
  { date: '2026-02-28', income: 16980, expense: 11540 },
  { date: '2026-03-31', income: 21230, expense: 13120 },
  { date: '2026-04-30', income: 19870, expense: 14980 },
  { date: '2026-05-31', income: 23410, expense: 12760 },
  { date: '2026-06-30', income: 20560, expense: 15320 },
]

// Gráfico com dados: linhas Entradas (verde) x Saídas (vermelho) ao longo do semestre.
export function IncomeVsExpense() {
  return (
    <div style={wrap}>
      <LineChart data={monthly} />
    </div>
  )
}

// Skeleton exibido enquanto o filtro de período do Dashboard é aplicado.
export function Loading() {
  return (
    <div style={wrap}>
      <LineChart data={[]} isLoading />
    </div>
  )
}

// Estado vazio: nenhuma transação no período selecionado.
export function Empty() {
  return (
    <div style={wrap}>
      <LineChart data={[]} />
    </div>
  )
}
