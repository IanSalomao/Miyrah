// Confirmação de exclusão de categoria — wiki/api/categories.md (DELETE /v1/categories/{id}).
// Exclusão sempre permitida, mesmo com transações vinculadas (soft delete).
import { useState } from 'react'
import { ConfirmModal } from '@/components/modal-form/confirm-modal'
import { ApiError } from '@/lib/api-client'
import { useDeleteCategory } from '../hooks/use-category-mutations'
import type { Category } from '@/types'

interface CategoryDeleteModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: Category | null
  onDeleted: () => void
}

export function CategoryDeleteModal({
  open,
  onOpenChange,
  category,
  onDeleted,
}: CategoryDeleteModalProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const deleteCategory = useDeleteCategory()

  function handleConfirm() {
    if (!category) return
    setErrorMessage(null)
    deleteCategory.mutate(category.id, {
      onSuccess: () => {
        onDeleted()
        onOpenChange(false)
      },
      onError: (error) => {
        // 404: categoria já não existe — fecha e a listagem recarrega pela invalidação.
        if (error instanceof ApiError && error.code === 'RESOURCE_NOT_FOUND') {
          onDeleted()
          onOpenChange(false)
          return
        }
        setErrorMessage(
          error instanceof ApiError
            ? error.message
            : 'Ocorreu um erro inesperado. Tente novamente.',
        )
      },
    })
  }

  return (
    <ConfirmModal
      open={open}
      onOpenChange={onOpenChange}
      title="Excluir categoria"
      description={
        <>
          Tem certeza que deseja excluir{' '}
          <span className="font-medium text-foreground">{category?.name}</span>? Transações antigas
          continuarão exibindo o nome, com indicação de excluída.
        </>
      }
      onConfirm={handleConfirm}
      loading={deleteCategory.isPending}
    >
      {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}
    </ConfirmModal>
  )
}
