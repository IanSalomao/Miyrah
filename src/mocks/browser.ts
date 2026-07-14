import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

// Worker MSW usado no dev (browser).
export const worker = setupWorker(...handlers)
