// Card individual do modo criação em lote (lançamentos encadeados) do
// TransactionFormModal — ver specs/transactions-batch-form.md. Cada card é um
// formulário independente (seu próprio useForm/categorias/membro), exposto ao
// pai via ref imperativa para validar, ler valores, duplicar e aplicar erros
// de API vindos da submissão individual (POST /v1/transactions por card).

import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Trash2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ApiError } from '@/lib/api-client'
import type { TransactionType } from '@/types'
import { createTransactionSchema, type TransactionFormValues } from '../schemas'
import { useCategoriesOptions } from '../hooks/use-categories-options'
import { useMinistriesOptions } from '../hooks/use-ministries-options'
import { TransactionFormFields } from './transaction-form-fields'
import type { MemberOption } from './member-picker'

export interface TransactionBatchFormCardHandle {
  /** Valores atuais do card (usado por "Duplicar"). */
  getValues: () => TransactionFormValues
  getMember: () => MemberOption | null
  /** Valida o card (schema tipo↔categoria incluso); em caso de erro, marca os
   * campos inline e retorna `null` — em caso de sucesso, retorna os valores
   * já validados. */
  validate: () => TransactionFormValues | null
  /** Aplica o erro retornado pela API para este card específico. */
  applyApiError: (error: unknown) => void
  /** Rola a tela até este card (usado ao bloquear o submit por card inválido). */
  scrollIntoView: () => void
}

interface TransactionBatchFormCardProps {
  cardId: number
  index: number
  showRemove: boolean
  initialValues: TransactionFormValues
  initialMember: MemberOption | null
  onRemove: () => void
}

export const TransactionBatchFormCard = forwardRef<
  TransactionBatchFormCardHandle,
  TransactionBatchFormCardProps
>(function TransactionBatchFormCard(
  { cardId, index, showRemove, initialValues, initialMember, onRemove },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [member, setMember] = useState<MemberOption | null>(initialMember)
  const [cardError, setCardError] = useState<string | null>(null)
  const idPrefix = `batch-card-${cardId}`

  const {
    control,
    register,
    getValues,
    setValue,
    setError,
    formState: { errors },
  } = useForm<TransactionFormValues>({ defaultValues: initialValues })

  const watchedType = useWatch({ control, name: 'type' })

  const categoriesQuery = useCategoriesOptions(watchedType)
  const ministriesQuery = useMinistriesOptions()

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

  useImperativeHandle(ref, () => ({
    getValues,
    getMember: () => member,
    validate: () => {
      const parsed = schema.safeParse(getValues())
      if (!parsed.success) {
        for (const issue of parsed.error.issues) {
          setError(issue.path[0] as keyof TransactionFormValues, { message: issue.message })
        }
        return null
      }
      return parsed.data
    },
    applyApiError: (error: unknown) => {
      setCardError(null)
      if (error instanceof ApiError) {
        if (error.code === 'CATEGORY_TYPE_MISMATCH') {
          setError('categoryId', { message: error.message })
          return
        }
        if (error.code === 'VALIDATION_ERROR' && error.details) {
          for (const detail of error.details) {
            setError(detail.field as keyof TransactionFormValues, { message: detail.message })
          }
          return
        }
        setCardError(error.message)
        return
      }
      setCardError('Não foi possível salvar este lançamento.')
    },
    scrollIntoView: () => {
      containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    },
  }))

  return (
    <div
      ref={containerRef}
      className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          Lançamento #{index + 1}
        </span>
        {showRemove && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Remover lançamento #${index + 1}`}
            onClick={onRemove}
          >
            <Trash2Icon className="size-4" />
          </Button>
        )}
      </div>

      {cardError && <p className="text-xs text-destructive">{cardError}</p>}

      <TransactionFormFields
        idPrefix={idPrefix}
        control={control}
        register={register}
        errors={errors}
        watchedType={watchedType}
        onTypeChange={handleTypeChange}
        categoryOptions={categoryOptions}
        ministryOptions={ministriesQuery.data?.items ?? []}
        member={member}
        onMemberChange={(next) => {
          setMember(next)
          setValue('memberId', next?.id ?? '')
        }}
      />
    </div>
  )
})
