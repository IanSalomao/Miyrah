import { afterEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { routes } from './router'
import { queryClient } from './query-client'
import { AuthProvider } from './auth-provider'
import { clearToken, setToken } from '@/lib/auth-storage'

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>,
  )
}

afterEach(() => {
  clearToken()
})

describe('roteamento', () => {
  it('renderiza /login no shell de autenticação', async () => {
    renderAt('/login')
    expect(
      await screen.findByRole('heading', { name: /Bem-vindo ao melhor lugar/ }),
    ).toBeInTheDocument()
    // O shell de auth não tem sidebar.
    expect(screen.queryByRole('link', { name: 'Transações' })).not.toBeInTheDocument()
  })

  it('redireciona rota protegida para /login quando não autenticado', async () => {
    renderAt('/')
    expect(
      await screen.findByRole('heading', { name: /Bem-vindo ao melhor lugar/ }),
    ).toBeInTheDocument()
  })

  it('renderiza a tela protegida com a sidebar quando autenticado', async () => {
    setToken('mock-token', false)
    renderAt('/')
    expect(await screen.findByRole('heading', { name: 'Início' })).toBeInTheDocument()
    // A sidebar aparece nas páginas autenticadas.
    expect(screen.getByRole('link', { name: 'Transações' })).toBeInTheDocument()
  })
})
