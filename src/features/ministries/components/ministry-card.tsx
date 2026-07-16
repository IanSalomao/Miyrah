// Card de ministério — wiki/pages/page_ministries.md
// Nome (Display), Descrição (Corpo) e Responsável (avatar pequeno + nome, ou
// "Sem responsável"); ícones de Editar/Excluir revelados no hover.

import { Pencil, Trash2 } from 'lucide-react'
import { Avatar } from '@/components/avatar/avatar'
import { Button } from '@/components/ui/button'
import type { Ministry } from '@/types'

export interface MinistryCardProps {
  ministry: Ministry
  onEdit: () => void
  onDelete: () => void
}

export function MinistryCard({ ministry, onEdit, onDelete }: MinistryCardProps) {
  return (
    <div className="group relative flex flex-col gap-3 rounded-lg border border-border bg-card p-5 shadow-none">
      <div className="absolute top-3 right-3 flex gap-1 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={`Editar ${ministry.name}`}
          onClick={onEdit}
        >
          <Pencil className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={`Excluir ${ministry.name}`}
          onClick={onDelete}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>

      <h3 className="pr-14 font-display text-lg leading-tight font-semibold">{ministry.name}</h3>

      <p className="text-sm text-muted-foreground">{ministry.description || 'Sem descrição.'}</p>

      <div className="mt-auto flex items-center gap-2 border-t border-border pt-3">
        {ministry.responsible ? (
          <>
            <Avatar name={ministry.responsible.name} size="sm" />
            <span className="truncate text-sm font-medium">{ministry.responsible.name}</span>
          </>
        ) : (
          <span className="text-sm text-muted-foreground">Sem responsável</span>
        )}
      </div>
    </div>
  )
}
