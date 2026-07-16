// Confirmação de exclusão de membro — component_modal_form.md (variante "Confirmação").
// Exclusão é soft delete via DELETE (page_members.md).

import { ConfirmModal } from '@/components/modal-form/confirm-modal'
import { ApiError } from '@/lib/api-client'
import type { Member } from '@/types'
import { useDeleteMember } from '../hooks/use-members'

interface MemberDeleteModalProps {
  member: Member | null
  onOpenChange: (open: boolean) => void
}

export function MemberDeleteModal({ member, onOpenChange }: MemberDeleteModalProps) {
  const deleteMutation = useDeleteMember()

  function handleConfirm() {
    if (!member) return
    deleteMutation.mutate(member.id, {
      onSuccess: () => {
        onOpenChange(false)
      },
      onError: (error: unknown) => {
        // 404 RESOURCE_NOT_FOUND: membro já não existe — fecha o modal e a lista já foi recarregada.
        if (error instanceof ApiError && error.code === 'RESOURCE_NOT_FOUND') {
          onOpenChange(false)
        }
      },
    })
  }

  return (
    <ConfirmModal
      open={Boolean(member)}
      onOpenChange={onOpenChange}
      title="Excluir membro"
      description={
        member
          ? `Tem certeza de que deseja excluir "${member.name}"? Essa ação não pode ser desfeita.`
          : ''
      }
      onConfirm={handleConfirm}
      loading={deleteMutation.isPending}
    />
  )
}
