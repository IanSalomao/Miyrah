// Confirmação de exclusão de ministério — wiki/pages/page_ministries.md
// (variante "Confirmação" de component_modal_form). Soft delete via DELETE /v1/ministries/{id}.

import { ApiError } from '@/lib/api-client'
import { ConfirmModal } from '@/components/modal-form/confirm-modal'
import { useRemoveMinistry } from '../hooks/use-ministries'
import type { Ministry } from '@/types'

export interface DeleteMinistryDialogProps {
  ministry: Ministry | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteMinistryDialog({ ministry, open, onOpenChange }: DeleteMinistryDialogProps) {
  const removeMutation = useRemoveMinistry()

  function handleConfirm() {
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
    <ConfirmModal
      open={open}
      onOpenChange={onOpenChange}
      title="Excluir ministério"
      description={
        ministry
          ? `Tem certeza de que deseja excluir "${ministry.name}"? Esta ação não pode ser desfeita.`
          : ''
      }
      confirmLabel="Excluir"
      onConfirm={handleConfirm}
      loading={removeMutation.isPending}
    />
  )
}
