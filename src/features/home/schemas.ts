// Schema do formulário de edição de transação (modal aberto a partir do
// bloco "Últimas transações" da Início) — wiki/api/transactions.md.
// No formulário o valor é sempre digitado positivo; o Tipo define o sinal.

import { z } from 'zod'

export const transactionEditSchema = z.object({
  type: z.enum(['income', 'expense']),
  value: z.number('Informe um valor.').positive('O valor deve ser maior que zero.'),
  date: z.string().min(1, 'Informe a data.'),
  categoryId: z.string().min(1, 'Selecione uma categoria.'),
  description: z.string().optional(),
  memberId: z.string().nullable().optional(),
  ministryId: z.string().nullable().optional(),
})

export type TransactionEditFormValues = z.infer<typeof transactionEditSchema>
