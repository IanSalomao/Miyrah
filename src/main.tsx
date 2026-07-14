import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Providers } from './app/providers'

// MSW só em dev e enquanto não houver backend real (VITE_API_URL).
async function enableMocking() {
  if (!import.meta.env.DEV || import.meta.env.VITE_API_URL) return
  const { worker } = await import('./mocks/browser')
  await worker.start({ onUnhandledRequest: 'bypass' })
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Providers />
    </StrictMode>,
  )
})
