import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupButton,
} from 'miyrah'
import { Search, X } from 'lucide-react'

const wrap: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  padding: 24,
  background: 'var(--background)',
  maxWidth: 340,
}

// Campo de valor monetário com prefixo "R$".
export function CurrencyField() {
  return (
    <div style={wrap}>
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>R$</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="0,00" defaultValue="1.250,00" />
      </InputGroup>
    </div>
  )
}

// Busca com ícone e botão de limpar.
export function SearchField() {
  return (
    <div style={wrap}>
      <InputGroup>
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupInput placeholder="Buscar transação..." defaultValue="Dízimo" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="icon-xs" aria-label="Limpar busca">
            <X />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}

// Sufixo textual (ex.: unidade percentual).
export function WithSuffix() {
  return (
    <div style={wrap}>
      <InputGroup>
        <InputGroupInput placeholder="0" defaultValue="10" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>% do dízimo</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
