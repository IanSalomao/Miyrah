import { useState } from 'react'
import { FilterTabs } from 'miyrah'

const wrap: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  padding: 24,
  background: 'var(--background)',
  alignItems: 'flex-start',
  minWidth: 360,
}

type TypeValue = 'all' | 'income' | 'expense'

const OPTIONS: { value: TypeValue; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'income', label: 'Entradas' },
  { value: 'expense', label: 'Saídas' },
]

// Aba "Todas" ativa — filtro da listagem de categorias.
export function AllActive() {
  const [value, setValue] = useState<TypeValue>('all')
  return (
    <div style={wrap}>
      <FilterTabs options={OPTIONS} value={value} onValueChange={setValue} />
    </div>
  )
}

// Aba "Entradas" ativa.
export function IncomeActive() {
  const [value, setValue] = useState<TypeValue>('income')
  return (
    <div style={wrap}>
      <FilterTabs options={OPTIONS} value={value} onValueChange={setValue} />
    </div>
  )
}
