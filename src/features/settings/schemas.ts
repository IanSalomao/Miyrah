// Schemas dos formulários da tela de Configurações — wiki/api/account.md.
import { z } from 'zod'
import type { UpdateAccountPayload } from '@/types'

// Mesmo formato produzido por `maskCnpj` (lib/format.ts) — aceita numérico e
// alfanumérico (formato 2026), dígitos verificadores sempre numéricos.
const CNPJ_PATTERN = /^[0-9A-Z]{2}\.[0-9A-Z]{3}\.[0-9A-Z]{3}\/[0-9A-Z]{4}-\d{2}$/

export const profileFormSchema = z.object({
  name: z.string().trim().min(1, 'Informe o nome da igreja.'),
  email: z.string().trim().min(1, 'Informe o e-mail.').email('Informe um e-mail válido.'),
  phone: z.string().optional(),
  cnpj: z
    .string()
    .optional()
    .refine((value) => !value || CNPJ_PATTERN.test(value), {
      message: 'CNPJ inválido — use o formato 00.000.000/0000-00.',
    }),
  denomination: z.string().optional(),
})

export type ProfileFormValues = z.infer<typeof profileFormSchema>

/** Converte os valores do formulário no payload de `PATCH /v1/account`. */
export function toUpdateAccountPayload(values: ProfileFormValues): UpdateAccountPayload {
  return {
    name: values.name.trim(),
    email: values.email.trim(),
    phone: values.phone ? values.phone.replace(/\D/g, '') : null,
    cnpj: values.cnpj ? values.cnpj : null,
    denomination: values.denomination ? values.denomination.trim() : null,
  }
}

const newPasswordSchema = z.string().min(8, 'A nova senha deve ter no mínimo 8 caracteres.')

// "Confirmar Nova Senha" é validado só no front-end — não é enviado à API (wiki/api/account.md).
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Informe a senha atual.'),
    newPassword: newPasswordSchema,
    confirmNewPassword: z.string().min(1, 'Confirme a nova senha.'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'As senhas não coincidem.',
    path: ['confirmNewPassword'],
  })

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>
