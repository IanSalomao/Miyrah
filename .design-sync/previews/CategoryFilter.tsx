import { useState } from 'react'
import { CategoryFilter } from 'miyrah'
import type { Category } from '../../src/types/category'

const wrap: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  padding: 24,
  background: 'var(--background)',
  alignItems: 'flex-start',
  minWidth: 320,
}

const CATEGORIES: Category[] = [
  { id: 'c1', name: 'Dízimos', description: null, type: 'income', color: '#2E7D5B', createdAt: '', updatedAt: '' },
  { id: 'c2', name: 'Ofertas', description: null, type: 'income', color: '#4C6EF5', createdAt: '', updatedAt: '' },
  { id: 'c3', name: 'Doações', description: null, type: 'income', color: '#C2410C', createdAt: '', updatedAt: '' },
  { id: 'c4', name: 'Aluguel', description: null, type: 'expense', color: '#7C3AED', createdAt: '', updatedAt: '' },
  { id: 'c5', name: 'Contas de consumo', description: null, type: 'expense', color: '#D97706', createdAt: '', updatedAt: '' },
]

// Nenhuma categoria selecionada — trigger neutro.
export function Empty() {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  return (
    <div style={wrap}>
      <CategoryFilter categories={CATEGORIES} selectedIds={selectedIds} onChange={setSelectedIds} />
    </div>
  )
}

// Duas categorias marcadas — contador no trigger e destaque em cor primária.
export function Selected() {
  const [selectedIds, setSelectedIds] = useState<string[]>(['c1', 'c3'])
  return (
    <div style={wrap}>
      <CategoryFilter categories={CATEGORIES} selectedIds={selectedIds} onChange={setSelectedIds} />
    </div>
  )
}
