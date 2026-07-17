import { Separator } from 'miyrah'

const wrap: React.CSSProperties = {
  padding: 24,
  background: 'var(--background)',
}

const card: React.CSSProperties = {
  background: 'var(--card)',
  border: '1px solid var(--border)',
  borderRadius: 12,
  padding: 16,
  maxWidth: 360,
}

const mono: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontWeight: 600 }

// Separador horizontal entre blocos do resumo financeiro.
export function Horizontal() {
  return (
    <div style={wrap}>
      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10 }}>
          <span>Entradas</span>
          <span style={{ ...mono, color: 'var(--income)' }}>+ R$ 18.450,00</span>
        </div>
        <Separator />
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
          <span>Saídas</span>
          <span style={{ ...mono, color: 'var(--expense)' }}>− R$ 7.320,50</span>
        </div>
        <Separator />
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10 }}>
          <span style={{ fontWeight: 600 }}>Saldo</span>
          <span style={mono}>R$ 11.129,50</span>
        </div>
      </div>
    </div>
  )
}

// Separador vertical entre métricas em linha.
export function Vertical() {
  return (
    <div style={wrap}>
      <div
        style={{
          ...card,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          height: 64,
          maxWidth: 460,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>Membros</span>
          <span style={mono}>248</span>
        </div>
        <Separator orientation="vertical" />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>Ministérios</span>
          <span style={mono}>7</span>
        </div>
        <Separator orientation="vertical" />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>Transações</span>
          <span style={mono}>143</span>
        </div>
      </div>
    </div>
  )
}
