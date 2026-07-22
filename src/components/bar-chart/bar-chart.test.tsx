import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import type { ComparisonBucket, DashboardComparisonStats } from '@/types'

import { BarChart } from './bar-chart'

const SAMPLE_DATA: ComparisonBucket[] = [
  { periodStart: '2026-06-01', label: 'Jun/26', income: 95000, expense: 61000 },
  { periodStart: '2026-07-01', label: 'Jul/26', income: 90000, expense: 70000 },
]

describe('BarChart', () => {
  it('renderiza o estado de carregamento (skeleton) quando isLoading', () => {
    render(<BarChart data={[]} isLoading />)

    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('renderiza o estado vazio quando não há dados', () => {
    render(<BarChart data={[]} />)

    expect(screen.getByText('Nenhuma transação encontrada')).toBeInTheDocument()
  })

  it('monta sem quebrar com dados de exemplo', () => {
    const { container } = render(<BarChart data={SAMPLE_DATA} />)

    expect(container.querySelector('.recharts-responsive-container')).toBeInTheDocument()
  })

  it('não renderiza o toggle Mês/Semana sem onGroupByChange', () => {
    render(<BarChart data={SAMPLE_DATA} />)

    expect(screen.queryByRole('tab', { name: 'Mês' })).not.toBeInTheDocument()
    expect(screen.queryByRole('tab', { name: 'Semana' })).not.toBeInTheDocument()
  })

  it('renderiza o toggle e dispara onGroupByChange ao clicar em "Semana"', async () => {
    const user = userEvent.setup()
    const onGroupByChange = vi.fn()
    render(
      <BarChart
        data={SAMPLE_DATA}
        groupBy="month"
        onGroupByChange={onGroupByChange}
      />,
    )

    expect(screen.getByRole('tab', { name: 'Mês' })).toBeInTheDocument()
    await user.click(screen.getByRole('tab', { name: 'Semana' }))

    expect(onGroupByChange).toHaveBeenCalledWith('week')
  })

  it('exibe "—" no indicador quando incomeVsAvg/expenseVsAvg é null', () => {
    const comparison: DashboardComparisonStats = {
      sampleSize: 0,
      incomeVsAvg: null,
      expenseVsAvg: null,
    }
    render(<BarChart data={SAMPLE_DATA} comparison={comparison} />)

    expect(screen.queryByText('0%')).not.toBeInTheDocument()
    expect(screen.getByText(/Entradas/).textContent).toContain('—')
    expect(screen.getByText(/Saídas/).textContent).toContain('—')
  })

  it('formata a variação negativa com seta ↓ e vírgula decimal', () => {
    const comparison: DashboardComparisonStats = {
      sampleSize: 5,
      incomeVsAvg: -10.0,
      expenseVsAvg: 16.7,
    }
    render(<BarChart data={SAMPLE_DATA} comparison={comparison} groupBy="month" />)

    expect(screen.getByText(/Entradas ↓ 10,0% vs\. média dos 5 meses anteriores/)).toBeInTheDocument()
    expect(screen.getByText(/Saídas ↑ 16,7% vs\. média dos 5 meses anteriores/)).toBeInTheDocument()
  })

  it('usa a unidade "semanas" quando groupBy é week', () => {
    const comparison: DashboardComparisonStats = {
      sampleSize: 3,
      incomeVsAvg: 5.5,
      expenseVsAvg: -2.3,
    }
    render(<BarChart data={SAMPLE_DATA} comparison={comparison} groupBy="week" />)

    expect(
      screen.getByText(/Entradas ↑ 5,5% vs\. média das 3 semanas anteriores/),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Saídas ↓ 2,3% vs\. média das 3 semanas anteriores/),
    ).toBeInTheDocument()
  })
})
