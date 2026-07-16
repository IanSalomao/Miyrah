import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { LinePoint } from '@/types'

import { LineChart } from './line-chart'

const SAMPLE_DATA: LinePoint[] = [
  { date: '2026-07-01', income: 500, expense: 0 },
  { date: '2026-07-02', income: 0, expense: 1200 },
]

describe('LineChart', () => {
  it('renderiza o estado de carregamento (skeleton) quando isLoading', () => {
    render(<LineChart data={[]} isLoading />)

    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('renderiza o estado vazio quando não há dados', () => {
    render(<LineChart data={[]} />)

    expect(screen.getByText('Nenhuma transação encontrada')).toBeInTheDocument()
  })

  it('monta sem quebrar com dados de exemplo', () => {
    const { container } = render(<LineChart data={SAMPLE_DATA} />)

    expect(container.querySelector('.recharts-responsive-container')).toBeInTheDocument()
  })
})
