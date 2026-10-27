// Cadastro, Etapa 2 (perfil): denominação, telefone e CNPJ — todos opcionais,
// a conta já existe e o usuário pode pular. Reaproveita a validação de CNPJ da
// tela de Configurações (wiki/api/account.md).
import { z } from 'zod'
import type { UpdateAccountPayload } from '@/types'

// Mesmo formato produzido por `maskCnpj` (lib/format.ts) — aceita numérico e
// alfanumérico (formato 2026), dígitos verificadores sempre numéricos.
const CNPJ_PATTERN = /^[0-9A-Z]{2}\.[0-9A-Z]{3}\.[0-9A-Z]{3}\/[0-9A-Z]{4}-\d{2}$/

export const onboardingProfileSchema = z.object({
  denomination: z.string().optional(),
  phone: z.string().optional(),
  cnpj: z
    .string()
    .optional()
    .refine((value) => !value || CNPJ_PATTERN.test(value), {
      message: 'CNPJ inválido — use o formato 00.000.000/0000-00.',
    }),
})

export type OnboardingProfileFormValues = z.infer<typeof onboardingProfileSchema>

/** Converte os valores do formulário no payload de `PATCH /v1/account`. */
export function toUpdateAccountPayload(values: OnboardingProfileFormValues): UpdateAccountPayload {
  return {
    denomination: values.denomination ? values.denomination.trim() : null,
    phone: values.phone ? values.phone.replace(/\D/g, '') : null,
    cnpj: values.cnpj ? values.cnpj : null,
  }
}
