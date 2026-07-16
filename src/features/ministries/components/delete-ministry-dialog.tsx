// Confirmação de exclusão de ministério — wiki/pages/page_ministries.md
// (variante "Confirmação" de component_modal_form). Soft delete via DELETE /v1/ministries/{id}.

import type { FormEvent } from 'react'
import { ApiError } from '@/lib/api-client'
import { ModalForm } from '@/components/modal-form/modal-form'
import { useRemoveMinistry } from '../hooks/use-ministries'
import type { Ministry } from '@/types'

export interface DeleteMinistryDialogProps {
  ministry: Ministry | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteMinistryDialog({ ministry, open, onOpenChange }: DeleteMinistryDialogProps) {
  const removeMutation = useRemoveMinistry()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!ministry) return

    removeMutation.mutate(ministry.id, {
      onSuccess: () => onOpenChange(false),
      onError: (error: unknown) => {
        // 404 (ministério já não existe): fecha o modal e a grid recarrega via invalidate.
        if (error instanceof ApiError && error.code === 'RESOURCE_NOT_FOUND') {
          onOpenChange(false)
        }
      },
    })
  }

  return (
    <ModalForm
      open={open}
      onOpenChange={onOpenChange}
      title="Excluir ministério"
      description={
        ministry
          ? `Tem certeza de que deseja excluir "${ministry.name}"? Esta ação não pode ser desfeita.`
          : undefined
      }
      onSubmit={handleSubmit}
      submitLabel="Excluir"
      variant="destructive"
      isSubmitting={removeMutation.isPending}
    />
  )
}
