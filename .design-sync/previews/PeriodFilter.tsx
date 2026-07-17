import { useState } from 'react'
import { PeriodFilter } from 'miyrah'
import type { DashboardPeriod } from '../../src/types/dashboard'

const wrap: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  padding: 24,
  background: 'var(--background)',
  alignItems: 'flex-start',
  minWidth: 420,
}

// Preset selecionado (últimos 3 meses) — trigger destacado por não ser o padrão.
export function Preset() {
  const [period, setPeriod] = useState<DashboardPeriod>('last3Months')
  return (
    <div style={wrap}>
      <PeriodFilter
        period={period}
        onPeriodChange={setPeriod}
        onDateFromChange={() => {}}
        onDateToChange={() => {}}
      />
    </div>
  )
}

// Intervalo personalizado — revela os campos de data De/Até.
export function Custom() {
  const [dateFrom, setDateFrom] = useState('2026-01-01')
  const [dateTo, setDateTo] = useState('2026-03-31')
  return (
    <div style={wrap}>
      <PeriodFilter
        period="custom"
        dateFrom={dateFrom}
        dateTo={dateTo}
        onPeriodChange={() => {}}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
      />
    </div>
  )
}
