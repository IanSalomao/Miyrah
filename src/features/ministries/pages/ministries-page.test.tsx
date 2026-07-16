import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MinistriesPage } from './ministries-page'
import type { Ministry, Paginated, Member } from '@/types'

const { listMinistriesMock, createMinistryMock, removeMinistryMock, listMembersMock } = vi.hoisted(
  () => ({
    listMinistriesMock: vi.fn(),
    createMinistryMock: vi.fn(),
    removeMinistryMock: vi.fn(),
    listMembersMock: vi.fn(),
  }),
)

vi.mock('@/services', () => ({
  listMinistries: listMinistriesMock,
  createMinistry: createMinistryMock,
  updateMinistry: vi.fn(),
  removeMinistry: removeMinistryMock,
  listMembers: listMembersMock,
}))

const MINISTRIES: Ministry[] = [
  {
    id: 'm1',
    name: 'Ministério de Louvor',
    description: 'Equipe responsável pela música nos cultos',
    responsible: { id: 'b1', name: 'João da Silva' },
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-02-01T10:00:00Z',
  },
  {
    id: 'm2',
    name: 'Ministério de Recepção',
    description: null,
    responsible: null,
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-02-01T10:00:00Z',
  },
]

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <MinistriesPage />
    </QueryClientProvider>,
  )
}

afterEach(() => {
  vi.clearAllMocks()
})

describe('MinistriesPage', () => {
  it('renderiza um card por ministério, com responsável ou "Sem responsável"', async () => {
    listMinistriesMock.mockResolvedValue({ items: MINISTRIES })

    renderPage()

    expect(await screen.findByText('Ministério de Louvor')).toBeInTheDocument()
    expect(screen.getByText('João da Silva')).toBeInTheDocument()
    expect(screen.getByText('Ministério de Recepção')).toBeInTheDocument()
    expect(screen.getByText('Sem responsável')).toBeInTheDocument()
  })

  it('exibe o estado vazio quando não há ministérios', async () => {
    listMinistriesMock.mockResolvedValue({ items: [] })

    renderPage()

    expect(await screen.findByText('Nenhum ministério encontrado')).toBeInTheDocument()
    expect(
      screen.getAllByRole('button', { name: 'Adicionar ministério' }).length,
    ).toBeGreaterThan(0)
  })

  it('cria um ministério pelo modal de formulário', async () => {
    const user = userEvent.setup()
    listMinistriesMock.mockResolvedValue({ items: [] })
    listMembersMock.mockResolvedValue({
      items: [],
      meta: { page: 1, limit: 20, total: 0, totalPages: 0 },
    } satisfies Paginated<Member>)
    createMinistryMock.mockResolvedValue({
      id: 'new-id',
      name: 'Ministério Infantil',
      description: null,
      responsible: null,
      createdAt: '2026-07-10T14:30:00Z',
      updatedAt: '2026-07-10T14:30:00Z',
    })

    renderPage()

    await user.click(await screen.findByRole('button', { name: 'Adicionar ministério' }))

    const dialog = await screen.findByRole('dialog')
    await user.type(within(dialog).getByLabelText('Nome'), 'Ministério Infantil')
    await user.click(within(dialog).getByRole('button', { name: 'Adicionar' }))

    await waitFor(() => {
      expect(createMinistryMock).toHaveBeenCalledWith({
        name: 'Ministério Infantil',
        description: null,
        responsibleId: null,
      })
    })
  })
})
