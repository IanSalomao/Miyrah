// Tipos globais da API — derivados de wiki/API_docs.md.
// O contrato é a fonte da verdade; estes tipos derivam dele, nunca o contrário.

/** Tipo compartilhado por transações e categorias (income = entrada, expense = saída). */
export type TransactionType = 'income' | 'expense'

/** Códigos de erro estáveis (SCREAMING_SNAKE_CASE, sempre em inglês). */
export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'INVALID_CREDENTIALS'
  | 'TOKEN_EXPIRED'
  | 'RESOURCE_NOT_FOUND'
  | 'EMAIL_ALREADY_IN_USE'
  | 'CATEGORY_TYPE_MISMATCH'
  | 'CATEGORY_TYPE_IMMUTABLE'
  | 'INVALID_OR_EXPIRED_TOKEN'
  | 'INTERNAL_ERROR'

/** Detalhe de erro por campo (validação com múltiplos campos). */
export interface ErrorDetail {
  field: string
  message: string
}

/** Metadados de paginação. */
export interface Meta {
  page: number
  limit: number
  total: number
  totalPages: number
}

/** Envelope de lista paginada (data.items + data.meta). */
export interface Paginated<T> {
  items: T[]
  meta: Meta
}

/** Envelope de sucesso — item único. */
export interface SuccessEnvelope<T> {
  success: true
  data: T
}

/** Objeto de erro dentro do envelope. */
export interface ApiErrorBody {
  code: ErrorCode
  message: string
  details: ErrorDetail[] | null
}

/** Envelope de erro. */
export interface ErrorEnvelope {
  success: false
  error: ApiErrorBody
}

/** Envelope genérico da API. */
export type ApiEnvelope<T> = SuccessEnvelope<T> | ErrorEnvelope

/** Resposta padrão de operações que só retornam mensagem (ex.: DELETE). */
export interface MessageResponse {
  message: string
}
