import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup, SelectLabel } from 'miyrah'

const wrap: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  padding: 24,
  background: 'var(--background)',
  maxWidth: 320,
}

// Trigger com valor selecionado e placeholder (estados fechados).
export function Basic() {
  return (
    <div style={wrap}>
      <Select defaultValue="tithe">
        <SelectTrigger>
          <SelectValue placeholder="Selecione a categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="tithe">Dízimos</SelectItem>
          <SelectItem value="offering">Ofertas</SelectItem>
          <SelectItem value="rent">Aluguel</SelectItem>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Selecione o ministério" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="worship">Louvor</SelectItem>
          <SelectItem value="kids">Infantil</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

// Lista aberta com grupos rotulados.
export function Open() {
  return (
    <div style={{ ...wrap, minHeight: 260 }}>
      <Select defaultOpen defaultValue="offering">
        <SelectTrigger>
          <SelectValue placeholder="Selecione a categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Entradas</SelectLabel>
            <SelectItem value="tithe">Dízimos</SelectItem>
            <SelectItem value="offering">Ofertas</SelectItem>
            <SelectItem value="donation">Doações</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Saídas</SelectLabel>
            <SelectItem value="rent">Aluguel</SelectItem>
            <SelectItem value="utilities">Contas de consumo</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
