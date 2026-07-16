// Filtro de período do component_filter_bar, com presets + intervalo personalizado
// (dateFrom/dateTo). Presets conforme wiki/pages/page_dashboard.md.

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { DashboardPeriod } from '@/types'

const PERIOD_OPTIONS: { value: DashboardPeriod; label: string }[] = [
  { value: 'currentMonth', label: 'Mês atual' },
  { value: 'last3Months', label: 'Últimos 3 meses' },
  { value: 'last6Months', label: 'Últimos 6 meses' },
  { value: 'last12Months', label: 'Últimos 12 meses' },
  { value: 'currentYear', label: 'Ano atual' },
  { value: 'custom', label: 'Personalizado' },
]

const DEFAULT_PERIOD: DashboardPeriod = 'currentMonth'

interface PeriodFilterProps {
  period: DashboardPeriod
  dateFrom?: string
  dateTo?: string
  onPeriodChange: (period: DashboardPeriod) => void
  onDateFromChange: (value: string) => void
  onDateToChange: (value: string) => void
}

export function PeriodFilter({
  period,
  dateFrom,
  dateTo,
  onPeriodChange,
  onDateFromChange,
  onDateToChange,
}: PeriodFilterProps) {
  const isActive = period !== DEFAULT_PERIOD

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={period} onValueChange={(value) => onPeriodChange(value as DashboardPeriod)}>
        <SelectTrigger
          aria-label="Período"
          className={cn(isActive && 'border-primary text-primary')}
        >
          <SelectValue placeholder="Período" />
        </SelectTrigger>
        <SelectContent>
          {PERIOD_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {period === 'custom' && (
        <div className="flex items-center gap-2">
          <Label htmlFor="period-date-from" className="sr-only">
            De
          </Label>
          <Input
            id="period-date-from"
            type="date"
            value={dateFrom ?? ''}
            onChange={(event) => onDateFromChange(event.target.value)}
            className="w-36"
          />
          <span className="text-sm text-muted-foreground">até</span>
          <Label htmlFor="period-date-to" className="sr-only">
            Até
          </Label>
          <Input
            id="period-date-to"
            type="date"
            value={dateTo ?? ''}
            onChange={(event) => onDateToChange(event.target.value)}
            className="w-36"
          />
        </div>
      )}
    </div>
  )
}
