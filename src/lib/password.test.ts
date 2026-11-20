import { describe, expect, it } from 'vitest'
import { isStrongPassword, passwordRules, strongPasswordSchema } from './password'

describe('isStrongPassword', () => {
  it('aceita senha com todas as regras de composição', () => {
    expect(isStrongPassword('SenhaForte1!')).toBe(true)
  })

  it('rejeita por falta de símbolo', () => {
    expect(isStrongPassword('SenhaForte1')).toBe(false)
  })

  it('rejeita por falta de maiúscula', () => {
    expect(isStrongPassword('senhaforte1!')).toBe(false)
  })

  it('rejeita por falta de minúscula', () => {
    expect(isStrongPassword('SENHAFORTE1!')).toBe(false)
  })

  it('rejeita por falta de número', () => {
    expect(isStrongPassword('SenhaForte!')).toBe(false)
  })

  it('rejeita por comprimento menor que 8', () => {
    expect(isStrongPassword('Ab1!')).toBe(false)
  })
})

describe('passwordRules', () => {
  it('cada regra avalia só o seu próprio critério', () => {
    const lengthRule = passwordRules.find((rule) => rule.id === 'length')!
    expect(lengthRule.test('12345678')).toBe(true)
    expect(lengthRule.test('1234567')).toBe(false)
  })
})

describe('strongPasswordSchema', () => {
  it('valida via Zod a mesma política', () => {
    expect(strongPasswordSchema.safeParse('SenhaForte1!').success).toBe(true)
    expect(strongPasswordSchema.safeParse('fraca').success).toBe(false)
  })
})
