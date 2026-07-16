// Schemas Zod dos formulários de autenticação — wiki/api/auth.md
import { z } from 'zod'

const emailSchema = z.string().min(1, 'Informe o e-mail.').email('Informe um e-mail válido.')

const passwordMinSchema = z
  .string()
  .min(8, 'A senha deve ter no mínimo 8 caracteres.')

// wiki/pages/page_login.md — Email, Senha, "Lembrar-me".
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Informe a senha.'),
  rememberMe: z.boolean(),
})

export type LoginFormValues = z.infer<typeof loginSchema>

// wiki/pages/page_register.md — confirmPassword e aceite dos termos são só front (não vão à API).
export const registerSchema = z
  .object({
    name: z.string().min(2, 'Informe o nome da igreja.'),
    email: emailSchema,
    phone: z.string().optional(),
    password: passwordMinSchema,
    confirmPassword: z.string().min(1, 'Confirme a senha.'),
    acceptTerms: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem.',
    path: ['confirmPassword'],
  })
  .refine((data) => data.acceptTerms === true, {
    message: 'É preciso aceitar os termos de uso e a política de privacidade.',
    path: ['acceptTerms'],
  })

export type RegisterFormValues = z.infer<typeof registerSchema>

// wiki/pages/page_forgot_password.md — Passo 1.
export const forgotPasswordSchema = z.object({
  email: emailSchema,
})

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

// wiki/pages/page_forgot_password.md — Passo 3 ("Confirmar Nova Senha" só no front).
export const resetPasswordSchema = z
  .object({
    newPassword: passwordMinSchema,
    confirmNewPassword: z.string().min(1, 'Confirme a nova senha.'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'As senhas não coincidem.',
    path: ['confirmNewPassword'],
  })

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>
