// Schema do formulário de membro — wiki/api/members.md (nome obrigatório; demais campos opcionais).

import { z } from 'zod'
import type { CreateMemberPayload } from '@/types'

export const memberFormSchema = z.object({
  name: z.string().trim().min(1, 'O nome é obrigatório.'),
  birthDate: z.string().optional(),
  baptismDate: z.string().optional(),
  email: z
    .string()
    .optional()
    .refine((value) => !value || z.email().safeParse(value).success, {
      message: 'E-mail inválido.',
    }),
  phone: z.string().optional(),
})

export type MemberFormValues = z.infer<typeof memberFormSchema>

export const emptyMemberFormValues: MemberFormValues = {
  name: '',
  birthDate: '',
  baptismDate: '',
  email: '',
  phone: '',
}

/** Converte os valores do formulário no payload da API (string vazia vira `null`). */
export function toMemberPayload(values: MemberFormValues): CreateMemberPayload {
  return {
    name: values.name.trim(),
    birthDate: values.birthDate ? values.birthDate : null,
    baptismDate: values.baptismDate ? values.baptismDate : null,
    email: values.email ? values.email.trim() : null,
    phone: values.phone ? values.phone.replace(/\D/g, '') : null,
  }
}
