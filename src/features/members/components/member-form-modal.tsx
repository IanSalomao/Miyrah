// Modal de criação/edição de membro — component_modal_form.md (variante "Formulário completo").
// Mesmo formulário reaproveitado para criar e editar (page_members.md).

import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { ModalForm } from '@/components/modal-form/modal-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ApiError } from '@/lib/api-client'
import { maskPhone } from '@/lib/format'
import type { Member } from '@/types'
import { useCreateMember, useUpdateMember } from '../hooks/use-members'
import {
  emptyMemberFormValues,
  memberFormSchema,
  toMemberPayload,
  type MemberFormValues,
} from '../schemas'

interface MemberFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Membro em edição — `null`/`undefined` abre na variante de criação. */
  member?: Member | null
}

const FIELD_NAMES = new Set<keyof MemberFormValues>([
  'name',
  'birthDate',
  'baptismDate',
  'email',
  'phone',
])

export function MemberFormModal({ open, onOpenChange, member }: MemberFormModalProps) {
  const isEditing = Boolean(member)
  const createMutation = useCreateMember()
  const updateMutation = useUpdateMember()
  const isSubmitting = createMutation.isPending || updateMutation.isPending

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<MemberFormValues>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: emptyMemberFormValues,
  })

  // Preenche o formulário ao abrir (edição) ou zera (criação).
  useEffect(() => {
    if (!open) return
    reset(
      member
        ? {
            name: member.name,
            birthDate: member.birthDate ?? '',
            baptismDate: member.baptismDate ?? '',
            email: member.email ?? '',
            phone: member.phone ? maskPhone(member.phone) : '',
          }
        : emptyMemberFormValues,
    )
  }, [open, member, reset])

  const phoneField = register('phone')

  function onSubmit(values: MemberFormValues) {
    const payload = toMemberPayload(values)
    const submit =
      isEditing && member
        ? updateMutation.mutateAsync({ id: member.id, payload })
        : createMutation.mutateAsync(payload)

    submit
      .then(() => {
        onOpenChange(false)
      })
      .catch((error: unknown) => {
        if (!(error instanceof ApiError)) return

        if (error.details && error.details.length > 0) {
          for (const detail of error.details) {
            if (FIELD_NAMES.has(detail.field as keyof MemberFormValues)) {
              setError(detail.field as keyof MemberFormValues, { message: detail.message })
            }
          }
          return
        }

        // Membro já não existe mais: fecha o modal (a lista já foi invalidada pela mutation).
        if (isEditing && error.code === 'RESOURCE_NOT_FOUND') {
          onOpenChange(false)
        }
      })
  }

  return (
    <ModalForm
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Editar membro' : 'Adicionar membro'}
      onSubmit={handleSubmit(onSubmit)}
      loading={isSubmitting}
      submitLabel={isEditing ? 'Salvar' : 'Adicionar'}
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="member-name">Nome</Label>
        <Input
          id="member-name"
          autoFocus
          aria-invalid={Boolean(errors.name)}
          {...register('name')}
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="member-birth-date">Data de Nascimento</Label>
          <Input
            id="member-birth-date"
            type="date"
            aria-invalid={Boolean(errors.birthDate)}
            {...register('birthDate')}
          />
          {errors.birthDate && (
            <p className="text-sm text-destructive">{errors.birthDate.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="member-baptism-date">Data de Batismo</Label>
          <Input
            id="member-baptism-date"
            type="date"
            aria-invalid={Boolean(errors.baptismDate)}
            {...register('baptismDate')}
          />
          {errors.baptismDate && (
            <p className="text-sm text-destructive">{errors.baptismDate.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="member-email">Email</Label>
        <Input
          id="member-email"
          type="email"
          aria-invalid={Boolean(errors.email)}
          {...register('email')}
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="member-phone">Telefone</Label>
        <Input
          id="member-phone"
          type="tel"
          aria-invalid={Boolean(errors.phone)}
          {...phoneField}
          onChange={(event) => {
            event.target.value = maskPhone(event.target.value)
            phoneField.onChange(event)
          }}
        />
        {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
      </div>
    </ModalForm>
  )
}
