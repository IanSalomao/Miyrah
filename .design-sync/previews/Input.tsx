import { Input } from 'miyrah'

const wrap: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  padding: 24,
  background: 'var(--background)',
  maxWidth: 340,
}

// Campos de entrada com placeholders realistas.
export function Basic() {
  return (
    <div style={wrap}>
      <Input placeholder="Nome do membro" />
      <Input type="email" placeholder="email@igreja.com.br" />
      <Input defaultValue="Igreja Batista Central" />
    </div>
  )
}

// Estados: normal, desabilitado e inválido.
export function States() {
  return (
    <div style={wrap}>
      <Input placeholder="Descrição da transação" />
      <Input disabled defaultValue="12.345.678/0001-90" />
      <Input aria-invalid defaultValue="senha123" />
    </div>
  )
}
