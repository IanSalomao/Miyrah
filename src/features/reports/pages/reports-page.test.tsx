import { afterEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ApiError } from '@/lib/api-client'
import type { Paginated, Report } from '@/types'
import { ReportsPage } from './reports-page'

const {
  listReportsMock,
  createReportMock,
  getReportDownloadMock,
  listCategoriesMock,
} = vi.hoisted(() => ({
  listReportsMock: vi.fn(),
  createReportMock: vi.fn(),
  getReportDownloadMock: vi.fn(),
  listCategoriesMock: vi.fn(),
}))

vi.mock('@/services', () => ({
  listReports: listReportsMock,
  createReport: createReportMock,
  getReportDownload: getReportDownloadMock,
  listCategories: listCategoriesMock,
}))

const REPORT: Report = {
  id: 'rep-1',
  generatedAt: '2026-07-10T14:30:00Z',
  params: {
    dateFrom: '2026-07-01',
    dateTo: '2026-07-31',
    categoryIds: [],
    sections: ['expenseByMinistry', 'transactionList'],
    includeMember: false,
  },
}

function paginatedReports(items: Report[]): Paginated<Report> {
  return { items, meta: { page: 1, limit: 20, total: items.length, totalPages: 1 } }
}

function emptyCategories() {
  return { items: [], meta: { page: 1, limit: 100, total: 0, totalPages: 0 } }
}

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <ReportsPage />
    </QueryClientProvider>,
  )
}

async function fillPeriod() {
  fireEvent.change(screen.getByLabelText('Data inicial'), { target: { value: '2026-07-01' } })
  fireEvent.change(screen.getByLabelText('Data final'), { target: { value: '2026-07-31' } })
}

afterEach(() => {
  vi.clearAllMocks()
})

describe('ReportsPage', () => {
  it('mostra o painel de blocos com "Saídas por Ministério" pré-marcada e o estado vazio do histórico', async () => {
    listReportsMock.mockResolvedValue(paginatedReports([]))
    listCategoriesMock.mockResolvedValue(emptyCategories())

    renderPage()

    expect(await screen.findByText('Nenhum relatório encontrado')).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'Saídas por ministério' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'Saldo do período' })).not.toBeChecked()
    // "Incluir membro" começa desabilitada (Lista de transações não marcada).
    expect(screen.getByRole('checkbox', { name: 'Incluir membro' })).toBeDisabled()
  })

  it('exige o período ao gerar e não chama a API sem datas', async () => {
    const user = userEvent.setup()
    listReportsMock.mockResolvedValue(paginatedReports([]))
    listCategoriesMock.mockResolvedValue(emptyCategories())

    renderPage()
    await screen.findByText('Nenhum relatório encontrado')

    await user.click(screen.getByRole('button', { name: /gerar novo relatório/i }))

    expect(await screen.findByText(/informe a data inicial e a data final/i)).toBeInTheDocument()
    expect(createReportMock).not.toHaveBeenCalled()
  })

  it('gera um relatório com o período e os blocos marcados', async () => {
    const user = userEvent.setup()
    listReportsMock.mockResolvedValue(paginatedReports([]))
    listCategoriesMock.mockResolvedValue(emptyCategories())
    createReportMock.mockResolvedValue({
      id: 'rep-new',
      generatedAt: '2026-07-30T10:00:00Z',
      downloadUrl: 'https://storage.example/rep-new',
      expiresAt: '2026-07-30T10:15:00Z',
    })

    renderPage()
    await screen.findByText('Nenhum relatório encontrado')

    await fillPeriod()
    await user.click(screen.getByRole('button', { name: /gerar novo relatório/i }))

    await waitFor(() => {
      expect(createReportMock).toHaveBeenCalledWith(
        expect.objectContaining({
          dateFrom: '2026-07-01',
          dateTo: '2026-07-31',
          sections: ['expenseByMinistry'],
        }),
      )
    })
    const payload = createReportMock.mock.calls[0][0]
    expect(payload.includeMember).toBeUndefined()
    expect(payload.currentPassword).toBeUndefined()
  })

  it('pede senha ao marcar "Incluir membro" e envia includeMember + senha na geração', async () => {
    const user = userEvent.setup()
    listReportsMock.mockResolvedValue(paginatedReports([]))
    listCategoriesMock.mockResolvedValue(emptyCategories())
    createReportMock.mockResolvedValue({
      id: 'rep-new',
      generatedAt: '2026-07-30T10:00:00Z',
      downloadUrl: 'https://storage.example/rep-new',
      expiresAt: '2026-07-30T10:15:00Z',
    })

    renderPage()
    await screen.findByText('Nenhum relatório encontrado')

    await user.click(screen.getByRole('checkbox', { name: 'Lista de transações' }))
    await user.click(screen.getByRole('checkbox', { name: 'Incluir membro' }))

    const dialog = await screen.findByRole('dialog', { name: 'Incluir nome do membro' })
    await user.type(within(dialog).getByLabelText('Senha atual'), 'minha-senha')
    await user.click(within(dialog).getByRole('button', { name: 'Confirmar' }))

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Incluir nome do membro' })).not.toBeInTheDocument()
    })
    expect(screen.getByRole('checkbox', { name: 'Incluir membro' })).toBeChecked()

    await fillPeriod()
    await user.click(screen.getByRole('button', { name: /gerar novo relatório/i }))

    await waitFor(() => {
      expect(createReportMock).toHaveBeenCalledWith(
        expect.objectContaining({
          includeMember: true,
          currentPassword: 'minha-senha',
          sections: expect.arrayContaining(['transactionList']),
        }),
      )
    })
  })

  it('reabre o pop-up de senha quando a geração falha com 401', async () => {
    const user = userEvent.setup()
    listReportsMock.mockResolvedValue(paginatedReports([]))
    listCategoriesMock.mockResolvedValue(emptyCategories())
    createReportMock.mockRejectedValue(
      new ApiError({ code: 'INVALID_CREDENTIALS', message: 'Senha atual incorreta.', details: null }, 401),
    )

    renderPage()
    await screen.findByText('Nenhum relatório encontrado')

    await user.click(screen.getByRole('checkbox', { name: 'Lista de transações' }))
    await user.click(screen.getByRole('checkbox', { name: 'Incluir membro' }))
    const dialog = await screen.findByRole('dialog', { name: 'Incluir nome do membro' })
    await user.type(within(dialog).getByLabelText('Senha atual'), 'errada')
    await user.click(within(dialog).getByRole('button', { name: 'Confirmar' }))

    await fillPeriod()
    await user.click(screen.getByRole('button', { name: /gerar novo relatório/i }))

    // Pop-up reabre com a mensagem de senha incorreta.
    expect(await screen.findByText('Senha atual incorreta.')).toBeInTheDocument()
    expect(screen.getByRole('dialog', { name: 'Incluir nome do membro' })).toBeInTheDocument()
  })

  it('baixa um relatório do histórico pelo link temporário', async () => {
    const user = userEvent.setup()
    listReportsMock.mockResolvedValue(paginatedReports([REPORT]))
    listCategoriesMock.mockResolvedValue(emptyCategories())
    getReportDownloadMock.mockResolvedValue({
      downloadUrl: 'https://storage.example/rep-1/signed',
      expiresAt: '2026-07-30T10:15:00Z',
    })
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})

    renderPage()

    await user.click(await screen.findByRole('button', { name: 'Baixar' }))

    await waitFor(() => {
      expect(getReportDownloadMock).toHaveBeenCalledWith('rep-1')
    })
    expect(clickSpy).toHaveBeenCalled()
    clickSpy.mockRestore()
  })
})
