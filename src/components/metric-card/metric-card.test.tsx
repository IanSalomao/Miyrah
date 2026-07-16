import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MetricCard } from './metric-card'

describe('MetricCard', () => {
  it('variante Entradas: cor income e sinal + (mesmo passando magnitude positiva)', () => {
    render(<MetricCard label="Entradas" value={1500} variant="income" />)
    const valueEl = screen.getByText(/R\$ 1\.500,00/)
    expect(valueEl.textContent).toContain('+')
    expect(valueEl).toHaveClass('text-income')
    expect(valueEl).toHaveClass('font-mono')
  })

  it('variante Saídas: cor expense e sinal − (mesmo passando magnitude positiva)', () => {
    render(<MetricCard label="Saídas" value={800} variant="expense" />)
    const valueEl = screen.getByText(/R\$ 800,00/)
    expect(valueEl.textContent).toContain('−')
    expect(valueEl).toHaveClass('text-expense')
  })

  it('variante Balanço: verde quando ≥ 0', () => {
    render(<MetricCard label="Balanço" value={200} variant="balance" />)
    const valueEl = screen.getByText(/\+R\$ 200,00/)
    expect(valueEl).toHaveClass('text-income')
  })

  it('variante Balanço: vermelho quando negativo', () => {
    render(<MetricCard label="Balanço" value={-350} variant="balance" />)
    const valueEl = screen.getByText(/−R\$ 350,00/)
    expect(valueEl).toHaveClass('text-expense')
  })

  it('variante Neutra: sem cifrão/sinal, cor foreground', () => {
    render(<MetricCard label="Membros" value={42} variant="neutral" />)
    const valueEl = screen.getByText('42')
    expect(valueEl).toHaveClass('text-foreground')
    expect(valueEl.textContent).not.toMatch(/[+−]/)
  })

  it('a cor nunca é a única pista: label e sinal explícito sempre presentes', () => {
    render(<MetricCard label="Entradas" value={100} variant="income" />)
    expect(screen.getByText('Entradas')).toBeInTheDocument()
    expect(screen.getByText(/\+R\$ 100,00/)).toBeInTheDocument()
  })

  it('estado loading exibe skeleton no lugar do valor', () => {
    render(<MetricCard label="Entradas" value={100} variant="income" loading />)
    expect(screen.queryByText(/R\$/)).not.toBeInTheDocument()
    expect(screen.getByLabelText('Entradas — carregando')).toBeInTheDocument()
  })
})
