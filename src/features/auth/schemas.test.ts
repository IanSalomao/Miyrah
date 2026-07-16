import { describe, expect, it } from 'vitest'
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from './schemas'

describe('loginSchema', () => {
  it('aceita e-mail válido e senha preenchida', () => {
    const result = loginSchema.safeParse({
      email: 'contato@igrejacentral.com.br',
      password: 'senhaSegura123',
      rememberMe: true,
    })
    expect(result.success).toBe(true)
  })

  it('rejeita e-mail inválido', () => {
    const result = loginSchema.safeParse({
      email: 'nao-e-um-email',
      password: 'senhaSegura123',
      rememberMe: false,
    })
    expect(result.success).toBe(false)
  })

  it('rejeita senha vazia', () => {
    const result = loginSchema.safeParse({
      email: 'contato@igrejacentral.com.br',
      password: '',
      rememberMe: false,
    })
    expect(result.success).toBe(false)
  })
})

describe('registerSchema', () => {
  const base = {
    name: 'Igreja Batista Central',
    email: 'contato@igrejacentral.com.br',
    phone: '',
    password: 'senhaSegura123',
    confirmPassword: 'senhaSegura123',
    acceptTerms: true,
  }

  it('aceita dados válidos com os termos aceitos', () => {
    expect(registerSchema.safeParse(base).success).toBe(true)
  })

  it('rejeita senha com menos de 8 caracteres', () => {
    const result = registerSchema.safeParse({ ...base, password: '123', confirmPassword: '123' })
    expect(result.success).toBe(false)
  })

  it('rejeita quando confirmPassword não bate com password', () => {
    const result = registerSchema.safeParse({ ...base, confirmPassword: 'outraSenha123' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path.includes('confirmPassword'))).toBe(
        true,
      )
    }
  })

  it('rejeita quando os termos não foram aceitos', () => {
    const result = registerSchema.safeParse({ ...base, acceptTerms: false })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path.includes('acceptTerms'))).toBe(true)
    }
  })
})

describe('forgotPasswordSchema', () => {
  it('exige e-mail válido', () => {
    expect(forgotPasswordSchema.safeParse({ email: 'contato@igrejacentral.com.br' }).success).toBe(
      true,
    )
    expect(forgotPasswordSchema.safeParse({ email: 'invalido' }).success).toBe(false)
  })
})

describe('resetPasswordSchema', () => {
  it('exige senha mínima de 8 caracteres e confirmação igual', () => {
    expect(
      resetPasswordSchema.safeParse({
        newPassword: 'novaSenha123',
        confirmNewPassword: 'novaSenha123',
      }).success,
    ).toBe(true)

    expect(
      resetPasswordSchema.safeParse({ newPassword: '123', confirmNewPassword: '123' }).success,
    ).toBe(false)

    expect(
      resetPasswordSchema.safeParse({
        newPassword: 'novaSenha123',
        confirmNewPassword: 'outraSenha456',
      }).success,
    ).toBe(false)
  })
})
