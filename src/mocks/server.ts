import { setupServer } from 'msw/node'
import { handlers } from './handlers'

// Servidor MSW usado nos testes (Vitest/Node).
export const server = setupServer(...handlers)
