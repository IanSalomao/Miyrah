import { describe, expect, it } from 'vitest'
import { ministryFormSchema } from './schemas'

describe('ministryFormSchema', () => {
  it('exige o nome', () => {
    const result = ministryFormSchema.safeParse({ name: '', responsibleId: null })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(['name'])
    }
  })

  it('rejeita nome só com espaços', () => {
    const result = ministryFormSchema.safeParse({ name: '   ' })
    expect(result.success).toBe(false)
  })

  it('aceita responsibleId nulo (remove o responsável)', () => {
    const result = ministryFormSchema.safeParse({ name: 'Louvor', responsibleId: null })
    expect(result.success).toBe(true)
  })

  it('aceita responsibleId ausente (não altera o responsável)', () => {
    const result = ministryFormSchema.safeParse({ name: 'Louvor' })
    expect(result.success).toBe(true)
  })

  it('aceita responsibleId com uuid válido', () => {
    const result = ministryFormSchema.safeParse({
      name: 'Louvor',
      responsibleId: 'b1e6c9b0-8f2a-4b3e-9c9a-1e2f3a4b5c6d',
    })
    expect(result.success).toBe(true)
  })

  it('rejeita responsibleId que não é um uuid', () => {
    const result = ministryFormSchema.safeParse({ name: 'Louvor', responsibleId: 'not-a-uuid' })
    expect(result.success).toBe(false)
  })

  it('descrição é opcional', () => {
    const result = ministryFormSchema.safeParse({ name: 'Louvor' })
    expect(result.success).toBe(true)
  })
})
