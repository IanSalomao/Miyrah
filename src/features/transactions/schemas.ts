// Schemas do formulário de transação — wiki/api/transactions.md
// Lógica de sinal: o usuário sempre digita a MAGNITUDE positiva e escolhe o
// Tipo; quem decide o sinal final é o backend a partir do `type` enviado.

import { z } from 'zod'
import type { CreateTransactionPayload, TransactionType } from '@/types'

export const transactionTypeOptions: { value: TransactionType; label: string }[] = [
  { value: 'income', label: 'Entrada' },
  { value: 'expense', label: 'Saída' },
]

const transactionShape = {
  type: z.enum(['income', 'expense'], { message: 'Selecione o tipo da transação.' }),
  // Magnitude positiva digitada pelo usuário — nunca o valor com sinal.
  value: z.coerce
    .number({ message: 'Informe um valor numérico.' })
    .positive('O valor deve ser maior que zero.'),
  date: z.string().min(1, 'Informe a data.'),
  categoryId: z.string().min(1, 'Selecione uma categoria.'),
  description: z.string().trim().max(500, 'Máximo de 500 caracteres.').optional().or(z.literal('')),
  memberId: z.string().optional().or(z.literal('')),
  ministryId: z.string().optional().or(z.literal('')),
}

/**
 * Cria o schema do formulário validando também a consistência tipo↔categoria
 * no cliente (espelha o 422 CATEGORY_TYPE_MISMATCH do backend, mas falha
 * antes do submit). `categoryTypeById` mapeia id da categoria → seu tipo.
 */
export function createTransactionSchema(categoryTypeById: Record<string, TransactionType>) {
  return z.object(transactionShape).superRefine((data, ctx) => {
    const categoryType = categoryTypeById[data.categoryId]
    if (categoryType && categoryType !== data.type) {
      ctx.addIssue({
        code: 'custom',
        path: ['categoryId'],
        message: 'A categoria selecionada não é do mesmo tipo da transação.',
      })
    }
  })
}

export type TransactionFormValues = z.infer<ReturnType<typeof createTransactionSchema>>

/**
 * Converte os valores do formulário (magnitude positiva + tipo) no payload
 * da API: `value` permanece positivo, `type` viaja junto — o backend aplica
 * o sinal. Campos opcionais vazios viram `null`/`undefined` conforme o caso.
 */
export function toTransactionPayload(values: TransactionFormValues): CreateTransactionPayload {
  return {
    type: values.type,
    value: Math.abs(values.value),
    date: values.date,
    categoryId: values.categoryId,
    description: values.description ? values.description : null,
    memberId: values.memberId ? values.memberId : null,
    ministryId: values.ministryId ? values.ministryId : null,
  }
}
