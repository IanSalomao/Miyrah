import { Skeleton } from 'miyrah'

const wrap: React.CSSProperties = {
  padding: 24,
  background: 'var(--background)',
}

const card: React.CSSProperties = {
  background: 'var(--card)',
  border: '1px solid var(--border)',
  borderRadius: 12,
  padding: 16,
  maxWidth: 480,
}

// Placeholder de carregamento de uma linha da tabela de transações.
export function TableRow() {
  return (
    <div style={wrap}>
      <div style={card}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 0',
              borderBottom: i < 3 ? '1px solid var(--border)' : 'none',
            }}
          >
            <Skeleton style={{ height: 16, width: 16, borderRadius: 4 }} />
            <Skeleton style={{ height: 14, flex: 1 }} />
            <Skeleton style={{ height: 14, width: 80 }} />
            <Skeleton style={{ height: 14, width: 96 }} />
          </div>
        ))}
      </div>
    </div>
  )
}

// Placeholder de um card de métrica em carregamento.
export function MetricCardLoading() {
  return (
    <div style={wrap}>
      <div style={{ ...card, maxWidth: 220 }}>
        <Skeleton style={{ height: 12, width: 88, marginBottom: 12 }} />
        <Skeleton style={{ height: 28, width: 140 }} />
      </div>
    </div>
  )
}

// Placeholder de item de lista de membros (avatar + nome + contato).
export function MemberRow() {
  return (
    <div style={wrap}>
      <div style={{ ...card, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Skeleton style={{ height: 40, width: 40, borderRadius: 9999 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
          <Skeleton style={{ height: 14, width: '55%' }} />
          <Skeleton style={{ height: 12, width: '35%' }} />
        </div>
      </div>
    </div>
  )
}
