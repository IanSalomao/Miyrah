// Início — wiki/pages/page_home.md ("Editar transação a partir da Início")
// Reaproveita component_modal_form na variante "Formulário completo" com os
// mesmos campos/regras de wiki/pages/page_transactions.md: Tipo, Valor, Data,
// Categoria, Descrição, Membro, Ministério.

import { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, ChevronsUpDown } from 'lucide-react'
import { ModalForm } from '@/components/modal-form/modal-form'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { ApiError } from '@/lib/api-client'
import { transactionEditSchema, type TransactionEditFormValues } from '../schemas'
import { useCategoriesByType } from '../hooks/use-categories-by-type'
import { useMembersSearch } from '../hooks/use-members-search'
import { useMinistries } from '../hooks/use-ministries'
import { useUpdateTransaction } from '../hooks/use-update-transaction'
import type { Transaction } from '@/types'

const NO_MINISTRY = '__none__'

export interface TransactionEditModalProps {
  transaction: Transaction
  open: boolean
  onOpenChange: (open: boolean) => void
  /** 404 RESOURCE_NOT_FOUND: fecha o modal e quem chama recarrega a lista. */
  onNotFound?: () => void
}

export function TransactionEditModal({
  transaction,
  open,
  onOpenChange,
  onNotFound,
}: TransactionEditModalProps) {
  const [memberSearch, setMemberSearch] = useState('')
  const [memberPopoverOpen, setMemberPopoverOpen] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const {
    control,
    register,
    handleSubmit,
    watch,
    getValues,
    setValue,
    setError,
    formState: { errors },
  } = useForm<TransactionEditFormValues>({
    resolver: zodResolver(transactionEditSchema),
    defaultValues: {
      type: transaction.type,
      value: Math.abs(transaction.value),
      date: transaction.date,
      categoryId: transaction.category.id,
      description: transaction.description ?? '',
      memberId: transaction.member?.id ?? null,
      ministryId: transaction.ministry?.id ?? null,
    },
  })

  const type = watch('type')
  const memberId = watch('memberId')

  const categoriesQuery = useCategoriesByType(type)
  const membersQuery = useMembersSearch(memberSearch, memberPopoverOpen)
  const ministriesQuery = useMinistries()
  const updateTransactionMutation = useUpdateTransaction()

  // Ao trocar o Tipo, a Categoria já escolhida é limpa se não for compatível.
  useEffect(() => {
    if (!categoriesQuery.data) return
    const current = getValues('categoryId')
    if (current && !categoriesQuery.data.items.some((category) => category.id === current)) {
      setValue('categoryId', '')
    }
  }, [type, categoriesQuery.data, getValues, setValue])

  useEffect(() => {
    if (!open) {
      setFormError(null)
      setMemberSearch('')
    }
  }, [open])

  const selectedMemberName = useMemo(() => {
    if (!memberId) return null
    if (transaction.member?.id === memberId) return transaction.member.name
    return membersQuery.data?.items.find((member) => member.id === memberId)?.name ?? null
  }, [memberId, membersQuery.data, transaction.member])

  const categories = categoriesQuery.data?.items ?? []
  const ministries = ministriesQuery.data?.items ?? []
  const members = membersQuery.data?.items ?? []

  function onSubmit(values: TransactionEditFormValues) {
    setFormError(null)
    updateTransactionMutation.mutate(
      {
        id: transaction.id,
        payload: {
          type: values.type,
          value: values.value,
          date: values.date,
          categoryId: values.categoryId,
          description: values.description || null,
          memberId: values.memberId || null,
          ministryId: values.ministryId || null,
        },
      },
      {
        onSuccess: () => onOpenChange(false),
        onError: (error) => {
          if (!(error instanceof ApiError)) {
            setFormError('Ocorreu um erro inesperado. Tente novamente.')
            return
          }
          if (error.code === 'RESOURCE_NOT_FOUND') {
            onOpenChange(false)
            onNotFound?.()
            return
          }
          if (error.code === 'CATEGORY_TYPE_MISMATCH') {
            setError('categoryId', { message: error.message })
            return
          }
          if (error.code === 'VALIDATION_ERROR' && error.details) {
            for (const detail of error.details) {
              setError(detail.field as keyof TransactionEditFormValues, {
                message: detail.message,
              })
            }
            return
          }
          setFormError(error.message)
        },
      },
    )
  }

  return (
    <ModalForm
      open={open}
      onOpenChange={onOpenChange}
      title="Editar transação"
      variant="form"
      onSubmit={handleSubmit(onSubmit)}
      isSubmitting={updateTransactionMutation.isPending}
    >
      {formError && (
        <p role="alert" className="text-sm text-expense">
          {formError}
        </p>
      )}

      <Field>
        <FieldLabel htmlFor="transaction-edit-type">Tipo</FieldLabel>
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="transaction-edit-type" className="w-full">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Entrada</SelectItem>
                <SelectItem value="expense">Saída</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        <FieldError errors={[errors.type]} />
      </Field>

      <Field>
        <FieldLabel htmlFor="transaction-edit-value">Valor</FieldLabel>
        <Input
          id="transaction-edit-value"
          type="number"
          step="0.01"
          min="0"
          className="text-right font-mono"
          aria-invalid={!!errors.value}
          {...register('value', { valueAsNumber: true })}
        />
        <FieldError errors={[errors.value]} />
      </Field>

      <Field>
        <FieldLabel htmlFor="transaction-edit-date">Data</FieldLabel>
        <Input
          id="transaction-edit-date"
          type="date"
          aria-invalid={!!errors.date}
          {...register('date')}
        />
        <FieldError errors={[errors.date]} />
      </Field>

      <Field>
        <FieldLabel htmlFor="transaction-edit-category">Categoria</FieldLabel>
        <Controller
          control={control}
          name="categoryId"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger
                id="transaction-edit-category"
                className="w-full"
                aria-invalid={!!errors.categoryId}
              >
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <span className="flex items-center gap-2">
                      <span
                        className="size-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: category.color }}
                        aria-hidden
                      />
                      {category.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <FieldError errors={[errors.categoryId]} />
      </Field>

      <Field>
        <FieldLabel htmlFor="transaction-edit-description">Descrição</FieldLabel>
        <Textarea id="transaction-edit-description" rows={2} {...register('description')} />
        <FieldError errors={[errors.description]} />
      </Field>

      <Field>
        <FieldLabel>Membro</FieldLabel>
        <Popover open={memberPopoverOpen} onOpenChange={setMemberPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              role="combobox"
              aria-expanded={memberPopoverOpen}
              className="w-full justify-between font-normal"
            >
              {selectedMemberName ?? 'Nenhum membro vinculado'}
              <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
            <Command shouldFilter={false}>
              <CommandInput
                placeholder="Buscar membro…"
                value={memberSearch}
                onValueChange={setMemberSearch}
              />
              <CommandList>
                <CommandEmpty>Nenhum membro encontrado.</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    value={NO_MINISTRY}
                    onSelect={() => {
                      setValue('memberId', null)
                      setMemberPopoverOpen(false)
                    }}
                  >
                    <Check className={cn('mr-2 size-4', memberId ? 'opacity-0' : 'opacity-100')} />
                    Nenhum membro vinculado
                  </CommandItem>
                  {members.map((member) => (
                    <CommandItem
                      key={member.id}
                      value={member.id}
                      onSelect={() => {
                        setValue('memberId', member.id)
                        setMemberPopoverOpen(false)
                      }}
                    >
                      <Check
                        className={cn(
                          'mr-2 size-4',
                          memberId === member.id ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                      {member.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </Field>

      <Field>
        <FieldLabel htmlFor="transaction-edit-ministry">Ministério</FieldLabel>
        <Controller
          control={control}
          name="ministryId"
          render={({ field }) => (
            <Select
              value={field.value ?? NO_MINISTRY}
              onValueChange={(value) => field.onChange(value === NO_MINISTRY ? null : value)}
            >
              <SelectTrigger id="transaction-edit-ministry" className="w-full">
                <SelectValue placeholder="Nenhum ministério vinculado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_MINISTRY}>Nenhum ministério vinculado</SelectItem>
                {ministries.map((ministry) => (
                  <SelectItem key={ministry.id} value={ministry.id}>
                    {ministry.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </Field>
    </ModalForm>
  )
}
