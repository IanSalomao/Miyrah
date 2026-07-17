import { useState } from 'react'
import { SearchFilter } from 'miyrah'

const wrap: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  padding: 24,
  background: 'var(--background)',
  maxWidth: 360,
}

// Campo vazio com placeholder — busca de membros.
export function Empty() {
  const [value, setValue] = useState('')
  return (
    <div style={wrap}>
      <SearchFilter value={value} onChange={setValue} placeholder="Buscar membro..." />
    </div>
  )
}

// Campo preenchido — busca de transações.
export function Filled() {
  const [value, setValue] = useState('Dízimo — Maria Fernandes')
  return (
    <div style={wrap}>
      <SearchFilter value={value} onChange={setValue} placeholder="Buscar transação..." />
    </div>
  )
}
