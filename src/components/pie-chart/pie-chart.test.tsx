import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { CategorySlice } from '@/types'

import { PieChart } from './pie-chart'

const SAMPLE_DATA: CategorySlice[] = [
  { categoryId: 'cat-1', name: 'Dízimo', color: '#22C55E', value: 500 },
  { categoryId: 'cat-2', name: 'Oferta', color: '#3B82F6', value: 300 },
]

describe('PieChart', () => {
  it('renderiza o estado de carregamento (skeleton) quando isLoading', () => {
    render(<PieChart data={[]} isLoading title="Entradas por categoria" />)

    expect(screen.getByText('Entradas por categoria')).toBeInTheDocument()
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('renderiza o estado vazio quando não há dados', () => {
    render(<PieChart data={[]} title="Saídas por categoria" />)

    expect(screen.getByText('Nenhuma transação encontrada')).toBeInTheDocument()
  })

  it('monta sem quebrar com dados de exemplo e exibe a legenda com nome e valor', () => {
    const { container } = render(<PieChart data={SAMPLE_DATA} title="Entradas por categoria" />)

    expect(container.querySelector('.recharts-responsive-container')).toBeInTheDocument()
    expect(screen.getByText('Dízimo')).toBeInTheDocument()
    expect(screen.getByText('Oferta')).toBeInTheDocument()
    expect(screen.getByText('R$ 500,00')).toBeInTheDocument()
  })
})
