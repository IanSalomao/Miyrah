import { MemberAvatar } from 'miyrah'

const wrap: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  padding: 24,
  background: 'var(--background)',
}

const labelRow: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  padding: 24,
  background: 'var(--background)',
}

const member: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  color: 'var(--foreground)',
}

// Avatar de membro derivado das iniciais do nome completo.
export function Members() {
  return (
    <div style={wrap}>
      <MemberAvatar name="Maria Aparecida" />
      <MemberAvatar name="João Silva" />
      <MemberAvatar name="Pedro Rodrigues" />
      <MemberAvatar name="Ana Beatriz Costa" />
    </div>
  )
}

// Tamanhos: padrão (linha de tabela) e compacto (card de ministério).
export function Sizes() {
  return (
    <div style={labelRow}>
      <div style={member}>
        <MemberAvatar name="Carla Fernandes" size="default" />
        <span>Carla Fernandes</span>
      </div>
      <div style={member}>
        <MemberAvatar name="Carla Fernandes" size="sm" />
        <span>Carla Fernandes</span>
      </div>
    </div>
  )
}

// Vínculo excluído (soft delete): mantém as iniciais, com indicação visual.
export function Deleted() {
  return (
    <div style={labelRow}>
      <div style={member}>
        <MemberAvatar name="Roberto Alves" />
        <span>Roberto Alves</span>
      </div>
      <div style={member}>
        <MemberAvatar name="Roberto Alves" deleted />
        <span style={{ color: 'var(--muted-foreground)', fontStyle: 'italic' }}>
          Roberto Alves (excluído)
        </span>
      </div>
    </div>
  )
}
