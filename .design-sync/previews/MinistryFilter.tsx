import { useState } from 'react'
import { MinistryFilter } from 'miyrah'
import type { Ministry } from '../../src/types/ministry'

const wrap: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  padding: 24,
  background: 'var(--background)',
  alignItems: 'flex-start',
  minWidth: 280,
}

const MINISTRIES: Ministry[] = [
  { id: 'm1', name: 'Louvor', description: null, responsible: null, createdAt: '', updatedAt: '' },
  { id: 'm2', name: 'Infantil', description: null, responsible: null, createdAt: '', updatedAt: '' },
  { id: 'm3', name: 'Ação Social', description: null, responsible: null, createdAt: '', updatedAt: '' },
  { id: 'm4', name: 'Diaconia', description: null, responsible: null, createdAt: '', updatedAt: '' },
]

// Nenhum ministério selecionado — mostra "Todos os ministérios".
export function AllMinistries() {
  const [value, setValue] = useState<string | undefined>(undefined)
  return (
    <div style={wrap}>
      <MinistryFilter ministries={MINISTRIES} value={value} onChange={setValue} />
    </div>
  )
}

// Ministério específico selecionado — trigger destacado em cor primária.
export function Selected() {
  const [value, setValue] = useState<string | undefined>('m1')
  return (
    <div style={wrap}>
      <MinistryFilter ministries={MINISTRIES} value={value} onChange={setValue} />
    </div>
  )
}
