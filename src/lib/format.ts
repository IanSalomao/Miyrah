// Formatação centralizada — moeda (BRL), datas (pt-BR) e máscaras.
// Ver wiki/API_docs.md e wiki/design_system.md.

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

// Sinais tipográficos (design_system.md): "+" e "−" (U+2212, não hífen).
const PLUS = '+'
const MINUS = '−'

/** Moeda BRL respeitando o sinal natural do número (ex.: -R$ 1.200,00). */
export function formatCurrency(value: number): string {
  return currencyFormatter.format(value)
}

/**
 * Moeda com sinal explícito na frente e magnitude (ex.: +R$ 500,00 / −R$ 1.200,00).
 * A cor semântica é decidida por quem exibe — o sinal nunca é a única pista.
 * Zero é neutro (sem sinal).
 */
export function formatSignedCurrency(value: number): string {
  const magnitude = currencyFormatter.format(Math.abs(value))
  if (value > 0) return `${PLUS}${magnitude}`
  if (value < 0) return `${MINUS}${magnitude}`
  return magnitude
}

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/

/**
 * Converte string em Date sem o "bug de um dia antes":
 * datas puras (YYYY-MM-DD) são construídas no fuso local, não em UTC.
 */
function toDate(value: string): Date {
  const match = DATE_ONLY.exec(value)
  if (match) {
    const [year, month, day] = value.split('-').map(Number)
    return new Date(year, month - 1, day)
  }
  return new Date(value)
}

/** Data em pt-BR (dd/mm/aaaa). Ideal para campos date-only como transaction.date. */
export function formatDate(value: string): string {
  return dateFormatter.format(toDate(value))
}

/** Data + hora em pt-BR. Ideal para timestamps ISO-UTC (createdAt/generatedAt). */
export function formatDateTime(value: string): string {
  return dateTimeFormatter.format(new Date(value))
}

/** Máscara de CNPJ (XX.XXX.XXX/XXXX-XX). Aceita numérico e alfanumérico (2026). */
export function maskCnpj(value: string): string {
  const raw = value
    .toUpperCase()
    .replace(/[^0-9A-Z]/g, '')
    .slice(0, 14)
  const parts: string[] = []
  parts.push(raw.slice(0, 2))
  if (raw.length > 2) parts.push('.' + raw.slice(2, 5))
  if (raw.length > 5) parts.push('.' + raw.slice(5, 8))
  if (raw.length > 8) parts.push('/' + raw.slice(8, 12))
  if (raw.length > 12) parts.push('-' + raw.slice(12, 14))
  return parts.join('')
}

/** Máscara de telefone BR: (XX) XXXX-XXXX ou (XX) XXXXX-XXXX. */
export function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length === 0) return ''
  if (digits.length <= 2) return `(${digits}`
  const ddd = digits.slice(0, 2)
  const rest = digits.slice(2)
  const breakAt = rest.length > 4 ? rest.length - 4 : rest.length
  const prefix = rest.slice(0, breakAt)
  const suffix = rest.slice(breakAt)
  return suffix ? `(${ddd}) ${prefix}-${suffix}` : `(${ddd}) ${prefix}`
}

/** Iniciais para avatar de membro (design_system.md: sempre das iniciais do nome). */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}
