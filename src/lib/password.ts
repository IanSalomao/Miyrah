// Política de senha forte, compartilhada entre os formulários que criam/alteram
// senha (cadastro, redefinição e "alterar senha"). O checklist visual
// (PasswordRequirements) e o schema Zod consomem a MESMA lista de regras, para
// que o que o usuário vê seja exatamente o que é validado.
//
// Nota de contrato: o backend hoje exige apenas o mínimo de 8 caracteres
// (Doc/api/auth.md). Estas regras de composição são, por ora, uma validação
// mais rígida só no front — a wiki e o backend devem ser alinhados depois.
import { z } from 'zod'

export const PASSWORD_MIN_LENGTH = 8

export interface PasswordRule {
  id: string
  label: string
  test: (value: string) => boolean
}

export const passwordRules: readonly PasswordRule[] = [
  {
    id: 'length',
    label: `Mínimo de ${PASSWORD_MIN_LENGTH} caracteres`,
    test: (value) => value.length >= PASSWORD_MIN_LENGTH,
  },
  { id: 'lowercase', label: 'Uma letra minúscula', test: (value) => /[a-z]/.test(value) },
  { id: 'uppercase', label: 'Uma letra maiúscula', test: (value) => /[A-Z]/.test(value) },
  { id: 'number', label: 'Um número', test: (value) => /\d/.test(value) },
  {
    id: 'symbol',
    label: 'Um símbolo (!@#$…)',
    test: (value) => /[^A-Za-z0-9]/.test(value),
  },
]

/** `true` quando a senha satisfaz todas as regras de composição. */
export function isStrongPassword(value: string): boolean {
  return passwordRules.every((rule) => rule.test(value))
}

const STRONG_PASSWORD_MESSAGE =
  'A senha deve ter no mínimo 8 caracteres, com maiúscula, minúscula, número e símbolo.'

/** Schema Zod de senha forte — usa a mesma lista de `passwordRules`. */
export const strongPasswordSchema = z
  .string()
  .refine(isStrongPassword, { message: STRONG_PASSWORD_MESSAGE })
