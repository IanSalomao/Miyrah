// Filtro de ministério (seleção única) do component_filter_bar.
// Filtrar por um ministério específico oculta transações sem ministério vinculado
// (comportamento do backend — este componente só envia o `ministryId`).

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { Ministry } from '@/types'

const ALL_VALUE = 'all'

interface MinistryFilterProps {
  ministries: Ministry[]
  value?: string
  onChange: (value: string | undefined) => void
}

export function MinistryFilter({ ministries, value, onChange }: MinistryFilterProps) {
  return (
    <Select
      value={value ?? ALL_VALUE}
      onValueChange={(next) => onChange(next === ALL_VALUE ? undefined : next)}
    >
      <SelectTrigger aria-label="Ministério" className={cn(value && 'border-primary text-primary')}>
        <SelectValue placeholder="Ministério" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL_VALUE}>Todos os ministérios</SelectItem>
        {ministries.map((ministry) => (
          <SelectItem key={ministry.id} value={ministry.id}>
            {ministry.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
