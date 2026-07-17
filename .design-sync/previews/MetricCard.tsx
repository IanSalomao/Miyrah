import { MetricCard } from 'miyrah'

const row: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, minmax(160px, 1fr))',
  gap: 16,
  padding: 24,
  background: 'var(--background)',
}

// Bloco de métricas do topo do Dashboard: entradas, saídas, saldo e contagem.
export function Overview() {
  return (
    <div style={row}>
      <MetricCard label="Entradas" value={18450} variant="income" />
      <MetricCard label="Saídas" value={7320.5} variant="expense" />
      <MetricCard label="Saldo" value={11129.5} variant="balance" />
      <MetricCard label="Transações" value={143} variant="neutral" />
    </div>
  )
}

// Saldo negativo usa a cor semântica de saída (nunca só o sinal).
export function NegativeBalance() {
  return (
    <div style={{ ...row, gridTemplateColumns: 'repeat(2, minmax(160px, 1fr))' }}>
      <MetricCard label="Saldo do mês" value={-2840.75} variant="balance" />
      <MetricCard label="Ticket médio" value={129.9} variant="neutral" formatValue={(v) => `R$ ${v.toFixed(2).replace('.', ',')}`} />
    </div>
  )
}

// Skeleton exibido enquanto o filtro de período é aplicado.
export function Loading() {
  return (
    <div style={{ ...row, gridTemplateColumns: 'repeat(3, minmax(160px, 1fr))' }}>
      <MetricCard label="Entradas" value={0} variant="income" loading />
      <MetricCard label="Saídas" value={0} variant="expense" loading />
      <MetricCard label="Saldo" value={0} variant="balance" loading />
    </div>
  )
}
