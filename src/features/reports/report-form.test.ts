import { describe, expect, it } from 'vitest'
import {
  buildCreateReportPayload,
  canIncludeMember,
  createInitialReportForm,
  toggleSection,
  validateReportForm,
  type ReportFormState,
} from './report-form'

function form(overrides: Partial<ReportFormState> = {}): ReportFormState {
  return { ...createInitialReportForm(), ...overrides }
}

describe('createInitialReportForm', () => {
  it('começa só com "Saídas por Ministério" pré-marcada', () => {
    const initial = createInitialReportForm()
    expect(initial.sections).toEqual(['expenseByMinistry'])
    expect(initial.includeMember).toBe(false)
    expect(initial.currentPassword).toBe('')
    expect(initial.categoryIds).toEqual([])
  })
})

describe('toggleSection', () => {
  it('marca um bloco ainda não selecionado', () => {
    const next = toggleSection(form(), 'summary')
    expect(next.sections).toContain('summary')
    expect(next.sections).toContain('expenseByMinistry')
  })

  it('desmarca um bloco já selecionado', () => {
    const next = toggleSection(form({ sections: ['summary', 'expenseByMinistry'] }), 'summary')
    expect(next.sections).not.toContain('summary')
  })

  it('desmarcar "Lista de transações" também desliga "Incluir Membro" e descarta a senha', () => {
    const state = form({
      sections: ['transactionList'],
      includeMember: true,
      currentPassword: 'segredo',
    })
    const next = toggleSection(state, 'transactionList')
    expect(next.sections).not.toContain('transactionList')
    expect(next.includeMember).toBe(false)
    expect(next.currentPassword).toBe('')
  })
})

describe('canIncludeMember', () => {
  it('só permite incluir membro com "Lista de transações" marcada', () => {
    expect(canIncludeMember(form({ sections: ['transactionList'] }))).toBe(true)
    expect(canIncludeMember(form({ sections: ['summary'] }))).toBe(false)
  })
})

describe('validateReportForm', () => {
  it('exige data inicial e final', () => {
    expect(validateReportForm(form({ dateFrom: '', dateTo: '' })).period).toBeTruthy()
    expect(validateReportForm(form({ dateFrom: '2026-07-01', dateTo: '' })).period).toBeTruthy()
  })

  it('rejeita data inicial posterior à final', () => {
    const errors = validateReportForm(form({ dateFrom: '2026-07-31', dateTo: '2026-07-01' }))
    expect(errors.period).toBeTruthy()
  })

  it('exige ao menos um bloco', () => {
    const errors = validateReportForm(
      form({ dateFrom: '2026-07-01', dateTo: '2026-07-31', sections: [] }),
    )
    expect(errors.sections).toBeTruthy()
  })

  it('não acusa erro quando período e blocos estão válidos', () => {
    const errors = validateReportForm(form({ dateFrom: '2026-07-01', dateTo: '2026-07-31' }))
    expect(errors).toEqual({})
  })
})

describe('buildCreateReportPayload', () => {
  it('omite categoryIds quando nenhuma categoria é escolhida', () => {
    const payload = buildCreateReportPayload(
      form({ dateFrom: '2026-07-01', dateTo: '2026-07-31' }),
    )
    expect(payload.categoryIds).toBeUndefined()
    expect(payload.sections).toEqual(['expenseByMinistry'])
  })

  it('inclui categoryIds quando há categorias selecionadas', () => {
    const payload = buildCreateReportPayload(
      form({ dateFrom: '2026-07-01', dateTo: '2026-07-31', categoryIds: ['cat-1', 'cat-2'] }),
    )
    expect(payload.categoryIds).toEqual(['cat-1', 'cat-2'])
  })

  it('só envia includeMember e currentPassword quando "Incluir Membro" está ativo', () => {
    const off = buildCreateReportPayload(
      form({ dateFrom: '2026-07-01', dateTo: '2026-07-31', currentPassword: 'x' }),
    )
    expect(off.includeMember).toBeUndefined()
    expect(off.currentPassword).toBeUndefined()

    const on = buildCreateReportPayload(
      form({
        dateFrom: '2026-07-01',
        dateTo: '2026-07-31',
        sections: ['transactionList'],
        includeMember: true,
        currentPassword: 'segredo',
      }),
    )
    expect(on.includeMember).toBe(true)
    expect(on.currentPassword).toBe('segredo')
  })
})
