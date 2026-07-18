// Formulário de criar/editar transação — component_modal_form (variante
// "Formulário completo"). Ver wiki/pages/page_transactions.md e
// wiki/api/transactions.md (lógica de sinal).
//
// Modo edição: um único formulário, comportamento inalterado.
// Modo criação: drawer com N "cards" encadeados (Adicionar/Duplicar) — ver
// specs/transactions-batch-form.md. Cada card é validado e enviado
// individualmente (só existe POST /v1/transactions, sem endpoint em lote).

import { Fragment, useMemo, useRef, useState, type FormEvent } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { CopyIcon, PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FormDrawer } from '@/components/modal-form/form-drawer'
import { ApiError } from '@/lib/api-client'
import type { Transaction, TransactionType } from '@/types'
import {
  createTransactionSchema,
  toTransactionPayload,
  type TransactionFormValues,
} from '../schemas'
import { useCategoriesOptions } from '../hooks/use-categories-options'
import { useMinistriesOptions } from '../hooks/use-ministries-options'
import { useCreateTransactions, useUpdateTransaction } from '../hooks/use-transaction-mutations'
import type { MemberOption } from './member-picker'
import { TransactionFormFields } from './transaction-form-fields'
import {
  TransactionBatchFormCard,
  type TransactionBatchFormCardHandle,
} from './transaction-batch-form-card'

interface TransactionFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** `null`/`undefined` = criar; presente = editar. */
  transaction?: Transaction | null
}

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10)
}

function blankFormValues(): TransactionFormValues {
  return {
    type: 'income',
    value: 0,
    date: todayIsoDate(),
    categoryId: '',
    description: '',
    memberId: '',
    ministryId: '',
  }
}

function toDefaultValues(transaction: Transaction): TransactionFormValues {
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
 * Modo edição — um único formulário, sem encadeamento (comportamento
 * inalterado). Montado com `key` por registro (ver wrapper abaixo).
 */
function EditTransactionForm({
  open,
  onOpenChange,
  transaction,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction: Transaction
}) {
  const [member, setMember] = useState<MemberOption | null>(
    transaction.member ? { id: transaction.member.id, name: transaction.member.name } : null,
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
      await updateMutation.mutateAsync({ id: transaction.id, payload })
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

  const isSaving = isSubmitting || updateMutation.isPending

  return (
    <FormDrawer
      open={open}
      onOpenChange={onOpenChange}
      title="Editar transação"
      onSubmit={handleSubmit(onSubmit)}
      loading={isSaving}
    >
      <TransactionFormFields
        idPrefix="transaction"
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
    </FormDrawer>
  )
}

interface BatchEntry {
  uid: number
  initialValues: TransactionFormValues
  initialMember: MemberOption | null
}

/**
 * Modo criação — drawer com N cards encadeados. Cada card é independente
 * (próprio useForm/categorias/membro, ver `TransactionBatchFormCard`); esta
 * casca só orquestra a lista de cards e a submissão em lote.
 */
function CreateTransactionBatchForm({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  // Começa em 1 porque o primeiro card (estado inicial) já usa a uid 0 —
  // evita ler o ref durante a inicialização preguiçosa do useState (render).
  const nextUid = useRef(1)
  const cardHandles = useRef(new Map<number, TransactionBatchFormCardHandle>())

  function makeEntry(
    initialValues: TransactionFormValues = blankFormValues(),
    initialMember: MemberOption | null = null,
  ): BatchEntry {
    return { uid: nextUid.current++, initialValues, initialMember }
  }

  const [entries, setEntries] = useState<BatchEntry[]>(() => [
    { uid: 0, initialValues: blankFormValues(), initialMember: null },
  ])
  const createManyMutation = useCreateTransactions()

  function handleAddAfter(index: number) {
    setEntries((prev) => [...prev.slice(0, index + 1), makeEntry(), ...prev.slice(index + 1)])
  }

  function handleDuplicate(index: number) {
    const source = entries[index]
    const handle = cardHandles.current.get(source.uid)
    const values = handle?.getValues() ?? source.initialValues
    const member = handle?.getMember() ?? source.initialMember
    setEntries((prev) => [
      ...prev.slice(0, index + 1),
      makeEntry(values, member),
      ...prev.slice(index + 1),
    ])
  }

  function handleRemove(uid: number) {
    setEntries((prev) => prev.filter((entry) => entry.uid !== uid))
    cardHandles.current.delete(uid)
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const validated: { entry: BatchEntry; values: TransactionFormValues }[] = []
    let firstInvalidHandle: TransactionBatchFormCardHandle | null = null

    // Valida todos os cards (mesmo os posteriores ao primeiro inválido) para
    // que cada um mostre seu próprio erro inline de uma vez só.
    for (const entry of entries) {
      const handle = cardHandles.current.get(entry.uid)
      const values = handle?.validate() ?? null
      if (values) {
        validated.push({ entry, values })
      } else if (!firstInvalidHandle) {
        firstInvalidHandle = handle ?? null
      }
    }

    if (validated.length !== entries.length) {
      firstInvalidHandle?.scrollIntoView()
      return
    }

    const payloads = validated.map(({ values }) => toTransactionPayload(values))
    const results = await createManyMutation.mutateAsync(payloads)

    const remaining: BatchEntry[] = []
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        remaining.push(validated[index].entry)
      }
    })

    if (remaining.length === 0) {
      onOpenChange(false)
      return
    }

    // Sucesso parcial: mantém no drawer só os cards que falharam, com o
    // respectivo erro aplicado — os dados já digitados neles não se perdem
    // porque o card continua montado (mesma `uid`/`key`).
    setEntries(remaining)
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        const handle = cardHandles.current.get(validated[index].entry.uid)
        handle?.applyApiError(result.reason)
      }
    })
  }

  const count = entries.length
  const isSaving = createManyMutation.isPending

  return (
    <FormDrawer
      open={open}
      onOpenChange={onOpenChange}
      title="Adicionar transação"
      description={`${count} ${count === 1 ? 'transação encadeada' : 'transações encadeadas'}`}
      onSubmit={onSubmit}
      submitLabel={`Salvar ${count} ${count === 1 ? 'transação' : 'transações'}`}
      loading={isSaving}
    >
      <div className="flex flex-col">
        {entries.map((entry, index) => (
          <Fragment key={entry.uid}>
            <TransactionBatchFormCard
              ref={(handle) => {
                if (handle) cardHandles.current.set(entry.uid, handle)
                else cardHandles.current.delete(entry.uid)
              }}
              cardId={entry.uid}
              index={index}
              showRemove={entries.length > 1}
              initialValues={entry.initialValues}
              initialMember={entry.initialMember}
              onRemove={() => handleRemove(entry.uid)}
            />
            <div className="flex items-center justify-center gap-2 py-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddAfter(index)}
              >
                <PlusIcon className="size-3.5" />
                Adicionar
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleDuplicate(index)}
              >
                <CopyIcon className="size-3.5" />
                Duplicar
              </Button>
            </div>
          </Fragment>
        ))}
      </div>
    </FormDrawer>
  )
}

/**
 * Wrapper público: decide entre edição (um card) e criação (N cards
 * encadeados) e remonta a árvore inteira (via `key`) a cada abertura — o que
 * garante que o modo criação sempre comece com 1 card em branco.
 */
export function TransactionFormModal({
  open,
  onOpenChange,
  transaction,
}: TransactionFormModalProps) {
  if (!open) return null
  if (transaction) {
    return (
      <EditTransactionForm
        key={transaction.id}
        open={open}
        onOpenChange={onOpenChange}
        transaction={transaction}
      />
    )
  }
  return <CreateTransactionBatchForm key="create" open={open} onOpenChange={onOpenChange} />
}
