import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from 'miyrah'

const wrap: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  padding: 24,
  background: 'var(--background)',
}

// Iniciais dos membros (o DS gera o avatar do nome — nunca há upload de foto).
export function Initials() {
  return (
    <div style={wrap}>
      <Avatar>
        <AvatarFallback>MA</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>JS</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>PR</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>CF</AvatarFallback>
      </Avatar>
    </div>
  )
}

// Três tamanhos: compacto, padrão e grande.
export function Sizes() {
  return (
    <div style={wrap}>
      <Avatar size="sm">
        <AvatarFallback>AL</AvatarFallback>
      </Avatar>
      <Avatar size="default">
        <AvatarFallback>AL</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>AL</AvatarFallback>
      </Avatar>
    </div>
  )
}

// Grupo empilhado com contagem de excedentes (ex.: membros de um ministério).
export function Group() {
  return (
    <div style={wrap}>
      <AvatarGroup>
        <Avatar>
          <AvatarFallback>MA</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>JS</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>PR</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>+5</AvatarGroupCount>
      </AvatarGroup>
    </div>
  )
}
