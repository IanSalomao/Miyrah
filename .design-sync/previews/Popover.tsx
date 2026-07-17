import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
  Button,
  Separator,
} from 'miyrah'
import { Info, CalendarDays } from 'lucide-react'

const wrap: React.CSSProperties = {
  padding: 24,
  background: 'var(--background)',
  minHeight: 340,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
}

const rowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: 13,
}

const monoValue: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontWeight: 600,
}

// Detalhes rápidos do saldo (aberto por padrão).
export function BalanceDetails() {
  return (
    <div style={wrap}>
      <Popover defaultOpen>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <Info />
            Saldo do mês
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverHeader>
            <PopoverTitle>Saldo até 16/07/2026</PopoverTitle>
            <PopoverDescription>Igreja Batista Central</PopoverDescription>
          </PopoverHeader>
          <Separator />
          <div style={rowStyle}>
            <span>Entradas</span>
            <span style={{ ...monoValue, color: 'var(--income)' }}>+ R$ 18.450,00</span>
          </div>
          <div style={rowStyle}>
            <span>Saídas</span>
            <span style={{ ...monoValue, color: 'var(--expense)' }}>− R$ 7.320,50</span>
          </div>
          <Separator />
          <div style={rowStyle}>
            <span style={{ fontWeight: 600 }}>Saldo</span>
            <span style={monoValue}>R$ 11.129,50</span>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

// Estado fechado: gatilho de filtro de período.
export function Trigger() {
  return (
    <div style={{ ...wrap, minHeight: 120 }}>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <CalendarDays />
            Julho de 2026
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverDescription>Escolha o período de exibição.</PopoverDescription>
        </PopoverContent>
      </Popover>
    </div>
  )
}
