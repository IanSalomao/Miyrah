import { Badge } from 'miyrah'

const wrap: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 10,
  padding: 24,
  background: 'var(--background)',
}

// Todas as variantes do Badge.
export function Variants() {
  return (
    <div style={wrap}>
      <Badge variant="default">Padrão</Badge>
      <Badge variant="secondary">Secundário</Badge>
      <Badge variant="destructive">Destrutivo</Badge>
      <Badge variant="outline">Contorno</Badge>
      <Badge variant="ghost">Ghost</Badge>
      <Badge variant="link">Link</Badge>
    </div>
  )
}

// Uso típico: marcação de status de transações e membros.
export function StatusTags() {
  return (
    <div style={wrap}>
      <Badge variant="secondary">Dízimo</Badge>
      <Badge variant="secondary">Oferta</Badge>
      <Badge variant="outline">Ministério de Louvor</Badge>
      <Badge variant="destructive">Excluído</Badge>
    </div>
  )
}
