import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '@/app/auth-provider'
import { ApiError } from '@/lib/api-client'
import { clearToken, getToken } from '@/lib/auth-storage'
import { LoginPage } from './login-page'

const { loginMock } = vi.hoisted(() => ({ loginMock: vi.fn() }))

vi.mock('@/services', () => ({
  login: loginMock,
}))

function renderLoginPage() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MemoryRouter initialEntries={['/login']}>
          <LoginPage />
        </MemoryRouter>
      </AuthProvider>
    </QueryClientProvider>,
  )
}

afterEach(() => {
  clearToken()
  loginMock.mockReset()
})

describe('LoginPage', () => {
  it('faz login com sucesso e guarda o token da sessão', async () => {
    const user = userEvent.setup()
    loginMock.mockResolvedValueOnce({ token: 'token-abc', expiresAt: '2026-08-09T14:30:00Z' })

    renderLoginPage()

    await user.type(screen.getByLabelText('E-mail'), 'contato@igrejacentral.com.br')
    await user.type(screen.getByLabelText('Senha'), 'senhaSegura123')
    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    await waitFor(() =>
      expect(loginMock).toHaveBeenCalledWith(
        {
          email: 'contato@igrejacentral.com.br',
          password: 'senhaSegura123',
          rememberMe: false,
        },
        expect.anything(),
      ),
    )
    await waitFor(() => expect(getToken()).toBe('token-abc'))
  })

  it('exibe mensagem genérica quando as credenciais são inválidas', async () => {
    const user = userEvent.setup()
    loginMock.mockRejectedValueOnce(
      new ApiError({ code: 'INVALID_CREDENTIALS', message: 'E-mail ou senha incorretos.', details: null }, 401),
    )

    renderLoginPage()

    await user.type(screen.getByLabelText('E-mail'), 'contato@igrejacentral.com.br')
    await user.type(screen.getByLabelText('Senha'), 'senhaErrada')
    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('E-mail ou senha incorretos.')
    expect(getToken()).toBeNull()
  })
})
