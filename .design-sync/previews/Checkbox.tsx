import { Checkbox, Label } from 'miyrah'

const wrap: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  padding: 24,
  background: 'var(--background)',
}

const row: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
}

// Estados: marcado, desmarcado e desabilitado.
export function States() {
  return (
    <div style={{ ...wrap, flexDirection: 'row', gap: 24 }}>
      <div style={row}>
        <Checkbox id="c-off" />
        <Label htmlFor="c-off">Desmarcado</Label>
      </div>
      <div style={row}>
        <Checkbox id="c-on" defaultChecked />
        <Label htmlFor="c-on">Marcado</Label>
      </div>
      <div style={row}>
        <Checkbox id="c-disabled" disabled />
        <Label htmlFor="c-disabled">Desabilitado</Label>
      </div>
    </div>
  )
}

// Uso típico: "Lembrar-me" no login.
export function RememberMe() {
  return (
    <div style={wrap}>
      <Label htmlFor="remember-me" style={{ gap: 8 }}>
        <Checkbox id="remember-me" defaultChecked />
        Lembrar-me neste dispositivo
      </Label>
    </div>
  )
}
