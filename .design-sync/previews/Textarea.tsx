import { Textarea } from 'miyrah'

const wrap: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  padding: 24,
  background: 'var(--background)',
  maxWidth: 420,
}

// Campo de observações de uma transação.
export function Basic() {
  return (
    <div style={wrap}>
      <Textarea placeholder="Observações sobre o lançamento (opcional)" />
      <Textarea defaultValue="Oferta especial da campanha de missões — recebida no culto de domingo à noite." />
    </div>
  )
}

// Estados: desabilitado e inválido.
export function States() {
  return (
    <div style={wrap}>
      <Textarea
        disabled
        defaultValue="Doação registrada por Maria Aparecida para o Ministério Infantil."
      />
      <Textarea
        aria-invalid
        placeholder="A observação não pode exceder 500 caracteres"
      />
    </div>
  )
}
