// Campo de busca por texto do component_filter_bar — usado por page_members (só busca)
// e page_transactions (busca + demais filtros). Ver wiki/components/component_filter_bar.md.

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface SearchFilterProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function SearchFilter({
  value,
  onChange,
  placeholder = 'Buscar...',
  className,
}: SearchFilterProps) {
  return (
    <div className={cn('relative min-w-48 flex-1 sm:flex-none', className)}>
      <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="pl-8"
      />
    </div>
  )
}
