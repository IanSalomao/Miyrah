import type { RequestHandler } from 'msw'

// Agregador dos handlers por domínio (auth, members, transactions...).
// Cada domínio de wiki/api/* vira um arquivo próprio e é concatenado aqui.
export const handlers: RequestHandler[] = []
