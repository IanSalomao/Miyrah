// Formulário de criar/editar transação — component_modal_form (variante
// "Formulário completo"). Ver wiki/pages/page_transactions.md e
// wiki/api/transactions.md (lógica de sinal).

import { useMemo, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { SegmentedControl } from './segmented-control'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FormDrawer } from '@/components/modal-form/form-drawer'
import { ApiError } from '@/lib/api-client'
import type { Transaction, TransactionType } from '@/types'
import {
  createTransactionSchema,
  toTransactionPayload,
  transactionTypeOptions,
  type TransactionFormValues,
} from '../schemas'
import { useCategoriesOptions } from '../hooks/use-categories-options'
import { useMinistriesOptions } from '../hooks/use-ministries-options'
import { useCreateTransaction, useUpdateTransaction } from '../hooks/use-transaction-mutations'
import { MemberPicker, type MemberOption } from './member-picker'

interface TransactionFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** `null`/`undefined` = criar; presente = editar. */
  transaction?: Transaction | null
}

function toDefaultValues(transaction?: Transaction | null): TransactionFormValues {
  if (!transaction) {
    return {
      type: 'income',
      value: 0,
      date: new Date().toISOString().slice(0, 10),
      categoryId: '',
      description: '',
      memberId: '',
      ministryId: '',
    }
  }
  return {
    type: transaction.type,
    value: Math.abs(transaction.value),
    date: transaction.date,
    categoryId: transaction.category.id,
    description: transaction.description ?? '',
    memberId: transaction.member?.id ?? '',
    ministryId: transaction.ministry?.id ?? '',
  }
}

/**
 * Formulário propriamente dito. Montado com `key` diferente por registro
 * (ver `TransactionFormModal` abaixo) — cada abertura do modal para um
 * registro diferente remonta o componente, o que reinicializa
 * `useForm`/`useState` sem precisar de `useEffect` + `setState`.
 */
function TransactionForm({ open, onOpenChange, transaction }: TransactionFormModalProps) {
  const isEditing = Boolean(transaction)
  const [member, setMember] = useState<MemberOption | null>(
    transaction?.member ? { id: transaction.member.id, name: transaction.member.name } : null,
  )

  const {
    control,
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormValues>({
    defaultValues: toDefaultValues(transaction),
  })

  const watchedType = useWatch({ control, name: 'type' })

  const categoriesQuery = useCategoriesOptions(watchedType)
  const ministriesQuery = useMinistriesOptions()
  const createMutation = useCreateTransaction()
  const updateMutation = useUpdateTransaction()

  const categoryOptions = useMemo(() => categoriesQuery.data?.items ?? [], [categoriesQuery.data])
  const categoryTypeById = useMemo(
    () => Object.fromEntries(categoryOptions.map((c) => [c.id, c.type])),
    [categoryOptions],
  )
  const schema = useMemo(() => createTransactionSchema(categoryTypeById), [categoryTypeById])

  function handleTypeChange(nextType: TransactionType) {
    setValue('type', nextType)
    setValue('categoryId', '')
  }

  async function onSubmit(values: TransactionFormValues) {
    const parsed = schema.safeParse(values)
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof TransactionFormValues
        setError(field, { message: issue.message })
      }
      return
    }

    const payload = toTransactionPayload(parsed.data)

    try {
      if (isEditing && transaction) {
        await updateMutation.mutateAsync({ id: transaction.id, payload })
      } else {
        await createMutation.mutateAsync(payload)
      }
      onOpenChange(false)
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.code === 'CATEGORY_TYPE_MISMATCH') {
          setError('categoryId', { message: error.message })
          return
        }
        if (error.code === 'RESOURCE_NOT_FOUND') {
          onOpenChange(false)
          return
        }
        if (error.code === 'VALIDATION_ERROR' && error.details) {
          for (const detail of error.details) {
            setError(detail.field as keyof TransactionFormValues, { message: detail.message })
          }
          return
        }
      }
    }
  }

  const isSaving = isSubmitting || createMutation.isPending || updateMutation.isPending

  return (
    <FormDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Editar transação' : 'Adicionar transação'}
      onSubmit={handleSubmit(onSubmit)}
      loading={isSaving}
    >
      <div className="flex flex-col gap-1.5">
        <Label>Tipo</Label>
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <SegmentedControl
              aria-label="Tipo da transação"
              value={field.value}
              onChange={handleTypeChange}
              options={transactionTypeOptions}
            />
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="transaction-value">Valor</Label>
          <Input
            id="transaction-value"
            type="number"
            step="0.01"
            min="0.01"
            inputMode="decimal"
            className="font-mono"
            aria-invalid={Boolean(errors.value)}
            {...register('value')}
          />
          {errors.value && <p className="text-xs text-destructive">{errors.value.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="transaction-date">Data</Label>
          <Input
            id="transaction-date"
            type="date"
            aria-invalid={Boolean(errors.date)}
            {...register('date')}
          />
          {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="transaction-category">Categoria</Label>
        <Controller
          control={control}
          name="categoryId"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger
                id="transaction-category"
                className="w-full"
                aria-invalid={Boolean(errors.categoryId)}
              >
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <span
                      aria-hidden="true"
                      className="inline-block size-2.5 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.categoryId && (
          <p className="text-xs text-destructive">{errors.categoryId.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="transaction-description">Descrição</Label>
        <Input id="transaction-description" {...register('description')} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Membro (opcional)</Label>
        <MemberPicker
          value={member}
          onChange={(next) => {
            setMember(next)
            setValue('memberId', next?.id ?? '')
          }}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="transaction-ministry">Ministério (opcional)</Label>
        <Controller
          control={control}
          name="ministryId"
          render={({ field }) => (
            <Select
              value={field.value || 'none'}
              onValueChange={(next) => field.onChange(next === 'none' ? '' : next)}
            >
              <SelectTrigger id="transaction-ministry" className="w-full">
                <SelectValue placeholder="Nenhum ministério" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhum</SelectItem>
                {(ministriesQuery.data?.items ?? []).map((ministry) => (
                  <SelectItem key={ministry.id} value={ministry.id}>
                    {ministry.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>
    </FormDrawer>
  )
}

/**
 * Wrapper público: remonta `TransactionForm` (via `key`) sempre que o modal
 * abre para um registro diferente (ou para criar), garantindo que o
 * formulário comece do zero sem precisar sincronizar estado em um efeito.
 */
export function TransactionFormModal(props: TransactionFormModalProps) {
  if (!props.open) return null
  return <TransactionForm key={props.transaction?.id ?? 'create'} {...props} />
}
