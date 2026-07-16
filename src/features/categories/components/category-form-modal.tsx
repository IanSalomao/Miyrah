// Modal de criação/edição de categoria — wiki/pages/page_categories.md,
// wiki/components/component_modal_form.md (variante "Formulário completo").
// Regra de negócio (CLAUDE.md): o Tipo é imutável após a criação — desabilitado na edição
// e nunca enviado no payload de PATCH.
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormModal } from '@/components/modal-form/modal-form'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ApiError } from '@/lib/api-client'
import { useCreateCategory, useUpdateCategory } from '../hooks/use-category-mutations'
import { categoryFormSchema, type CategoryFormValues } from '../schemas'
import type { Category, TransactionType } from '@/types'

const TYPE_LABELS: Record<TransactionType, string> = {
  income: 'Entrada',
  expense: 'Saída',
}

const DEFAULT_COLOR = '#2B5C4F'

interface CategoryFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Categoria em edição — ausente indica criação. */
  category?: Category | null
  /** Tipo da aba ativa no momento em que o modal de criação foi aberto. */
  defaultType: TransactionType
  onNotFound?: () => void
}

export function CategoryFormModal({
  open,
  onOpenChange,
  category,
  defaultType,
  onNotFound,
}: CategoryFormModalProps) {
  const isEditing = Boolean(category)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const isSubmitting = createCategory.isPending || updateCategory.isPending

  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: category?.name ?? '',
      description: category?.description ?? '',
      type: category?.type ?? defaultType,
      color: category?.color ?? DEFAULT_COLOR,
    },
  })

  function handleApiError(error: unknown) {
    if (error instanceof ApiError) {
      if (error.code === 'RESOURCE_NOT_FOUND') {
        onNotFound?.()
        onOpenChange(false)
        return
      }
      if (error.details) {
        for (const detail of error.details) {
          if (detail.field in ({ name: 0, description: 0, type: 0, color: 0 } as const)) {
            setError(detail.field as keyof CategoryFormValues, { message: detail.message })
          }
        }
      }
      setErrorMessage(error.message)
      return
    }
    setErrorMessage('Ocorreu um erro inesperado. Tente novamente.')
  }

  const onSubmit = handleSubmit((values) => {
    setErrorMessage(null)
    const description = values.description ? values.description : null

    if (isEditing && category) {
      updateCategory.mutate(
        { id: category.id, payload: { name: values.name, description, color: values.color } },
        { onSuccess: () => onOpenChange(false), onError: handleApiError },
      )
      return
    }

    createCategory.mutate(
      { name: values.name, description, type: values.type, color: values.color },
      { onSuccess: () => onOpenChange(false), onError: handleApiError },
    )
  })

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Editar categoria' : 'Adicionar categoria'}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      errorMessage={errorMessage}
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="category-name">Nome</Label>
        <Input id="category-name" aria-invalid={Boolean(errors.name)} {...register('name')} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="category-description">Descrição</Label>
        <Textarea id="category-description" {...register('description')} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="category-type">Tipo</Label>
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange} disabled={isEditing}>
              <SelectTrigger id="category-type" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">{TYPE_LABELS.income}</SelectItem>
                <SelectItem value="expense">{TYPE_LABELS.expense}</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {isEditing && (
          <p className="text-xs text-muted-foreground">
            O tipo não pode ser alterado após a criação.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="category-color">Cor</Label>
        <Controller
          control={control}
          name="color"
          render={({ field }) => (
            <div className="flex items-center gap-2">
              <input
                id="category-color"
                type="color"
                value={field.value}
                onChange={(event) => field.onChange(event.target.value)}
                className="h-8 w-10 shrink-0 rounded-md border border-input bg-transparent p-0.5"
                aria-label="Selecionar cor da categoria"
              />
              <Input
                value={field.value}
                onChange={(event) => field.onChange(event.target.value)}
                aria-invalid={Boolean(errors.color)}
                className="font-mono"
                maxLength={7}
              />
            </div>
          )}
        />
        {errors.color && <p className="text-xs text-destructive">{errors.color.message}</p>}
      </div>
    </FormModal>
  )
}
