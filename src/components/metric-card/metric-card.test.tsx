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

  it('variante Balanço: Azul (token primary) por decisão de produto, com sinal + quando ≥ 0', () => {
    render(<MetricCard label="Balanço" value={200} variant="balance" />)
    const valueEl = screen.getByText(/\+R\$ 200,00/)
    expect(valueEl).toHaveClass('text-primary')
  })

  it('variante Balanço: Azul também quando negativo, com sinal − explícito', () => {
    render(<MetricCard label="Balanço" value={-350} variant="balance" />)
    const valueEl = screen.getByText(/−R\$ 350,00/)
    expect(valueEl).toHaveClass('text-primary')
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

  it('percentChange omitido: sem indicador de variação', () => {
    render(<MetricCard label="Saldo no início do período" value={12000} variant="balance" />)
    expect(screen.queryByText(/%/)).not.toBeInTheDocument()
  })

  it('percentChange positivo: seta ↑ e cor income (verde)', () => {
    render(
      <MetricCard
        label="Saldo no fim do período"
        value={18500}
        variant="balance"
        percentChange={54.2}
      />,
    )
    const indicator = screen.getByText('↑ 54,2%')
    expect(indicator).toHaveClass('text-income')
  })

  it('percentChange negativo: seta ↓ e cor expense (vermelho), com magnitude sem sinal duplo', () => {
    render(
      <MetricCard
        label="Saldo no fim do período"
        value={9000}
        variant="balance"
        percentChange={-12.5}
      />,
    )
    const indicator = screen.getByText('↓ 12,5%')
    expect(indicator).toHaveClass('text-expense')
  })

  it('percentChange null: estado neutro (sem seta, sem cor semântica)', () => {
    render(
      <MetricCard label="Saldo no fim do período" value={0} variant="balance" percentChange={null} />,
    )
    expect(screen.getByText('—')).toBeInTheDocument()
    expect(screen.queryByText(/↑|↓/)).not.toBeInTheDocument()
  })

  it('estado loading não exibe o indicador de variação', () => {
    render(
      <MetricCard
        label="Saldo no fim do período"
        value={18500}
        variant="balance"
        percentChange={54.2}
        loading
      />,
    )
    expect(screen.queryByText(/%/)).not.toBeInTheDocument()
  })

  it('secondary: exibe a 3ª linha auxiliar quando não há percentChange', () => {
    render(<MetricCard label="Entradas" value={1500} variant="income" secondary="4 transações" />)
    expect(screen.getByText('4 transações')).toBeInTheDocument()
  })

  it('percentChange tem prioridade sobre secondary', () => {
    render(
      <MetricCard
        label="Saldo no fim do período"
        value={18500}
        variant="balance"
        percentChange={10}
        secondary="4 transações"
      />,
    )
    expect(screen.getByText('↑ 10,0%')).toBeInTheDocument()
    expect(screen.queryByText('4 transações')).not.toBeInTheDocument()
  })

  it('secondary não aparece durante o loading', () => {
    render(
      <MetricCard label="Entradas" value={1500} variant="income" secondary="4 transações" loading />,
    )
    expect(screen.queryByText('4 transações')).not.toBeInTheDocument()
  })

  it('icon: renderiza o ícone quando informado', () => {
    render(
      <MetricCard
        label="Entradas"
        value={1500}
        variant="income"
        icon={<svg data-testid="metric-icon" />}
      />,
    )
    expect(screen.getByTestId('metric-icon')).toBeInTheDocument()
  })

  it('info: expõe um gatilho de ajuda acessível quando informado', () => {
    render(<MetricCard label="Entradas" value={1500} variant="income" info="Como é calculado." />)
    expect(screen.getByRole('button', { name: 'Sobre Entradas' })).toBeInTheDocument()
  })

  it('info omitido: sem gatilho de ajuda', () => {
    render(<MetricCard label="Entradas" value={1500} variant="income" />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
