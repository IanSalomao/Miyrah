import { describe, expect, it } from 'vitest'
import { categoryFormSchema } from './schemas'

const base = {
  name: 'Dízimo',
  description: '',
  type: 'income' as const,
  color: '#22C55E',
}

describe('categoryFormSchema', () => {
  it('aceita um payload válido', () => {
    const result = categoryFormSchema.safeParse(base)
    expect(result.success).toBe(true)
  })

  it('exige o nome', () => {
    const result = categoryFormSchema.safeParse({ ...base, name: '' })
    expect(result.success).toBe(false)
  })

  it('aceita apenas os tipos income ou expense', () => {
    const result = categoryFormSchema.safeParse({ ...base, type: 'invalid' })
    expect(result.success).toBe(false)
  })

  it('exige uma cor hexadecimal válida', () => {
    expect(categoryFormSchema.safeParse({ ...base, color: 'verde' }).success).toBe(false)
    expect(categoryFormSchema.safeParse({ ...base, color: '#GGG' }).success).toBe(false)
    expect(categoryFormSchema.safeParse({ ...base, color: '#22C55E' }).success).toBe(true)
  })

  it('descrição é opcional', () => {
    const withoutDescription: Omit<typeof base, 'description'> = {
      name: base.name,
      type: base.type,
      color: base.color,
    }
    expect(categoryFormSchema.safeParse(withoutDescription).success).toBe(true)
  })
})
