import { describe, expect, it } from 'vitest'
import { memberFormSchema, toMemberPayload } from './schemas'

describe('memberFormSchema', () => {
  it('exige o nome', () => {
    const result = memberFormSchema.safeParse({ name: '' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('O nome é obrigatório.')
    }
  })

  it('aceita só o nome, com os demais campos ausentes', () => {
    const result = memberFormSchema.safeParse({ name: 'Maria' })
    expect(result.success).toBe(true)
  })

  it('rejeita e-mail inválido quando informado', () => {
    const result = memberFormSchema.safeParse({ name: 'João', email: 'não-é-email' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('E-mail inválido.')
    }
  })

  it('aceita e-mail válido', () => {
    const result = memberFormSchema.safeParse({ name: 'João', email: 'joao@example.com' })
    expect(result.success).toBe(true)
  })

  it('aceita e-mail vazio (opcional)', () => {
    const result = memberFormSchema.safeParse({ name: 'João', email: '' })
    expect(result.success).toBe(true)
  })
})

describe('toMemberPayload', () => {
  it('converte campos vazios em null e mantém apenas dígitos no telefone', () => {
    const payload = toMemberPayload({
      name: '  João da Silva  ',
      birthDate: '',
      baptismDate: '2010-03-20',
      email: '',
      phone: '(11) 98888-7777',
    })

    expect(payload).toEqual({
      name: 'João da Silva',
      birthDate: null,
      baptismDate: '2010-03-20',
      email: null,
      phone: '11988887777',
    })
  })
})
