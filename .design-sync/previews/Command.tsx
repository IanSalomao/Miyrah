import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from 'miyrah'
import { TrendingUp, TrendingDown, Music, Baby, HandHeart } from 'lucide-react'

const wrap: React.CSSProperties = {
  padding: 24,
  background: 'var(--background)',
  minHeight: 380,
  display: 'flex',
  justifyContent: 'center',
}

const box: React.CSSProperties = {
  width: 340,
  border: '1px solid var(--border)',
  borderRadius: 12,
  background: 'var(--popover)',
  boxShadow: '0 1px 2px 0 rgba(18,32,58,0.06)',
}

// Busca de categoria com grupos de Entradas e Saídas.
export function CategorySearch() {
  return (
    <div style={wrap}>
      <div style={box}>
        <Command>
          <CommandInput placeholder="Buscar categoria..." />
          <CommandList>
            <CommandEmpty>Nenhuma categoria encontrada.</CommandEmpty>
            <CommandGroup heading="Entradas">
              <CommandItem>
                <TrendingUp />
                Dízimos
              </CommandItem>
              <CommandItem>
                <TrendingUp />
                Ofertas
              </CommandItem>
              <CommandItem>
                <HandHeart />
                Doações
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Saídas">
              <CommandItem>
                <TrendingDown />
                Aluguel
              </CommandItem>
              <CommandItem>
                <TrendingDown />
                Contas de consumo
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    </div>
  )
}

// Busca de ministério com atalhos de teclado.
export function MinistrySearch() {
  return (
    <div style={wrap}>
      <div style={box}>
        <Command>
          <CommandInput placeholder="Buscar ministério..." />
          <CommandList>
            <CommandEmpty>Nenhum ministério encontrado.</CommandEmpty>
            <CommandGroup heading="Ministérios">
              <CommandItem>
                <Music />
                Ministério de Louvor
                <CommandShortcut>⌘1</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <Baby />
                Ministério Infantil
                <CommandShortcut>⌘2</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <HandHeart />
                Ministério de Ação Social
                <CommandShortcut>⌘3</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    </div>
  )
}
