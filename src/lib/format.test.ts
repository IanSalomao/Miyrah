import { describe, expect, it } from 'vitest'
import {
  formatCompactNumber,
  formatCurrency,
  formatDate,
  formatDateTime,
  formatSignedCurrency,
  getInitials,
  maskCnpj,
  maskPhone,
} from './format'

// Normaliza espaços (Intl usa NBSP/narrow-NBSP entre "R$" e o número).
const norm = (s: string) => s.replace(/\s/g, ' ')

describe('formatCurrency', () => {
  it('formata em BRL com o sinal natural', () => {
    expect(norm(formatCurrency(500))).toBe('R$ 500,00')
    expect(norm(formatCurrency(1200.5))).toBe('R$ 1.200,50')
    expect(norm(formatCurrency(-1200))).toBe('-R$ 1.200,00')
    expect(norm(formatCurrency(0))).toBe('R$ 0,00')
  })
})

describe('formatSignedCurrency', () => {
  it('prefixa + para entradas e − para saídas, com a magnitude', () => {
    expect(norm(formatSignedCurrency(500))).toBe('+R$ 500,00')
    expect(norm(formatSignedCurrency(-1200))).toBe('−R$ 1.200,00')
  })

  it('zero é neutro (sem sinal)', () => {
    expect(norm(formatSignedCurrency(0))).toBe('R$ 0,00')
  })

  it('usa o sinal tipográfico − (U+2212), não o hífen', () => {
    expect(formatSignedCurrency(-10)).toContain('−')
    expect(formatSignedCurrency(-10)).not.toContain('-')
  })
})

describe('formatCompactNumber', () => {
  it('abrevia milhares com "k" e milhões com "mi"', () => {
    expect(formatCompactNumber(5000)).toBe('5k')
    expect(formatCompactNumber(15000)).toBe('15k')
    expect(formatCompactNumber(12500)).toBe('12,5k')
    expect(formatCompactNumber(1_500_000)).toBe('1,5mi')
  })

  it('mantém valores abaixo de mil como inteiros e zero como "0"', () => {
    expect(formatCompactNumber(0)).toBe('0')
    expect(formatCompactNumber(950)).toBe('950')
  })

  it('preserva o sinal tipográfico − para negativos', () => {
    expect(formatCompactNumber(-15000)).toBe('−15k')
  })
})

describe('formatDate', () => {
  it('formata data pura (YYYY-MM-DD) sem deslocar o dia por fuso', () => {
    expect(formatDate('2026-07-01')).toBe('01/07/2026')
    // Regressão do "um dia antes": 01/01 não pode virar 31/12 do ano anterior.
    expect(formatDate('2026-01-01')).toBe('01/01/2026')
  })
})

describe('formatDateTime', () => {
  it('formata timestamp ISO como dd/mm/aaaa, hh:mm', () => {
    expect(formatDateTime('2026-07-10T14:30:00Z')).toMatch(/^\d{2}\/\d{2}\/\d{4},? \d{2}:\d{2}$/)
  })
})

describe('maskCnpj', () => {
  it('mascara CNPJ numérico', () => {
    expect(maskCnpj('12345678000190')).toBe('12.345.678/0001-90')
  })

  it('mascara CNPJ alfanumérico (formato 2026)', () => {
    expect(maskCnpj('12ABC34501DE35')).toBe('12.ABC.345/01DE-35')
  })

  it('mascara parcialmente durante a digitação', () => {
    expect(maskCnpj('123')).toBe('12.3')
    expect(maskCnpj('12')).toBe('12')
  })
})

describe('maskPhone', () => {
  it('mascara celular (11 dígitos) e fixo (10 dígitos)', () => {
    expect(maskPhone('11999999999')).toBe('(11) 99999-9999')
    expect(maskPhone('1133334444')).toBe('(11) 3333-4444')
  })

  it('mascara parcialmente', () => {
    expect(maskPhone('11')).toBe('(11')
    expect(maskPhone('')).toBe('')
  })
})

describe('getInitials', () => {
  it('deriva iniciais do primeiro e último nome', () => {
    expect(getInitials('João da Silva')).toBe('JS')
    expect(getInitials('Maria')).toBe('MA')
    expect(getInitials('  ')).toBe('?')
  })
})
