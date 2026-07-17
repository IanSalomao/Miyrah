import { useState } from 'react'
import { TypeFilter } from 'miyrah'
import type { DashboardType } from '../../src/types/dashboard'

const wrap: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  padding: 24,
  background: 'var(--background)',
  alignItems: 'flex-start',
}

// Segmented control com "Todas" ativo (estado padrão).
export function AllSelected() {
  const [value, setValue] = useState<DashboardType>('all')
  return (
    <div style={wrap}>
      <TypeFilter value={value} onChange={setValue} />
    </div>
  )
}

// "Entradas" ativo — cor primária no segmento selecionado.
export function IncomeSelected() {
  const [value, setValue] = useState<DashboardType>('income')
  return (
    <div style={wrap}>
      <TypeFilter value={value} onChange={setValue} />
    </div>
  )
}

// "Saídas" ativo.
export function ExpenseSelected() {
  const [value, setValue] = useState<DashboardType>('expense')
  return (
    <div style={wrap}>
      <TypeFilter value={value} onChange={setValue} />
    </div>
  )
}
