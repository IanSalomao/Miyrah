// Coluna Membro/Ministério — mostra o que houver vinculado, nunca ambos ao
// mesmo tempo (wiki/pages/page_transactions.md). Membro exibe avatar + nome;
// vínculo excluído mantém o nome com indicação visual.

import { MemberAvatar } from '@/components/avatar/avatar'
import { cn } from '@/lib/utils'
import type { MemberRef, MinistryRef } from '@/types'

interface TransactionLinkedCellProps {
  member: MemberRef | null
  ministry: MinistryRef | null
}

export function TransactionLinkedCell({ member, ministry }: TransactionLinkedCellProps) {
  if (member) {
    return (
      <div className="flex items-center gap-2">
        <MemberAvatar name={member.name} deleted={member.deleted} />
        <span className={cn(member.deleted && 'text-muted-foreground italic')}>
          {member.name}
          {member.deleted && ' (excluído)'}
        </span>
      </div>
    )
  }

  if (ministry) {
    return (
      <span className={cn(ministry.deleted && 'text-muted-foreground italic')}>
        {ministry.name}
        {ministry.deleted && ' (excluído)'}
      </span>
    )
  }

  return <span className="text-muted-foreground">—</span>
}
