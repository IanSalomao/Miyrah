// Modal de criar/editar ministério — wiki/pages/page_ministries.md (variante
// "Formulário completo" de component_modal_form). Campos: Nome, Descrição, Responsável.

import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { ApiError } from '@/lib/api-client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { FormDrawer } from '@/components/modal-form/form-drawer'
import { MemberPicker } from '@/components/member-picker/member-picker'
import { useCreateMinistry, useUpdateMinistry } from '../hooks/use-ministries'
import { ministryFormSchema, type MinistryFormValues } from '../schemas'
import type { Ministry } from '@/types'

export interface MinistryFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Ministério em edição, ou `null`/`undefined` para criar um novo. */
  ministry?: Ministry | null
}

export function MinistryFormModal({ open, onOpenChange, ministry }: MinistryFormModalProps) {
  const isEditing = Boolean(ministry)
  const createMutation = useCreateMinistry()
  const updateMutation = useUpdateMinistry()
  const isSubmitting = createMutation.isPending || updateMutation.isPending

  const [responsibleLabel, setResponsibleLabel] = useState<string | null>(null)

  const form = useForm<MinistryFormValues>({
    resolver: zodResolver(ministryFormSchema),
    defaultValues: { name: '', description: '', responsibleId: null },
  })

  // Reidrata o formulário sempre que o modal abre (criação limpa, edição preenchida).
  useEffect(() => {
    if (!open) return
    form.reset({
      name: ministry?.name ?? '',
      description: ministry?.description ?? '',
      responsibleId: ministry?.responsible?.id ?? null,
    })
    setResponsibleLabel(ministry?.responsible?.name ?? null)
  }, [open, ministry, form])

  function handleSubmit(values: MinistryFormValues) {
    const payload = {
      name: values.name.trim(),
      description: values.description?.trim() ? values.description.trim() : null,
      responsibleId: values.responsibleId ?? null,
    }

    const submit = isEditing
      ? updateMutation.mutateAsync({ id: ministry!.id, payload })
      : createMutation.mutateAsync(payload)

    submit
      .then(() => onOpenChange(false))
      .catch((error: unknown) => {
        if (!(error instanceof ApiError)) return

        if (error.code === 'RESOURCE_NOT_FOUND') {
          if (isEditing) {
            // Ministério não encontrado — fecha o modal (a grid já recarrega via invalidate).
            onOpenChange(false)
            return
          }
          // Criação: 404 é o membro responsável não encontrado.
          form.setError('responsibleId', { message: error.message })
          return
        }

        if (error.code === 'VALIDATION_ERROR' && error.details) {
          for (const detail of error.details) {
            form.setError(detail.field as keyof MinistryFormValues, { message: detail.message })
          }
          return
        }

        form.setError('name', { message: error.message })
      })
  }

  return (
    <FormDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Editar ministério' : 'Adicionar ministério'}
      onSubmit={form.handleSubmit(handleSubmit)}
      submitLabel={isEditing ? 'Salvar alterações' : 'Adicionar'}
      loading={isSubmitting}
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="ministry-name">Nome</Label>
        <Input
          id="ministry-name"
          aria-invalid={Boolean(form.formState.errors.name)}
          {...form.register('name')}
        />
        {form.formState.errors.name && (
          <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="ministry-description">Descrição</Label>
        <Textarea id="ministry-description" {...form.register('description')} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Responsável</Label>
        <MemberPicker
          value={form.watch('responsibleId') ?? null}
          label={responsibleLabel}
          disabled={isSubmitting}
          onSelect={(member) => {
            form.setValue('responsibleId', member?.id ?? null, {
              shouldValidate: true,
              shouldDirty: true,
            })
            setResponsibleLabel(member?.name ?? null)
          }}
        />
        {form.formState.errors.responsibleId && (
          <p className="text-sm text-destructive">{form.formState.errors.responsibleId.message}</p>
        )}
      </div>
    </FormDrawer>
  )
}
