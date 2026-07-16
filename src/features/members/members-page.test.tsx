import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MembersPage } from './members-page'
import type { Member, Paginated } from '@/types'

const { listMembersMock, createMemberMock, updateMemberMock, removeMemberMock } = vi.hoisted(
  () => ({
    listMembersMock: vi.fn(),
    createMemberMock: vi.fn(),
    updateMemberMock: vi.fn(),
    removeMemberMock: vi.fn(),
  }),
)

vi.mock('@/services', () => ({
  listMembers: listMembersMock,
  createMember: createMemberMock,
  updateMember: updateMemberMock,
  removeMember: removeMemberMock,
}))

const MEMBER: Member = {
  id: '1',
  name: 'João da Silva',
  birthDate: '1990-05-12',
  baptismDate: '2010-03-20',
  email: 'joao@example.com',
  phone: '11988887777',
  createdAt: '2026-02-01T10:00:00Z',
  updatedAt: '2026-02-01T10:00:00Z',
}

function paginated(items: Member[]): Paginated<Member> {
  return { items, meta: { page: 1, limit: 20, total: items.length, totalPages: 1 } }
}

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <MembersPage />
    </QueryClientProvider>,
  )
}

afterEach(() => {
  vi.clearAllMocks()
})

describe('MembersPage', () => {
  it('lista os membros retornados pela API', async () => {
    listMembersMock.mockResolvedValue(paginated([MEMBER]))

    renderPage()

    expect(await screen.findByText('João da Silva')).toBeInTheDocument()
    expect(screen.getByText('joao@example.com')).toBeInTheDocument()
    expect(screen.getByText('(11) 98888-7777')).toBeInTheDocument()
  })

  it('mostra o estado vazio quando não há membros', async () => {
    listMembersMock.mockResolvedValue(paginated([]))

    renderPage()

    expect(await screen.findByText('Nenhum membro encontrado')).toBeInTheDocument()
  })

  it('abre o modal e chama createMember ao submeter o formulário', async () => {
    const user = userEvent.setup()
    listMembersMock.mockResolvedValue(paginated([]))
    createMemberMock.mockResolvedValue({ ...MEMBER, id: '2', name: 'Maria Souza' })

    renderPage()
    await screen.findByText('Nenhum membro encontrado')

    // Empty state e a barra de ferramentas têm, ambos, um botão "Adicionar membro".
    const [toolbarAddButton] = screen.getAllByRole('button', { name: 'Adicionar membro' })
    await user.click(toolbarAddButton)

    const dialog = await screen.findByRole('dialog')
    await user.type(within(dialog).getByLabelText('Nome'), 'Maria Souza')
    await user.click(within(dialog).getByRole('button', { name: 'Adicionar' }))

    await waitFor(() => {
      expect(createMemberMock).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Maria Souza' }),
      )
    })
  })
})
