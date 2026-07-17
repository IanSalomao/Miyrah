import { useState } from 'react'
import {
  FilterBar,
  PeriodFilter,
  TypeFilter,
  MinistryFilter,
  CategoryFilter,
  SearchFilter,
} from 'miyrah'
import type { DashboardPeriod, DashboardType } from '../../src/types/dashboard'
import type { Ministry } from '../../src/types/ministry'
import type { Category } from '../../src/types/category'

const wrap: React.CSSProperties = {
  padding: 24,
  background: 'var(--background)',
  minWidth: 720,
}

const MINISTRIES: Ministry[] = [
  { id: 'm1', name: 'Louvor', description: null, responsible: null, createdAt: '', updatedAt: '' },
  { id: 'm2', name: 'Infantil', description: null, responsible: null, createdAt: '', updatedAt: '' },
  { id: 'm3', name: 'Ação Social', description: null, responsible: null, createdAt: '', updatedAt: '' },
]

const CATEGORIES: Category[] = [
  { id: 'c1', name: 'Dízimos', description: null, type: 'income', color: '#2E7D5B', createdAt: '', updatedAt: '' },
  { id: 'c2', name: 'Ofertas', description: null, type: 'income', color: '#4C6EF5', createdAt: '', updatedAt: '' },
  { id: 'c4', name: 'Aluguel', description: null, type: 'expense', color: '#7C3AED', createdAt: '', updatedAt: '' },
]

// Barra completa de filtros do Dashboard: período, tipo, ministério e categoria.
export function Dashboard() {
  const [period, setPeriod] = useState<DashboardPeriod>('last3Months')
  const [type, setType] = useState<DashboardType>('income')
  const [ministry, setMinistry] = useState<string | undefined>('m1')
  const [categoryIds, setCategoryIds] = useState<string[]>(['c1'])
  return (
    <div style={wrap}>
      <FilterBar>
        <PeriodFilter
          period={period}
          onPeriodChange={setPeriod}
          onDateFromChange={() => {}}
          onDateToChange={() => {}}
        />
        <TypeFilter value={type} onChange={setType} />
        <MinistryFilter ministries={MINISTRIES} value={ministry} onChange={setMinistry} />
        <CategoryFilter categories={CATEGORIES} selectedIds={categoryIds} onChange={setCategoryIds} />
      </FilterBar>
    </div>
  )
}

// Barra da tela de Transações: busca por texto + tipo + categoria.
export function Transactions() {
  const [search, setSearch] = useState('Dízimo')
  const [type, setType] = useState<DashboardType>('all')
  const [categoryIds, setCategoryIds] = useState<string[]>([])
  return (
    <div style={wrap}>
      <FilterBar>
        <SearchFilter value={search} onChange={setSearch} placeholder="Buscar transação..." />
        <TypeFilter value={type} onChange={setType} />
        <CategoryFilter categories={CATEGORIES} selectedIds={categoryIds} onChange={setCategoryIds} />
      </FilterBar>
    </div>
  )
}
