import { describe, expect, it } from 'vitest'
import { createTransactionSchema, toTransactionPayload } from './schemas'

describe('createTransactionSchema', () => {
  const categoryTypeById = { 'cat-income': 'income', 'cat-expense': 'expense' } as const

  it('exige valor maior que zero', () => {
    const schema = createTransactionSchema(categoryTypeById)
    const result = schema.safeParse({
      type: 'income',
      value: 0,
      date: '2026-07-01',
      categoryId: 'cat-income',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === 'value')).toBe(true)
    }
  })

  it('exige categoria selecionada', () => {
    const schema = createTransactionSchema(categoryTypeById)
    const result = schema.safeParse({
      type: 'income',
      value: 100,
      date: '2026-07-01',
      categoryId: '',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === 'categoryId')).toBe(true)
    }
  })

  it('rejeita categoria de tipo diferente do selecionado (consistência tipo↔categoria)', () => {
    const schema = createTransactionSchema(categoryTypeById)
    const result = schema.safeParse({
      type: 'expense',
      value: 100,
      date: '2026-07-01',
      categoryId: 'cat-income',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path[0] === 'categoryId')
      expect(issue?.message).toMatch(/mesmo tipo/i)
    }
  })

  it('aceita quando o tipo da categoria bate com o tipo da transação', () => {
    const schema = createTransactionSchema(categoryTypeById)
    const result = schema.safeParse({
      type: 'expense',
      value: 100,
      date: '2026-07-01',
      categoryId: 'cat-expense',
    })
    expect(result.success).toBe(true)
  })
})

describe('toTransactionPayload — lógica de sinal', () => {
  it('mantém o valor sempre positivo no payload, independentemente do tipo', () => {
    const income = toTransactionPayload({
      type: 'income',
      value: 500,
      date: '2026-07-01',
      categoryId: 'cat-income',
      description: '',
      memberId: '',
      ministryId: '',
    })
    expect(income.value).toBe(500)
    expect(income.type).toBe('income')

    const expense = toTransactionPayload({
      type: 'expense',
      value: 500,
      date: '2026-07-01',
      categoryId: 'cat-expense',
      description: '',
      memberId: '',
      ministryId: '',
    })
    expect(expense.value).toBe(500)
    expect(expense.type).toBe('expense')
  })

  it('converte campos opcionais vazios para null', () => {
    const payload = toTransactionPayload({
      type: 'income',
      value: 10,
      date: '2026-07-01',
      categoryId: 'cat-income',
      description: '',
      memberId: '',
      ministryId: '',
    })
    expect(payload.description).toBeNull()
    expect(payload.memberId).toBeNull()
    expect(payload.ministryId).toBeNull()
  })
})
