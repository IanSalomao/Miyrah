import { Label, Input, Checkbox } from 'miyrah'

const wrap: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  padding: 24,
  background: 'var(--background)',
  maxWidth: 340,
}

const fieldStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
}

// Label associada a inputs, como num formulário.
export function WithInput() {
  return (
    <div style={wrap}>
      <div style={fieldStyle}>
        <Label htmlFor="member-name">Nome do membro</Label>
        <Input id="member-name" placeholder="João da Silva" />
      </div>
      <div style={fieldStyle}>
        <Label htmlFor="member-email">E-mail</Label>
        <Input id="member-email" type="email" placeholder="joao@igreja.com.br" />
      </div>
    </div>
  )
}

// Label alinhada a um checkbox (padrão inline).
export function WithCheckbox() {
  return (
    <div style={wrap}>
      <Label htmlFor="remember" style={{ gap: 8 }}>
        <Checkbox id="remember" defaultChecked />
        Lembrar-me neste dispositivo
      </Label>
    </div>
  )
}
