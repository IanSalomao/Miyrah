// MemberPicker — seletor de membro (combobox com busca), usado no campo
// "Responsável" de wiki/pages/page_ministries.md. Busca via GET /v1/members
// (`search`) e sempre oferece a opção "Nenhum" para limpar a seleção.

import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ChevronsUpDown } from 'lucide-react'
import { MemberAvatar } from '@/components/avatar/avatar'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'
import { listMembers } from '@/services'
import { queryKeys } from '@/lib/query-keys'

export interface MemberOption {
  id: string
  name: string
}

export interface MemberPickerProps {
  /** `id` do membro selecionado, ou `null` (opção "Nenhum"). */
  value: string | null
  /** Nome do membro selecionado, para exibição sem depender da lista carregada. */
  label: string | null
  onSelect: (member: MemberOption | null) => void
  disabled?: boolean
  placeholder?: string
}

const SEARCH_DEBOUNCE_MS = 300

export function MemberPicker({
  value,
  label,
  onSelect,
  disabled = false,
  placeholder = 'Selecionar responsável',
}: MemberPickerProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [search])

  const query = { search: debouncedSearch || undefined, limit: 20 }
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.members.list(query),
    queryFn: ({ signal }) => listMembers(query, signal),
    enabled: open,
  })

  const members = data?.items ?? []

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) setSearch('')
      }}
    >
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="w-full justify-between font-normal"
        >
          {value && label ? (
            <span className="flex min-w-0 items-center gap-2">
              <MemberAvatar name={label} size="sm" />
              <span className="truncate">{label}</span>
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Buscar membro..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandGroup>
              <CommandItem
                value="none"
                onSelect={() => {
                  onSelect(null)
                  setOpen(false)
                }}
              >
                Nenhum
              </CommandItem>
            </CommandGroup>
            {isLoading ? (
              <div className="flex flex-col gap-1 p-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : members.length === 0 ? (
              <CommandEmpty>Nenhum membro encontrado.</CommandEmpty>
            ) : (
              <CommandGroup>
                {members.map((member) => (
                  <CommandItem
                    key={member.id}
                    value={member.id}
                    onSelect={() => {
                      onSelect({ id: member.id, name: member.name })
                      setOpen(false)
                    }}
                  >
                    <MemberAvatar name={member.name} size="sm" />
                    {member.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
