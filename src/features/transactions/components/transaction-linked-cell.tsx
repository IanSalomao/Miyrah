// Coluna Membro/Ministério — mostra o que houver vinculado, nunca ambos ao
// mesmo tempo (wiki/pages/page_transactions.md). Membro exibe avatar + nome;
// vínculo excluído mantém o nome com indicação visual.

import { Building2Icon } from 'lucide-react'
import { MemberAvatar, type MemberAvatarProps } from '@/components/avatar/avatar'
import { cn } from '@/lib/utils'
import type { MemberRef, MinistryRef } from '@/types'

interface TransactionLinkedCellProps {
  member: MemberRef | null
  ministry: MinistryRef | null
  /** Tamanho do avatar do membro — `sm` no card-row compacto da listagem. */
  avatarSize?: MemberAvatarProps['size']
}

export function TransactionLinkedCell({
  member,
  ministry,
  avatarSize = 'default',
}: TransactionLinkedCellProps) {
  if (member) {
    return (
      <div className="flex min-w-0 items-center gap-2">
        <MemberAvatar name={member.name} deleted={member.deleted} size={avatarSize} />
        <span className={cn('truncate', member.deleted && 'text-muted-foreground italic')}>
          {member.name}
          {member.deleted && ' (excluído)'}
        </span>
      </div>
    )
  }

  if (ministry) {
    return (
      <div
        className={cn(
          'flex min-w-0 items-center gap-2 text-muted-foreground',
          ministry.deleted && 'italic',
        )}
      >
        <Building2Icon className="size-4 shrink-0" aria-hidden="true" />
        <span className="truncate">
          {ministry.name}
          {ministry.deleted && ' (excluído)'}
        </span>
      </div>
    )
  }

  return <span className="text-muted-foreground/70">—</span>
}
