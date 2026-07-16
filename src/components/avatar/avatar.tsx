// Círculo com as iniciais do nome de um membro — nunca há upload de foto.
// Ver wiki/components/component_avatar.md.
import { Avatar as AvatarRoot, AvatarFallback } from '@/components/ui/avatar'
import { getInitials } from '@/lib/format'
import { cn } from '@/lib/utils'

export interface MemberAvatarProps {
  /** Nome completo do membro — as iniciais são derivadas dele. */
  name: string
  /** Tamanho padrão (linha de tabela) ou pequeno (contexto compacto, ex.: card de ministério). */
  size?: 'default' | 'sm'
  /** Vínculo excluído (soft delete) — mantém as iniciais, com indicação visual de "excluído". */
  deleted?: boolean
  className?: string
}

export function MemberAvatar({
  name,
  size = 'default',
  deleted = false,
  className,
}: MemberAvatarProps) {
  return (
    <AvatarRoot
      size={size}
      className={cn(deleted && 'opacity-60 grayscale', className)}
      aria-label={deleted ? `${name} (excluído)` : name}
    >
      <AvatarFallback
        className={cn(
          'bg-primary/10 font-semibold text-foreground',
          deleted && 'italic',
        )}
      >
        {getInitials(name)}
      </AvatarFallback>
    </AvatarRoot>
  )
}
