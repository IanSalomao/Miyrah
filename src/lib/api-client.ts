// Wrapper de fetch tipado — toda chamada à API passa por aqui.
// Ver wiki/API_docs.md: injeta Bearer, faz unwrap do envelope { success, data }
// e converte { success: false, error } em ApiError tipado.

import type { ApiEnvelope, ApiErrorBody, ErrorCode, ErrorDetail } from '@/types'
import { clearToken, getToken } from './auth-storage'

const BASE_URL = import.meta.env.VITE_API_URL ?? '/v1'

/** Erro tipado da API — trate sempre pelo `code` (estável em inglês). */
export class ApiError extends Error {
  readonly code: ErrorCode
  readonly details: ErrorDetail[] | null
  readonly status: number

  constructor(body: ApiErrorBody, status: number) {
    super(body.message)
    this.name = 'ApiError'
    this.code = body.code
    this.details = body.details
    this.status = status
  }
}

// Callback de 401 registrado pelo AuthProvider (evita import circular com React).
let unauthorizedHandler: (() => void) | null = null
export function setUnauthorizedHandler(fn: (() => void) | null): void {
  unauthorizedHandler = fn
}

export type QueryParams = Record<string, string | number | boolean | undefined | null>

interface RequestOptions {
  params?: QueryParams
  body?: unknown
  signal?: AbortSignal
}

function buildUrl(path: string, params?: QueryParams): string {
  const url = `${BASE_URL}${path}`
  if (!params) return url
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      search.append(key, String(value))
    }
  }
  const qs = search.toString()
  return qs ? `${url}?${qs}` : url
}

async function request<T>(
  method: string,
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  let body: string | undefined
  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json'
    body = JSON.stringify(options.body)
  }

  const res = await fetch(buildUrl(path, options.params), {
    method,
    headers,
    body,
    signal: options.signal,
  })

  let json: ApiEnvelope<T> | null = null
  try {
    json = (await res.json()) as ApiEnvelope<T>
  } catch {
    // Resposta sem corpo JSON.
  }

  // 401 em qualquer chamada → limpar sessão e notificar (redireciona para /login).
  if (res.status === 401) {
    clearToken()
    unauthorizedHandler?.()
  }

  if (json && json.success) return json.data
  if (json && json.success === false) throw new ApiError(json.error, res.status)

  // Resposta inesperada (sem envelope).
  throw new ApiError(
    { code: 'INTERNAL_ERROR', message: 'Ocorreu um erro inesperado. Tente novamente.', details: null },
    res.status,
  )
}

export const apiClient = {
  get: <T>(path: string, params?: QueryParams, signal?: AbortSignal) =>
    request<T>('GET', path, { params, signal }),
  post: <T>(path: string, body?: unknown, params?: QueryParams) =>
    request<T>('POST', path, { body, params }),
  patch: <T>(path: string, body?: unknown) => request<T>('PATCH', path, { body }),
  del: <T>(path: string, body?: unknown) => request<T>('DELETE', path, { body }),
}
